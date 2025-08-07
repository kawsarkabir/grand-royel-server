import dotenv from "dotenv";
import admin from "firebase-admin";
dotenv.config();

const firebaseKey = process.env.FIREBASE_SERVICES_KEY;

if (!firebaseKey) {
  throw new Error(
    "FIREBASE_SERVICES_KEY is not defined in environment variables."
  );
}

const fileData = Buffer.from(firebaseKey, "base64").toString("utf8");

const serviceAccount = JSON.parse(fileData);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
