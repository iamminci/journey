import express, { Request, Response } from "express";
import db from "../../firebase/firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import TronWeb from "tronweb";
import { abi } from "../contract";

export const claimRouter = express.Router();

const tronWeb = new TronWeb({
  fullHost: "https://api.shasta.trongrid.io",
  //   fullHost: "https://api.trongrid.io",
  //   headers: { "TRON-PRO-API-KEY": process.env.API_KEY },
  privateKey: process.env.PRIVATE_KEY,
});

// fetch all quests: https://journey-server.onrender.com/api/quests/
claimRouter.get("/", async (req: Request, res: Response) => {
  try {
    const query = collection(db, "quests");
    const querySnap: any = await getDocs(query);

    const fetchedQuests: any = [];

    if (querySnap) {
      querySnap.forEach((doc: any) => {
        fetchedQuests.push(doc.data());
      });
    }

    res
      .status(200)
      .send({ message: "Successfully fetched", quest: fetchedQuests });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "server error" });
  }
});

claimRouter.get("/:questId/:address", async (req: Request, res: Response) => {
  try {
    const { questId, address } = req.params;

    const docRef = doc(db, "quests", questId);
    const docSnap = await getDoc(docRef);

    if (questId === "SOEKIWe2g0JDOKTZBl6N") {
      if (docSnap.exists()) {
        const { nft_reward, completed_users } = docSnap.data();

        // SEND NFT REWARD
        const nftContract = await tronWeb
          .contract()
          .at("TEaRdU1GNh1vAHLG4QxxZqQAoNqBEMTgE9");

        const nftResult = await nftContract
          .mintWithTokenURI(address, nft_reward.token_uri)
          .send({
            feeLimit: 100_000_000,
            callValue: 0,
            shouldPollResponse: false,
          });

        // add user to completed_users array
        const prevCompletedUsers = JSON.parse(JSON.stringify(completed_users));
        prevCompletedUsers.push(address);

        await updateDoc(docRef, {
          completed_users: prevCompletedUsers,
        });

        res.status(200).send({
          message: "Reward successfully claimed",
          nftTxn: nftResult,
        });
      } else {
        res.status(404).send({ message: "Journey not found" });
      }
      return;
    }

    if (docSnap.exists()) {
      const {
        token_reward,
        nft_reward,
        xp: questXP,
        completed_users,
      } = docSnap.data();

      // SEND TOKEN REWARD
      const tokenResult = await tronWeb.trx.sendTransaction(
        address,
        token_reward.amount * 10 ** 6
      );

      // SEND NFT REWARD
      const nftContract = await tronWeb
        .contract()
        // .at("TVLZLczRjzMJyGCSWGE7G5K51KursmpUDE");
        .at("TEaRdU1GNh1vAHLG4QxxZqQAoNqBEMTgE9");

      const nftResult = await nftContract
        .mintWithTokenURI(address, nft_reward.token_uri)
        .send({
          feeLimit: 100_000_000,
          callValue: 0,
          shouldPollResponse: false,
        });

      // UPDATE XP
      const userDocRef = doc(db, "users", address);

      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const { quests, xp: userXP } = userDocSnap.data();
        const newQuests = JSON.parse(JSON.stringify(quests));
        newQuests[questId as string].status = "rewarded";

        await updateDoc(userDocRef, {
          quests: newQuests,
          xp: userXP + questXP,
        });
      }

      // add user to completed_users array
      const prevCompletedUsers = JSON.parse(JSON.stringify(completed_users));
      prevCompletedUsers.push(address);

      await updateDoc(docRef, {
        completed_users: prevCompletedUsers,
      });

      res.status(200).send({
        message: "Reward successfully claimed",
        tokenTxn: tokenResult.transaction.txID,
        nftTxn: nftResult,
      });
    } else {
      res.status(404).send({ message: "Quest not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "server error" });
  }
});

// fetch specific quest: https://journey-server.onrender.com/api/quests/V2zbf8iYGGGzFnkXQ6tB
claimRouter.get("/nft", async (req: Request, res: Response) => {
  try {
    // let nft = await tronWeb.contract(abi, "TPf4U83GepX7mjd89L4WW6LK4MXzHGHTgJ");
    // let nft = await tronWeb.contract().at("TPf4U83GepX7mjd89L4WW6LK4MXzHGHTgJ");

    // let result = await nft["ownerOf"](1).call();
    // let result = await nft["tokenURI"](1).call();

    let result = await nft
      .mintWithTokenURI(
        "TAFY85f6xtVNvriSbXAx1t5YDQ89f871C8",
        1,
        "https://bafybeigp25ig4sdg255y242fabm2da6g7gyxhu7tvdgbtr4jpl3rs23oqe.ipfs.w3s.link/metadata.json"
      )
      .send({
        feeLimit: 100_000_000,
        callValue: 0,
        shouldPollResponse: true,
      });

    console.log(result);
    res.status(200).send(result);
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "server error" });
  }
});
