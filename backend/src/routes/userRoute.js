const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const AuthMid = require('../middlewares/middleware');


//lay tat ca user
// [GET] localhost:3000/user
router.get('/', userController.getAllUsers); //admin

//lay user theo id
// [GET] localhost:3000/user
router.get('/:id',  userController.getUsersById);


// [POST] localhost:300/user
router.post('/',  userController.createUsers)

//[POST] localhost:3000/user/login
router.post('/login', userController.login)

router.post('/change-password', userController.changePassword);


router.post('/logout',AuthMid.cleanCookie);


router.get('/check/check-auth', AuthMid.checkAuth);

// Cập nhật user
// [PUT] localhost:3000/user/:id
router.put('/:id',  userController.updateUsers);

// Xóa user
// [DELETE] localhost:3000/user/:id
router.delete('/:id', userController.deleteUsers);

module.exports = router;