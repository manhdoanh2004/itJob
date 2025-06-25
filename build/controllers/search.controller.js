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
exports.searchResult = void 0;
const account_company_model_1 = __importDefault(require("../models/account-company.model"));
const job_model_1 = __importDefault(require("../models/job.model"));
const city_model_1 = __importDefault(require("../models/city.model"));
const searchResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dataFinal = [];
    let totalPage = 0;
    let totalRecord = 0;
    if (Object.keys(req.query).length > 0) {
        const find = {};
        // Language
        if (req.query.language) {
            find.technologies = new RegExp(`${req.query.language}`, 'i');
        }
        //End  Language
        //City
        if (req.query.city) {
            const cityquery = req.query.city;
            const cityReg = new RegExp(`${cityquery}`, 'i');
            const city = yield city_model_1.default.findOne({
                name: cityReg
            });
            if (city) {
                const companyListInCity = yield account_company_model_1.default.find({
                    city: city.id
                });
                const listAccountCompanyId = companyListInCity.map(item => item.id);
                find.companyId = { $in: listAccountCompanyId };
            }
        }
        //End City
        //Company
        if (req.query.company) {
            const comanyReg = new RegExp(`${req.query.company}`, 'i');
            const acccountCompany = yield account_company_model_1.default.findOne({
                companyName: comanyReg
            });
            find.companyId = acccountCompany === null || acccountCompany === void 0 ? void 0 : acccountCompany.id;
        }
        //End Company
        //Keyword
        if (req.query.keyword) {
            const keywordReg = new RegExp(`${req.query.keyword}`, 'i');
            find["$or"] = [
                { title: keywordReg },
                { technologies: keywordReg }
            ];
        }
        //EndKeyword
        //Positon
        if (req.query.position) {
            const positionReg = new RegExp(`${req.query.position}`, 'i');
            find.position = positionReg;
        }
        //End Positon
        //Working from
        if (req.query.workingForm) {
            const workingFormReg = new RegExp(`${req.query.workingForm}`, 'i');
            find.workingForm = workingFormReg;
        }
        //End Working from
        // Phân trang
        const limitItems = 2;
        let page = 1;
        if (req.query.page) {
            const currentPage = parseInt(`${req.query.page}`);
            if (currentPage > 0) {
                page = currentPage;
            }
        }
        totalRecord = yield job_model_1.default.countDocuments(find);
        totalPage = Math.ceil(totalRecord / limitItems);
        if (page > totalPage && totalPage != 0) {
            page = totalPage;
        }
        const skip = (page - 1) * limitItems;
        // Hết Phân trang
        const jobs = yield job_model_1.default
            .find(find)
            .sort({
            createdAt: "desc"
        }).limit(limitItems).skip(skip);
        for (const item of jobs) {
            const itemFinal = {
                id: item.id,
                companyLogo: "",
                title: item.title,
                companyName: "",
                salaryMin: item.salaryMin,
                salaryMax: item.salaryMax,
                position: item.position,
                workingForm: item.workingForm,
                companyCity: "",
                technologies: item.technologies,
            };
            const companyInfo = yield account_company_model_1.default.findOne({
                _id: item.companyId
            });
            if (companyInfo) {
                itemFinal.companyLogo = `${companyInfo.logo}`;
                itemFinal.companyName = `${companyInfo.companyName}`;
                const city = yield city_model_1.default.findOne({
                    _id: companyInfo.city
                });
                itemFinal.companyCity = `${city === null || city === void 0 ? void 0 : city.name}`;
            }
            dataFinal.push(itemFinal);
        }
    }
    res.json({
        code: "success",
        message: "Thành công!",
        jobs: dataFinal,
        totalPage: totalPage,
        totalRecord: totalRecord
    });
});
exports.searchResult = searchResult;
