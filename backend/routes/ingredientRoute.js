import express from "express";
import { addIngredient, listIngredients, updateIngredient, deleteIngredient, restockIngredient, lowStockIngredients } from "../controllers/ingredientController.js";
import authMiddleware from "../middleware/auth.js";

const ingredientRouter = express.Router();

ingredientRouter.post("/add", authMiddleware, addIngredient);
ingredientRouter.get("/list", authMiddleware, listIngredients);
ingredientRouter.post("/update", authMiddleware, updateIngredient);
ingredientRouter.post("/delete", authMiddleware, deleteIngredient);
ingredientRouter.post("/restock", authMiddleware, restockIngredient);
ingredientRouter.get("/low-stock", authMiddleware, lowStockIngredients);

export default ingredientRouter;
