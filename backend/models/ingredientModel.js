import { db } from '../config/db.js';

export const getIngredientCollection = () => db.collection("ingredients");
