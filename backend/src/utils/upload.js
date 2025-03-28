const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Cấu hình Multer để lưu ảnh vào thư mục uploads/
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'uploads/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Middleware upload ảnh
const upload = multer({ storage: storage });

// Hàm xóa ảnh
const deleteImage = (imagePath) => {
    if (!imagePath) {
        console.error("Lỗi: Không có đường dẫn ảnh để xóa.");
        return;
    }

    // Bỏ dấu `/` ở đầu nếu có
    let normalizedPath = imagePath.startsWith("/") ? imagePath.substring(1) : imagePath;

    // Đảm bảo đường dẫn ảnh nằm trong thư mục `backend/uploads/`
    let filePath = path.join(__dirname, "..", "..", normalizedPath);

    console.log("🛠 Image path nhận vào:", imagePath);
    console.log("🛠 Đường dẫn thực tế:", filePath);

    // Kiểm tra file có tồn tại không trước khi xóa
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.warn("⚠ Ảnh không tồn tại hoặc đã bị xóa:", filePath);
            return;
        }

        // Nếu file tồn tại, thực hiện xóa
        fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
                console.error("❌ Lỗi khi xóa ảnh:", unlinkErr);
            } else {
                console.log("✅ Ảnh đã được xóa thành công:", filePath);
            }
        });
    });
};


module.exports = { upload, deleteImage };
