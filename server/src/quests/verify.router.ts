import express, { Request, Response } from "express";
import db from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { QUEST_STATUS } from "../types";
import TronWeb from "tronweb";
import * as dotenv from "dotenv";

dotenv.config();

export const verifyRouter = express.Router();

const tronWeb = new TronWeb({
  fullHost: "https://api.trongrid.io",
  headers: { "TRON-PRO-API-KEY": "your api key" },
  privateKey: process.env.PRIVATE_KEY,
});

// verify quest: http://localhost:8888/api/verify/:questId/:user
verifyRouter.get("/:questId/:address", async (req: Request, res: Response) => {
  try {
    const { questId, address } = req.params;

    const userDocRef = doc(db, "users", address);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const { quests } = userDocSnap.data();
      const activeQuest = quests.find(
        (quest: any) => quest.quest_id === questId
      );

      if (activeQuest) {
        const { status, startedAt } = activeQuest;

        if (Number(status) === QUEST_STATUS.InProgress) {
          const questDocRef = doc(db, "quests", questId);
          const questDocSnap = await getDoc(questDocRef);

          if (questDocSnap.exists()) {
            const { contractAddress, methodHash, amount } = questDocSnap.data();

            const response = await fetch(
              `https://api.trongrid.io/v1/accounts/${address}/transactions`
            );
            const { data: transactions } = await response.json();

            transactions.find((txn: any) => {
              if (
                isValidTimestamp(txn, startedAt) &&
                isValidContract(txn, contractAddress) &&
                isValidMethod(txn, methodHash) &&
                isValidAmount(txn, amount)
              )
                res.status(200).send("Success: Verified!");
            });
            res.status(404).send("Error: Verification failed");
          } else {
            res.status(404).send(`Error: No quest found with ${questId}`);
          }
        } else {
          res.status(404).send("Error: Quest is not in progress");
        }
      } else {
        res
          .status(404)
          .send(`Error: User does not have an active quest with ${questId}`);
      }
    } else {
      res.status(404).send(`Error: No user found with ${address}`);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

/* QUEST VERIFICATION HELPERS */
function isValidTimestamp(txn: any, startedAt: number) {
  return txn.block_timestamp > startedAt;
}

function isValidContract(txn: any, contractAddress: string) {
  return (
    txn.raw_data.contract[0].parameter.value.contract_address ===
    contractAddress
  );
}

function isValidMethod(txn: any, method: string) {
  return txn.raw_data.contract[0].parameter.value.data.slice(0, 8) === method;
}

function isValidAmount(txn: any, amount: number) {
  return (
    txn.raw_data.contract[0].parameter.value.call_value >= amount * 10 ** 6
  );
}
