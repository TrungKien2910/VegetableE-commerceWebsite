const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const port = 3000 || process.env.PORT;
const app = express();
app.use(
  cors({
    origin: ["http://localhost:8080", "http://localhost:5173"],
        credentials: true, // ✅ Bật gửi cookie
  })
);
app.use(cookieParser()); // ✅ Bắt buộc để đọc cookie

const morgan = require('morgan');
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const EventEmitter = require('events');
EventEmitter.defaultMaxListeners = 20;

const userRoute = require('./src/routes/userRoute');
app.use('/user', userRoute);

const loaiSanPhamRoute = require('./src/routes/loaiSanPhamRoute');
app.use('/loaisanpham', loaiSanPhamRoute);

const nhaCungCapRoute = require('./src/routes/nhaCungCapRoute');
app.use('/nhacungcap', nhaCungCapRoute);

const sanPhamRoute = require('./src/routes/sanPhamRoute');
app.use('/sanpham', sanPhamRoute);

const phieunhapRoute = require('./src/routes/phieuNhapKhoRoute');
app.use('/phieunhap', phieunhapRoute);

const donHangRoute = require('./src/routes/donHangRoute');
app.use('/donhang', donHangRoute);

const doanhThuRoute = require('./src/routes/doanhthuRoute');
app.use('/api/doanh-thu', doanhThuRoute);



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.use((req, res, next) => {
    console.log('404 middleware hit');
    res.send("Thành công!");
  });

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});