import { db } from '../config/db.js';

export const getUserCollection = () => db.collection("users");
