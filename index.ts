import express,{Request,Response} from 'express'
import cors from "cors"
import routes from "./routes/client/index.route";
import dotenv from "dotenv";
import {connectDB} from "./config/database";
import cookieParser from "cookie-parser"

//Load biến môi trường
dotenv.config();

const app=express();
const port=4000;

//Kết nối database
connectDB();


// Cấu hình CORS
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Cho phép gửi cookie
}));



//Cho phép gửi data lên dạng json
app.use(express.json());

//Cấu hình lấy cookies
app.use(cookieParser());

//Thiết lập đường dẫn cho bên client
app.use("/",routes)

app.listen(port,()=>{
    console.log(`Website đang chạy trên cổng ${port}`);
})
