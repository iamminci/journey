import express, { Request, Response } from "express";
import db from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Client } from "twitter-api-sdk";
import * as dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

export const verifyRouter = express.Router();

const client = new Client(process.env.BEARER_TOKEN as string);

// verify quest: http://localhost:8888/api/verify/:questId/:user
verifyRouter.get("/:questId/:address", async (req: Request, res: Response) => {
  try {
    const { questId, address } = req.params;

    // fetch user
    const userDocRef = doc(db, "users", address);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      // fetch user current quests
      const { quests, twitter } = userDocSnap.data();
      const questsArray: any[] = Object.values(quests);

      // find requested quest among active
      const activeQuest = questsArray.find((quest: any) => {
        return quest.questId === questId;
      });

      if (activeQuest) {
        const { currentStep, startedAt } = activeQuest;

        // fetch quest
        const questDocRef = doc(db, "quests", questId);
        const questDocSnap = await getDoc(questDocRef);

        if (questDocSnap.exists()) {
          // fetch steps from quest
          const { steps } = questDocSnap.data();

          // find user current step details from quest
          const activeStep = steps[currentStep];

          const {
            contract_address,
            amount,
            method,
            contract_addresses,
            methods,
            isTwitter,
            partner_id,
          } = activeStep;

          if (isTwitter) {
            const { data } = await client.users.usersIdFollowing(
              twitter.user_id,
              {
                "user.fields": ["id", "name", "username"],
              }
            );

            const found = data?.find(({ id }) => id === partner_id);

            if (found) {
              res.status(200).send({ message: "Success: Verified!" });
            } else {
              res.status(404).send({ message: "Error: Verification failed" });
            }
          } else {
            const response = await fetch(
              `https://api.trongrid.io/v1/accounts/${address}/transactions`
            );

            const { data: transactions } = await response.json();

            let foundTxn;
            if (contract_addresses && contract_addresses.length > 0) {
              for (let i = 0; i < contract_addresses.length; i++) {
                foundTxn = transactions.find((txn: any) => {
                  if (
                    isValidTimestamp(txn, startedAt) &&
                    isValidContract(txn, contract_addresses[i]) &&
                    isValidMethod(txn, methods[i]) &&
                    isValidAmount(txn, amount)
                  )
                    return true;
                });
                if (foundTxn) break;
              }
            } else {
              foundTxn = transactions.find((txn: any) => {
                if (
                  isValidTimestamp(txn, startedAt) &&
                  isValidContract(txn, contract_address) &&
                  isValidMethod(txn, method) &&
                  isValidAmount(txn, amount)
                )
                  return true;
              });
            }

            if (foundTxn) {
              res.status(200).send({ message: "Success: Verified!" });
            } else {
              res.status(404).send({ message: "Error: Verification failed" });
            }
          }
        } else {
          res
            .status(404)
            .send({ message: `Error: No quest found with ${questId}` });
        }
      } else {
        res.status(404).send({
          message: `Error: User does not have an active quest with ${questId}`,
        });
      }
    } else {
      res.status(404).send({ message: `Error: No user found with ${address}` });
    }

    return;
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

/* QUEST VERIFICATION HELPERS */
function isValidTimestamp(txn: any, startedAt: number) {
  const result = txn.block_timestamp > startedAt;
  if (!result) {
    console.log("is valid timestamp failed");
    console.log("txn.block_timestamp: ", txn.block_timestamp);
    console.log("startedAt: ", startedAt);
  }
  return result;
}

function isValidContract(txn: any, contractAddress: string) {
  const result =
    txn.raw_data.contract[0].parameter.value.contract_address ===
    contractAddress;
  if (!result) {
    console.log("is valid contract failed");
    console.log(
      "txn.raw_data.contract[0].parameter.value.contract_address: ",
      txn.raw_data.contract[0].parameter.value.contract_address
    );
    console.log("contractAddress: ", contractAddress);
  }
  return result;
}

function isValidMethod(txn: any, method: string) {
  const result =
    txn.raw_data.contract[0].parameter.value.data.slice(0, 8) === method;
  if (!result) {
    console.log("is valid method failed");
    console.log(
      "txn.raw_data.contract[0].parameter.value.data.slice(0, 8): ",
      txn.raw_data.contract[0].parameter.value.data.slice(0, 8)
    );
    console.log("method: ", method);
  }
  return txn.raw_data.contract[0].parameter.value.data.slice(0, 8) === method;
}

function isValidAmount(txn: any, amount: number) {
  if (!txn.raw_data.contract[0].parameter.value.call_value) return true;
  const result =
    txn.raw_data.contract[0].parameter.value.call_value >= amount * 10 ** 6;
  if (!result) {
    console.log("is valid amount failed");
    console.log(
      "txn.raw_data.contract[0].parameter.value.call_value: ",
      txn.raw_data.contract[0].parameter.value.call_value
    );
    console.log("amount * 10 ** 6: ", amount * 10 ** 6);
  }
  return result;
}
