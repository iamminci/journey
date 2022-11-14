import express, { Request, Response } from "express";
import db from "../../firebase/firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export const usersRouter = express.Router();

// fetch all users
usersRouter.get("/", async (req: Request, res: Response) => {
  try {
    const query = collection(db, "users");
    const querySnap: any = await getDocs(query);

    const fetchedUsers: any = [];

    if (querySnap) {
      querySnap.forEach((doc: any) => {
        fetchedUsers.push(doc.data());
      });
    }
    res
      .status(200)
      .send({ message: "Successfully fetched", quest: fetchedUsers });
  } catch (e) {
    console.log(e);
    res.status(500).send("bye");
  }
});

// fetch user
usersRouter.get("/:address", async (req: Request, res: Response) => {
  try {
    const { address } = req.params;

    const docRef = doc(db, "users", address);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      res.status(200).send(docSnap.data());
    } else {
      res.status(404).send({ message: "User not found" });
    }
    return;
  } catch (e) {
    console.log(e);
    res.status(500).send("bye");
  }
});

// create a new user
usersRouter.post("/new", async (req: Request, res: Response) => {
  try {
    const { address } = req.body;

    const docRef = doc(db, "users", address);
    await setDoc(docRef, {
      address: address,
      uuid: uuidv4(),
      quests: {},
    });
    res.status(202).send("User successfully added");
  } catch (e) {
    console.log(e);
    res.status(500).send("bye");
  }
});

// // create a new user
usersRouter.post("/startQuest", async (req: Request, res: Response) => {
  try {
    const { address, newQuests } = req.body;

    const docRef = doc(db, "users", address);

    await updateDoc(docRef, {
      quests: newQuests,
    });
    res.status(202).send("Quest successfully started");
  } catch (e) {
    console.log(e);
    res.status(500).send("bye");
  }
});

// create a new user
usersRouter.put("/:address", async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const { quests } = req.body;

    const docRef = doc(db, "users", address);
    await updateDoc(docRef, {
      quests: quests,
    });
    res.status(202).send("User successfully added");
  } catch (e) {
    console.log(e);
    res.status(500).send("bye");
  }
});
