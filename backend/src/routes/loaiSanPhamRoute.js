const express = require('express');
const router = express.Router();
const LoaiSanPhamController = require('../controllers/LoaiSanPhamController');
const AuthMid = require('../middlewares/middleware');
const { upload } = require('../controllers/NhaCungCapController');



// [GET] localhost:3000/loaisanpham
router.get('/', LoaiSanPhamController.getAllLoaiSP);

// [GET] localhost:3000/loaisanpham/:id
router.get('/:id', LoaiSanPhamController.getLoaiSPById);


// [POST] localhost:3000/loaisanpham
router.post('/',upload.single('HinhAnh'),  LoaiSanPhamController.createLoaiSP);

// Cập nhật loại sản phẩm
// [PUT] localhost:3000/loaisanpham/:id
router.put('/:id', upload.single('HinhAnh'),  LoaiSanPhamController.updateLoaiSP);

// Xóa loại sản phẩm
// [DELETE] localhost:3000/loaisanpham/:id
router.delete('/:id', LoaiSanPhamController.deleteLoaiSP);

module.exports = router;