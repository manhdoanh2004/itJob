import { Request, Response } from "express";

import City from "../models/city.model";
export const list=async(req:Request,res:Response)=>
{

    try {
        const cityList=await City.find({});

        res.json({
            code:"sussecc",
            message:"Lấy danh sách thành phố thành công!",
            cityList:cityList
        })
    } catch (error) {
         res.json({
            code:"sussecc",
            message:"Lấy danh sách thành phố không thành công!",
            cityList:[]
        })
    }
   
}