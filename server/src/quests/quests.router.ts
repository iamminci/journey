import express, { Request, Response } from "express";
import db from "../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

export const questsRouter = express.Router();

questsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const query = collection(db, "users");
    const querySnap: any = await getDocs(query);

    if (querySnap) {
      querySnap.forEach((doc) => {
        res.status(200).send(`Hi, ${doc.data().name}`);
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("bye");
  }
});
