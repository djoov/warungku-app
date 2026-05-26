import express from "express"
import authMiddleware from "../middleware/auth.js"
import adminAuth from "../middleware/adminAuth.js"
import { listOrders, placeOrder, updateStatus, userOrders, verifyOrder, retryPayment, posOrder } from "../controllers/orderController.js"

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.get("/list", adminAuth, listOrders);
orderRouter.post("/status", adminAuth, updateStatus);
orderRouter.post("/verify", authMiddleware, verifyOrder);
orderRouter.post("/retry-payment", authMiddleware, retryPayment);
orderRouter.post("/pos", adminAuth, posOrder);

export default orderRouter;