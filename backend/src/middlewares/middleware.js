const auth = require('../utils/auth');

const authMiddleware = (req, res, next) => {
    // const token = req.headers['authorization']?.split(' ')[1];
      const token = req.cookies.token // Lấy token từ cookie
    if (!token) {
        return res.status(401).json({ message: "Token không tồn tại" });
    }
    const user = auth.verifyAccessToken(token);
    if (!user) {
        return res.status(403).json({ message: "Token không hợp lệ" });
    }
    req.user = user;
    next();
};

const checkAuth = (req, res) => {
    
    const token = req.cookies.accessToken; // Lưu ý tên phải trùng

    if (!token) {
        return res.status(401).json({ message: "Chưa đăng nhập" });
    }

    const user = auth.verifyAccessToken(token);

    if (!user) {
        return res.status(403).json({ message: "Token không hợp lệ" });
    }

    res.json({ message: "Đã xác thực", user });
};

const cleanCookie= (req, res) => {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      path: '/'
    });
    res.json({ message: 'Đăng xuất thành công' });
  };
  



const adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.VaiTro !== 'admin') {
        return res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }
    next();
};





module.exports = {
    authMiddleware,
    adminMiddleware,
    checkAuth,
    cleanCookie
};

