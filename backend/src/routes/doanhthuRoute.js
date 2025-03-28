const express = require('express');
const router = express.Router();
const DoanhThuController = require('../controllers/DoanhThuController');


router.get('/thong-ke-don-hang', DoanhThuController.getThongKeDonHang);
router.get('/san-pham-ban-chay', DoanhThuController.getSanPhamBanChay);
router.get('/khach-hang-mua-nhieu', DoanhThuController.getKhachHangMuaNhieu);
router.get('/thong-ke-nhap-hang', DoanhThuController.getThongKeNhapHang);
router.get('/doanh-thu-theo-ngay', DoanhThuController.getDoanhThuTheoNgay);
router.get('/loi-nhuan', DoanhThuController.getLoiNhuan);


module.exports = router;
