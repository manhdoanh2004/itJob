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
exports.deleteCVDel = exports.changeStatusCV = exports.detailCv = exports.listCv = exports.detail = exports.companyList = exports.deleteJobDel = exports.editJobPatch = exports.editJob = exports.listJob = exports.createPost = exports.profilePatch = exports.loginPost = exports.registerPost = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const account_company_model_1 = __importDefault(require("../models/account-company.model"));
const job_model_1 = __importDefault(require("../models/job.model"));
const city_model_1 = __importDefault(require("../models/city.model"));
const cv_model_1 = __importDefault(require("../models/cv.model"));
const registerPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { companyName, email, passWord } = req.body;
        const existAccount = yield account_company_model_1.default.findOne({
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
        const newAccount = new account_company_model_1.default({
            companyName: companyName,
            email: email,
            passWord: hashedPassword
        });
        yield newAccount.save();
        res.json({
            code: "success",
            message: "Đăng ký tài khoản nhà tuyển dụng  thành công!"
        });
    }
    catch (error) {
        res.json({
            code: "error",
            message: "Đăng ký tài khoản nhà tuyển dụng không thành công!"
        });
    }
});
exports.registerPost = registerPost;
const loginPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, passWord } = req.body;
    const exitsAccount = yield account_company_model_1.default.findOne({
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
        //secure:`${process.env.SECURE_ENV}`=="true"?true:false, //False:http, true:https
        secure: true, //False:http, true:https
        //  sameSite: `${process.env.SAMESITE_VALUE}`=="lax"?"lax":"none", // lax :cho phép gửi cookies giữa các domain khác nhau ở localhost, none :cho phép gửi cookies giữa các domain khác nhau cross-origin
        sameSite: "none", // lax :cho phép gửi cookies giữa các domain khác nhau ở localhost, none :cho phép gửi cookies giữa các domain khác nhau cross-origin
        path: "/"
    });
    res.json({
        code: "success",
        message: "Đăng nhập thành công !",
    });
});
exports.loginPost = loginPost;
const profilePatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.file) {
            req.body.logo = req.file.path;
        }
        else {
            delete req.body.logo;
        }
        yield account_company_model_1.default.updateOne({
            _id: req.account.id
        }, req.body);
        res.json({
            code: "success",
            message: "Cập nhật profile company thành công!"
        });
    }
    catch (error) {
        res.json({
            code: "error",
            message: "Cập nhật profile company không thành công!"
        });
    }
});
exports.profilePatch = profilePatch;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.companyId = req.account.id;
    req.body.salaryMin = req.body.salaryMin ? parseInt(req.body.salaryMin) : 0;
    req.body.salaryMax = req.body.salaryMax ? parseInt(req.body.salaryMax) : 0;
    req.body.technologies = req.body.technologies ? req.body.technologies.split(",") : [];
    req.body.images = [];
    // Xử lý mảng images
    if (req.files) {
        for (const file of req.files) {
            req.body.images.push(file.path);
        }
    }
    const newRecord = new job_model_1.default(req.body);
    yield newRecord.save();
    res.json({
        code: "success",
        message: "Tạo công việc thành công!"
    });
});
exports.createPost = createPost;
const listJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const find = {
        companyId: req.account.id
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
    const totalRecord = yield job_model_1.default.countDocuments(find);
    const totalPage = Math.ceil(totalRecord / limitItems);
    if (page > totalPage && totalPage != 0) {
        page = totalPage;
    }
    const skip = (page - 1) * limitItems;
    // Hết Phân trang
    const companyId = req.account.id;
    const jobList = yield job_model_1.default
        .find(find)
        .sort({
        createdAt: "desc"
    })
        .limit(limitItems)
        .skip(skip);
    let dataFinal = [];
    const city = yield city_model_1.default.findOne({
        _id: req.account.city
    });
    for (let job of jobList) {
        dataFinal.push({
            id: job.id,
            companyLogo: req.account.logo,
            companyName: req.account.companyName,
            salaryMin: job.salaryMin,
            salaryMax: job.salaryMax,
            position: job.position,
            workingForm: job.workingForm,
            companyCity: city === null || city === void 0 ? void 0 : city.name,
            technologies: job.technologies,
            title: job.title
        });
    }
    res.json({
        code: "success",
        message: "Lấy thành công!",
        jobList: dataFinal,
        totalPage: totalPage
    });
});
exports.listJob = listJob;
const editJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const companyId = req.account.id;
    const jobDetail = yield job_model_1.default.findOne({
        _id: id,
        companyId: companyId
    });
    if (!jobDetail) {
        res.json({
            code: "error",
            message: "Lấy thông tin thành công!",
            jobDetail: {}
        });
    }
    res.json({
        code: "success",
        message: "Lấy thông tin thành công!",
        jobDetail: jobDetail
    });
});
exports.editJob = editJob;
const editJobPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const companyId = req.account.id;
        req.body.salaryMin = req.body.salaryMin ? parseInt(req.body.salaryMin) : 0;
        req.body.salaryMax = req.body.salaryMax ? parseInt(req.body.salaryMax) : 0;
        req.body.technologies = req.body.technologies ? req.body.technologies.split(",") : [];
        req.body.images = [];
        // Xử lý mảng images
        if (req.files) {
            for (const file of req.files) {
                req.body.images.push(file.path);
            }
        }
        yield job_model_1.default.updateOne({
            _id: id,
            companyId: companyId,
        }, req.body);
        res.json({
            code: "success",
            message: "Cập nhật công việc thành công!"
        });
    }
    catch (error) {
        console.log(error);
        res.json({
            code: "error",
            message: "Cập nhật  không công việc thành công!"
        });
    }
});
exports.editJobPatch = editJobPatch;
const deleteJobDel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const companyId = req.account.id;
        yield job_model_1.default.deleteOne({
            _id: id,
            companyId: companyId
        });
        res.json({
            code: "success",
            message: " Xóa công việc  thành công!"
        });
    }
    catch (error) {
        console.log(error);
        res.json({
            code: "error",
            message: " Xóa công việc  Không  thành công!"
        });
    }
});
exports.deleteJobDel = deleteJobDel;
const companyList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const find = {};
    let limitItems = 2;
    if (req.query.limitItems) {
        limitItems = parseInt(`${req.query.limitItems}`);
    }
    // Phân trang
    let page = 1;
    if (req.query.page) {
        const currentPage = parseInt(`${req.query.page}`);
        if (currentPage > 0) {
            page = currentPage;
        }
    }
    const totalRecord = yield account_company_model_1.default.countDocuments(find);
    const totalPage = Math.ceil(totalRecord / limitItems);
    if (page > totalPage && totalPage != 0) {
        page = totalPage;
    }
    const skip = (page - 1) * limitItems;
    // Hết Phân trang
    const companyList = yield account_company_model_1.default
        .find(find)
        .limit(limitItems)
        .skip(skip)
        .sort({
        createdAt: "desc"
    });
    const companyListFinal = [];
    for (const item of companyList) {
        const dataItemFinal = {
            id: item.id,
            logo: item.logo,
            companyName: item.companyName,
            cityName: "",
            totalJob: 0
        };
        // Thành phố
        const city = yield city_model_1.default.findOne({
            _id: item.city
        });
        dataItemFinal.cityName = `${city === null || city === void 0 ? void 0 : city.name}`;
        // Tổng số việc làm
        const totalJob = yield job_model_1.default.countDocuments({
            companyId: item.id
        });
        dataItemFinal.totalJob = totalJob;
        companyListFinal.push(dataItemFinal);
    }
    res.json({
        code: "success",
        message: "Thành công!",
        companyList: companyListFinal,
        totalPage: totalPage
    });
});
exports.companyList = companyList;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companyId = req.params.id;
        const accountCompany = yield account_company_model_1.default.findOne({
            _id: companyId
        });
        if (!accountCompany) {
            res.json({
                code: "error",
                message: "Không thành công!"
            });
            return;
        }
        const companyDetail = {
            id: accountCompany.id,
            logo: accountCompany.logo,
            companyName: accountCompany.companyName,
            address: accountCompany.address,
            companyModel: accountCompany.companyModel,
            companyEmployees: accountCompany.companyEmployees,
            workingTime: accountCompany.workingTime,
            workOvertime: accountCompany.workOvertime,
            description: accountCompany.description,
        };
        //Danh sách công việc của công ty
        const jobList = yield job_model_1.default.find({
            companyId: companyId
        }).sort({
            createdAt: "desc"
        });
        const dataFinal = [];
        const city = yield city_model_1.default.findOne({
            _id: accountCompany.city
        });
        for (const item of jobList) {
            dataFinal.push({
                id: item.id,
                companyLogo: accountCompany.logo,
                title: item.title,
                companyName: accountCompany.companyName,
                salaryMin: item.salaryMin,
                salaryMax: item.salaryMax,
                position: item.position,
                workingForm: item.workingForm,
                companyCity: city === null || city === void 0 ? void 0 : city.name,
                technologies: item.technologies,
            });
        }
        res.json({
            code: "success",
            message: "Thành công!",
            companyDetail: companyDetail,
            jobList: dataFinal
        });
    }
    catch (error) {
        console.log(error);
        res.json({
            code: "error",
            message: "Không thành công!",
        });
    }
});
exports.detail = detail;
const listCv = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companyId = req.account.id;
        const listJob = yield job_model_1.default.find({
            companyId: companyId
        });
        const listJobId = listJob.map((item) => item.id);
        // Phân trang
        const limitItems = 2;
        let page = 1;
        if (req.query.page) {
            const currentPage = parseInt(`${req.query.page}`);
            if (currentPage > 0) {
                page = currentPage;
            }
        }
        const totalRecord = yield cv_model_1.default.countDocuments({
            jobId: { $in: listJobId }
        });
        const totalPage = Math.ceil(totalRecord / limitItems);
        if (page > totalPage && totalPage != 0) {
            page = totalPage;
        }
        const skip = (page - 1) * limitItems;
        // Hết Phân trang
        const listCv = yield cv_model_1.default.find({
            jobId: { $in: listJobId }
        }).limit(limitItems).skip(skip);
        const dataFinal = [];
        for (let cv of listCv) {
            let dataFinalItem = {
                id: cv.id,
                jobTitle: "",
                fullName: cv.fullName,
                email: cv.email,
                phone: cv.phone,
                jobSalaryMin: 0,
                jobSalaryMax: 0,
                jobPosition: "",
                jobWorkingFrom: "",
                viewed: cv.viewed,
                status: cv.status
            };
            const infoJob = yield job_model_1.default.findOne({
                _id: cv.jobId
            });
            if (infoJob) {
                dataFinalItem.jobTitle = `${infoJob.title}`;
                dataFinalItem.jobSalaryMin = parseInt(`${infoJob.salaryMin}`);
                dataFinalItem.jobSalaryMax = parseInt(`${infoJob.salaryMax}`);
                dataFinalItem.jobPosition = `${infoJob.position}`;
                dataFinalItem.jobWorkingFrom = `${infoJob.workingForm}`;
            }
            dataFinal.push(dataFinalItem);
        }
        res.json({
            code: "success",
            message: "Lấy danh sách cv thành công!",
            cvList: dataFinal,
            totalPage: totalPage
        });
    }
    catch (error) {
        console.log(error);
        res.json({
            code: "error",
            message: "Lấy danh sách cv không thành công!",
            cvList: []
        });
    }
});
exports.listCv = listCv;
const detailCv = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const companyId = req.account.id;
    const cvId = req.params.id;
    const infoCv = yield cv_model_1.default.findOne({
        _id: cvId
    });
    if (!infoCv) {
        res.json({
            code: "error",
            message: "Lấy thông tin không thành công!"
        });
        return;
    }
    const inforJob = yield job_model_1.default.findOne({
        _id: infoCv.jobId,
        companyId: companyId
    });
    if (!inforJob) {
        res.json({
            code: "error",
            message: "Lấy thông tin không thành công!"
        });
        return;
    }
    //Cập nhật lại trạng thái cv
    yield cv_model_1.default.updateOne({
        _id: cvId
    }, {
        viewed: true
    });
    //hết Cập nhật lại trạng thái cv
    const dataFinalCV = {
        fullName: infoCv.fullName,
        email: infoCv.email,
        phone: infoCv.phone,
        fileCV: infoCv.fileCV,
    };
    const dataFinalJob = {
        id: inforJob.id,
        title: inforJob.title,
        salaryMin: inforJob.salaryMin,
        salaryMax: inforJob.salaryMax,
        position: inforJob.position,
        workingForm: inforJob.workingForm,
        technologies: inforJob.technologies,
    };
    res.json({
        code: "success",
        message: "Lấy thông tin thành công!",
        cvDetail: dataFinalCV,
        jobDetail: dataFinalJob,
    });
});
exports.detailCv = detailCv;
const changeStatusCV = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companyId = req.account.id;
        const status = req.body.action;
        const cvId = req.body.id;
        const infoCV = yield cv_model_1.default.findOne({
            _id: cvId
        });
        if (!infoCV) {
            res.json({
                code: "error",
                message: "Id không hợp lệ!"
            });
            return;
        }
        const infoJob = yield job_model_1.default.findOne({
            _id: infoCV.jobId,
            companyId: companyId
        });
        if (!infoJob) {
            res.json({
                code: "error",
                message: "Không có quyền truy cập!"
            });
            return;
        }
        yield cv_model_1.default.updateOne({
            _id: cvId
        }, {
            status: status
        });
        res.json({
            code: "success",
            message: "Thành công!"
        });
    }
    catch (error) {
        console.log(error);
        res.json({
            code: "error",
            message: "Id không hợp lệ!"
        });
    }
});
exports.changeStatusCV = changeStatusCV;
const deleteCVDel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companyId = req.account.id;
        const cvId = req.params.id;
        const infoCV = yield cv_model_1.default.findOne({
            _id: cvId
        });
        if (!infoCV) {
            res.json({
                code: "error",
                message: "Id không hợp lệ!"
            });
            return;
        }
        const infoJob = yield job_model_1.default.findOne({
            _id: infoCV.jobId,
            companyId: companyId
        });
        if (!infoJob) {
            res.json({
                code: "error",
                message: "Không có quyền truy cập!"
            });
            return;
        }
        yield cv_model_1.default.deleteOne({
            _id: cvId
        });
        res.json({
            code: "success",
            message: "Đã xóa!"
        });
    }
    catch (error) {
        console.log(error);
        res.json({
            code: "error",
            message: "Id không hợp lệ!"
        });
    }
});
exports.deleteCVDel = deleteCVDel;
