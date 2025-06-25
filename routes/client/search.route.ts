import {Router} from "express";
import * as searchControllers from "../../controllers/search.controller"

const router=Router();

router.get("/",searchControllers.searchResult);

export default router;