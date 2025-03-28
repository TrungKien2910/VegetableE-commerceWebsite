const pool = require('../utils/connectDB');

// Lấy tất cả phiếu nhập kèm chi tiết
const getAll = async () => {
    const query = `
        SELECT pn.MaPhieuNhap, pn.MaNCC, ncc.TenNCC, pn.NgayNhap, pn.TongTien, pn.TrangThai,
               ctpn.MaCTPN, ctpn.MaSP, sp.TenSP, ctpn.SoLuong, ctpn.DonGia, ctpn.TongTien AS TongTienCT
        FROM PhieuNhap pn
        LEFT JOIN ChiTietPhieuNhap ctpn ON pn.MaPhieuNhap = ctpn.MaPhieuNhap
        LEFT JOIN SanPham sp ON ctpn.MaSP = sp.MaSP
        LEFT JOIN NhaCungCap ncc ON pn.MaNCC = ncc.MaNCC
        ORDER BY pn.MaPhieuNhap
    `;

    const [rows] = await pool.query(query);

    if (rows.length === 0) {
        return [];  // Không có dữ liệu
    }

    // Nhóm dữ liệu theo MaPhieuNhap
    const phieuNhaps = [];
    const mapPhieuNhap = new Map();

    rows.forEach(row => {
        if (!mapPhieuNhap.has(row.MaPhieuNhap)) {
            mapPhieuNhap.set(row.MaPhieuNhap, {
                MaPhieuNhap: row.MaPhieuNhap,
                MaNCC: row.MaNCC,
                TenNCC: row.TenNCC, // Lấy tên nhà cung cấp
                NgayNhap: row.NgayNhap,
                TongTien: parseFloat(row.TongTien),
                TrangThai: row.TrangThai,
                ChiTietPhieuNhaps: []
            });
            phieuNhaps.push(mapPhieuNhap.get(row.MaPhieuNhap));
        }

        // Thêm chi tiết vào danh sách
        mapPhieuNhap.get(row.MaPhieuNhap).ChiTietPhieuNhaps.push({
            MaCTPN: row.MaCTPN,
            MaSP: row.MaSP,
            TenSP: row.TenSP, // Lấy tên sản phẩm
            SoLuong: row.SoLuong,
            DonGia: parseFloat(row.DonGia),
            TongTienCT: parseFloat(row.TongTienCT)
        });
    });

    return phieuNhaps;
};


// Lấy phiếu nhập theo ID
const getPhieuNhapById = async (id) => {
    const query = `
        SELECT pn.MaPhieuNhap, pn.MaNCC, ncc.TenNCC, pn.NgayNhap, pn.TongTien, pn.TrangThai,
               ctpn.MaCTPN, ctpn.MaSP, sp.TenSP, ctpn.SoLuong, ctpn.DonGia, ctpn.TongTien AS TongTienCT
        FROM PhieuNhap pn
        LEFT JOIN ChiTietPhieuNhap ctpn ON pn.MaPhieuNhap = ctpn.MaPhieuNhap
        LEFT JOIN SanPham sp ON ctpn.MaSP = sp.MaSP
        LEFT JOIN NhaCungCap ncc ON pn.MaNCC = ncc.MaNCC
        WHERE pn.MaPhieuNhap = ?
    `;

    const [rows] = await pool.query(query, [id]);

    if (rows.length === 0) {
        return null;  // Không có dữ liệu
    }

    // Tạo object kết quả
    const phieuNhap = {
        MaPhieuNhap: rows[0].MaPhieuNhap,
        MaNCC: rows[0].MaNCC,
        TenNCC: rows[0].TenNCC, // Lấy tên nhà cung cấp
        NgayNhap: rows[0].NgayNhap,
        TongTien: parseFloat(rows[0].TongTien),
        TrangThai: rows[0].TrangThai,
        ChiTietPhieuNhaps: rows.map(row => ({
            MaCTPN: row.MaCTPN,
            MaSP: row.MaSP,
            TenSP: row.TenSP, // Lấy tên sản phẩm
            SoLuong: row.SoLuong,
            DonGia: parseFloat(row.DonGia),
            TongTienCT: parseFloat(row.TongTienCT)
        }))
    };

    return phieuNhap;
};


