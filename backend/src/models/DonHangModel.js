const pool = require('../utils/connectDB');

// Lấy tất cả đơn hàng + chi tiết đơn hàng
const getAll = async () => {
    const query = `
    SELECT dh.MaDH, dh.MaKH, dh.TenKH, dh.SoDienThoai, dh.NgayDat, dh.DiaChi, dh.TongTien, dh.TrangThai, dh.ThanhToan, 
       tt.NgayThanhToan, ctdh.MaSP, sp.TenSP, ctdh.SoLuong, ctdh.DonGia, ctdh.TongTien AS TongTienCT
FROM DonHang dh
LEFT JOIN ChiTietDonHang ctdh ON dh.MaDH = ctdh.MaDH
LEFT JOIN (
    SELECT MaDH, MAX(NgayThanhToan) AS NgayThanhToan FROM ThanhToan GROUP BY MaDH
) tt ON dh.MaDH = tt.MaDH
LEFT JOIN SanPham sp ON ctdh.MaSP = sp.MaSP
ORDER BY dh.MaDH;

    `;

    const [rows] = await pool.query(query);

    if (rows.length === 0) {
        return []; // Không có dữ liệu
    }

    // Nhóm dữ liệu theo MaDH
    const donHangs = [];
    const mapDonHang = new Map();

    rows.forEach(row => {
        if (!mapDonHang.has(row.MaDH)) {
            mapDonHang.set(row.MaDH, {
                MaDH: row.MaDH,
                MaKH: row.MaKH,
                TenKH: row.TenKH,
                SoDienThoai: row.SoDienThoai,
                NgayDat: row.NgayDat,
                DiaChi: row.DiaChi,
                TongTien: parseFloat(row.TongTien),
                TrangThai: row.TrangThai,
                ThanhToan: row.ThanhToan,
                NgayThanhToan: row.NgayThanhToan,
                ChiTietDonHangs: []
            });
            donHangs.push(mapDonHang.get(row.MaDH));
        }

        // Thêm chi tiết vào danh sách
        mapDonHang.get(row.MaDH).ChiTietDonHangs.push({
            MaCTDH: row.MaCTDH,
            MaSP: row.MaSP,
            TenSP: row.TenSP, // Lấy tên sản phẩm
            SoLuong: row.SoLuong,
            DonGia: parseFloat(row.DonGia),
            TongTienCT: parseFloat(row.TongTienCT)
        });
    });

    return donHangs;
};


// Lấy đơn hàng + chi tiết đơn hàng theo UserID
const getDonHangByUserId = async (id) => {
    const query = `
    SELECT dh.MaDH, dh.MaKH, dh.TenKH, dh.SoDienThoai, dh.NgayDat, dh.TongTien, dh.TrangThai, dh.ThanhToan,
       tt.NgayThanhToan, dh.DiaChi,
       ctdh.MaCTDH, ctdh.MaSP, sp.TenSP, ctdh.SoLuong, ctdh.DonGia, ctdh.TongTien AS TongTienCT
FROM DonHang dh
LEFT JOIN ChiTietDonHang ctdh ON dh.MaDH = ctdh.MaDH
LEFT JOIN (
    SELECT MaDH, MAX(NgayThanhToan) AS NgayThanhToan FROM ThanhToan GROUP BY MaDH
) tt ON dh.MaDH = tt.MaDH
LEFT JOIN SanPham sp ON ctdh.MaSP = sp.MaSP
WHERE dh.MaKH = ?
ORDER BY dh.MaDH;

    `;

    const [rows] = await pool.query(query, [id]);

    if (rows.length === 0) {
        return []; // Không có dữ liệu
    }

    // Nhóm dữ liệu theo MaDH
    const donHangs = [];
    const mapDonHang = new Map();

    rows.forEach(row => {
        if (!mapDonHang.has(row.MaDH)) {
            mapDonHang.set(row.MaDH, {
                MaDH: row.MaDH,
                MaKH: row.MaKH,
                TenKH: row.TenKH, // Lấy tên khách hàng
                SoDienThoai: row.SoDienThoai,
                NgayDat: row.NgayDat,
                DiaChi: row.DiaChi,
                TongTien: parseFloat(row.TongTien),
                TrangThai: row.TrangThai,
                ThanhToan: row.ThanhToan,
                NgayThanhToan: row.NgayThanhToan,
                ChiTietDonHangs: []
            });
            donHangs.push(mapDonHang.get(row.MaDH));
        }

        // Thêm chi tiết vào danh sách
        mapDonHang.get(row.MaDH).ChiTietDonHangs.push({
            MaCTDH: row.MaCTDH,
            MaSP: row.MaSP,
            TenSP: row.TenSP, // Lấy tên sản phẩm
            SoLuong: row.SoLuong,
            DonGia: parseFloat(row.DonGia),
            TongTienCT: parseFloat(row.TongTienCT)
        });
    });

    return donHangs;
  
};

