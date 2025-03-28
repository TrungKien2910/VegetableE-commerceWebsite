const express = require('express');
const router = express.Router();
const donHangController = require('../controllers/DonHangController');

// Lấy tất cả đơn hàng
// [GET] localhost:3000/donhang
router.get('/', donHangController.getAllDonHang);

//lay don hang theo UserId
// [GET] localhost:3000/donhang?UserId=1
router.get('/user', donHangController.getDonHangByUserId);

// Lấy đơn hàng theo TrangThai
// [GET] localhost:3000/donhang/TrangThai?TrangThai=ChoDuyet
router.get('/trangThai', donHangController.getDonHangByTrangThai);

// Lấy đơn hàng theo ThanhToan
// [GET] localhost:3000/donhang/thanhToan?ThanhToan=ChuaThanhToan
router.get('/thanhToan', donHangController.getDonHangByThanhToan);

//lay lich su don hang
router.get('/lichsudonhang/:id', donHangController.getLichSuMuaHang)

//thanh toan don hang
// localhost:3000/donhang/thanhToan/:id
router.post('/thanhToan/:id', donHangController.userThanhToan);

//duyet don hang
// localhost:3000/donhang/duyet/:id
router.post('/approve/:id', donHangController.approveDonHang);

//huy don hang
// localhost:3000/donhang/huy/:id
router.post('/cancel/:id', donHangController.cancelDonHang);

// Lấy đơn hàng theo DonHangId
// [GET] localhost:3000/donhang/:id
router.get('/:id', donHangController.getDonHangByDonHangId);

// Tạo đơn hàng
// [POST] localhost:3000/donhang
router.post('/', donHangController.createDonHang);

// Cập nhật đơn hàng
// [PUT] localhost:3000/donhang/:id
router.put('/:id', donHangController.updateDonHang);







module.exports = router;