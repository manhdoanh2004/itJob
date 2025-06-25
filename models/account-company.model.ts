import mongoose from "mongoose";

const schema = new mongoose.Schema({
    companyName: String,
    email: String,
    passWord: String,
    city: String,
    address: String,
    companyModel: String,
    companyEmployees: String,
    workingTime: String,
    workOvertime: String,
    description: String,
    logo: String,
    phone: String,
    deleted:{
        type:Boolean,
        defaut:false
    }
    
},{
    timestamps:true
});

const AccountCompany= mongoose.model("Accounts-company",schema,"accounts-company");
export default AccountCompany;