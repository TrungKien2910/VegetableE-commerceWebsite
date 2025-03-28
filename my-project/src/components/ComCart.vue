<template>
  <div class="cart-container">
    <div v-if="cart.length === 0" class="empty-cart">
      <p>Giỏ hàng của bạn trống. Hãy mua thêm sản phẩm !</p>
    </div>

    <div v-else class="modal-content">
      <table class="cart-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" class="checkbox" />
            </th>
            <th>IMAGE</th>
            <th>PRODUCT</th>
            <th>PRICE</th>
            <th>QUANTITY</th>
            <th>TOTAL</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cart" :key="item.MaSP">
            <td>
              <input type="checkbox" v-model="item.selected" @change="updateTotalPrice" class="checkbox" />
            </td>
            <td>
              <img :src="item.HinhAnh" class="product-image" alt="product" />
            </td>
            <td>{{ item.TenSP }}</td>
            <td>{{ item.GiaBan.toLocaleString() }} VND</td>
            <td>
              <div class="quantity-controls">
                <button @click="decreaseQuantity(item)" class="quantity-btn">
                  -
                </button>
                <span>{{ item.quantity }}</span>
                <button @click="increaseQuantity(item)" class="quantity-btn">
                  +
                </button>
              </div>
            </td>
            <td>{{ (item.GiaBan * item.quantity).toLocaleString() }} VND</td>
            <td>
              <button @click="removeFromCart(item)" class="remove-btn">
                Remove
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="cart-summary">
        <p class="total-price">
          Total: {{ selectedTotalPrice.toLocaleString() }} VND
        </p>
        <div class="action-buttons">
          <button @click="clearCart" class="clear-cart-btn">Clear all</button>
          <button @click="checkout" class="checkout-btn" :disabled="!isAnyItemSelected">
            Checkout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const user = ref(null);

const cart = ref([]);

// Lấy giỏ hàng từ localStorage khi component được mount
onMounted(() => {
  const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.value = storedCart.map(item => ({ ...item, selected: false }));
});

// Tính tổng tiền các sản phẩm được chọn
const selectedTotalPrice = computed(() => {
  return cart.value
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.GiaBan * item.quantity, 0);
});

// Kiểm tra nếu có sản phẩm nào được chọn
const isAnyItemSelected = computed(() => cart.value.some(item => item.selected));

// Chọn/bỏ chọn tất cả sản phẩm
const selectAll = ref(false);
const toggleSelectAll = () => {
  cart.value.forEach(item => (item.selected = selectAll.value));
};

// Giảm số lượng sản phẩm
const decreaseQuantity = (item) => {
  if (item.quantity > 1) {
    item.quantity--;
  } else {
    removeFromCart(item);
  }
  saveCart();
};

// Tăng số lượng sản phẩm
const increaseQuantity = (item) => {
  if (item.quantity < item.SoLuong) { // Kiểm tra số lượng tồn kho
    item.quantity++;
    saveCart();
  } else {
    alert(`Không thể thêm quá ${item.SoLuong} sản phẩm!`);
  }
};

// Xóa sản phẩm khỏi giỏ hàng
const removeFromCart = (item) => {
  cart.value = cart.value.filter(cartItem => cartItem.MaSP !== item.MaSP);
  saveCart();
};

// Xóa toàn bộ giỏ hàng
const clearCart = () => {
  cart.value = [];
  localStorage.removeItem("cart");
};

// Lưu giỏ hàng vào localStorage
const saveCart = () => {
  localStorage.setItem("cart", JSON.stringify(cart.value));
};

const getUserFromServer = async () => {
      try {
        const response = await fetch("http://localhost:3000/user/check/check-auth", {
          method: "GET",
          credentials: "include", // Gửi cookie
        });

        if (response.ok) {
          const data = await response.json();
          user.value = data.user;
        } else {
          user.value = null;
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu user:", error);
        user.value = null;
      }
    };

    const checkout = async () => {
      await getUserFromServer();

      if (!user.value) {
        router.push("/login");
        return;
      }

      const selectedItems = cart.value.filter(item => item.selected);
      router.push({
        name: "HoaDon", // Dùng name thay vì path
        params: { MaKH: user.value.MaKH },
        query: { items: JSON.stringify(selectedItems) },
      });

};

</script>



<style scoped>
/* Container Styles */
/* Container Styles */
.cart-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  max-width: 900px;
  margin: 30px auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Empty Cart */
.empty-cart {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: #8b0000;
  /* Dark red for emphasis */
}

/* Table Styling */
.cart-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  text-align: center;
}

.cart-table th,
.cart-table td {
  padding: 12px;
  border-bottom: 1px solid #ddd;
  font-size: 16px;
}

.cart-table th {
  background-color: #8b0000;
  /* Dark red header background */
  color: #fff;
  font-weight: bold;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
}

/* Quantity Controls */
.quantity-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.quantity-btn {
  padding: 8px 12px;
  font-size: 18px;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  background-color: #ffcccc;
  /* Light red background */
  color: #8b0000;
  /* Dark red text */
  cursor: pointer;
  transition: 0.3s;
}

.quantity-btn:hover {
  background-color: #8b0000;
  /* Dark red on hover */
  color: #fff;
}

/* Buttons */
.remove-btn {
  padding: 8px 15px;
  border: none;
  background-color: #a40000;
  /* Bold dark red for remove button */
  color: #fff;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
}

.remove-btn:hover {
  background-color: #8b0000;
  /* Even darker red on hover */
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  /* Space between buttons */
  margin-top: 20px;
  /* Extra margin to separate from the table */
}

.clear-cart-btn,
.checkout-btn {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  color: #fff;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s ease;
}

.clear-cart-btn {
  background-color: #8b0000;
  /* Dark red for clear cart */
}

.clear-cart-btn:hover {
  background-color: #6d0000;
  /* Darker red on hover */
}

.checkout-btn {
  background-color: #a40000;
  /* Rich dark red for checkout */
}

.checkout-btn:disabled {
  background-color: #9e9e9e;
  cursor: not-allowed;
}

.checkout-btn:hover:not(:disabled) {
  background-color: #8b0000;
  /* Dark red on hover */
}

/* Responsive */
@media (max-width: 768px) {
  .cart-container {
    padding: 15px;
  }

  .cart-table th,
  .cart-table td {
    font-size: 14px;
    padding: 10px;
  }

  .product-image {
    width: 60px;
    height: 60px;
  }
}
</style>
