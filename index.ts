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
var whitelist = ["http://localhost:3000","https://itjov-fe.onrender.com"];
var corsOptions:any = {
  origin: function (origin:any, callback:any) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Cho phép gửi cookie
}

app.use(cors(corsOptions));
// app.use(cors({
//   origin: "http://localhost:3000",
//   methods: ["GET", "POST", "PATCH", "DELETE"],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true // Cho phép gửi cookie
// }));



//Cho phép gửi data lên dạng json
app.use(express.json());

//Cấu hình lấy cookies
app.use(cookieParser());

//Thiết lập đường dẫn cho bên client
app.use("/",routes)

app.listen(port,()=>{
    console.log(`Website đang chạy trên cổng ${port}`);
})
