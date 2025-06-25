"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const companyController = __importStar(require("../../controllers/company.controller"));
const companyValidate = __importStar(require("../../validates/company.validate"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_helper_1 = require("../../helpers/cloudinary.helper");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: cloudinary_helper_1.storage });
router.post(`/register`, companyValidate.registerPost, companyController.registerPost);
router.post(`/login`, companyValidate.loginPost, companyController.loginPost);
router.patch(`/profile`, auth_middleware_1.verifyTokenCompany, upload.single("logo"), companyController.profilePatch);
router.get("/list", companyController.companyList);
router.get("/detail/:id", companyController.detail);
router.get("/job/list", auth_middleware_1.verifyTokenCompany, companyController.listJob);
router.post("/job/create", auth_middleware_1.verifyTokenCompany, upload.array('images', 6), companyValidate.createPost, companyController.createPost);
router.get("/job/edit/:id", auth_middleware_1.verifyTokenCompany, companyController.editJob);
router.patch("/job/edit/:id", auth_middleware_1.verifyTokenCompany, upload.array('images', 6), companyValidate.createPost, companyController.editJobPatch);
router.delete("/job/delete/:id", auth_middleware_1.verifyTokenCompany, companyController.deleteJobDel);
router.get("/cv/list", auth_middleware_1.verifyTokenCompany, companyController.listCv);
router.get("/cv/detail/:id", auth_middleware_1.verifyTokenCompany, companyController.detailCv);
router.patch("/cv/change-status", auth_middleware_1.verifyTokenCompany, companyController.changeStatusCV);
router.delete("/cv/delete/:id", auth_middleware_1.verifyTokenCompany, companyController.deleteCVDel);
exports.default = router;
