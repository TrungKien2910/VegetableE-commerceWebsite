const NhaCungCap = require('../models/NhaCungCapModel');
const { upload, deleteImage } = require('../utils/upload');


class NhaCungCapController {

    async getAllNhaCungCap(req, res) {
        try {
            const nhaCungCap = await NhaCungCap.getAll();

            if (!nhaCungCap || nhaCungCap.length === 0) {
                return res.status(404).json({ message: "Không tìm thấy nhà cung cấp nào" });
            }

            const host = `${req.protocol}://${req.get('host')}`;

            const updatedNhaCungCap = nhaCungCap.map(ncc => ({
                ...ncc,
                HinhAnh: ncc.HinhAnh ? `${host}${ncc.HinhAnh}` : null
            }));

            res.status(200).json(updatedNhaCungCap);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách nhà cung cấp:", error);
            res.status(500).json({ message: "Đã xảy ra lỗi khi lấy danh sách nhà cung cấp" });
        }
    }
    
    async createNhaCungCap(req, res) {
        try {
            const { TenNCC, SoDienThoai, Email, DiaChi } = req.body;
            const HinhAnh = req.file ? `/uploads/${req.file.filename}` : null;

            // Kiểm tra dữ liệu đầu vào
            if (!TenNCC || !SoDienThoai || !Email || !DiaChi) {
                if (HinhAnh) deleteImage(HinhAnh); // Xóa ảnh nếu đã tải lên
                return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin nhà cung cấp' });
            }

            // Kiểm tra nhà cung cấp đã tồn tại chưa
            const nhaCungCapTonTai = await NhaCungCap.checkNhaCungCap(TenNCC, Email, SoDienThoai, -1);
            if (nhaCungCapTonTai.length > 0) {
                if (HinhAnh) deleteImage(HinhAnh);
                return res.status(400).json({ message: 'Nhà cung cấp đã tồn tại hoặc số điện thoại hoặc email đã tồn tại' });
            }

            // Tạo nhà cung cấp mới
            const newNhaCungCap = { TenNCC, SoDienThoai, Email, DiaChi, HinhAnh };
            const createdNhaCungCap = await NhaCungCap.createNhaCungCap(newNhaCungCap);

            res.status(201).json({
                message: 'Tạo nhà cung cấp thành công',
                nhacungcap: { id: createdNhaCungCap.insertId, ...newNhaCungCap }
            });
        } catch (error) {
            console.error("Lỗi khi tạo nhà cung cấp:", error);
            res.status(500).json({ message: "Đã xảy ra lỗi khi tạo nhà cung cấp" });
        }
    }

    async updateNhaCungCap(req, res) {
        try {
            const id = req.params.id;
            if (!id) return res.status(400).json({ message: "Thiếu ID nhà cung cấp" });
    
            const { TenNCC, SoDienThoai, Email, DiaChi } = req.body;
            let HinhAnhMoi = req.file ? `/uploads/${req.file.filename}` : null;
    console.log(HinhAnhMoi);
            // Lấy thông tin nhà cung cấp hiện tại
            const nhaCungCapHienTai = await NhaCungCap.getNhaCungCapById(id);
            if (!nhaCungCapHienTai) {
                if (HinhAnhMoi) deleteImage(HinhAnhMoi); // Xóa ảnh nếu đã upload nhưng không tìm thấy NCC
                return res.status(404).json({ message: "Không tìm thấy nhà cung cấp" });
            }
    
            // Kiểm tra trùng lặp (không được trùng với nhà cung cấp khác)
            const nhaCungCapTonTai = await NhaCungCap.checkNhaCungCap(TenNCC, Email, SoDienThoai, id);
            if (nhaCungCapTonTai.length > 0) {
                if (HinhAnhMoi) deleteImage(HinhAnhMoi); // Xóa ảnh nếu bị trùng lặp
                return res.status(400).json({ message: "Nhà cung cấp đã tồn tại hoặc số điện thoại hoặc email đã tồn tại" });
            }

    
            // Kiểm tra xem có cần cập nhật ảnh không
            let HinhAnhCapNhat = nhaCungCapHienTai[0].HinhAnh; // Giữ nguyên ảnh cũ mặc định
            if (HinhAnhMoi !== null) { 
                if (HinhAnhCapNhat) deleteImage(HinhAnhCapNhat); // Nếu có ảnh mới, xóa ảnh cũ
                HinhAnhCapNhat = HinhAnhMoi; // Cập nhật ảnh mới
            }
    
            // Chuẩn bị dữ liệu cập nhật
            const supplierData = {
                TenNCC: TenNCC !== undefined ? TenNCC : nhaCungCapHienTai.TenNCC,
            SoDienThoai: SoDienThoai !== undefined ? SoDienThoai : nhaCungCapHienTai.SoDienThoai,
            Email: Email !== undefined ? Email : nhaCungCapHienTai.Email,
            DiaChi: DiaChi !== undefined ? DiaChi : nhaCungCapHienTai.DiaChi,
            HinhAnh: HinhAnhCapNhat
            };
    
            // Cập nhật vào CSDL
            await NhaCungCap.updateNhaCungCap(id, supplierData);
    
            res.status(200).json({ message: "Cập nhật thành công", nhacungcap: supplierData });
        } catch (error) {
            console.error("Lỗi khi cập nhật nhà cung cấp:", error);
            res.status(500).json({ message: "Đã xảy ra lỗi khi cập nhật nhà cung cấp" });
        }
    }
    
    

    async deleteNhaCungCap(req, res) {
        try {
            const id = req.params.id;
            if (!id) return res.status(400).json({ message: "Thiếu ID nhà cung cấp" });

            // Lấy thông tin nhà cung cấp từ CSDL
            const nhaCungCap = await NhaCungCap.getNhaCungCapById(id);
            if (!nhaCungCap) {
                return res.status(404).json({ message: "Không tìm thấy nhà cung cấp" });
            }
            console.log("🛠 Đường dẫn ảnh trước khi xóa:", nhaCungCap[0].HinhAnh);

            // Xóa ảnh nếu có
            if (nhaCungCap[0].HinhAnh) {
                deleteImage(nhaCungCap[0].HinhAnh);
            }

            // Xóa nhà cung cấp khỏi CSDL
            await NhaCungCap.deleteNhaCungCap(id);

            res.status(200).json({ message: "Xóa nhà cung cấp thành công" });
        } catch (error) {
            console.error("Lỗi khi xóa nhà cung cấp:", error);
            res.status(500).json({ message: "Đã xảy ra lỗi khi xóa nhà cung cấp" });
        }
    }

    async getNhaCungCapById(req, res) {
        try {
            const id = req.params.id;
            const nhacungcap = await NhaCungCap.getNhaCungCapById(id);

              // Thêm đường dẫn đầy đủ cho ảnh
              const host = `${req.protocol}://${req.get('host')}`; // Lấy domain của API
              const updatedNhaCungCap = nhacungcap.map(ncc => ({
                  ...ncc,
                  HinhAnh: ncc.HinhAnh ? `${host}${ncc.HinhAnh}` : null
              }));
      
              res.status(200).json(updatedNhaCungCap);
        }
        catch (error) {
            console.error("Lỗi khi lấy thông tin nhà cung cấp:", error);
            res.status(500).json({ message: "Đã xảy ra lỗi khi lấy thông tin nhà cung cấp" });      
          }
    }


}

module.exports = new NhaCungCapController;
module.exports.upload = upload;
