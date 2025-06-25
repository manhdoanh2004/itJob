import { Request ,Response} from "express";
import Job from "../models/job.model";
import AccountCompany from "../models/account-company.model";
import CV from "../models/cv.model";
import { AccountRequest } from "../interfaces/request.interface";

export const jobDetail=async(req:Request,res:Response)=>
{

    try {
    const id = req.params.id;

    const record = await Job.findOne({
      _id: id
    })

    if(!record) {
      res.json({
        code: "error",
        message: "Id không hợp lệ!"
      })
      return;
    }

    const jobDetail = {
      id: record.id,
      title: record.title,
      companyName: "",
      salaryMin: record.salaryMin,
      salaryMax: record.salaryMax,
      images: record.images,
      position: record.position,
      workingForm: record.workingForm,
      companyAddress: "",
      technologies: record.technologies,
      description: record.description,
      companyLogo: "",
      companyId: record.companyId,
      companyModel: "",
      companyEmployees: "",
      companyWorkingTime: "",
      companyWorkOvertime: ""
    };

    const companyInfo = await AccountCompany.findOne({
      _id: record.companyId
    });

    if(companyInfo) {
      jobDetail.companyName = `${companyInfo.companyName}`;
      jobDetail.companyAddress = `${companyInfo.address}`;
      jobDetail.companyLogo = `${companyInfo.logo}`;
      jobDetail.companyModel = `${companyInfo.companyModel}`;
      jobDetail.companyEmployees = `${companyInfo.companyEmployees}`;
      jobDetail.companyWorkingTime = `${companyInfo.workingTime}`;
      jobDetail.companyWorkOvertime = `${companyInfo.workOvertime}`;
    }

    res.json({
      code: "success",
      message: "Thành công!",
      jobDetail: jobDetail
    })
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Id không hợp lệ!"
    })
  }

}

export const jobApplyPost=async(req:AccountRequest,res:Response)=>
{
    try {

      const userId=req.account.id;
      

      req.body.userId=userId;
      req.body.fileCV=req.file? req.file.path : "";

      const newCv= new CV(req.body);
      await newCv.save();

      res.json({
        code:"success",
        message:"Ứng tuyển thành công!"
      })
    } catch (error) {
      console.log(error);
        res.json({
        code:"error",
        message:"Ứng tuyển không thành công!"
      })
    }

}