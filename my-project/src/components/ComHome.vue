<template>
  <div class="home-container">
    <div class="product-category">
      <h2 class="category-title">Sản Phẩm Mới Nhất</h2>
      <ComProductHome :products="newProducts" />
    </div>

    <div class="product-category">
      <h2 class="category-title">Sản Phẩm Bán Chạy</h2>
      <ComProductHome :products="bestSellingProducts" />
    </div>

    <div class="product-category">
      <h2 class="category-title">Sản Phẩm Khuyến Mãi</h2>
      <ComProductHome :products="discountedProducts" />
    </div>
  </div>
</template>

<script>
import ComProductHome from '@/components/ComProductHome.vue';

export default {
  components: {
    ComProductHome
  },
  data() {
    return {
      newProducts: [],
      bestSellingProducts: [],
      discountedProducts: []
    };
  },
  mounted() {
    fetch("http://localhost:3000/sanpham")
      .then((response) => response.json())
      .then((data) => {
        this.newProducts = data.slice(0, 8);
        this.bestSellingProducts = data.slice(8, 16);
        this.discountedProducts = data.slice(16, 24);
      })
      .catch((error) => console.error("Lỗi tải dữ liệu:", error));
  }
};
</script>

<style>
/* Đặt nền cho toàn trang */
html, body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #f3f9f6, #edf3ee);
  background-attachment: fixed;
  font-family: 'Roboto', sans-serif;
}

/* Nếu có element bao ngoài toàn trang (ví dụ: #app) */
#app {
  min-height: 100vh;
}

/* Container chính luôn full width theo trình duyệt */
.home-container {
  width: 100%;
  padding: 40px 20px;
  background: transparent;
  border-radius: 0;
  box-shadow: none;
}

/* Các style bên trong trang home */
.product-category {
  margin-bottom: 60px;
}

.category-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2e7d32;
  margin-bottom: 30px;
  text-align: center;
  letter-spacing: 1px;
  text-transform: capitalize;
  position: relative;
}

.category-title::after {
  content: "";
  display: block;
  width: 80px;
  height: 3px;
  background-color: #388e3c;
  margin: 10px auto 0;
  border-radius: 2px;
}

/* Thay đổi từ cuộn ngang sang dạng lưới */
.product-list {
  display: flex;
  /* Cho phép xuống dòng khi hết chỗ */
  flex-wrap: wrap;
  /* Khoảng cách giữa các sản phẩm */
  gap: 25px;
  /* Canh giữa các item nếu muốn */
  justify-content: center;
  padding-bottom: 20px;
  /* Bỏ các thuộc tính scroll ngang */
  /* overflow-x: auto; */
  /* scroll-snap-type: x mandatory; */
  /* scroll-padding: 20px; */
  /* Bỏ scrollbar ngang */
  scrollbar-width: none; /* Ẩn scrollbar Firefox */
}
.product-list::-webkit-scrollbar {
  display: none; /* Ẩn scrollbar Chrome, Safari, Edge */
}

/* Mỗi item hiển thị khung viền xanh lá, nền trắng */
.product-list .menu-item {
  width: 220px; /* hoặc 300px tùy ý */
  background: #fff; 
  border: 2px solid #b2ddb2; /* Viền xanh lá nhạt */
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  /* Thêm padding để nội dung có khoảng trống */
  padding: 20px;
  text-align: center;
}

/* Hiệu ứng hover */
.product-list .menu-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
.menu-item {
  padding: 10px 20px;
  margin-left: 10px;
  border: none;
  background-color: #fcfafa;
  color: white;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
}

.menu-item:hover {
  background-color: #ff8a75;
}

/* Responsive */
@media (max-width: 768px) {
  .category-title {
    font-size: 1.8rem;
  }
  .product-list .menu-item {
    width: 200px; /* Thu nhỏ nếu muốn */
  }
}

@media (max-width: 480px) {
  .category-title {
    font-size: 1.5rem;
  }
  .product-list .menu-item {
    width: 100%;
  }
}
</style>
