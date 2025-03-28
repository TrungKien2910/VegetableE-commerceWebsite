const SP = require('../models/SanPhamModel');
const { upload, deleteImage } = require('../utils/upload');


class SanPhamController {

    async getAllSP(req, res) {
        try {
            const SanPham = await SP.getAll();
            const host = `${req.protocol}://${req.get('host')}`;
            const updatedLSanPham = SanPham.map(sp => ({
                ...sp,
                HinhAnh: sp.HinhAnh ? `${host}${sp.HinhAnh}` : null
            }));
            res.status(200).json(updatedLSanPham);
        }
        catch (error) {
            console.error("Lỗi khi lấy danh sách sản phẩm:", error);
            res.status(500).json({ message: "Lỗi hệ thống, vui lòng thử lại sau." });
                }
    }

   
    async createSP(req, res) {
        try {
            const {TenSP, GiaBan, SoLuong, MoTa, MaLoai, MaNCC} = req.body;
            const HinhAnh = req.file ? `/uploads/${req.file.filename}` : null;
            const check = await SP.checkSanPham(TenSP);
            if (check.length > 0) {
                if (HinhAnh) deleteImage(HinhAnh); 
                return res.status(400).json({message: 'Tên sản phẩm đã tồn tại'});
            }
            const newSP = {
                TenSP,
                GiaBan,
                SoLuong,
                MoTa,
                HinhAnh,
                MaLoai,
                MaNCC
            }
            const results = await SP.createSanPham(newSP);
            res.status(201).json("Tạo sản phẩm thành công");
        }
        catch (error) {
            console.error("Lỗi khi tạo sản phẩm:", error);
            res.status(500).json({ message: "Đã xảy ra lỗi khi tạo sản phẩm." });
                }
    }

    async updateSP(req, res) {
        try {
            const id = req.params.id;
            if (!id) return res.status(400).json({ message: "Thiếu ID sản phẩm" });
    
            const { TenSP, GiaBan, SoLuong, MoTa, MaLoai, MaNCC } = req.body;
            let HinhAnhMoi = req.file ? `/uploads/${req.file.filename}` : null;
    
            // Lấy thông tin sản phẩm hiện tại
            const spHienTai = await SP.getSanPhamById(id);
            if (!spHienTai) {
                if (HinhAnhMoi) deleteImage(HinhAnhMoi);
                return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
            }
    
            // Kiểm tra trùng lặp tên sản phẩm (không được trùng với sản phẩm khác)
            const spTonTai = await SP.checkSanPham(TenSP);
            if (spTonTai.length > 0 && spTonTai[0].MaSP !== Number(id)) {
                if (HinhAnhMoi) deleteImage(HinhAnhMoi);
                return res.status(400).json({ message: "Tên sản phẩm đã tồn tại" });
            }
    
            // Kiểm tra xem có cần cập nhật ảnh không
            let HinhAnhCapNhat = spHienTai[0].HinhAnh;
            if (HinhAnhMoi !== null) { 
                if (HinhAnhCapNhat) deleteImage(HinhAnhCapNhat); // Xóa ảnh cũ nếu có ảnh mới
                HinhAnhCapNhat = HinhAnhMoi;
            }
    
            // Chuẩn bị dữ liệu cập nhật
            const spData = {
                TenSP: TenSP !== undefined ? TenSP : spHienTai[0].TenSP,
                GiaBan: GiaBan !== undefined ? GiaBan : spHienTai[0].GiaBan,
                SoLuong: SoLuong !== undefined ? SoLuong : spHienTai[0].SoLuong,
                MoTa: MoTa !== undefined ? MoTa : spHienTai[0].MoTa,
                HinhAnh: HinhAnhCapNhat,
                MaLoai: MaLoai !== undefined ? MaLoai : spHienTai[0].MaLoai,
                MaNCC: MaNCC !== undefined ? MaNCC : spHienTai[0].MaNCC
            };
    
            // Cập nhật sản phẩm vào CSDL
            await SP.updateSanPham(id, spData);
    
            res.status(200).json({ message: "Cập nhật sản phẩm thành công", sanPham: spData });
        } catch (error) {
            console.error("Lỗi khi cập nhật sản phẩm:", error);
            res.status(500).json({ message: "Đã xảy ra lỗi khi cập nhật sản phẩm" });
        }
    }
    

    async deleteSP(req, res) {
        try {
            const id = req.params.id;
            if (!id) return res.status(400).json({ message: "Thiếu ID sản phẩm" });
            
                        // Lấy thông tin loại sản phẩm từ CSDL
                        const existingSP = await SP.getSanPhamById(id);
                        if (!existingSP || existingSP.length === 0) {
                            return res.status(404).json({ message: " sản phẩm không tồn tại" });
                        }    
                        // Xóa ảnh nếu có
                        if (existingSP[0].HinhAnh) {
                            deleteImage(existingSP[0].HinhAnh);
                        }                
                        const results = await SP.deleteSanPham(id);
            res.status(200).json("Xóa thành công");
        }
        catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
            res.status(500).json({ message: "Lỗi hệ thống, vui lòng thử lại sau." });
                }
    }

    async getSPById(req, res) {
        try {
            const id = req.params.id;
            const sanpham = await SP.getSanPhamById(id);
            const host = `${req.protocol}://${req.get('host')}`;
            const updatedLSanPham = sanpham.map(sp => ({
                ...sp,
                HinhAnh: sp.HinhAnh ? `${host}${sp.HinhAnh}` : null
            }));
            res.status(200).json(updatedLSanPham);
        }
        catch (error) {
            console.error("Lỗi khi lấy thông tin sản phẩm:", error);
            res.status(500).json({ message: "Đã xảy ra lỗi khi lấy thông tin sản phẩm" });
                }
    }


}

module.exports = new SanPhamController;