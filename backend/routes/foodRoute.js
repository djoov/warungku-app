import express from "express"
import { addFood, listFood, removeFood, updateFood, toggleStock } from "../controllers/foodController.js"
import multer from "multer"
import adminAuth from "../middleware/adminAuth.js"

const foodRouter = express.Router()

// Use memoryStorage so we can pass the buffer directly to Firebase Storage
const storage = multer.memoryStorage();
const upload = multer({storage:storage})

foodRouter.post("/add", adminAuth, upload.single("image"), addFood)
foodRouter.get("/list", listFood)
foodRouter.post("/remove", adminAuth, removeFood);
foodRouter.post("/update", adminAuth, upload.single("image"), updateFood);
foodRouter.post("/toggle-stock", adminAuth, toggleStock);

export default foodRouter;