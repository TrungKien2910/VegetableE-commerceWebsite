const db  = require('../utils/connectDB');

// Thống kê số lượng đơn hàng theo trạng thái
const getThongKeDonHang = async () => {
    const query = `
      SELECT TrangThai, COUNT(*) AS SoLuong
      FROM DonHang
      GROUP BY TrangThai;
    `;
    return db.execute(query);
  };
  
  // Thống kê sản phẩm bán chạy (top sản phẩm có số lượng bán cao nhất)
  const getSanPhamBanChay = async () => {
    const query = `
      SELECT SanPham.TenSP, SUM(ChiTietDonHang.SoLuong) AS TongBan
      FROM ChiTietDonHang
      JOIN SanPham ON ChiTietDonHang.MaSP = SanPham.MaSP
      JOIN DonHang ON ChiTietDonHang.MaDH = DonHang.MaDH
      WHERE DonHang.TrangThai = 'DaGiao'
      GROUP BY SanPham.TenSP
      ORDER BY TongBan DESC
      LIMIT 10;
    `;
    return db.execute(query);
  };
  
  // Thống kê khách hàng mua hàng nhiều nhất
  const getKhachHangMuaNhieu = async () => {
    const query = `
      SELECT User.HoTen, COUNT(DonHang.MaDH) AS SoLuongDon, SUM(DonHang.TongTien) AS TongChiTieu
FROM DonHang
JOIN User ON DonHang.MaKH = User.MaKH
WHERE DonHang.TrangThai = 'DaGiao'
GROUP BY User.HoTen
ORDER BY TongChiTieu DESC
LIMIT 10;
    `;
    return db.execute(query);
  };
  
  // Thống kê nhập hàng theo nhà cung cấp
  const getThongKeNhapHang = async () => {
    const query = `
      SELECT NhaCungCap.TenNCC, SUM(ChiTietPhieuNhap.SoLuong * ChiTietPhieuNhap.DonGia) AS TongTienNhap
FROM ChiTietPhieuNhap
JOIN SanPham ON ChiTietPhieuNhap.MaSP = SanPham.MaSP
JOIN NhaCungCap ON SanPham.MaNCC = NhaCungCap.MaNCC
JOIN PhieuNhap ON ChiTietPhieuNhap.MaPhieuNhap = PhieuNhap.MaPhieuNhap
GROUP BY NhaCungCap.TenNCC
ORDER BY TongTienNhap DESC
    `;
    return db.execute(query);
  };
  
  // Doanh thu theo ngày
  const getDoanhThuTheoNgay = async () => {
    const query = `
      SELECT DATE(NgayDat) AS Ngay, SUM(TongTien) AS DoanhThu 
      FROM DonHang
      WHERE TrangThai = 'DaGiao'
      GROUP BY Ngay
      ORDER BY Ngay DESC;
    `;
    return db.execute(query);
  };
  // LoiNhuan
  const getLoiNhuan = async () => {
    const query = `
      SELECT 
    -- Tổng tiền nhập hàng (nếu không có thì là 0)
    COALESCE((SELECT SUM(TongTien) FROM PhieuNhap), 0) AS TongTienNhap,

    -- Tổng tiền thanh toán thành công (nếu không có thì là 0)
    COALESCE((SELECT SUM(SoTien) FROM ThanhToan WHERE TrangThai = 'ThanhCong'), 0) AS TongTienThanhCong,

    -- Tổng tiền hoàn lại (nếu không có thì là 0)
    COALESCE((SELECT SUM(SoTien) FROM ThanhToan WHERE TrangThai = 'DaHoanTien'), 0) AS TongTienHoanLai,

    -- Tổng doanh thu thực tế (đã trừ hoàn tiền)
    COALESCE((SELECT SUM(SoTien) FROM ThanhToan WHERE TrangThai = 'ThanhCong'), 0) - 
    COALESCE((SELECT SUM(SoTien) FROM ThanhToan WHERE TrangThai = 'DaHoanTien'), 0) AS TongTienBan,

    -- Lợi nhuận thực tế (doanh thu thực tế - tổng tiền nhập hàng)
    (COALESCE((SELECT SUM(SoTien) FROM ThanhToan WHERE TrangThai = 'ThanhCong'), 0) - 
     COALESCE((SELECT SUM(SoTien) FROM ThanhToan WHERE TrangThai = 'DaHoanTien'), 0) - 
     COALESCE((SELECT SUM(TongTien) FROM PhieuNhap), 0)) AS LoiNhuan;
    `;
    return db.execute(query);
  };
  
  module.exports = {
    getThongKeDonHang,
    getSanPhamBanChay,
    getKhachHangMuaNhieu,
    getThongKeNhapHang,
    getDoanhThuTheoNgay,
    getLoiNhuan
  };