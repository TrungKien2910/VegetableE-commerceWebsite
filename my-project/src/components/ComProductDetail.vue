  <template>
  <main>
    <div class="menu" v-if="product">
      <h2 class="menu-title">{{ product.TenSP }}</h2>

      <div class="menu-item">
        <div class="menu-item-image-wrapper">
          <img :src="product.HinhAnh" alt="Product Image" class="menu-item-image" @error="handleImageError" />
        </div>

        <div class="menu-item-info">
          <h3 class="product-name">{{ product.TenSP }}</h3>
          <p class="product-price">{{ formatPrice(product.GiaBan) }}</p>

          <button class="order-button" v-if="product.SoLuong > 0" @click="addToCart">
            Đặt hàng
          </button>
          <p class="out-of-stock" v-else>Hết hàng</p>
        </div>

        <div class="product-description-wrapper">
          <p class="product-description">{{ product.MoTa || "Không có mô tả" }}</p>
        </div>
      </div>
    </div>

    <p v-else class="error-message">Không tìm thấy sản phẩm</p>
  </main>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const defaultImage = ref('https://as1.ftcdn.net/v2/jpg/04/29/42/42/1000_F_429424279_dokEFwnSoJeOKpqvV1ttXum8piESsF5L.jpg');
const product = ref(null);
const route = useRoute();

// Hàm xử lý ảnh lỗi
const handleImageError = (event) => {
  event.target.src = defaultImage.value;
};

// Hàm format giá tiền
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
};

// Hàm gọi API để lấy thông tin sản phẩm
const fetchProductDetail = async () => {
  try {
    const productId = route.params.id;
    const res = await fetch(`http://localhost:3000/sanpham/${productId}`);
    const data = await res.json();
    product.value = data[0];
  } catch (error) {
    console.error("Lỗi tải sản phẩm:", error);
  }
};

// Gọi API khi component được mount
onMounted(fetchProductDetail);

// Thêm sản phẩm vào giỏ hàng
const addToCart = () => {
  if (!product.value) return;

  // Lấy giỏ hàng từ localStorage (nếu có)
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
  const existingProduct = cart.find((item) => item.MaSP === product.value.MaSP);

  if (existingProduct) {
    if (existingProduct.quantity < product.value.SoLuong) { // Kiểm tra tồn kho
      existingProduct.quantity += 1;
      alert(`Đã thêm ${product.value.TenSP} vào giỏ hàng!`);
    } else {
      alert(`Không thể thêm quá ${product.value.SoLuong} sản phẩm vào giỏ hàng!`);
    }
  } else {
    if (product.value.SoLuong > 0) {
      cart.push({ ...product.value, quantity: 1 });
      alert(`Đã thêm ${product.value.TenSP} vào giỏ hàng!`);
    } else {
      alert(`Sản phẩm ${product.value.TenSP} đã hết hàng!`);
    }
  }

  // Lưu lại giỏ hàng vào localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
};


</script>



<style scoped>
/* General styling */
.menu {
  text-align: center;
  padding: 40px 20px;
  background-color: #f8f8f8;
  font-family: 'Roboto', sans-serif;
}

.menu-title {
  font-size: 36px;
  font-weight: bold;
  color: #8b0000;
  margin-bottom: 20px;
}

/* Product item layout */
.menu-item {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  justify-content: center;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  margin-bottom: 20px;
  transition: transform 0.3s ease;
}

.menu-item:hover {
  transform: scale(1.05);
}

/* Image section */
.menu-item-image-wrapper {
  width: 40%;
  max-width: 300px;
}

.menu-item-image {
  width: 100%;
  border-radius: 15px;
  object-fit: cover;
}

/* Product info section */
.menu-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
}

.product-name {
  font-size: 28px;
  font-weight: bold;
  color: #333;
}

.product-price {
  font-size: 24px;
  font-weight: bold;
  color: #ff5722;
}

.order-button {
  padding: 12px 25px;
  background-color: #8b0000;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s, box-shadow 0.3s;
}

.order-button:hover {
  background-color: #6d0000;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.out-of-stock {
  font-size: 16px;
  font-weight: bold;
  color: #b22222;
}

/* Description section */
.product-description-wrapper {
  margin-top: 20px;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.product-description {
  font-size: 16px;
  color: #555;
  line-height: 1.5;
  text-align: justify;
  max-width: 800px;
  margin: 0 auto;
}

/* Responsive design */
@media (max-width: 768px) {
  .menu-item {
    flex-direction: column;
    text-align: center;
  }

  .menu-item-image-wrapper {
    width: 100%;
  }

  .menu-item-info {
    align-items: center;
  }
}
</style>


<style scoped>
/* General styling */
.menu {
  text-align: center;
  padding: 40px 20px;
  background-color: #f8f8f8;
  font-family: 'Roboto', sans-serif;
}

.menu-title {
  font-size: 36px;
  font-weight: bold;
  color: #8b0000;
  margin-bottom: 20px;
}

/* Product item layout */
.menu-item {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  justify-content: center;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  margin-bottom: 20px;
  transition: transform 0.3s ease;
}

.menu-item:hover {
  transform: scale(1.05);
}

/* Image section */
.menu-item-image-wrapper {
  width: 40%;
  max-width: 300px;
}

.menu-item-image {
  width: 100%;
  border-radius: 15px;
  object-fit: cover;
}

/* Product info section */
.menu-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
}

.product-name {
  font-size: 28px;
  font-weight: bold;
  color: #333;
}

.product-price {
  font-size: 24px;
  font-weight: bold;
  color: #ff5722;
}

.order-button {
  padding: 12px 25px;
  background-color: #8b0000;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s, box-shadow 0.3s;
}

.order-button:hover {
  background-color: #6d0000;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.out-of-stock {
  font-size: 16px;
  font-weight: bold;
  color: #b22222;
}

/* Description section */
.product-description-wrapper {
  margin-top: 20px;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.product-description {
  font-size: 16px;
  color: #555;
  line-height: 1.5;
  text-align: justify;
  max-width: 800px;
  margin: 0 auto;
}

/* Responsive design */
@media (max-width: 768px) {
  .menu-item {
    flex-direction: column;
    text-align: center;
  }

  .menu-item-image-wrapper {
    width: 100%;
  }

  .menu-item-info {
    align-items: center;
  }
}
</style>
