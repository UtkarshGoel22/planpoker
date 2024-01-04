import express from "express";

import { registerUser } from "../controllers/user_registration";
import { registerUserValidation } from "../middlewares/user_validation";

const router: express.Router = express.Router();

router.post("/signup", registerUserValidation, registerUser);

export default router;