// Lấy đơn hàng + chi tiết đơn hàng theo DonHangId
const getDonHangByDonHangId = async (id) => {
    const query = `
    SELECT dh.MaDH, dh.MaKH, dh.TenKH, dh.SoDienThoai, dh.NgayDat, dh.TongTien, dh.TrangThai, dh.ThanhToan, 
       tt.NgayThanhToan, dh.DiaChi,
       ctdh.MaCTDH, ctdh.MaSP, sp.TenSP, ctdh.SoLuong, ctdh.DonGia, ctdh.TongTien AS TongTienCT
FROM DonHang dh
LEFT JOIN ChiTietDonHang ctdh ON dh.MaDH = ctdh.MaDH
LEFT JOIN (
    SELECT MaDH, MAX(NgayThanhToan) AS NgayThanhToan FROM ThanhToan GROUP BY MaDH
) tt ON ctdh.MaDH = tt.MaDH
LEFT JOIN SanPham sp ON ctdh.MaSP = sp.MaSP
WHERE dh.MaDH = ?
ORDER BY dh.MaDH;

    `;

    const [rows] = await pool.query(query, [id]);

    if (rows.length === 0) {
        return []; // Không có dữ liệu
    }

    // Nhóm dữ liệu theo MaDH
    const donHangs = [];
    const mapDonHang = new Map();

    rows.forEach(row => {
        if (!mapDonHang.has(row.MaDH)) {
            mapDonHang.set(row.MaDH, {
                MaDH: row.MaDH,
                MaKH: row.MaKH,
                TenKH: row.TenKH, // Lấy tên khách hàng
                SoDienThoai: row.SoDienThoai,
                NgayDat: row.NgayDat,
                DiaChi: row.DiaChi,
                TongTien: parseFloat(row.TongTien),
                TrangThai: row.TrangThai,
                ThanhToan: row.ThanhToan,
                NgayThanhToan: row.NgayThanhToan,
                ChiTietDonHangs: []
            });
            donHangs.push(mapDonHang.get(row.MaDH));
        }

        // Thêm chi tiết vào danh sách
        mapDonHang.get(row.MaDH).ChiTietDonHangs.push({
            MaCTDH: row.MaCTDH,
            MaSP: row.MaSP,
            TenSP: row.TenSP, // Lấy tên sản phẩm
            SoLuong: row.SoLuong,
            DonGia: parseFloat(row.DonGia),
            TongTienCT: parseFloat(row.TongTienCT)
        });
    });

    return donHangs;
  
};