// Tạo phiếu nhập + chi tiết phiếu nhập
const createPhieuNhap = async (newPhieuNhap) => {
    const { MaNCC, ChiTietPhieuNhaps } = newPhieuNhap;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Thêm phiếu nhập
        const [result] = await connection.query(
            'INSERT INTO PhieuNhap (MaNCC, TrangThai, TongTien) VALUES (?, ?, 0)',
            [MaNCC, "ChoDuyet"]
        );
        const MaPhieuNhap = result.insertId;

        // Thêm chi tiết phiếu nhập
        for (const item of ChiTietPhieuNhaps) {
            await connection.query(
                'INSERT INTO ChiTietPhieuNhap (MaPhieuNhap, MaSP, SoLuong, DonGia) VALUES (?, ?, ?, ?)',
                [MaPhieuNhap, item.MaSP, item.SoLuong, item.DonGia]
            );
        }

        // Cập nhật tổng tiền từ database (không cần tính trong code)
        const [[{ TongTien }]] = await connection.query(
            'SELECT SUM(TongTien) AS TongTien FROM ChiTietPhieuNhap WHERE MaPhieuNhap = ?',
            [MaPhieuNhap]
        );

        await connection.query(
            'UPDATE PhieuNhap SET TongTien = ? WHERE MaPhieuNhap = ?',
            [TongTien, MaPhieuNhap]
        );

        await connection.commit();
        return { MaPhieuNhap, TongTien };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

// Cập nhật phiếu nhập (không thay đổi chi tiết phiếu)
const updatePhieuNhap = async (id, updatedPhieuNhap) => {
    const { MaNCC, TrangThai, ChiTietPhieuNhaps } = updatedPhieuNhap;
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();

        // Cập nhật thông tin phiếu nhập (nếu có)
        await connection.query(
            'UPDATE PhieuNhap SET MaNCC = ?, TrangThai = ? WHERE MaPhieuNhap = ?',
            [MaNCC, TrangThai, id]
        );

        // Xóa chi tiết phiếu nhập cũ
        await connection.query(
            'DELETE FROM ChiTietPhieuNhap WHERE MaPhieuNhap = ?',
            [id]
        );

        // Thêm chi tiết phiếu nhập mới
        for (const item of ChiTietPhieuNhaps) {
            await connection.query(
                'INSERT INTO ChiTietPhieuNhap (MaPhieuNhap, MaSP, SoLuong, DonGia) VALUES (?, ?, ?, ?)',
                [id, item.MaSP, item.SoLuong, item.DonGia]
            );
        }

        // Cập nhật tổng tiền (lấy từ database)
        const [[{ TongTien }]] = await connection.query(
            'SELECT SUM(TongTien) AS TongTien FROM ChiTietPhieuNhap WHERE MaPhieuNhap = ?',
            [id]
        );

        await connection.query(
            'UPDATE PhieuNhap SET TongTien = ? WHERE MaPhieuNhap = ?',
            [TongTien, id]
        );

        await connection.commit();
        return { MaPhieuNhap: id, TongTien };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};


// Xóa phiếu nhập (sẽ tự động xóa chi tiết phiếu nhập nhờ ON DELETE CASCADE)
const deletePhieuNhap = async (id) => {
    await pool.query('DELETE FROM PhieuNhap WHERE MaPhieuNhap = ?', [id]);
    return { message: 'Xóa thành công' };
};

const updateSanPhamSoLuong = async (MaSP, SoLuong) => {
    const query = 'UPDATE SanPham SET SoLuong = SoLuong + ? WHERE MaSP = ?';
    await pool.query(query, [SoLuong, MaSP]);
}

const updateTrangThaiPhieuNhap = async (id, TrangThai) => {
    const query = 'UPDATE PhieuNhap SET TrangThai = ? WHERE MaPhieuNhap = ?';
    await pool.query(query, [TrangThai, id]);
}

const searchPhieuNhapTrangThai = async (TrangThai) => {
    const query = `
        SELECT pn.MaPhieuNhap, pn.MaNCC, ncc.TenNCC, pn.NgayNhap, pn.TongTien, pn.TrangThai,
               ctpn.MaCTPN, ctpn.MaSP, sp.TenSP, ctpn.SoLuong, ctpn.DonGia, ctpn.TongTien AS TongTienCT
        FROM PhieuNhap pn
        LEFT JOIN ChiTietPhieuNhap ctpn ON pn.MaPhieuNhap = ctpn.MaPhieuNhap
        LEFT JOIN SanPham sp ON ctpn.MaSP = sp.MaSP
        LEFT JOIN NhaCungCap ncc ON pn.MaNCC = ncc.MaNCC
        WHERE pn.TrangThai = ?
        ORDER BY pn.MaPhieuNhap
    `;

    const [rows] = await pool.query(query, [TrangThai]);

    if (rows.length === 0) {
        return [];  // Không có dữ liệu
    }

    // Nhóm dữ liệu theo MaPhieuNhap
    const phieuNhaps = [];
    const mapPhieuNhap = new Map();

    rows.forEach(row => {
        if (!mapPhieuNhap.has(row.MaPhieuNhap)) {
            mapPhieuNhap.set(row.MaPhieuNhap, {
                MaPhieuNhap: row.MaPhieuNhap,
                MaNCC: row.MaNCC,
                TenNCC: row.TenNCC, // Lấy tên nhà cung cấp
                NgayNhap: row.NgayNhap,
                TongTien: parseFloat(row.TongTien),
                TrangThai: row.TrangThai,
                ChiTietPhieuNhaps: []
            });
            phieuNhaps.push(mapPhieuNhap.get(row.MaPhieuNhap));
        }

        // Thêm chi tiết vào danh sách
        mapPhieuNhap.get(row.MaPhieuNhap).ChiTietPhieuNhaps.push({
            MaCTPN: row.MaCTPN,
            MaSP: row.MaSP,
            TenSP: row.TenSP, // Lấy tên sản phẩm
            SoLuong: row.SoLuong,
            DonGia: parseFloat(row.DonGia),
            TongTienCT: parseFloat(row.TongTienCT)
        });
});

    return phieuNhaps;
};

module.exports = {
    getAll,
    createPhieuNhap,
    updatePhieuNhap,
    deletePhieuNhap,
    getPhieuNhapById,
    updateSanPhamSoLuong,
    updateTrangThaiPhieuNhap,
    searchPhieuNhapTrangThai
};
