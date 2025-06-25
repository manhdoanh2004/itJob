import {Router} from "express";
import * as cityControllers from "../../controllers/city.controller"

const router=Router();

router.get("/list",cityControllers.list)
export default router;