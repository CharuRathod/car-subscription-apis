import dotenv from "dotenv";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

dotenv.config();

let messaging = null;

const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ?.replace(/^"|"$/g, "")
    .replace(/\\n/g, "\n");

const hasValidCredentialShape =
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    privateKey &&
    privateKey.includes("-----BEGIN PRIVATE KEY-----") &&
    privateKey.includes("-----END PRIVATE KEY-----") &&
    privateKey.length > 200;

if (hasValidCredentialShape) {
    try {
        const app = getApps().length
            ? getApps()[0]
            : initializeApp({
                credential: cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey
                })
            });

        messaging = getMessaging(app);
    } catch (error) {
        console.warn(`Firebase push notifications are disabled: ${error.message}`);
    }
} else {
    console.warn("Firebase push notifications are disabled: the service-account credentials are missing or invalid.");
}

export { messaging };
