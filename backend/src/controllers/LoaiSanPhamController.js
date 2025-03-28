const LoaiSP = require('../models/LoaiSanPhamModel');
const { upload, deleteImage } = require('../utils/upload');

class LoaiSanPhamController {

    async getAllLoaiSP(req, res) {
        try {
            const LoaiSPs = await LoaiSP.getAll();
            const host = `${req.protocol}://${req.get('host')}`;
            const updatedLoaiSPs = LoaiSPs.map(lsp => ({
                ...lsp,
                HinhAnh: lsp.HinhAnh ? `${host}${lsp.HinhAnh}` : null
            }));
            res.status(200).json(updatedLoaiSPs);
        }
        catch (error) {
            console.error("Lỗi khi lấy danh sách loại sản phẩm:", error);
            res.status(500).json({ message: "Lỗi server khi lấy danh sách loại sản phẩm", error: error.message });
                }
    }

   
    async createLoaiSP(req, res) {
        try {
            const {TenLoai} = req.body;
            const HinhAnh = req.file ? `/uploads/${req.file.filename}` : null;
            const LoaiSPs = await LoaiSP.checkLoaiSP(TenLoai);
            if (LoaiSPs.length > 0) {
                if (HinhAnh) deleteImage(HinhAnh); 
                return res.status(400).json({ message: 'Tên loại sản phẩm đã tồn tại' });
            }
            const newLoaiSP = {
                TenLoai,
                HinhAnh
            }
            const results = await LoaiSP.createLoaiSP(newLoaiSP);
            res.status(201).json({ message: "Tạo loại sản phẩm thành công" });
        }
        catch (error) {
            console.error("Lỗi khi tạo loại sản phẩm:", error);
            res.status(500).json({ message: "Lỗi server khi tạo loại sản phẩm", error: error.message });
        }
    }

    async updateLoaiSP(req, res) {
        try {
            const id = req.params.id;
            if (!id) return res.status(400).json({ message: "Thiếu ID loại sản phẩm" });
    
            const { TenLoai } = req.body;
            let HinhAnhMoi = req.file ? `/uploads/${req.file.filename}` : null;
    
            // Lấy thông tin loại sản phẩm hiện tại
            const loaiSPHienTai = await LoaiSP.getLoaiSPsById(id);
            if (!loaiSPHienTai) {
                if (HinhAnhMoi) deleteImage(HinhAnhMoi); // Xóa ảnh nếu đã upload nhưng không tìm thấy loại SP
                return res.status(404).json({ message: "Không tìm thấy loại sản phẩm" });
            }
    
            // Kiểm tra trùng lặp tên loại sản phẩm (không được trùng với loại khác)
            const loaiSPTonTai = await LoaiSP.checkLoaiSP(TenLoai);
            if (loaiSPTonTai.length > 0 && loaiSPTonTai[0].MaLoai !== Number(id)) {
                if (HinhAnhMoi) deleteImage(HinhAnhMoi);
                    return res.status(400).json({ message: "Tên loại sản phẩm đã tồn tại" });
                }

    
            // Kiểm tra xem có cần cập nhật ảnh không
            let HinhAnhCapNhat = loaiSPHienTai[0].HinhAnh; // Giữ nguyên ảnh cũ mặc định
            if (HinhAnhMoi !== null) { 
                if (HinhAnhCapNhat) deleteImage(HinhAnhCapNhat); // Nếu có ảnh mới, xóa ảnh cũ
                HinhAnhCapNhat = HinhAnhMoi; // Cập nhật ảnh mới
            }
    
            // Chuẩn bị dữ liệu cập nhật
            const loaiSPData = {
                TenLoai: TenLoai !== undefined ? TenLoai : loaiSPHienTai[0].TenLoai,
                HinhAnh: HinhAnhCapNhat
            };
    
            // Cập nhật vào CSDL
            await LoaiSP.updateLoaiSP(id, loaiSPData);
    
            res.status(200).json({ message: "Cập nhật thành công", loaiSP: loaiSPData });
        } catch (error) {
            console.error("Lỗi khi cập nhật loại sản phẩm:", error);
            res.status(500).json({ message: "Đã xảy ra lỗi khi cập nhật loại sản phẩm" });
        }
    }
    

    async deleteLoaiSP(req, res) {
        try {
            const id = req.params.id;
            if (!id) return res.status(400).json({ message: "Thiếu ID loại sản phẩm" });
    
            // Lấy thông tin loại sản phẩm từ CSDL
            const existingLoaiSP = await LoaiSP.getLoaiSPsById(id);
            if (!existingLoaiSP || existingLoaiSP.length === 0) {
                return res.status(404).json({ message: "Loại sản phẩm không tồn tại" });
            }    
            // Xóa ảnh nếu có
            if (existingLoaiSP[0].HinhAnh) {
                deleteImage(existingLoaiSP[0].HinhAnh);
            }
    
            // Xóa loại sản phẩm khỏi CSDL
            await LoaiSP.deleteLoaiSP(id);
    
            res.status(200).json({ message: "Xóa loại sản phẩm thành công" });
        } catch (error) {
            console.error("Lỗi khi xóa loại sản phẩm:", error);
            res.status(500).json({ message: "Đã xảy ra lỗi khi xóa loại sản phẩm" });
        }
    }

    async getLoaiSPById(req, res) {
        try {
            const id = req.params.id;
            const loaisp = await LoaiSP.getLoaiSPsById(id);
            if (!loaisp || loaisp.length === 0) {
                return res.status(404).json({ message: "Loại sản phẩm không tồn tại" });
            }
            // Thêm đường dẫn đầy đủ cho ảnh
            const host = `${req.protocol}://${req.get('host')}`; // Lấy domain của API
            const updatedloaisp = loaisp.map(loaisp1 => ({
                ...loaisp1,
                HinhAnh: loaisp1.HinhAnh ? `${host}${loaisp1.HinhAnh}` : null
            }));
    
            res.status(200).json(updatedloaisp);
        }
        catch (error) {
            console.error("Lỗi khi lấy loại sản phẩm theo ID:", error);
            res.status(500).json({ message: "Lỗi server khi lấy loại sản phẩm theo ID", error: error.message });
                }
    }

    


}

module.exports = new LoaiSanPhamController;
module.exports.upload = upload;
