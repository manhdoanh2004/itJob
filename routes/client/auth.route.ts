import {Router} from "express";
import * as authController from "../../controllers/auth.controller";
const router=Router();

router.post("/check",authController.authCheck);
router.delete('/logout', authController.logout);




export default router