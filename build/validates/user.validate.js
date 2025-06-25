"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profilePatch = exports.loginPost = exports.registerPost = void 0;
const joi_1 = __importDefault(require("joi"));
const registerPost = (req, res, next) => {
    const schema = joi_1.default.object({
        fullName: joi_1.default.string()
            .required()
            .min(5)
            .max(50)
            .messages({
            "string.empty": "Vui lòng nhập họ tên!",
            "string.min": "Họ tên phải có ít nhất 5 ký tự!",
            "string.max": "Họ tên không được vượt quá 50 ký tự!"
        }),
        email: joi_1.default.string()
            .required()
            .email()
            .messages({
            "string.empty": "Vui lòng nhập email của bạn!",
            "string.email": "Email không đúng định dạng!"
        }),
        passWord: joi_1.default.string()
            .required()
            .min(8) // Ít nhất 8 ký tự
            .custom((value, helpers) => {
            if (!/[A-Z]/.test(value)) {
                return helpers.error("password.uppercase"); // Ít nhất một chữ cái in hoa
            }
            if (!/[a-z]/.test(value)) {
                return helpers.error("password.lowercase"); // Ít nhất một chữ cái thường
            }
            if (!/\d/.test(value)) {
                return helpers.error("password.number"); // Ít nhất một chữ số
            }
            if (!/[@$!%*?&]/.test(value)) {
                return helpers.error("password.special"); // Ít nhất một ký tự đặc biệt
            }
            return value; // Nếu tất cả điều kiện đều đúng
        })
            .messages({
            "string.empty": "Vui lòng nhập mật khẩu!",
            "string.min": "Mật khẩu phải chứa ít nhất 8 ký tự!",
            "password.uppercase": "Mật khẩu phải chứa ít nhất một chữ cái in hoa!",
            "password.lowercase": "Mật khẩu phải chứa ít nhất một chữ cái thường!",
            "password.number": "Mật khẩu phải chứa ít nhất một chữ số!",
            "password.special": "Mật khẩu phải chứa ít nhất một ký tự đặc biệt!",
        }),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        const errorMessage = error.details[0].message;
        res.json({
            code: "error",
            message: errorMessage
        });
        return;
    }
    next();
};
exports.registerPost = registerPost;
const loginPost = (req, res, next) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string()
            .required()
            .email()
            .messages({
            "string.empty": "Vui lòng nhập email của bạn!",
            "string.email": "Email không đúng định dạng!"
        }),
        passWord: joi_1.default.string()
            .required()
            .min(8) // Ít nhất 8 ký tự
            .custom((value, helpers) => {
            if (!/[A-Z]/.test(value)) {
                return helpers.error("password.uppercase"); // Ít nhất một chữ cái in hoa
            }
            if (!/[a-z]/.test(value)) {
                return helpers.error("password.lowercase"); // Ít nhất một chữ cái thường
            }
            if (!/\d/.test(value)) {
                return helpers.error("password.number"); // Ít nhất một chữ số
            }
            if (!/[@$!%*?&]/.test(value)) {
                return helpers.error("password.special"); // Ít nhất một ký tự đặc biệt
            }
            return value; // Nếu tất cả điều kiện đều đúng
        })
            .messages({
            "string.empty": "Vui lòng nhập mật khẩu!",
            "string.min": "Mật khẩu phải chứa ít nhất 8 ký tự!",
            "password.uppercase": "Mật khẩu phải chứa ít nhất một chữ cái in hoa!",
            "password.lowercase": "Mật khẩu phải chứa ít nhất một chữ cái thường!",
            "password.number": "Mật khẩu phải chứa ít nhất một chữ số!",
            "password.special": "Mật khẩu phải chứa ít nhất một ký tự đặc biệt!",
        }),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        const errorMessage = error.details[0].message;
        res.json({
            code: "error",
            message: errorMessage
        });
        return;
    }
    next();
};
exports.loginPost = loginPost;
const profilePatch = (req, res, next) => {
    const schema = joi_1.default.object({
        fullName: joi_1.default.string()
            .required()
            .messages({
            "string.empty": "Vui lòng nhập họ tên của bạn!",
        }),
        email: joi_1.default.string()
            .required()
            .email()
            .messages({
            "string.empty": "Vui lòng nhập email của bạn!",
            "string.email": "Email không đúng định dạng!"
        }),
        phone: joi_1.default.string()
            .required()
            .custom((value, helpers) => {
            if (!/(84|0[3|5|7|8|9])+([0-9]{8})\b/g.test(value)) {
                return helpers.error("phone.invalid"); // Số điện thoại không đúng định dạng 
            }
            return value; // Nếu tất cả điều kiện đều đúng
        })
            .messages({
            "string.empty": "Vui lòng nhập vào số điện thoại",
            "phone.invalid": "Số điện thoại không đúng định dạng",
        }),
        avatar: joi_1.default.string()
            .allow('')
    });
    const { error } = schema.validate(req.body);
    if (error) {
        const errorMessage = error.details[0].message;
        res.json({
            code: "error",
            message: errorMessage
        });
        return;
    }
    next();
};
exports.profilePatch = profilePatch;
