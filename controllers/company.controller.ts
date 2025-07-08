import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import AccountCompany from "../models/account-company.model"
import Job from "../models/job.model"

import { AccountRequest } from "../interfaces/request.interface";
import City from "../models/city.model";
import CV from "../models/cv.model";

export const registerPost=async(req:Request,res:Response)=>
{
   try {
    const { companyName, email, passWord } = req.body;

 
  const existAccount = await AccountCompany.findOne({
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

  const newAccount = new AccountCompany({
    companyName: companyName,
    email: email,
    passWord: hashedPassword
  });

  await newAccount.save();

  res.json({
    code: "success",
    message: "Đăng ký tài khoản nhà tuyển dụng  thành công!"
  })
  } catch (error) {
    res.json({
    code: "error",
    message: "Đăng ký tài khoản nhà tuyển dụng không thành công!"
  })
  }
};

export const loginPost=async(req:Request,res:Response)=>
{
    const {email,passWord}=req.body;
 

  const exitsAccount = await AccountCompany.findOne({
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
     httpOnly: false, //chỉ có sever mới được gửi token lên
     secure:`${process.env.SECURE_ENV}`=="true"?true:false, //False:http, true:https

    sameSite: `${process.env.SAMESITE_VALUE}`=="lax"?"lax":"none", // lax :cho phép gửi cookies giữa các domain khác nhau ở localhost, none :cho phép gửi cookies giữa các domain khác nhau cross-origin
      path:"/"
   });
 
   res.json({
     code: "success",
     message: "Đăng nhập thành công !",
   });
};


export const profilePatch = async (req: AccountRequest, res: Response) => {
  

  try {
     if(req.file) {
    req.body.logo = req.file.path;
  } else {
    delete req.body.logo;
  }

  await AccountCompany.updateOne({
    _id: req.account.id
  }, req.body);

  res.json({
    code: "success",
    message: "Cập nhật profile company thành công!"
  })
  } catch (error) {
    res.json({
    code: "error",
    message: "Cập nhật profile company không thành công!"
  })
  }
 
}


export const createPost=async(req:AccountRequest,res:Response)=>
{

  req.body.companyId = req.account.id;
  req.body.salaryMin = req.body.salaryMin ? parseInt(req.body.salaryMin) : 0;
  req.body.salaryMax = req.body.salaryMax ? parseInt(req.body.salaryMax) : 0;
  req.body.technologies = req.body.technologies ? req.body.technologies.split(",") : [];
  req.body.images = [];

  // Xử lý mảng images
  if (req.files) {
    for (const file of req.files as any[]) {
      req.body.images.push(file.path);
    }
  }

  const newRecord = new Job(req.body);
  await newRecord.save();

  res.json({
    code: "success",
    message: "Tạo công việc thành công!"
  })

  

}

export const listJob=async(req:AccountRequest,res:Response)=>
{


    const find = {
    companyId: req.account.id
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
  const totalRecord = await Job.countDocuments(find);
  const totalPage = Math.ceil(totalRecord/limitItems);
  if(page > totalPage && totalPage != 0) {
    page = totalPage;
  }
  const skip = (page - 1) * limitItems;
  // Hết Phân trang



  const companyId=req.account.id;
 

   const jobList = await Job
    .find(find)
    .sort({
      createdAt: "desc"
    })
    .limit(limitItems)
    .skip(skip);



  let dataFinal=[];

  const city=await City.findOne({
    _id:req.account.city
  })
  for(let job of jobList)
  {
    dataFinal.push({
      id:job.id,
      companyLogo:req.account.logo,
      companyName:req.account.companyName,
      salaryMin:job.salaryMin,
      salaryMax:job.salaryMax,
      position:job.position,
      workingForm:job.workingForm,
      companyCity:city?.name,
      technologies:job.technologies,
      title:job.title

    })
  }


  res.json({
    code:"success",
    message:"Lấy thành công!",
    jobList:dataFinal,
     totalPage: totalPage
  })
}


export const editJob=async(req:AccountRequest,res:Response)=>
{
  const id=req.params.id;

  const companyId=req.account.id;
  

  const jobDetail=await Job.findOne({
    _id:id,
    companyId:companyId
  });
  if(!jobDetail)
  {
     res.json({
        code:"error",
        message:"Lấy thông tin thành công!",
        jobDetail:{}
     })
  }

 
  
  res.json({
    code:"success",
    message:"Lấy thông tin thành công!",
    jobDetail:jobDetail
  })
}

export const editJobPatch=async(req:AccountRequest,res:Response)=>
{

 try {
   const id=req.params.id;
  const companyId = req.account.id;
  req.body.salaryMin = req.body.salaryMin ? parseInt(req.body.salaryMin) : 0;
  req.body.salaryMax = req.body.salaryMax ? parseInt(req.body.salaryMax) : 0;
  req.body.technologies = req.body.technologies ? req.body.technologies.split(",") : [];
  req.body.images = [];

  // Xử lý mảng images
  if (req.files) {
    for (const file of req.files as any[]) {
      req.body.images.push(file.path);
    }
  }
  
  await Job.updateOne({
    _id:id,
    companyId:companyId,
  },req.body);

  res.json({
    code: "success",
    message: "Cập nhật công việc thành công!"
  })
 } catch (error) {
  console.log(error)
  res.json({
    code: "error",
    message: "Cập nhật  không công việc thành công!"
  })
 }

  

}


export const deleteJobDel=async(req:AccountRequest,res:Response)=>
{
  try {
  const id=req.params.id;
  const companyId=req.account.id;
  await Job.deleteOne({
    _id:id,
    companyId:companyId
  })
  res.json({
    code:"success",
    message:" Xóa công việc  thành công!"
  })
  } catch (error) {
    console.log(error)
     res.json({
    code:"error",
    message:" Xóa công việc  Không  thành công!"
  })
  }
}

export const companyList=async(req:Request,res:Response)=>
{

     const find = {};

  let limitItems = 2;
  if(req.query.limitItems) {
    limitItems = parseInt(`${req.query.limitItems}`);
  }

    // Phân trang
  
  let page = 1;
  if(req.query.page) {
    const currentPage = parseInt(`${req.query.page}`);
    if(currentPage > 0) {
      page = currentPage;
    }
  }
  const totalRecord = await AccountCompany.countDocuments(find);
  const totalPage = Math.ceil(totalRecord/limitItems);
  if(page > totalPage && totalPage != 0) {
    page = totalPage;
  }
  const skip = (page - 1) * limitItems;
  // Hết Phân trang
  const companyList = await AccountCompany
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
    const city = await City.findOne({
      _id: item.city
    })
    dataItemFinal.cityName = `${city?.name}`;

    // Tổng số việc làm
    const totalJob = await Job.countDocuments({
      companyId: item.id
    })
    dataItemFinal.totalJob = totalJob;

    companyListFinal.push(dataItemFinal);
  }

  res.json({
    code: "success",
    message: "Thành công!",
    companyList: companyListFinal,
    totalPage:totalPage
  })


}


export const detail=async(req:Request,res:Response)=>
{
  try {
    const companyId= req.params.id;
   
    

    const accountCompany=await AccountCompany.findOne({
      _id:companyId
    });

    if(!accountCompany)
    {
       res.json({
        code:"error",
        message:"Không thành công!"
      });
      return;
    }

    const companyDetail={
      id:accountCompany.id,
      logo:accountCompany.logo,
      companyName:accountCompany.companyName,
      address:accountCompany.address,
      companyModel:accountCompany.companyModel,
      companyEmployees:accountCompany.companyEmployees,
      workingTime:accountCompany.workingTime,
      workOvertime:accountCompany.workOvertime,
      description:accountCompany.description,

    };

    //Danh sách công việc của công ty
    const jobList=await Job.find({
      companyId:companyId
    }).sort(
      {
        createdAt:"desc"
      }
    );

  
     const dataFinal = [];

    const city = await City.findOne({
    _id: accountCompany.city
  })

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
        companyCity: city?.name,
        technologies: item.technologies,
      });
    }



    res.json({
      code:"success",
      message:"Thành công!",
      companyDetail:companyDetail,
      jobList:dataFinal
    })
  } catch (error) {
    console.log(error)
     res.json({
      code:"error",
      message:"Không thành công!",
   
    })
  }
 
}

