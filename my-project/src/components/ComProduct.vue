<template>
    <main>
      <div class="menu">
        <h2 class="menu-title">{{ product.TenSP }}</h2>
        <div class="menu-carousel">
          <div class="menu-item">
            <router-link :to="{ name: 'ProductDetail', params: { id: product.MaSP } }" class="product-link">
              <!-- Sử dụng defaultImage nếu ảnh sản phẩm bị lỗi -->
              <img :src="product.HinhAnh || defaultImage" alt="Product Image" class="product-image" @error="handleImageError" />
              <div class="menu-item-info">
                <h3 class="product-name">{{ product.TenSP }}</h3>
                <p class="product-description" v-if="product.MoTa">{{ product.MoTa.slice(0, 100) }}...</p>
                <p class="product-price">{{ product.GiaBan }}</p>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </main>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    props: ['product'],
    setup() {
      const defaultImage = ref('https://as1.ftcdn.net/v2/jpg/04/29/42/42/1000_F_429424279_dokEFwnSoJeOKpqvV1ttXum8piESsF5L.jpg');
  
      const handleImageError = (event) => {
        event.target.src = defaultImage.value;
      };
  
      return {
        defaultImage,
        handleImageError,
      };
    },
  };
  </script>
<style scoped>
/* Căn chỉnh tổng thể */
.menu {
    text-align: center;
    padding: 40px 20px;
    background-color: #f4f4f9;
    /* Light background to reduce harshness */
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    /* Light shadow for depth */
}

/* Tiêu đề */
.menu-title {
    font-size: 2rem;
    margin-bottom: 20px;
    color: #333;
    /* Dark text for clarity */
    font-weight: bold;
}

/* Bố cục danh sách sản phẩm */
.menu-carousel {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
    /* Wrap the products nicely */
    padding-top: 10px;
}

/* Sản phẩm */
.menu-item {
    position: relative;
    flex: 0 0 280px;
    /* Fixed width */
    max-width: 100%;
    border-radius: 12px;
    background-color: #ffffff;
    /* White background */
    overflow: hidden;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
    /* Subtle shadow effect */
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Hover effect for product */
.menu-item:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.15);
    /* Deeper shadow on hover */
}

/* Hình ảnh */
.product-image {
    width: 100%;
    height: 220px;
    /* Fixed height for images */
    object-fit: cover;
    /* Maintain aspect ratio */
    transition: transform 0.3s ease-in-out;
}

.menu-item:hover .product-image {
    transform: scale(1.1);
    /* Slight zoom on hover */
}

/* Thông tin sản phẩm */
.menu-item-info {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5));
    color: #ffffff;
    text-align: left;
    padding: 15px;
    opacity: 0;
    transform: translateY(100%);
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.menu-item:hover .menu-item-info {
    opacity: 1;
    transform: translateY(0);
    /* Show product details on hover */
}

/* Tên sản phẩm */
.product-name {
    font-size: 1.2rem;
    font-weight: bold;
    color: #ff6600;
    /* Bright accent color */
    margin: 0 0 8px;
}

/* Mô tả */
.product-description {
    font-size: 16px;
    color: #666;
    /* Softer text color */
    line-height: 1.5;
    text-align: justify;
    max-width: 800px;
    margin: 0 auto;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    /* Limit to 2 lines */
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Giá sản phẩm */
.product-price {
    font-size: 1.1rem;
    font-weight: bold;
    color: #f77f00;
    /* Warm orange for price */
    margin: 0;
}

/* Link sản phẩm */
.product-link {
    text-decoration: none;
}
</style>
