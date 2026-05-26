import { db } from '../config/db.js';

export const getRecipeCollection = () => db.collection("recipes");
