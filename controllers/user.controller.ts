import { Request, Response } from "express";
import AccountUser from "../models/account-user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {AccountRequest} from "../interfaces/request.interface"
import AccountCompany from "../models/account-company.model";
import CV from "../models/cv.model";
import Job from "../models/job.model";

export const registerPost = async (req: Request, res: Response) => {
  try {
    const { fullName, email, passWord } = req.body;

 
  const existAccount = await AccountUser.findOne({
    email: email
  });

  if(existAccount) {
     res.json({
      code: "error",
      message: "Email đã tồn tại trong hệ thống!"
    });
   return;
  }

  // Mã hóa mật khẩu với bcrypt
  const salt = await bcrypt.genSalt(10); // Tạo salt - Chuỗi ngẫu nhiên có 10 ký tự
  const hashedPassword = await bcrypt.hash(passWord, salt); // Mã hóa mật khẩu

  const newAccount = new AccountUser({
    fullName: fullName,
    email: email,
    passWord: hashedPassword
  });

  await newAccount.save();

  res.json({
    code: "success",
    message: "Đăng ký tài khoản thành công!"
  })
  } catch (error) {
    res.json({
    code: "error",
    message: "Đăng ký tài khoản không thành công!"
  })
  }
}



export const loginPost=async(req:Request,res:Response)=>
{
  
  const {email,passWord}=req.body;

  const exitsAccount = await AccountUser.findOne({
     email: email,
   });
   if (!exitsAccount) {
      res.json({
       code: "error",
       message: "Email không tồn tại!",
     });
   }

   
 
   //kiểm tra xem mật khẩu người dùng nhập vào có đúng với mật khẩu trong database hay không
   const isPassWordValid = await bcrypt.compare(passWord, `${exitsAccount?.passWord}`); // true
   if (!isPassWordValid) {
      res.json({
       code: "error",
       message: "Mật khẩu không chính xác!",
     });
   }
  
   

 
   //Tạo jwt
   var token = jwt.sign(
     {
       id: `${exitsAccount?.id}`,
       email: exitsAccount?.email,
     },
    `${ process.env.JWT_SECRET}`,
     {
       expiresIn: "1d",
     }
   );
 
   //lưu token vào cookies
   res.cookie("token", token, {
     maxAge:  24 * 60 * 60 * 1000, //Token có hiệu lưu 1 ngày,
     httpOnly: true, //chỉ có sever mới được gửi token lên
    // secure:`${process.env.SECURE_ENV}`=="true"?true:false, //False:http, true:https
     secure:true, //False:http, true:https
     sameSite: "none", // lax :cho phép gửi cookies giữa các domain khác nhau ở localhost, none :cho phép gửi cookies giữa các domain khác nhau cross-origin
      path:"/"
   });
 
   res.json({
     code: "success",
     message: "Đăng nhập thành công !",
   });
};

export const profilePach=async(req:AccountRequest,res:Response)=>
{

  try {
      if(req.file)
  {
    req.body.avatar=req.file.path;
  }
  else delete req.body.avatar
  
  await AccountUser.updateOne({
    _id:req.account.id,

  },req.body);

  res.json({
    code:"success",
    message:"Cập nhật profile thành công!"
  })
  } catch (error) {
      res.json({
    code:"error",
    message:"Cập nhật profile không thành công!"
  })
  }

}


export const listCV=async(req:AccountRequest,res:Response)=>
{
    
  const userId = req.account.id;
  const find={
      userId: userId
    };
  // Phân trang
    const limitItems = 2;
    let page = 1;
    if(req.query.page) {
      const currentPage = parseInt(`${req.query.page}`);
      if(currentPage > 0) {
        page = currentPage;
      }
    }
    const totalRecord = await CV.countDocuments(find);
    const totalPage = Math.ceil(totalRecord/limitItems);
    if(page > totalPage && totalPage != 0) {
      page = totalPage;
    }
    const skip = (page - 1) * limitItems;
    // Hết Phân trang


  const listCV = await CV
    .find(find)
    .sort({
      createdAt: "desc"
    }).limit(limitItems).skip(skip);

  const dataFinal = [];

  for (const item of listCV) {
    const dataItemFinal = {
      id: item.id,
      jobId:"",
      companyId:"",
      jobTitle: "",
      companyName: "",
      jobSalaryMin: 0,
      jobSalaryMax: 0,
      jobPosition: "",
      jobWorkingForm: "",
      status: item.status,
      companyLogo:""
    };

    const infoJob = await Job.findOne({
      _id: item.jobId
    })

    if(infoJob) {
      dataItemFinal.jobId = `${infoJob.id}`;
      dataItemFinal.jobTitle = `${infoJob.title}`;
      dataItemFinal.jobSalaryMin = parseInt(`${infoJob.salaryMin}`);
      dataItemFinal.jobSalaryMax = parseInt(`${infoJob.salaryMax}`);
      dataItemFinal.jobPosition = `${infoJob.position}`;
      dataItemFinal.jobWorkingForm = `${infoJob.workingForm}`;

      const infoCompany = await AccountCompany.findOne({
        _id: infoJob.companyId
      })

      if(infoCompany) {
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
    totalPage:totalPage
  })

}