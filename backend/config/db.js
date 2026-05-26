import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import fs from 'fs';

let db;
let bucket;

export const connectDB = () => {
    try {
        // Load the service account key JSON file
        const serviceAccountRaw = fs.readFileSync('./serviceAccountKey.json');
        const serviceAccount = JSON.parse(serviceAccountRaw);

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: "remesan-c81e0.firebasestorage.app"
        });

        db = getFirestore();
        bucket = getStorage().bucket();

        console.log("Firebase Admin Connected 🔥");
    } catch (error) {
        console.error("Firebase Admin Initialization Error:", error.message);
        console.log("Please make sure you have placed your valid serviceAccountKey.json in the backend folder.");
    }
}

export { db, bucket };