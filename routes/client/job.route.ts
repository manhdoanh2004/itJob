import {Router} from "express";
import * as jobControllers from "../../controllers/job.controller"
import * as jobValidats from "../../validates/job.validate";
import multer from "multer";
import { storage } from "../../helpers/cloudinary.helper";
import * as veryFyToken from "../../middlewares/auth.middleware"

const router=Router();

const upload=multer({storage:storage,
    limits:{
        fieldSize: 5*1024*1024 //5mb,

    },
     fileFilter: (req, file, cb)=> {
        if(file.mimetype!=="application/pdf")  
        {
            cb(null, false); 
            cb(new Error('Chỉ được gửi lên file dạng pdf!'));
            return;
        }
        else cb(null, true);
}
});

router.get("/detail/:id",jobControllers.jobDetail);

router.post("/apply",
    veryFyToken.verifyTokenUser
    ,upload.single("fileCV"),
    jobValidats.applyPost
    ,jobControllers.jobApplyPost)

export default router;