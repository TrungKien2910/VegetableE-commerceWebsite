const pool = require('../utils/connectDB');

const getAll = async () => {
    const query = 'SELECT * FROM NhaCungCap'
    const [rows, fields] = await pool.execute(query);
    return rows;
}

const createNhaCungCap = async (newNhaCungCap) => {
    const {TenNCC, SoDienThoai, Email, DiaChi, HinhAnh} = newNhaCungCap;
    const query = 'INSERT INTO NhaCungCap (TenNCC, SoDienThoai,Email,DiaChi,HinhAnh) VALUES (?, ?,?,?,?)';
    const results = await pool.execute(query, [TenNCC, SoDienThoai, Email, DiaChi, HinhAnh]);
    return results[0];
}

const checkNhaCungCap = async (TenNCC, Email, SoDienThoai, id) => {
    const query = 'SELECT * FROM NhaCungCap WHERE (TenNCC = ? OR Email = ? OR SoDienThoai = ?) AND MaNCC != ?';
    const [rows] = await pool.execute(query, [TenNCC, Email, SoDienThoai, id]);
    return rows;
};

const updateNhaCungCap = async (id, updateNhaCungCap) => {
    const {TenNCC,SoDienThoai,Email,DiaChi,HinhAnh} = updateNhaCungCap;
    const query = 'UPDATE NhaCungCap SET TenNCC = ?, SoDienThoai = ?, Email = ?, DiaChi = ?, HinhAnh = ? WHERE MaNCC = ?';
    const [results] = await pool.execute(query, [TenNCC,SoDienThoai,Email,DiaChi,HinhAnh, id]);
    return results;
};

const deleteNhaCungCap = async (id) => {
    const query = 'DELETE FROM NhaCungCap WHERE MaNCC = ?';
    const [results] = await pool.execute(query, [id]);
    return results;
};

const getNhaCungCapById = async (id) => {
    const query = 'SELECT * FROM NhaCungCap WHERE MaNCC = ?';
    const [rows, fields] = await pool.execute(query, [id]);
    return rows;
}

module.exports = {
    getAll,
    createNhaCungCap,
    checkNhaCungCap,
    updateNhaCungCap,
    deleteNhaCungCap,
    getNhaCungCapById
};
