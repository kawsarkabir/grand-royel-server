import admin from "../config/firebase";
export const verifyFirebaseToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized - Missing token" });
    }
    const idToken = authHeader.split(" ")[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    }
    catch (err) {
        console.error("❌ Firebase token verification failed:", err);
        return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }
};
