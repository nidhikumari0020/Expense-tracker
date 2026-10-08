import express from "express";
import {
    registerUser,
    loginUser,
    getUserDetails,
    updateUserDetails,
    changeUserPassword
} from "../controllers/userController.js";

import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

//protected route
userRouter.get("/me", authMiddleware, getUserDetails);
userRouter.put("/profile", authMiddleware, updateUserDetails);
userRouter.put("/password", authMiddleware, changeUserPassword);

export default userRouter;