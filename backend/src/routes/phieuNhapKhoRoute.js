const express = require('express');
const router = express.Router();
const PhieuNhapKhoController = require('../controllers/PhieuNhapKhoController');

// [GET] localhost:3000/phieunhap
router.get('/', PhieuNhapKhoController.getAllPhieuNhap);

// [Get] localhost:3000/phieunhap/searchTrangThai
router.get('/searchTrangThai', PhieuNhapKhoController.SearchPhieuNhapTrangThai);

// [GET] localhost:3000/phieunhap/:id
router.get('/:id', PhieuNhapKhoController.getPhieuNhapById);

// [POST] localhost:3000/phieunhap
router.post('/',  PhieuNhapKhoController.createPhieuNhap);

// Cập nhật phiếu nhập
// [PUT] localhost:3000/phieunhap/:id
router.put('/:id',  PhieuNhapKhoController.updatePhieuNhap);

// Xóa phiếu nhập
// [DELETE] localhost:3000/phieunhap/:id
router.delete('/:id', PhieuNhapKhoController.deletePhieuNhap);

// [GET] localhost:3000/phieunhap/:id/approve
router.get('/:id/approve', PhieuNhapKhoController.approvePhieuNhap);

// [GET] localhost:3000/phieunhap/:id/cancel
router.get('/:id/cancel', PhieuNhapKhoController.cancelPhieuNhap);



module.exports = router;
