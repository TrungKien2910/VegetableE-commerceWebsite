const pool = require('../utils/connectDB');

const getAll = async () => {
    const query = 'SELECT * FROM LoaiSanPham'
    const [rows, fields] = await pool.execute(query);
    return rows;
}

const createLoaiSP = async (newLoaiSP) => {
    const {TenLoai, HinhAnh} = newLoaiSP;
    const query = 'INSERT INTO LoaiSanPham (TenLoai,HinhAnh) VALUES (?, ?)';
    const results = await pool.execute(query, [TenLoai, HinhAnh]);
    return results[0];
}

const checkLoaiSP = async (TenLoai) => {
    const query = 'SELECT * FROM LoaiSanPham WHERE TenLoai = ?';
    const [rows, fields] = await pool.execute(query, [TenLoai]);
    return rows;
}

const updateLoaiSP = async (id, updateLoaiSP) => {
    const {TenLoai, HinhAnh} = updateLoaiSP;
    const query = 'UPDATE LoaiSanPham SET TenLoai = ?, HinhAnh = ? WHERE MaLoai = ?';
    const [results] = await pool.execute(query, [TenLoai, HinhAnh, id]);
    return results;
};

const deleteLoaiSP = async (id) => {
    const query = 'DELETE FROM LoaiSanPham WHERE MaLoai = ?';
    const [results] = await pool.execute(query, [id]);
    return results;
};

const getLoaiSPsById = async (id) => {
    const query = 'SELECT * FROM LoaiSanPham WHERE MaLoai = ?';
    const [rows, fields] = await pool.execute(query, [id]);
    return rows;
}

module.exports = {
    getAll,
    createLoaiSP,
    checkLoaiSP,
    updateLoaiSP,
    deleteLoaiSP,
    getLoaiSPsById
};
