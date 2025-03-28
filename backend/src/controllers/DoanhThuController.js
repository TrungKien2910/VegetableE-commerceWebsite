const DoanhThuModel = require('../models/DoanhThuModel');

class DoanhThuController {

    async getThongKeDonHang (req, res) {
    try {
        const [rows] = await DoanhThuModel.getThongKeDonHang();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy thống kê đơn hàng', error });
    }
};

async getSanPhamBanChay (req, res) {
    try {
        const [rows] = await DoanhThuModel.getSanPhamBanChay();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy sản phẩm bán chạy', error });
    }
};

async getKhachHangMuaNhieu  (req, res)  {
    try {
        const [rows] = await DoanhThuModel.getKhachHangMuaNhieu();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy khách hàng mua nhiều', error });
    }
};

async getThongKeNhapHang  (req, res)  {
    try {
        const [rows] = await DoanhThuModel.getThongKeNhapHang();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy thống kê nhập hàng', error });
    }
};

async getDoanhThuTheoNgay (req, res)  {
    try {
        const [rows] = await DoanhThuModel.getDoanhThuTheoNgay();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy doanh thu theo ngày', error });
    }
};

async getLoiNhuan (req,res){
    try {
        const [rows] = await DoanhThuModel.getLoiNhuan();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy loi nhuan', error });
    }
};

}
module.exports = new DoanhThuController;
