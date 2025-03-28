const PhieuNhapKhoModel = require('../models/PhieuNhapKhoModel');
const pool = require('../utils/connectDB');

class PhieuNhapKhoController {

    // Lấy tất cả phiếu nhập
    async getAllPhieuNhap(req, res) {
        try {
            const data = await PhieuNhapKhoModel.getAll();
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi khi lấy danh sách phiếu nhập', error });
        }
    }

    // Lấy phiếu nhập theo ID
    async getPhieuNhapById(req, res) {
        const { id } = req.params;
        try {
            const data = await PhieuNhapKhoModel.getPhieuNhapById(id);
            if (data.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy phiếu nhập' });
            }
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi khi lấy phiếu nhập', error });
        }
    }

    // Tạo phiếu nhập
    async createPhieuNhap(req, res) {
        try {
            const newPhieuNhap = req.body;
            const result = await PhieuNhapKhoModel.createPhieuNhap(newPhieuNhap);
            res.status(201).json({ message: 'Tạo phiếu nhập thành công', ...result });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi khi tạo phiếu nhập', error });
        }
    }

    // Cập nhật phiếu nhập
    async updatePhieuNhap(req, res) {
        try {
            const { id } = req.params; // Lấy ID từ URL
            const updatedPhieuNhap = req.body; // Lấy dữ liệu từ request body
    
            const result = await PhieuNhapKhoModel.updatePhieuNhap(id, updatedPhieuNhap);
            
            res.status(200).json({ message: 'Cập nhật phiếu nhập thành công', ...result });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi khi cập nhật phiếu nhập', error });
        }
    }
    

    // Xóa phiếu nhập
    async deletePhieuNhap(req, res) {
        const { id } = req.params;
        try {
            const phieunhap = await PhieuNhapKhoModel.getPhieuNhapById(id);
    
            if (!phieunhap) { 
                return res.status(404).json({ message: 'Không tìm thấy phiếu nhập' });
            }
    
            if (phieunhap.TrangThai === 'DaNhap') { // Kiểm tra đúng thuộc tính của object
                return res.status(400).json({ message: 'Không thể xóa phiếu nhập đã nhập hàng' });
            }
    
            await PhieuNhapKhoModel.deletePhieuNhap(id);
            res.status(200).json({ message: 'Xóa phiếu nhập thành công' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi khi xóa phiếu nhập', error });
        }
    }
    

    async approvePhieuNhap (req, res)  {
    const { id } = req.params; // Lấy MaPhieuNhap từ request
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const phieuNhap = await PhieuNhapKhoModel.getPhieuNhapById(id);
        if (!phieuNhap) {
            await connection.rollback();
            return res.status(404).json({ message: 'Phiếu nhập không tồn tại' });
        }

        if (phieuNhap.TrangThai === 'DaNhap') {
            await connection.rollback();
            return res.status(400).json({ message: 'Phiếu nhập đã được duyệt trước đó' });
        }

        if (phieuNhap.TrangThai === 'Huy') {
            await connection.rollback();
            return res.status(400).json({ message: 'Phiếu nhập đã bị hủy trước đó' });
        }

        for (let item of phieuNhap.ChiTietPhieuNhaps) {
            await PhieuNhapKhoModel.updateSanPhamSoLuong(item.MaSP, item.SoLuong);
        }

        await PhieuNhapKhoModel.updateTrangThaiPhieuNhap(id, 'DaNhap');

        await connection.commit();
        res.json({ message: 'Phiếu nhập đã được duyệt thành công' });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi duyệt phiếu nhập' });
    } finally {
        connection.release();
    }

}

    async cancelPhieuNhap  (req, res) {
    const { id } = req.params;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const phieuNhap = await PhieuNhapKhoModel.getPhieuNhapById(id);
        if (!phieuNhap) {
            await connection.rollback();
            return res.status(404).json({ message: 'Phiếu nhập không tồn tại' });
        }

        if (phieuNhap.TrangThai === 'Huy') {
            await connection.rollback();
            return res.status(400).json({ message: 'Phiếu nhập đã bị hủy trước đó' });
        }

        if (phieuNhap.TrangThai === 'DaNhap') {
            // Nếu đã nhập hàng, cần trừ lại số lượng sản phẩm
            for (let item of phieuNhap.ChiTietPhieuNhaps) {
                await PhieuNhapKhoModel.updateSanPhamSoLuong(item.MaSP, -item.SoLuong, connection);
            }
        }

        await PhieuNhapKhoModel.updateTrangThaiPhieuNhap(id, 'Huy', connection);

        await connection.commit();
        res.json({ message: 'Phiếu nhập đã bị hủy thành công' });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi hủy phiếu nhập' });
    } finally {
        connection.release();
    }
}

async SearchPhieuNhapTrangThai(req, res) {
    const { TrangThai } = req.query;

    if (!TrangThai) {
        return res.status(400).json({ message: 'Thiếu trạng thái phiếu nhập' });
    }

    try {
        console.log('🟢 Trạng thái nhận được:', TrangThai);
        const data = await PhieuNhapKhoModel.searchPhieuNhapTrangThai(TrangThai);
        res.status(200).json(data);
    } catch (error) {
        console.error('🔴 Lỗi chi tiết:', error);  // Log lỗi đầy đủ
        res.status(500).json({ 
            message: 'Lỗi khi lấy danh sách phiếu nhập', 
            error: error.message,  // Trả về nội dung lỗi
            stack: error.stack  // Thêm stack trace để dễ debug
        });
    }
}




}

module.exports = new PhieuNhapKhoController;
