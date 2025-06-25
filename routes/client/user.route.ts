import { Router } from "express";
import * as userController from "../../controllers/user.controller";
import * as userValidate from"../../validates/user.validate";
import multer from "multer";
import { storage } from "../../helpers/cloudinary.helper";
import {verifyTokenUser}  from "../../middlewares/auth.middleware";

const router=Router();

const upload=multer({storage:storage});

router.post("/register",userValidate.registerPost,userController.registerPost);
router.post("/login",userValidate.loginPost,userController.loginPost);
router.patch("/profile",
    upload.single("avatar"),verifyTokenUser,userValidate.profilePatch,
    userController.profilePach);


router.get(
  '/cv/list', 
 verifyTokenUser,
  userController.listCV
);

export default router;
