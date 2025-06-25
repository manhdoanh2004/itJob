import mongoose from "mongoose";

const schema=new  mongoose.Schema({
    fullName:String,
    email:String,
    passWord:String,
    avatar:String,
    phone:String,
},{
    timestamps:true
});

const AccountUser=mongoose.model("account-user",schema,"accounts-user");

export default AccountUser;