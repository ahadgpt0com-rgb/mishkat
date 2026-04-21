import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import fs from "fs";

const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf-8"));
const app = initializeApp(config);
const storage = getStorage(app);

async function test() {
  try {
    const r = ref(storage, "test.txt");
    await uploadString(r, "hello");
    const url = await getDownloadURL(r);
    console.log("Success! URL:", url);
    process.exit(0);
  } catch (e: any) {
    console.error("Storage error:", e.message);
    process.exit(1);
  }
}
test();
