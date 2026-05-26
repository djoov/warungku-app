import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import fs from 'fs';

let db;
let bucket;

export const connectDB = () => {
    try {
        let serviceAccount;
        
        // 1. Cek apakah ada Environment Variable (Untuk Vercel / Production)
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        } else {
            // 2. Jika tidak ada, gunakan file lokal (Untuk Development di laptop)
            const serviceAccountRaw = fs.readFileSync('./serviceAccountKey.json');
            serviceAccount = JSON.parse(serviceAccountRaw);
        }

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