import { Request ,Response} from "express"
import AccountCompany from "../models/account-company.model";
import Job from "../models/job.model";
import City from "../models/city.model";

export const searchResult=async(req:Request,res:Response)=>
{
     const dataFinal = [];
     let totalPage=0;
     let totalRecord=0;
  if(Object.keys(req.query).length > 0) {
    const find: any = {};
 
    // Language
    if(req.query.language) {
      find.technologies = new RegExp(`${req.query.language}`,'i');
   
    }
     //End  Language

     //City
    if(req.query.city)
    {
      const cityquery=req.query.city;
      const cityReg=new RegExp(`${cityquery}`,'i');
      const city=await City.findOne({
        name: cityReg
      });

      if(city)
      {
         const companyListInCity =await AccountCompany.find({
          city:city.id
         });

         const listAccountCompanyId=companyListInCity.map(item=>item.id);

         find.companyId={$in:listAccountCompanyId};

      }

    }
     //End City

    //Company
    if(req.query.company)
    {

      const comanyReg=new RegExp(`${req.query.company}`,'i')
      const acccountCompany=await AccountCompany.findOne({
        companyName:comanyReg
      });
      find.companyId=acccountCompany?.id;
    }
    //End Company
    

    //Keyword
     if(req.query.keyword)
    {

      const keywordReg=new RegExp(`${req.query.keyword}`,'i')

      find["$or"]=[
        {title:keywordReg},
        { technologies:keywordReg}
      ]
    }
    //EndKeyword

    //Positon
    if(req.query.position)
    {
      const positionReg=new RegExp(`${req.query.position}`,'i');
      find.position=positionReg
    }
    //End Positon

    //Working from
    if(req.query.workingForm)
    {
       const workingFormReg=new RegExp(`${req.query.workingForm}`,'i');
      find.workingForm=workingFormReg
    }
    //End Working from

    // Phân trang
    const limitItems = 2;
    let page = 1;
    if(req.query.page) {
      const currentPage = parseInt(`${req.query.page}`);
      if(currentPage > 0) {
        page = currentPage;
      }
    }
     totalRecord = await Job.countDocuments(find);
     totalPage = Math.ceil(totalRecord/limitItems);
    if(page > totalPage && totalPage != 0) {
      page = totalPage;
    }
    const skip = (page - 1) * limitItems;
    // Hết Phân trang
    
    const jobs = await Job
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

      const companyInfo = await AccountCompany.findOne({
        _id: item.companyId
      })

      if(companyInfo) {
        itemFinal.companyLogo = `${companyInfo.logo}`;
        itemFinal.companyName = `${companyInfo.companyName}`;
        
        const city = await City.findOne({
          _id: companyInfo.city
        })
        itemFinal.companyCity = `${city?.name}`;
      }

      dataFinal.push(itemFinal);
    }
   
  }
 

  res.json({
    code: "success",
    message: "Thành công!",
    jobs: dataFinal,
    totalPage:totalPage,
    totalRecord:totalRecord
  })

}