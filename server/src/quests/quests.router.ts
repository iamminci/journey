import express, { Request, Response } from "express";
import db from "../../firebase/firebase";
import { collection, doc, getDocs, getDoc } from "firebase/firestore";

export const questsRouter = express.Router();

// fetch all quests: http://localhost:8888/api/quests/
questsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const query = collection(db, "quests");
    const querySnap: any = await getDocs(query);

    const fetchedQuests: any = [];

    if (querySnap) {
      querySnap.forEach((doc: any) => {
        fetchedQuests.push(doc.data());
      });
    }

    console.log(fetchedQuests);
    res.status(200).send(`Hi, ${fetchedQuests}`);
  } catch (e) {
    console.log(e);
    res.status(500).send("bye");
  }
});

// fetch specific quest: http://localhost:8888/api/quests/V2zbf8iYGGGzFnkXQ6tB
questsRouter.get("/:questId", async (req: Request, res: Response) => {
  try {
    const { questId } = req.params;

    const docRef = doc(db, "quests", questId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      res.status(200).send(docSnap.data());
    } else {
      console.log("No such document!");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("bye");
  }
});
