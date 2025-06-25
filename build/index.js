"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const index_route_1 = __importDefault(require("./routes/client/index.route"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
//Load biến môi trường
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 4000;
//Kết nối database
(0, database_1.connectDB)();
// Cấu hình CORS
app.use((0, cors_1.default)({
    origin: "https://itjov-fe.onrender.com",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Cho phép gửi cookie
}));
//Cho phép gửi data lên dạng json
app.use(express_1.default.json());
//Cấu hình lấy cookies
app.use((0, cookie_parser_1.default)());
//Thiết lập đường dẫn cho bên client
app.use("/", index_route_1.default);
app.listen(port, () => {
    console.log(`Website đang chạy trên cổng ${port}`);
});
