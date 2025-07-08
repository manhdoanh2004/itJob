"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCV = exports.profilePach = exports.loginPost = exports.registerPost = void 0;
const account_user_model_1 = __importDefault(require("../models/account-user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const account_company_model_1 = __importDefault(require("../models/account-company.model"));
const cv_model_1 = __importDefault(require("../models/cv.model"));
const job_model_1 = __importDefault(require("../models/job.model"));
const registerPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, passWord } = req.body;
        const existAccount = yield account_user_model_1.default.findOne({
            email: email
        });
        if (existAccount) {
            res.json({
                code: "error",
                message: "Email đã tồn tại trong hệ thống!"
            });
            return;
        }
        // Mã hóa mật khẩu với bcrypt
        const salt = yield bcryptjs_1.default.genSalt(10); // Tạo salt - Chuỗi ngẫu nhiên có 10 ký tự
        const hashedPassword = yield bcryptjs_1.default.hash(passWord, salt); // Mã hóa mật khẩu
        const newAccount = new account_user_model_1.default({
            fullName: fullName,
            email: email,
            passWord: hashedPassword
        });
        yield newAccount.save();
        res.json({
            code: "success",
            message: "Đăng ký tài khoản thành công!"
        });
    }
    catch (error) {
        res.json({
            code: "error",
            message: "Đăng ký tài khoản không thành công!"
        });
    }
});
exports.registerPost = registerPost;
const loginPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, passWord } = req.body;
    const exitsAccount = yield account_user_model_1.default.findOne({
        email: email,
    });
    if (!exitsAccount) {
        res.json({
            code: "error",
            message: "Email không tồn tại!",
        });
    }
    //kiểm tra xem mật khẩu người dùng nhập vào có đúng với mật khẩu trong database hay không
    const isPassWordValid = yield bcryptjs_1.default.compare(passWord, `${exitsAccount === null || exitsAccount === void 0 ? void 0 : exitsAccount.passWord}`); // true
    if (!isPassWordValid) {
        res.json({
            code: "error",
            message: "Mật khẩu không chính xác!",
        });
    }
    //Tạo jwt
    var token = jsonwebtoken_1.default.sign({
        id: `${exitsAccount === null || exitsAccount === void 0 ? void 0 : exitsAccount.id}`,
        email: exitsAccount === null || exitsAccount === void 0 ? void 0 : exitsAccount.email,
    }, `${process.env.JWT_SECRET}`, {
        expiresIn: "1d",
    });
    //lưu token vào cookies
    res.cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000, //Token có hiệu lưu 1 ngày,
        httpOnly: true, //chỉ có sever mới được gửi token lên
        secure: `${process.env.SECURE_ENV}` == "true" ? true : false, //False:http, true:https
        sameSite: `${process.env.SAMESITE_VALUE}` == "lax" ? "lax" : "none", // lax :cho phép gửi cookies giữa các domain khác nhau ở localhost, none :cho phép gửi cookies giữa các domain khác nhau cross-origin
        path: "/"
    });
    //  res.cookie("isLogin", "1", {
    //    maxAge:  24 * 60 * 60 * 1000, //Token có hiệu lưu 1 ngày,
    //    httpOnly: false, //chỉ có sever mới được gửi token lên
    //    secure:`${process.env.SECURE_ENV}`=="true"?true:false, //False:http, true:https
    //    sameSite: `${process.env.SAMESITE_VALUE}`=="lax"?"lax":"none", // lax :cho phép gửi cookies giữa các domain khác nhau ở localhost, none :cho phép gửi cookies giữa các domain khác nhau cross-origin
    //     path:"/"
    //  });
    res.json({
        code: "success",
        message: "Đăng nhập thành công !",
    });
});
exports.loginPost = loginPost;
const profilePach = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.file) {
            req.body.avatar = req.file.path;
        }
        else
            delete req.body.avatar;
        yield account_user_model_1.default.updateOne({
            _id: req.account.id,
        }, req.body);
        res.json({
            code: "success",
            message: "Cập nhật profile thành công!"
        });
    }
    catch (error) {
        res.json({
            code: "error",
            message: "Cập nhật profile không thành công!"
        });
    }
});
exports.profilePach = profilePach;
const listCV = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.account.id;
    const find = {
        userId: userId
    };
    // Phân trang
    const limitItems = 2;
    let page = 1;
    if (req.query.page) {
        const currentPage = parseInt(`${req.query.page}`);
        if (currentPage > 0) {
            page = currentPage;
        }
    }
    const totalRecord = yield cv_model_1.default.countDocuments(find);
    const totalPage = Math.ceil(totalRecord / limitItems);
    if (page > totalPage && totalPage != 0) {
        page = totalPage;
    }
    const skip = (page - 1) * limitItems;
    // Hết Phân trang
    const listCV = yield cv_model_1.default
        .find(find)
        .sort({
        createdAt: "desc"
    }).limit(limitItems).skip(skip);
    const dataFinal = [];
    for (const item of listCV) {
        const dataItemFinal = {
            id: item.id,
            jobId: "",
            companyId: "",
            jobTitle: "",
            companyName: "",
            jobSalaryMin: 0,
            jobSalaryMax: 0,
            jobPosition: "",
            jobWorkingForm: "",
            status: item.status,
            companyLogo: ""
        };
        const infoJob = yield job_model_1.default.findOne({
            _id: item.jobId
        });
        if (infoJob) {
            dataItemFinal.jobId = `${infoJob.id}`;
            dataItemFinal.jobTitle = `${infoJob.title}`;
            dataItemFinal.jobSalaryMin = parseInt(`${infoJob.salaryMin}`);
            dataItemFinal.jobSalaryMax = parseInt(`${infoJob.salaryMax}`);
            dataItemFinal.jobPosition = `${infoJob.position}`;
            dataItemFinal.jobWorkingForm = `${infoJob.workingForm}`;
            const infoCompany = yield account_company_model_1.default.findOne({
                _id: infoJob.companyId
            });
            if (infoCompany) {
                dataItemFinal.companyName = `${infoCompany.companyName}`;
                dataItemFinal.companyLogo = `${infoCompany.logo}`;
                dataItemFinal.companyId = `${infoCompany.id}`;
                dataFinal.push(dataItemFinal);
            }
        }
    }
    res.json({
        code: "success",
        message: "Lấy danh sách CV thành công!",
        listCV: dataFinal,
        totalPage: totalPage
    });
});
exports.listCV = listCV;