const getDonHangByTrangThai = async (TrangThai) => {
    const query = `
    SELECT dh.MaDH, dh.MaKH, dh.TenKH, dh.SoDienThoai, dh.NgayDat, dh.TongTien, dh.TrangThai, dh.ThanhToan,
       tt.NgayThanhToan, dh.DiaChi, ctdh.MaCTDH, ctdh.MaSP, sp.TenSP, ctdh.SoLuong, ctdh.DonGia, ctdh.TongTien AS TongTienCT
FROM DonHang dh
LEFT JOIN ChiTietDonHang ctdh ON dh.MaDH = ctdh.MaDH
LEFT JOIN (
    SELECT MaDH, MAX(NgayThanhToan) AS NgayThanhToan FROM ThanhToan GROUP BY MaDH
) tt ON dh.MaDH = tt.MaDH
LEFT JOIN SanPham sp ON ctdh.MaSP = sp.MaSP
WHERE dh.TrangThai = ?
ORDER BY dh.MaDH;

    `;

    const [rows] = await pool.query(query, [TrangThai]);

    if (rows.length === 0) {
        return []; // Không có dữ liệu
    }

    // Nhóm dữ liệu theo MaDH
    const donHangs = [];
    const mapDonHang = new Map();

    rows.forEach(row => {
        if (!mapDonHang.has(row.MaDH)) {
            mapDonHang.set(row.MaDH, {
                MaDH: row.MaDH,
                MaKH: row.MaKH,
                TenKH: row.TenKH, // Lấy tên khách hàng
                SoDienThoai: row.SoDienThoai,
                NgayDat: row.NgayDat,
                DiaChi: row.DiaChi,
                TongTien: parseFloat(row.TongTien),
                TrangThai: row.TrangThai,
                ThanhToan: row.ThanhToan,
                NgayThanhToan: row.NgayThanhToan,
                ChiTietDonHangs: []
            });
            donHangs.push(mapDonHang.get(row.MaDH));
        }

        // Thêm chi tiết vào danh sách
        mapDonHang.get(row.MaDH).ChiTietDonHangs.push({
            MaCTDH: row.MaCTDH,
            MaSP: row.MaSP,
            TenSP: row.TenSP, // Lấy tên sản phẩm
            SoLuong: row.SoLuong,
            DonGia: parseFloat(row.DonGia),
            TongTienCT: parseFloat(row.TongTienCT)
        });
    });

    return donHangs;

};

const getDonHangByThanhToan = async (ThanhToan) => {
    const query = `
   SELECT dh.MaDH, dh.MaKH, dh.HoTen, dh.SoDienThoai, dh.NgayDat, dh.TongTien, dh.TrangThai, dh.ThanhToan,
       tt.NgayThanhToan, dh.DiaChi, ctdh.MaCTDH, ctdh.MaSP, sp.TenSP, ctdh.SoLuong, ctdh.DonGia, ctdh.TongTien AS TongTienCT
FROM DonHang dh
LEFT JOIN ChiTietDonHang ctdh ON dh.MaDH = ctdh.MaDH
LEFT JOIN (
    SELECT MaDH, MAX(NgayThanhToan) AS NgayThanhToan FROM ThanhToan GROUP BY MaDH
) tt ON dh.MaDH = tt.MaDH
LEFT JOIN SanPham sp ON ctdh.MaSP = sp.MaSP
WHERE dh.ThanhToan = ?
ORDER BY dh.MaDH;

    `;

    const [rows] = await pool.query(query, [ThanhToan]);

    if (rows.length === 0) {
        return []; // Không có dữ liệu
    }

    // Nhóm dữ liệu theo MaDH
    const donHangs = [];
    const mapDonHang = new Map();

    rows.forEach(row => {
        if (!mapDonHang.has(row.MaDH)) {
            mapDonHang.set(row.MaDH, {
                MaDH: row.MaDH,
                MaKH: row.MaKH,
                TenKH: row.TenKH, // Lấy tên khách hàng
                SoDienThoai:row.SoDienThoai,
                NgayDat: row.NgayDat,
                DiaChi: row.DiaChi,
                TongTien: parseFloat(row.TongTien),
                TrangThai: row.TrangThai,
                ThanhToan: row.ThanhToan,
                NgayThanhToan: row.NgayThanhToan,
                ChiTietDonHangs: []
            });
            donHangs.push(mapDonHang.get(row.MaDH));
        }

        // Thêm chi tiết vào danh sách
        mapDonHang.get(row.MaDH).ChiTietDonHangs.push({
            MaCTDH: row.MaCTDH,
            MaSP: row.MaSP,
            TenSP: row.TenSP, // Lấy tên sản phẩm
            SoLuong: row.SoLuong,
            DonGia: parseFloat(row.DonGia),
            TongTienCT: parseFloat(row.TongTienCT)
        });
    });

    return donHangs;

}