export const listCv=async(req:AccountRequest,res:Response)=>
{
  try {
    const companyId=req.account.id;

 

 

  const listJob= await Job.find({
    companyId:companyId
  });

  const listJobId=listJob.map((item)=>item.id);


   // Phân trang
  const limitItems = 2;
  let page = 1;
  if(req.query.page) {
    const currentPage = parseInt(`${req.query.page}`);
    if(currentPage > 0) {
      page = currentPage;
    }
  }
  const totalRecord = await CV.countDocuments({
    jobId:{$in:listJobId}
  });
  const totalPage = Math.ceil(totalRecord/limitItems);
  if(page > totalPage && totalPage != 0) {
    page = totalPage;
  }
  const skip = (page - 1) * limitItems;
  // Hết Phân trang
  const listCv=await CV.find({
    jobId:{$in:listJobId}
  }).limit(limitItems).skip(skip);

  const dataFinal=[];
  
  for(let cv of listCv)
  {
    let dataFinalItem={
        id:cv.id,
        jobTitle:"",
        fullName:cv.fullName,
        email:cv.email,
        phone:cv.phone,
        jobSalaryMin: 0, 
        jobSalaryMax: 0,
        jobPosition:"",
        jobWorkingFrom:"",
        viewed:cv.viewed,
        status:cv.status
    };

    const infoJob=await Job.findOne({
        _id:cv.jobId
    });

    if(infoJob)
    {
      dataFinalItem.jobTitle=`${infoJob.title}`;
      dataFinalItem.jobSalaryMin=parseInt(`${infoJob.salaryMin}`);
      dataFinalItem.jobSalaryMax=parseInt(`${infoJob.salaryMax}`);
      dataFinalItem.jobPosition=`${infoJob.position}`;
      dataFinalItem.jobWorkingFrom=`${infoJob.workingForm}`;
     
    }

    dataFinal.push(dataFinalItem);
  }

 
 
  res.json({
    code:"success",
    message:"Lấy danh sách cv thành công!",
    cvList:dataFinal,
    totalPage:totalPage
  })
  } catch (error) {
    console.log(error)
    res.json({
    code:"error",
    message:"Lấy danh sách cv không thành công!",
    cvList:[]
  })
  }
}



