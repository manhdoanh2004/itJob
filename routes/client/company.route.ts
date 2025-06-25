import {Router} from "express";
import * as companyController from "../../controllers/company.controller"
import * as companyValidate from "../../validates/company.validate";
import multer from "multer";
import { storage } from "../../helpers/cloudinary.helper";
import {verifyTokenCompany}  from "../../middlewares/auth.middleware";

const router=Router();

const upload=multer({storage:storage});

router.post(`/register`,companyValidate.registerPost,companyController.registerPost);
router.post(`/login`,companyValidate.loginPost,companyController.loginPost);
router.patch(`/profile`,verifyTokenCompany,
    upload.single("logo"),
    companyController.profilePatch);


router.get("/list",companyController.companyList)

router.get("/detail/:id",companyController.detail)

router.get("/job/list",verifyTokenCompany,companyController.listJob);
router.post("/job/create",verifyTokenCompany,upload.array('images', 6),
            companyValidate.createPost,companyController.createPost);

router.get("/job/edit/:id",verifyTokenCompany,companyController.editJob);
router.patch("/job/edit/:id",verifyTokenCompany,upload.array('images', 6),companyValidate.createPost,companyController.editJobPatch);
router.delete("/job/delete/:id",verifyTokenCompany,companyController.deleteJobDel);

router.get("/cv/list",verifyTokenCompany,companyController.listCv);
router.get("/cv/detail/:id",verifyTokenCompany,companyController.detailCv);
router.patch("/cv/change-status",verifyTokenCompany,companyController.changeStatusCV);
router.delete("/cv/delete/:id",verifyTokenCompany,companyController.deleteCVDel);




export default router;