// Tạo đơn hàng mới + chi tiết đơn hàng
const createDonHang = async (newDonHang) => {
    const { MaKH,TenKH,SoDienThoai,DiaChi, ChiTietDonHangs, ThanhToan } = newDonHang;
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // Tạo đơn hàng với TongTien ban đầu là 0
        const [result] = await conn.query(
            `INSERT INTO DonHang (MaKH,TenKH,SoDienThoai, NgayDat, DiaChi, TongTien, TrangThai, ThanhToan) VALUES (?,?,?, NOW(),?, 0, ?, ?)`,
            [MaKH,TenKH,SoDienThoai, DiaChi ,"ChoDuyet", ThanhToan]
        );
        const MaDH = result.insertId;

        // Thêm chi tiết đơn hàng và trừ số lượng sản phẩm
        for (const item of ChiTietDonHangs) {
            const { MaSP, SoLuong, DonGia } = item;

            // Thêm chi tiết đơn hàng
            await conn.query(
                `INSERT INTO ChiTietDonHang (MaDH, MaSP, SoLuong, DonGia) VALUES (?, ?, ?, ?)`,
                [MaDH, MaSP, SoLuong, DonGia]
            );

            // // Trừ số lượng sản phẩm trong kho
            // await conn.query(
            //     `UPDATE SanPham SET SoLuong = SoLuong - ? WHERE MaSP = ? AND SoLuong >= ?`,
            //     [SoLuong, MaSP, SoLuong]
            // );
        }

        // Lấy tổng tiền từ database sau khi thêm chi tiết đơn hàng
        const [[{ TongTien }]] = await conn.query(
            `SELECT SUM(SoLuong * DonGia) AS TongTien FROM ChiTietDonHang WHERE MaDH = ?`,
            [MaDH]
        );

        // Cập nhật tổng tiền vào đơn hàng
        await conn.query(
            `UPDATE DonHang SET TongTien = ? WHERE MaDH = ?`,
            [TongTien, MaDH]
        );

        // Nếu trạng thái là "ThanhToan" thì thêm vào bảng ThanhToan
        if (ThanhToan === "DaThanhToan") {
            await conn.query(
                `INSERT INTO ThanhToan (MaDH, NgayThanhToan, SoTien, TrangThai) VALUES (?, NOW(), ?, 'ThanhCong')`,
                [MaDH, TongTien]
            );
        }

        await conn.query(
            `INSERT INTO LichSuMuaHang (MaKH, MaDH, TongTien, TrangThaiThanhToan, TrangThaiDonHang)
             VALUES (?, ?, ?, ?, ?)`,
            [MaKH, MaDH, TongTien, ThanhToan, "ChoDuyet"]
        );


        await conn.commit();
        return { MaDH, TongTien };
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
};

const userThanhToan = async (HoaDonId) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // Lấy tổng tiền từ database
        const [rows] = await conn.query(
            `SELECT TongTien FROM DonHang WHERE MaDH = ?`,
            [HoaDonId]
        );

        if (rows.length === 0) {
            throw new Error("Không tìm thấy đơn hàng");
        }

        const TongTien = rows[0].TongTien; // Lấy giá trị thực tế

        // Thêm vào bảng ThanhToan
        await conn.query(
            `INSERT INTO ThanhToan (MaDH, NgayThanhToan, SoTien, TrangThai) VALUES (?, NOW(), ?, 'ThanhCong')`,
            [HoaDonId, TongTien]
        );

        // Cập nhật trạng thái thanh toán
        await conn.query(
            `UPDATE DonHang SET ThanhToan = 'DaThanhToan' WHERE MaDH = ?`,
            [HoaDonId]
        );

        await conn.commit();
        return true;
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
};


