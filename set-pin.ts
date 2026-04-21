import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf-8"));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function setPin() {
  try {
    const docRef = doc(db, "config", "main");
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      await updateDoc(docRef, { pinCode: "0130" });
      console.log("PIN updated to 0130 in Firestore!");
    } else {
      console.log("Config not found in db, fallback will be used.");
    }
    process.exit(0);
  } catch (e: any) {
    console.error("Error setting pin:", e.message);
    process.exit(1);
  }
}
setPin();
