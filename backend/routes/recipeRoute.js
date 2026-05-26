import express from "express";
import { setRecipe, getRecipe, listRecipes, deleteRecipe, checkPortions } from "../controllers/recipeController.js";
import authMiddleware from "../middleware/auth.js";

const recipeRouter = express.Router();

recipeRouter.post("/set", authMiddleware, setRecipe);
recipeRouter.get("/get/:foodId", authMiddleware, getRecipe);
recipeRouter.get("/list", authMiddleware, listRecipes);
recipeRouter.post("/delete", authMiddleware, deleteRecipe);
recipeRouter.get("/portions/:foodId", authMiddleware, checkPortions);

export default recipeRouter;
