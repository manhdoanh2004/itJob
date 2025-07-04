"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    userId: String,
    jobId: String,
    fullName: String,
    email: String,
    phone: String,
    fileCV: String,
    viewed: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: 'initial'
    },
}, {
    timestamps: true
});
const CV = mongoose_1.default.model("CV", schema, "cvs");
exports.default = CV;
