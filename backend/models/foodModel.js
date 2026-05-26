import { db } from '../config/db.js';

// In Firebase Admin SDK, we use db.collection() to get a reference
export const getFoodCollection = () => db.collection("foods");