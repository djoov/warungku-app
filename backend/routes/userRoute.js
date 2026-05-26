import express from "express"
import { loginUser, registerUser, ssoLogin, listUsers, getProfile, updateProfile } from "../controllers/userController.js"
import adminAuth from "../middleware/adminAuth.js"
import authMiddleware from "../middleware/auth.js"
import multer from "multer"

const userRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({storage:storage});

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/sso-login", ssoLogin)
userRouter.get("/list", adminAuth, listUsers)

// User Profile routes
userRouter.get("/profile", authMiddleware, getProfile)
userRouter.post("/profile/update", authMiddleware, upload.single("image"), updateProfile)

export default userRouter;