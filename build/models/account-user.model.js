"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    fullName: String,
    email: String,
    passWord: String,
    avatar: String,
    phone: String,
}, {
    timestamps: true
});
const AccountUser = mongoose_1.default.model("account-user", schema, "accounts-user");
exports.default = AccountUser;
