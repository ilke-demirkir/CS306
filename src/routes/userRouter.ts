import { Router } from "express";
import { getUsers, createUser } from "../controllers/userController";

const userRouter = Router();

userRouter.get("/users", getUsers);
userRouter.post("/create", createUser);

export default userRouter;
