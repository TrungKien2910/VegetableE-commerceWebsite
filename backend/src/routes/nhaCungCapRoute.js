const express = require('express');
const router = express.Router();
const NhaCungCapController = require('../controllers/NhaCungCapController');
const AuthMid = require('../middlewares/middleware');
const { upload } = require('../controllers/NhaCungCapController');


// [GET] localhost:3000/nhacungcap
router.get('/', NhaCungCapController.getAllNhaCungCap);

// [GET] localhost:3000/nhacungcap/:id
router.get('/:id', NhaCungCapController.getNhaCungCapById);

// [POST] localhost:3000/nhacungcap
router.post('/', upload.single('HinhAnh'), NhaCungCapController.createNhaCungCap);

// Cập nhật nhà cung cấp
// [PUT] localhost:3000/nhacungcap/:id
router.put('/:id', upload.single('HinhAnh'), NhaCungCapController.updateNhaCungCap);

// Xóa nhà cung cấp
// [DELETE] localhost:3000/nhacungcap/:id
router.delete('/:id', NhaCungCapController.deleteNhaCungCap);

module.exports = router;