import { db } from '../config/db.js';

export const getOrderCollection = () => db.collection("orders");