<template>
  <div class="checkout-container">
    <h2>HÓA ĐƠN</h2>
    <div v-if="hoadon.length === 0">
      <p>Không có sản phẩm nào hết.</p>
    </div>
    <div v-else class="checkout-content">
      <!-- Product Info Section -->
      <div class="product-info">
        <table class="invoice-table">
          <thead>
            <tr>
              <th>IMAGE</th>
              <th>PRODUCT</th>
              <th>PRICE</th>
              <th>QUANTITY</th>
              <th>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in hoadon" :key="item.MaSP">
              <td><img :src="item.HinhAnh" class="product-image" alt="product" /></td>
              <td>{{ item.TenSP }}</td>
              <td>{{ parseFloat(item.GiaBan).toLocaleString() }} VND</td>
              <td>{{ item.quantity }}</td>
              <td>{{ (parseFloat(item.GiaBan) * item.quantity).toLocaleString() }} VND</td>
            </tr>
          </tbody>
        </table>
        <p class="total-price">Total: {{ totalPrice.toLocaleString() }} VND</p>
      </div>

      <!-- Customer Info Section -->
      <div class="user-info">
        <h3>Nhập thông tin của bạn</h3>
        <form>
          <div class="form-group">
            <label for="name">Họ tên</label>
            <input type="text" v-model="user.name" id="name" required placeholder="Nhập tên" />
          </div>
          <div class="form-group">
            <label for="phone">Số điện thoại</label>
            <input type="tel" v-model="user.phone" id="phone" required placeholder="Nhập số điện thoại" />
          </div>
          <div class="form-group">
            <label for="address">Địa chỉ</label>
            <input type="text" v-model="user.address" id="address" required placeholder="Nhập địa chỉ" />
          </div>

         <!-- Payment Buttons -->
<div class="payment-options">
  <button @click="confirmOrder('DaThanhToan')" class="confirm-btn">Thanh toán ngay</button>
  <button @click="confirmOrder('ChuaThanhToan')" class="confirm-btn later">Thanh toán sau</button>
</div>

        </form>
      </div>
    </div>

    <!-- Back to Cart Button -->
    <div class="back-to-cart">
      <button @click="goToCart" class="back-btn">Quay trở lại giỏ hàng</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const hoadon = ref([]);
    const user = ref({
      name: "",
      phone: "",
      address: "",
    });

    // Nhận dữ liệu từ route query
    onMounted(() => {
      if (route.query.items) {
        hoadon.value = JSON.parse(route.query.items);
      }
    });

    // Tính tổng tiền
    const totalPrice = computed(() => {
      return hoadon.value.reduce((total, item) => total + parseFloat(item.GiaBan) * item.quantity, 0);
    });

    // Xử lý thanh toán
    const confirmOrder = async (paymentStatus) => {

      if (!user.value.name.trim() || !/^\d{10}$/.test(user.value.phone) || !user.value.address.trim()) {
  alert("Vui lòng nhập đầy đủ thông tin hợp lệ!");
  return;
}


  const orderData = {
    MaKH: route.params.MaKH,
    TenKH: user.value.name,
    SoDienThoai: user.value.phone,
    DiaChi: user.value.address,
    ThanhToan: paymentStatus, // "DaThanhToan" hoặc "ChuaThanhToan"
    ChiTietDonHangs: hoadon.value.map(item => ({
      MaSP: item.MaSP,
      SoLuong: item.quantity,
      DonGia: parseFloat(item.GiaBan),
    })),
  };

  try {
    const response = await fetch("http://localhost:3000/donhang", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
    const responseData = await response.json(); // Lấy nội dung phản hồi


    if (response.ok) {
      alert("Đặt hàng thành công!");

      // Xóa các sản phẩm đã mua khỏi localStorage
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const updatedCart = cart.filter(cartItem =>
        !hoadon.value.some(orderedItem => orderedItem.MaSP === cartItem.MaSP)
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      router.push("/");

    } else {
      alert(`Đặt hàng thất bại! Lỗi: ${responseData.message || "Không rõ nguyên nhân."}`);
      console.error("Lỗi từ server:", responseData);
      
    }
  } catch (error) {
    console.error("Lỗi khi gửi đơn hàng:", error);
    alert("Đã xảy ra lỗi khi đặt hàng!");
  }
};


    // Quay về giỏ hàng
    const goToCart = () => {
      router.push("/cart");
    };

    return { hoadon, user, totalPrice, confirmOrder, goToCart };
  },
};
</script>

<style scoped>
/* Styles for the container */
.checkout-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  max-width: 1100px;
  margin: 30px auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 24px;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

.checkout-content {
  display: flex;
  justify-content: space-between;
  gap: 30px;
}

/* Product Info Section */
.product-info {
  flex: 1;
}

.invoice-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  text-align: center;
}

.invoice-table th,
.invoice-table td {
  padding: 12px;
  border-bottom: 1px solid #ddd;
  font-size: 16px;
}

.invoice-table th {
  background-color: #ff7043;
  color: #fff;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
}

.total-price {
  font-size: 18px;
  color: #333;
  font-weight: bold;
  margin-top: 10px;
}

/* Customer Info Section */
.user-info {
  flex: 1;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.user-info h3 {
  font-size: 20px;
  color: #333;
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  font-size: 14px;
  color: #555;
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 6px;
  border: 1px solid #ddd;
  box-sizing: border-box;
}

.form-group input:focus {
  border-color: #ff7043;
  outline: none;
}

/* Buttons */
.confirm-btn {
  background-color: #4caf50;
  color: white;
  font-size: 16px;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s ease;
}

.confirm-btn:hover {
  background-color: #388e3c;
}

.back-to-cart {
  margin-top: 20px;
  text-align: center;
}

.back-btn {
  background-color: #ff7043;
  color: white;
  font-size: 16px;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s ease;
}

.back-btn:hover {
  background-color: #e64a19;
}
</style>
