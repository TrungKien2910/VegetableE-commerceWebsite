<template>
    <footer>
        <div class="footer-container">
            <!-- Giới thiệu -->
            <div class="footer-column">
                <h3>Về Chúng Tôi</h3>
                <p>🌿 <strong></strong> Chuyên cung cấp rau củ quả sạch, tươi ngon từ trang trại đến tận tay khách hàng.</p>
                <p>📍 Địa chỉ: 14B Phan Văn Trị, Phường 7, Gò Vấp, TP.HCM</p>
            </div>

            <!-- Hỗ trợ khách hàng -->
            <div class="footer-column">
                <h3>Hỗ Trợ Khách Hàng</h3>
                <ul>
                    <li><a href="#">Chính sách giao hàng</a></li>
                    <li><a href="#">Hướng dẫn bảo quản rau củ</a></li>
                    <li><a href="#">Chính sách đổi trả</a></li>
                    <li><a href="#">Câu hỏi thường gặp</a></li>
                </ul>
            </div>

            <!-- Danh mục sản phẩm -->
            <div class="footer-column">
                <h3>Sản Phẩm</h3>
                <ul>
                    <li><a href="#">Rau hữu cơ</a></li>
                    <li><a href="#">Trái cây tươi</a></li>
                    <li><a href="#">Thực phẩm sạch</a></li>
                    <li><a href="#">Combo tiết kiệm</a></li>
                </ul>
            </div>

            <!-- Liên hệ -->
            <div class="footer-column">
                <h3>Liên Hệ</h3>
                <ul>
                    <li><a href="mailto:contact@organicfarm.com">📧 kiendo@organicfarm.com</a></li>
                    <li><a href="tel:0866712756">📞 0866-712-756</a></li>
                    <li><a href="#">📍 Xem trên Google Maps</a></li>
                </ul>
            </div>
        </div>
    </footer>
</template>

<style scoped>
footer {
    background-color: #2e7d32; /* Màu xanh lá nhẹ */
    color: #fff;
    padding: 40px 0;
    border-top: 4px solid #1b5e20; /* Màu xanh đậm */
    font-family: "Arial", sans-serif;
}

.footer-container {
    display: flex;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
    flex-wrap: wrap;
    gap: 20px;
}

.footer-column {
    flex: 1;
    min-width: 220px;
}

.footer-column h3 {
    font-size: 20px;
    margin-bottom: 15px;
    color: #c8e6c9; /* Màu xanh nhạt */
}

.footer-column p,
.footer-column a {
    font-size: 14px;
    line-height: 1.6;
    color: #fff;
}

.footer-column a {
    text-decoration: none;
    transition: color 0.3s ease-in-out;
}

.footer-column a:hover {
    color: #a5d6a7; /* Màu xanh sáng */
    text-decoration: underline;
}

ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

ul li {
    margin-bottom: 10px;
}

@media (max-width: 768px) {
    .footer-container {
        flex-direction: column;
        text-align: left;
    }

    .footer-column {
        width: 100%;
        margin-bottom: 20px;
    }
}
</style>
