import { Request, Response } from "express";
import AccountUser from "../models/account-user.model";
import jwt from "jsonwebtoken"
import AccountCompany from "../models/account-company.model";
export const authCheck=async(req:Request,res:Response)=>
{
    try {
    const token = req.cookies.token;

    if(!token) {
      res.json({
        code: "error",
        message: "Token không hợp lệ!",
         case:"Không tồn tại token"
      });
      return;
    }

    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as jwt.JwtPayload; // Giải mã token
    const { id, email } = decoded;

    // Tìm user
    const existAccountUser = await AccountUser.findOne({
      _id: id,
      email: email
    });

    if(existAccountUser) {
      const infoUser = {
        id: existAccountUser.id,
        fullName: existAccountUser.fullName,
        email: existAccountUser.email,
        phone:existAccountUser.phone,
        avatar:existAccountUser.avatar
      };

      res.json({
        code: "success",
        message: "Token hợp lệ!",
        infoUser: infoUser
      });
      return;
    }

 
    //Tìm company 
     const existAccountCompany = await AccountCompany.findOne({
      _id: id,
      email: email
    });

    if(existAccountCompany) {
      const infoCompany = {
        id: existAccountCompany.id,
        companyName: existAccountCompany.companyName,
        email: existAccountCompany.email,
        city: existAccountCompany.city,
        address: existAccountCompany.address,
        companyModel: existAccountCompany.companyModel,
        companyEmployees: existAccountCompany.companyEmployees,
        workingTime: existAccountCompany.workingTime,
        workOvertime: existAccountCompany.workOvertime,
        description: existAccountCompany.description,
        logo: existAccountCompany.logo,
        phone: existAccountCompany.phone,

      };

      res.json({
        code: "success",
        message: "Token hợp lệ!",
        infoCompany: infoCompany
      });
      return;
    }
  

    if(!existAccountUser&&!existAccountCompany ) {
     res.clearCookie("token", {
        httpOnly: true,
        secure:`${process.env.SECURE_ENV}`=="true"?true:false, //False:http, true:https
        sameSite: `${process.env.SAMESITE_VALUE}`=="lax"?"lax":"none", // lax :cho phép gửi cookies giữa các domain khác nhau ở localhost, none :cho phép gửi cookies giữa các domain khác nhau cross-origin
      });
      res.json({
        code: "error",
        message: "Token không hợp lệ!",
        case:"Không tìm thấy thông tin nhà tuyển dụng hoặc thông tin ứng viên"
      });
    }
  } catch (error) {
    res.clearCookie("token", {
        httpOnly: true,
        secure:`${process.env.SECURE_ENV}`=="true"?true:false, //False:http, true:https
        sameSite: `${process.env.SAMESITE_VALUE}`=="lax"?"lax":"none", // lax :cho phép gửi cookies giữa các domain khác nhau ở localhost, none :cho phép gửi cookies giữa các domain khác nhau cross-origin
        
        });

    res.json({
      code: "error",
      message: "Token không hợp lệ!",
       case:"Lỗi sever"
    });
  }

}

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token", {
   httpOnly: true,
   secure:`${process.env.SECURE_ENV}`=="true"?true:false, //False:http, true:https
   sameSite: `${process.env.SAMESITE_VALUE}`=="lax"?"lax":"none", // lax :cho phép gửi cookies giữa các domain khác nhau ở localhost, none :cho phép gửi cookies giữa các domain khác nhau cross-origin
   
  });
  res.json({
    code: "success",
    message: "Đã đăng xuất!"
  });
}
