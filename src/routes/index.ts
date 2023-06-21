import { Router } from "express";
import user from "../controllers/user";



const router = Router()

router.post("/register",user.SignUp)
router.get("/users",user.Get)

export default router;
