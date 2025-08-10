import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();
const firebaseServiceKey = process.env.FIREBASE_SERVICES_KEY as string;
const serviceAccount = JSON.parse(
  Buffer.from(firebaseServiceKey, "base64").toString("utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
