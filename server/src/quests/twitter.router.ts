import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import { Client } from "twitter-api-sdk";
import { doc, getDoc } from "firebase/firestore";
import db from "../../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

dotenv.config();

export const twitterRouter = express.Router();

const client = new Client(process.env.BEARER_TOKEN as string);

// verify tweet:
twitterRouter.get("/tweet/:tweetId", async (req: Request, res: Response) => {
  try {
    const { tweetId } = req.params;

    const response = await client.tweets.findTweetById(tweetId, {
      "tweet.fields": ["author_id"],
      expansions: ["author_id"],
      "user.fields": [
        "description",
        "entities",
        "id",
        "location",
        "name",
        "pinned_tweet_id",
        "profile_image_url",
        "protected",
        "url",
        "username",
      ],
    });

    res.status(202).send(response);

    // const fetchedId = response.data.text.split("uuid:")[1];

    // const q = query(collection(db, "users"), where("uuid", "==", fetchedId));
    // const querySnapshot = await getDocs(q);
    // querySnapshot.forEach((doc) => {
    //   if (doc) {
    //     res.status(202).send("verified");
    //   } else {
    //     console.log("not fou=nds");
    //     res.status(404).send({ message: "User not found" });
    //   }
    // });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

// verify following:
twitterRouter.get("/follow/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const { data } = await client.users.usersIdFollowing(userId, {
      "user.fields": ["id", "name", "username"],
    });

    const found = data?.find(({ id }) => id === "1299250153992327169");

    if (found) {
      res.status(202).send("found!");
    } else {
      res.status(404).send("not found");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

// verify following:
twitterRouter.get(
  "/follow/:userId/:partnerId",
  async (req: Request, res: Response) => {
    try {
      const { userId, partnerId } = req.params;

      const { data } = await client.users.usersIdFollowing(userId, {
        "user.fields": ["id", "name", "username"],
      });

      const found = data?.find(({ id }) => id === partnerId);

      if (found) {
        res.status(202).send("found!");
      } else {
        res.status(404).send("not found");
      }
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }
  }
);
