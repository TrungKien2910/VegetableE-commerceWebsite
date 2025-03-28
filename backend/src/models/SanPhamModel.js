const pool = require('../utils/connectDB');

const getAll = async () => {
    const query = 'SELECT * FROM SanPham'
    const [rows, fields] = await pool.execute(query);
    return rows;
}

const createSanPham = async (newSanPham) => {
    const {TenSP, MaLoai, GiaBan, SoLuong, MaNCC,MoTa, HinhAnh} = newSanPham;
    const query = 'INSERT INTO SanPham (TenSP, MaLoai, GiaBan, SoLuong, MaNCC, MoTa, HinhAnh) VALUES (?, ?,?, ?, ?, ?, ?)';
    const results = await pool.execute(query, [TenSP, MaLoai, GiaBan, SoLuong, MaNCC, MoTa, HinhAnh]);
    return results[0];
}

const checkSanPham = async (tenSanPham) => {
    const query = 'SELECT * FROM SanPham WHERE TenSP = ?';
    const [rows, fields] = await pool.execute(query, [tenSanPham]);
    return rows;
}

const updateSanPham = async (id, updateSanPham) => {
    const {TenSP, MaLoai, GiaBan, SoLuong, MaNCC,MoTa, HinhAnh} = updateSanPham;
    const query = 'UPDATE SanPham SET TenSP = ?, MaLoai = ?, GiaBan = ?, SoLuong = ?, MaNCC = ?, HinhAnh = ?, MoTa=? WHERE MaSP = ?';
    const [results] = await pool.execute(query, [TenSP, MaLoai, GiaBan, SoLuong, MaNCC, HinhAnh,MoTa, id]);
    return results;
};

const deleteSanPham = async (id) => {
    const query = 'DELETE FROM SanPham WHERE MaSP = ?';
    const [results] = await pool.execute(query, [id]);
    return results;
};

const getSanPhamById = async (id) => {
    const query = 'SELECT * FROM SanPham WHERE MaSP = ?';
    const [rows, fields] = await pool.execute(query, [id]);
    return rows;
}

module.exports = {
    getAll,
    createSanPham,
    checkSanPham,
    updateSanPham,
    deleteSanPham,
    getSanPhamById
};