export const detailCv=async(req:AccountRequest,res:Response)=>
{

  const companyId=req.account.id;
  const cvId=req.params.id;

  const infoCv=await CV.findOne({
    _id:cvId
  });

  if(!infoCv)
  { 
     res.json({
        code:"error",
        message:"Lấy thông tin không thành công!"
      });
      return;
  }

  const inforJob =await Job.findOne({
    _id:infoCv.jobId,
    companyId:companyId
  });

  if(!inforJob)
  {
      res.json({
        code:"error",
        message:"Lấy thông tin không thành công!"
      });
      return;
  }




  //Cập nhật lại trạng thái cv
  await CV.updateOne({
    _id:cvId
  },{
    viewed:true
  });
  //hết Cập nhật lại trạng thái cv
 
  const dataFinalCV={
    fullName:infoCv.fullName,
    email:infoCv.email,
    phone:infoCv.phone,
    fileCV:infoCv.fileCV, 
  };

  const dataFinalJob={
      id:inforJob.id,
      title:inforJob.title,
      salaryMin:inforJob.salaryMin,
      salaryMax:inforJob.salaryMax,
      position:inforJob.position,
      workingForm:inforJob.workingForm,
      technologies:inforJob.technologies,
      
  }
  res.json({
    code:"success",
    message:"Lấy thông tin thành công!",
    cvDetail:dataFinalCV,
    jobDetail:dataFinalJob,
  })
}



export const changeStatusCV=async(req:AccountRequest,res:Response)=>
{

  try {
    const companyId = req.account.id;
    const status = req.body.action;
    const cvId = req.body.id;

    const infoCV = await CV.findOne({
      _id: cvId
    })

    if(!infoCV) {
      res.json({
        code: "error",
        message: "Id không hợp lệ!"
      });
      return;
    }

    const infoJob = await Job.findOne({
      _id: infoCV.jobId,
      companyId: companyId
    })

    if(!infoJob) {
      res.json({
        code: "error",
        message: "Không có quyền truy cập!"
      });
      return;
    }

    await CV.updateOne({
      _id: cvId
    }, {
      status: status
    })

    res.json({
      code: "success",
      message: "Thành công!"
    })
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Id không hợp lệ!"
    })
  }

}


export const deleteCVDel=async(req:AccountRequest,res:Response)=>
{

  try {
    const companyId = req.account.id;
    const cvId = req.params.id;

    const infoCV = await CV.findOne({
      _id: cvId
    })

    if(!infoCV) {
      res.json({
        code: "error",
        message: "Id không hợp lệ!"
      });
      return;
    }

    const infoJob = await Job.findOne({
      _id: infoCV.jobId,
      companyId: companyId
    })

    if(!infoJob) {
      res.json({
        code: "error",
        message: "Không có quyền truy cập!"
      });
      return;
    }

    await CV.deleteOne({
      _id: cvId
    })

    res.json({
      code: "success",
      message: "Đã xóa!"
    })
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Id không hợp lệ!"
    })
  }

}