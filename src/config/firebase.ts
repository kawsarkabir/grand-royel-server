// import admin from "firebase-admin";
// import dotenv from "dotenv";

// dotenv.config();

// const fileData = Buffer.from(
//   process.env.FIREBASE_SERVICES_KEY,
//   "base64"
// ).toString("utf8");

// const serviceAccount = JSON.parse(fileData);

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// export default admin;

// firebase.ts
import admin from "firebase-admin";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.join(__dirname, "../../firebase-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
});

export default admin;