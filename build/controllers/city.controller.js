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
exports.list = void 0;
const city_model_1 = __importDefault(require("../models/city.model"));
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cityList = yield city_model_1.default.find({});
        res.json({
            code: "sussecc",
            message: "Lấy danh sách thành phố thành công!",
            cityList: cityList
        });
    }
    catch (error) {
        res.json({
            code: "sussecc",
            message: "Lấy danh sách thành phố không thành công!",
            cityList: []
        });
    }
});
exports.list = list;