const approrveDonHang = async (HoaDonId) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // Cập nhật trạng thái đơn hàng
        await conn.query(
            `UPDATE DonHang SET TrangThai = 'DaGiao' WHERE MaDH = ?`,
            [HoaDonId]
        );

        await conn.commit();
        return true;
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
};

const updateSanPhamSoLuong = async (MaSP, SoLuong) => {
    console.log(`Cập nhật số lượng sản phẩm: MaSP=${MaSP}, SoLuong=${SoLuong}`);
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // Cập nhật số lượng sản phẩm
        await conn.query(
            `UPDATE SanPham SET SoLuong = SoLuong + ? WHERE MaSP = ?`,
            [SoLuong, MaSP]
        );

        await conn.commit();
        return true;
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
    
    
}

const cancelDonHang = async (HoaDonId) => {
    
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // Cập nhật trạng thái đơn hàng
        await conn.query(
            `UPDATE DonHang SET TrangThai = 'Huy' WHERE MaDH = ?`,
            [HoaDonId]
        );

        await conn.commit();
        return true;
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }

}

const hoanTien = async (HoaDonId, TongTien) => {
    console.log(`Hoàn tiền cho đơn hàng ${HoaDonId}, số tiền: ${TongTien}`);
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // Thêm vào bảng ThanhToan
        await conn.query(
            `INSERT INTO ThanhToan (MaDH, NgayThanhToan, SoTien, TrangThai) VALUES (?, NOW(), ?, 'DaHoanTien')`,
            [HoaDonId, TongTien]
        );

        await conn.query(
            `UPDATE DonHang SET ThanhToan = 'DaHoanTien' WHERE MaDH = ?`,
            [HoaDonId]
        );

        await conn.commit();
        return true;
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }

}


const updateDonHang = async (id,HoTen,SoDienThoai, DiaChi) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // Cập nhật địa chỉ đơn hàng
        await conn.query(
            `UPDATE DonHang SET TenKH=?,SoDienThoai=?,DiaChi = ? WHERE MaDH = ?`,
            [HoTen,SoDienThoai,DiaChi, id]
        );

        await conn.commit();
        return true;
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
};

// Lưu lịch sử đơn hàng
const saveLichSuDonHang = async (MaDH) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // 🔹 1. Lấy thông tin đơn hàng từ bảng DonHang
        const [[donHang]] = await conn.query(
            ` SELECT MaKH, TongTien, TrangThai, ThanhToan AS  TrangThaiThanhToan
             FROM DonHang WHERE MaDH = ?`,
            [MaDH]
        );

        if (!donHang) {
            throw new Error("Không tìm thấy đơn hàng");
        }

        // 🔹 2. Thêm vào bảng LichSuMuaHang
        await conn.query(
            `INSERT INTO LichSuMuaHang (MaKH, MaDH, TongTien, TrangThaiThanhToan, TrangThaiDonHang)
             VALUES (?, ?, ?, ?,?)`,
            [donHang.MaKH, MaDH, donHang.TongTien, donHang.TrangThaiThanhToan, donHang.TrangThai]
        );

        await conn.commit();
        return true;

    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
};


const getLichSuDonHang = async (id) => {
    const query = `
    SELECT lsmh.MaDH, lsmh.TongTien, lsmh.TrangThaiThanhToan, dh.NgayDat, dh.DiaChi, lsmh.TrangThaiDonHang
        FROM LichSuMuaHang lsmh
        LEFT JOIN DonHang dh ON lsmh.MaDH = dh.MaDH
        WHERE lsmh.MaKH = ?
        ORDER BY lsmh.MaDH
    `;

    const [rows] = await pool.query(query, [id]);

    if (rows.length === 0) {
        return []; // Không có dữ liệu
    }

    return rows;
};

module.exports = {
    getAll,
    getDonHangByUserId,
    getDonHangByDonHangId,
    getDonHangByTrangThai,
    getDonHangByThanhToan,
    createDonHang,
    userThanhToan,
    approrveDonHang,
    updateSanPhamSoLuong,
    cancelDonHang,
    hoanTien,
    updateDonHang,
    saveLichSuDonHang,
    getLichSuDonHang
};
