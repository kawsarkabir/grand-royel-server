import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const fileData = Buffer.from(
  process.env.FIREBASE_SERVICES_KEY,
  "base64"
).toString("utf8");

const serviceAccount = JSON.parse(fileData);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;