const pool = require('../utils/connectDB');
const brypt = require('bcrypt');

const getAll = async () => {
    const query = 'SELECT * FROM User'
    const [rows, fields] = await pool.execute(query);
    return rows;
}

const createUsers = async (newUser) => {
    const {HoTen, Email, SoDienThoai, DiaChi, Username, MatKhau} = newUser;
    const newpass = await brypt.hash(MatKhau, 10);
    const query = 'INSERT INTO User (HoTen, Email, SoDienThoai, DiaChi, VaiTro, Username, MatKhau) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const results = await pool.execute(query, [HoTen, Email, SoDienThoai, DiaChi, "user" ,Username, newpass]);
    return results[0];
}

const checkUser = async (Email, SoDienThoai, Username) => {
    const query = 'SELECT * FROM User WHERE Email = ? OR SoDienThoai = ? OR Username = ?';
    const [rows, fields] = await pool.execute(query, [Email, SoDienThoai, Username]);
    return rows;
}

const checkUsername = async (Username) => {
    const query = 'SELECT * FROM User WHERE Username = ?';
    const [rows, fields] = await pool.execute(query, [Username]);
    return rows;
}

const checkUpdateUserSDT = async ( SoDienThoai) => {
    const query = 'SELECT * FROM User WHERE  SoDienThoai = ? ';
    const [rows, fields] = await pool.execute(query, [SoDienThoai]);
    return rows;
}

const checkUpdateUserEmail = async (Email) => {
    const query = 'SELECT * FROM User WHERE Email = ?  ';
    const [rows, fields] = await pool.execute(query, [Email]);
    return rows;
}

const updateUsers = async (id, updateUsers) => {
    const {HoTen, Email, SoDienThoai, DiaChi} = updateUsers;
    const query = 'UPDATE User SET HoTen = ?, Email = ?, SoDienThoai = ?, DiaChi = ? WHERE MaKH = ?';
    const [results] = await pool.execute(query, [HoTen, Email, SoDienThoai, DiaChi, id]);
    return results;
};

const deleteUsers = async (id) => {
    const query = 'DELETE FROM User WHERE MaKH = ?';
    const [results] = await pool.execute(query, [id]);
    return results;
};

const getUsersById = async (id) => {
    const query = 'SELECT * FROM User WHERE MaKH = ?';
    const [rows, fields] = await pool.execute(query, [id]);
    return rows;
};

const checkPass = async (id, oldpass) => {
    try {
        const query = 'SELECT MatKhau FROM User WHERE MaKH = ?';
        const [rows] = await pool.execute(query, [id]);

        if (rows.length === 0) return false; // Không tìm thấy user

        const isMatch = await brypt.compare(oldpass, rows[0].MatKhau);
        return isMatch;
    } catch (error) {
        console.error('Lỗi khi kiểm tra mật khẩu:', error);
        return false;
    }
};

const changepassword = async (id, newpass) => {
    try {
        const newpass1 = await brypt.hash(newpass, 10);
        const query = 'UPDATE User SET MatKhau = ? WHERE MaKH = ?';
        const [results] = await pool.execute(query, [newpass1, id]);

        return results.affectedRows > 0; // Trả về true nếu cập nhật thành công
    } catch (error) {
        console.error('Lỗi khi đổi mật khẩu:', error);
        return false;
    }
};

module.exports = {
    getAll,
    createUsers,
    checkUser,
    checkUsername,
    updateUsers,
    deleteUsers,
    getUsersById,
    changepassword,
    checkPass,
    checkUpdateUserSDT,
    checkUpdateUserEmail
};
