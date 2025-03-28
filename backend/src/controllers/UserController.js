const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const Auth = require('../utils/auth');

class UserController {
    async getAllUsers(req, res) {
        try {
            const users = await User.getAll();
            res.status(200).json(users);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async login (req, res) {
        try
        {
            const {Username, MatKhau} = req.body;
        const user = await User.checkUsername(Username);
        if (user.length === 0) {
            return res.status(400).json({message: 'Username không tồn tại'});
        }
        const checkPass = await bcrypt.compare(MatKhau, user[0].MatKhau);
        if (!checkPass) {
            return res.status(400).json({message: 'Mật khẩu không đúng'});
        }
        const payload = {
            MaKH: user[0].MaKH,
            HoTen: user[0].HoTen,
            Email: user[0].Email,
            SoDienThoai: user[0].SoDienThoai,
            DiaChi: user[0].DiaChi,
            VaiTro: user[0].VaiTro,
            Username: user[0].Username
        }
        const token = Auth.genrateAccessToken(payload);
        res.cookie('accessToken', token, {
            httpOnly: true, // Bảo vệ khỏi XSS
            sameSite: "none",
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
        });
        res.status(200).json({token});}
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async createUsers(req, res) {
        try {
            const {HoTen, Email, SoDienThoai, DiaChi, Username, MatKhau} = req.body;
            const user = await User.checkUser(Email, SoDienThoai, Username);
            if (user.length > 0) {
                return res.status(400).json({message: 'Email hoặc số điện thoại hoặc username đã tồn tại'});
            }
            const newUser = {
                HoTen: HoTen ?? "",
                Email,
                SoDienThoai,
                DiaChi: DiaChi ?? "",
                Username,
                MatKhau
            }
            const results = await User.createUsers(newUser);
            res.status(201).json("Tạo tài khoản thành công");
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateUsers(req, res) {
        try {
            const id = req.params.id;
            const {HoTen, Email, SoDienThoai, DiaChi} = req.body;
            const newUser = {
                HoTen: HoTen ?? "",
                Email,
                SoDienThoai,
                DiaChi: DiaChi ?? "",
            }
            
            const existingUserByEmail = await User.checkUpdateUserEmail(Email);
            const existingUserByPhone = await User.checkUpdateUserSDT(SoDienThoai);
    
            if (
                (existingUserByEmail.length > 0 && existingUserByEmail[0].MaKH != id) ||
                (existingUserByPhone.length > 0 && existingUserByPhone[0].MaKH != id)
            ) {
                return res.status(400).json({ message: "Email hoặc số điện thoại đã tồn tại" });
            }
            const user = await User.updateUsers(id, newUser);
            res.status(200).json("Cập nhật thành công");
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteUsers(req, res) {
        try {
            const id = req.params.id;
            const user = await User.deleteUsers(id);
            res.status(200).json("Xóa thành công");
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getUsersById(req, res) {
        try {
            const id = req.params.id;
            const user = await User.getUsersById(id);
            res.status(200).json(user);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

        async changePassword(req, res) {
            try {
                const { idUser, oldPassword, newPassword } = req.body;
        
                // Kiểm tra mật khẩu cũ trước
                const isValid = await User.checkPass(idUser, oldPassword);
                if (!isValid) {
                    return res.status(400).json({ message: "Mật khẩu cũ không chính xác" });
                }
        
                // Cập nhật mật khẩu mới
                const isUpdated = await User.changepassword(idUser, newPassword);
                if (isUpdated) {
                    return res.status(200).json({ message: "Cập nhật mật khẩu thành công" });
                } else {
                    return res.status(400).json({ message: "Cập nhật mật khẩu thất bại" });
                }
            } catch (error) {
                console.error("Lỗi khi đổi mật khẩu:", error);
                return res.status(500).json({ message: "Lỗi server" });
            }
        }
    
}

module.exports = new UserController;