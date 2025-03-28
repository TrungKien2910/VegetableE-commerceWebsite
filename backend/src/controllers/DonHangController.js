const e = require('express');
const DonHangModel = require('../models/DonHangModel');
const pool = require('../utils/connectDB');

class DonHangController {

    // Lấy tất cả phiếu nhập
    async getAllDonHang(req, res) {
        try {
            const data = await DonHangModel.getAll();
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: ' ', error });
        }
    }

    // Lấy phiếu nhập theo ID
    async getDonHangByUserId(req, res) {
        const { UserId } = req.query;
        
        try {
            const data = await DonHangModel.getDonHangByUserId(UserId);
            if (data.length === 0) {
                return res.status(404).json({ message: ' ' });
            }
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: ' ', error });
        }
    }

    async getDonHangByDonHangId(req, res) {
        const { id } = req.params;
        try {
            const data = await DonHangModel.getDonHangByDonHangId(id);
            if (data.length === 0) {
                return res.status(404).json({ message: ' ' });
            }
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: ' ', error });
        }
    }

    async getDonHangByTrangThai(req, res) {
        const { TrangThai } = req.query;
        try {
            const data = await DonHangModel.getDonHangByTrangThai(TrangThai);
            if (data.length === 0) {
                return res.status(404).json({ message: ' ' });
            }
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: ' ', error });
        }
    }

    async getDonHangByThanhToan(req, res) {
        const { ThanhToan } = req.query;
        try {
            const data = await DonHangModel.getDonHangByThanhToan(ThanhToan);
            if (data.length === 0) {
                return res.status(404).json({ message: ' ' });
            }
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: ' ', error });
        }
    }

    async createDonHang(req, res) {
        try {
            const newDonHang = req.body;
            const result = await DonHangModel.createDonHang(newDonHang);
            res.status(201).json({ message: ' ', ...result });
        } catch (error) {
            res.status(500).json({ message: ' ', error });
        }
    }

    async userThanhToan(req, res) {
        const { id } = req.params; // Lấy id đơn hàng từ params
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
    
            const DonHang = await DonHangModel.getDonHangByDonHangId(id);
            

            if (!DonHang || DonHang.length === 0) {
                await connection.rollback();
                return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
            }
            const donHangData = DonHang[0]; // Lấy phần tử đầu tiên
            if (String(donHangData.ThanhToan).trim() === 'DaThanhToan') {
                await connection.rollback();
                return res.status(400).json({ message: 'Đơn hàng đã được thanh toán trước đó' });
            }

           
    
    
            if (DonHang.TrangThai === 'Huy') {
                await connection.rollback();
                return res.status(400).json({ message: 'Đơn hàng đã bị hủy' });
            }
    

            // Gọi model để xử lý thanh toán
            await DonHangModel.userThanhToan(id);

            await DonHangModel.saveLichSuDonHang(id);

    
            await connection.commit();
            res.json({ message: 'Thanh toán đơn hàng thành công' });
        } catch (error) {
            await connection.rollback();
            console.error(error);
            res.status(500).json({ message: error.message });
        } finally {
            connection.release();
        }
    }
    

    async approveDonHang(req, res) {
        const { id } = req.params; // Lấy id đơn hàng từ params
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
    
            const DonHang = await DonHangModel.getDonHangByDonHangId(id);
           

            if (!DonHang || DonHang.length === 0) {
                await connection.rollback();
                return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
            }
            const donHangData = DonHang[0]; // Lấy phần tử đầu tiên
            
            if (String(donHangData.TrangThai).trim() === 'DaGiao') {
                await connection.rollback();
                return res.status(400).json({ message: 'Đơn hàng đã được duyệt trước đó' });
            }

            if (String(donHangData.TrangThai).trim() === 'Huy') {
                await connection.rollback();
                return res.status(400).json({ message: 'Đơn hàng đã bị hủy' });
            }

               for (let item of donHangData.ChiTietDonHangs) {
                        await DonHangModel.updateSanPhamSoLuong(item.MaSP, - item.SoLuong);
                    }
    
            // Gọi model để xử lý duyệt đơn hàng
            await DonHangModel.approrveDonHang(id);
            await DonHangModel.saveLichSuDonHang(id);

    
            await connection.commit();
            res.json({ message: 'Duyệt đơn hàng thành công' });
        } catch (error) {
            await connection.rollback();
            console.error(error);
            res.status(500).json({ message: error.message });
        } finally {
            connection.release();
        }
       
    }

    async cancelDonHang(req, res) {
        const { id } = req.params;
        const { userRole } = req.query;
        //const { userRole } = req.user.VaiTro; // Lấy vai trò user (giả sử có middleware xác thực)
        const connection = await pool.getConnection();
    
        try {
            await connection.beginTransaction();
    
            const DonHang = await DonHangModel.getDonHangByDonHangId(id);
    
            if (!DonHang || DonHang.length === 0) {
                await connection.rollback();
                return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
            }
    
            const donHangData = DonHang[0]; // Lấy đơn hàng đầu tiên
            const trangThai = String(donHangData.TrangThai).trim();
            const thanhToan = String(donHangData.ThanhToan).trim();
    
            // Nếu đơn hàng đã bị hủy trước đó
            if (trangThai === 'Huy') {
                await connection.rollback();
                return res.status(400).json({ message: 'Đơn hàng đã bị hủy trước đó' });
            }
    
            // Nếu đơn hàng đang giao thì chỉ admin mới có quyền hủy
            if (trangThai === 'DaGiao' && userRole !== 'admin') {
                await connection.rollback();
                return res.status(403).json({ message: 'Bạn không có quyền hủy đơn hàng này' });
            }
    
            // Nếu đơn hàng đã giao thì trừ số lượng sản phẩm + hoàn tiền nếu đã thanh toán
            if (trangThai === 'DaGiao') {
                for (let item of donHangData.ChiTietDonHangs) {
                    await DonHangModel.updateSanPhamSoLuong(item.MaSP, item.SoLuong);
                }
            }

            if (thanhToan === 'DaThanhToan') {
                await DonHangModel.hoanTien(donHangData.MaDH, donHangData.TongTien);
            }

    
            // Hủy đơn hàng (cập nhật trạng thái thành 'Huy')
            await DonHangModel.cancelDonHang(id);
            
            await DonHangModel.saveLichSuDonHang(id);
            console.log("Dữ liệu đơn hàng: ", JSON.stringify(donHangData, null, 2));

    
            await connection.commit();
            res.json({ message: 'Hủy đơn hàng thành công' });
    
        } catch (error) {
            await connection.rollback();
            console.error(error);
            res.status(500).json({ message: error.message });
        } finally {
            connection.release();
        }
    }
    
    async updateDonHang(req, res) {
        const { id } = req.params;
        const {  DiaChi ,HoTen, SoDienThoai } = req.body;
        const connection = await pool.getConnection();
    
        try {
            await connection.beginTransaction();
    
            const DonHang = await DonHangModel.getDonHangByDonHangId(id);
    
            if (!DonHang || DonHang.length === 0) {
                await connection.rollback();
                return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
            }
    
            const donHangData = DonHang[0]; // Lấy đơn hàng đầu tiên
            const trangThai = String(donHangData.TrangThai).trim();
    
            // Nếu đơn hàng đã bị hủy trước đó
            if (trangThai === 'Huy') {
                await connection.rollback();
                return res.status(400).json({ message: 'Đơn hàng đã bị hủy trước đó' });
            }
    
            if (trangThai === 'DaGiao') {
                await connection.rollback();
                return res.status(403).json({ message: 'Đơn hàng đã giao không thể cập nhật' });
            }
            // Hủy đơn hàng (cập nhật trạng thái thành 'Huy')
            await DonHangModel.updateDonHang(id, HoTen,SoDienThoai,DiaChi );

            await DonHangModel.saveLichSuDonHang(id);
    
            await connection.commit();
            res.json({ message: 'Cập nhật đơn hàng thành công' });
    
        } catch (error) {
            await connection.rollback();
            console.error(error);
            res.status(500).json({ message: error.message });
        } finally {
            connection.release();
        }
    }

    async getLichSuMuaHang(req, res) {
        const { id } = req.params;
        
        try {
            const data = await DonHangModel.getLichSuDonHang(id);
            if (data.length === 0) {
                return res.status(404).json({ message: 'Không có lịch sử mua hàng' });
            }
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi khi lấy lịch sử mua hàng', error });
        }
    }
}

module.exports = new DonHangController;
