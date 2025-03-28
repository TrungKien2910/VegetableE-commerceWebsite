const express = require('express');
const router = express.Router();
const SanPhamController = require('../controllers/SanPhamController');
const AuthMid = require('../middlewares/middleware');
const { upload } = require('../controllers/NhaCungCapController');


// [GET] localhost:3000/sanpham
router.get('/', SanPhamController.getAllSP);

// [GET] localhost:3000/sanpham/:id
router.get('/:id', SanPhamController.getSPById);

// [POST] localhost:3000/sanpham
router.post('/', upload.single('HinhAnh'),  SanPhamController.createSP); //admin

// Cập nhật sản phẩm
// [PUT] localhost:3000/sanpham/:id
router.put('/:id',upload.single('HinhAnh'),   SanPhamController.updateSP); //admin

// Xóa sản phẩm
// [DELETE] localhost:3000/sanpham/:id
router.delete('/:id', SanPhamController.deleteSP); //admin

module.exports = router;