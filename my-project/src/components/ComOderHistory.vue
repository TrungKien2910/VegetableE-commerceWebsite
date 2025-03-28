<template>
  <div class="container">
    <!-- Header row: Tiêu đề bên trái, Bộ lọc bên phải -->
    <div class="header-row">
      <h1 class="page-title">Lịch Sử Đơn Hàng</h1>
      <div class="filters">
        <div class="filter-group">
          <label for="status-select">Trạng thái:</label>
          <select id="status-select" v-model="selectedStatus" @change="filterOrders">
            <option value="">Tất cả</option>
            <option value="ChoDuyet">Chờ duyệt</option>
            <option value="DaGiao">Đã duyệt</option>
            <option value="Huy">Đã hủy</option>
          </select>
        </div>
        <div class="filter-group">
          <label for="payment-select">Thanh toán:</label>
          <select id="payment-select" v-model="selectedPayment" @change="filterOrders">
            <option value="">Tất cả</option>
            <option value="DaThanhToan">Đã Thanh Toán</option>
            <option value="ChuaThanhToan">Chưa Thanh Toán</option>
            <option value="DaHoanTien">Đã Hoàn Tiền</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Thông báo Loading / Lỗi -->
    <div v-if="loading" class="info-message">Đang tải...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>

    <!-- Bảng đơn hàng -->
    <div v-else>
      <table class="orders-table">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Ngày đặt</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Thanh toán</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.MaDH">
            <td>{{ order.MaDH }}</td>
            <td>{{ formatDate(order.NgayDat) }}</td>
            <td>{{ formatCurrency(order.TongTien) }}</td>
            <td>
              <span :class="getStatusClass(order.TrangThai)">
                {{ order.TrangThai }}
              </span>
            </td>
            <td>{{ order.ThanhToan }}</td>
            <td>
              <!-- Nếu chưa thanh toán và chưa hủy -->
              <button
                v-if="order.ThanhToan === 'ChuaThanhToan' && order.TrangThai !== 'Huy'"
                @click="thanhToan(order)"
                class="btn btn-action"
              >
                Thanh Toán
              </button>
              <!-- Nút Chi Tiết -->
              <button
                @click="openOrderDetails(order)"
                class="btn btn-detail"
              >
                Chi Tiết
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Dialog Chi Tiết Đơn Hàng -->
    <div v-if="showDialog" class="dialog-overlay">
      <div class="dialog-box">
        <h2 class="order-title">Mã đơn: {{ selectedOrder.MaDH }}</h2>
        <p><strong>Họ Tên:</strong> {{ selectedOrder.TenKH }}</p>
        <p><strong>Số điện thoại:</strong> {{ selectedOrder.SoDienThoai }}</p>
        <p><strong>Ngày đặt:</strong> {{ formatDate(selectedOrder.NgayDat) }}</p>
        <p><strong>Địa chỉ:</strong> {{ selectedOrder.DiaChi }}</p>
        <p><strong>Tổng tiền:</strong> {{ formatCurrency(selectedOrder.TongTien) }}</p>
        <p>
          <strong>Trạng thái:</strong>
          <span :class="getStatusClass(selectedOrder.TrangThai)">
            {{ selectedOrder.TrangThai }}
          </span>
        </p>
        <p><strong>Thanh toán:</strong> {{ selectedOrder.ThanhToan }}</p>

        <h3 class="details-title">Chi tiết đơn hàng:</h3>
        <ul class="details-list">
          <li
            v-for="item in selectedOrder.ChiTietDonHangs"
            :key="item.MaCTDH"
          >
            {{ item.TenSP }} - {{ item.SoLuong }} x {{ formatCurrency(item.DonGia) }} =
            <strong>{{ formatCurrency(item.TongTienCT) }}</strong>
          </li>
        </ul>

        <!-- Nút hủy / cập nhật nếu đơn đang chờ duyệt -->
        <div v-if="selectedOrder.TrangThai === 'ChoDuyet'" class="button-group">
          <button @click="openUpdateForm(selectedOrder)" class="btn btn-update">
            Cập Nhật
          </button>
          <button @click="refundOrder(selectedOrder.MaDH)" class="btn btn-refund">
            Hủy
          </button>
        </div>
        <!-- Nếu đơn đã giao, hiển thị nút Hoàn Tiền -->
        <div v-else-if="selectedOrder.TrangThai === 'DaGiao'" class="button-group">
          <button @click="call()" class="btn btn-refund">
            Hoàn Tiền
          </button>
        </div>

        <button @click="closeDialog" class="btn btn-close">Đóng</button>
      </div>
    </div>

    <!-- Dialog Cập Nhật Đơn Hàng -->
    <div v-if="showUpdateForm" class="dialog-overlay">
      <div class="dialog-box">
        <h2 class="order-title">Cập Nhật Đơn Hàng</h2>
        <label>Họ Tên:</label>
        <input
          v-model="updatedOrder.HoTen"
          type="text"
          class="input-field"
        />

        <label>Số Điện Thoại:</label>
        <input
          v-model="updatedOrder.SoDienThoai"
          type="text"
          class="input-field"
        />

        <label>Địa Chỉ:</label>
        <input
          v-model="updatedOrder.DiaChi"
          type="text"
          class="input-field"
        />

        <div class="dialog-buttons">
          <button @click="updateOrderInfo" class="btn btn-update">
            Xác Nhận
          </button>
          <button @click="showUpdateForm = false" class="btn btn-close">
            Hủy
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      orders: [],
      filteredOrders: [],
      loading: true,
      error: null,
      showUpdateForm: false,
      showDialog: false,
      selectedOrder: null,
      updatedOrder: {
        HoTen: "",
        SoDienThoai: "",
        DiaChi: ""
      },
      selectedStatus: "",
      selectedPayment: ""
    };
  },
  async created() {
    await this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      try {
        const response = await axios.get(
          `http://localhost:3000/donhang/user?UserId=${this.$route.params.idUser}`
        );
        this.orders = response.data;
        this.filteredOrders = response.data;
      } catch (err) {
        this.error = "Lỗi khi tải đơn hàng: " + err.message;
      } finally {
        this.loading = false;
      }
    },
    thanhToan(order) {
      order.ThanhToan = "DaThanhToan";
      fetch(`http://localhost:3000/donhang/thanhToan/${order.MaDH}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          console.log("Cập nhật thành công:", data);
        })
        .catch((error) => console.error("Lỗi khi cập nhật:", error));
    },
    filterOrders() {
      this.filteredOrders = this.orders.filter((order) => {
        const trangThai = order.TrangThai.trim().toLowerCase();
        const thanhToan = order.ThanhToan.trim().toLowerCase();
        return (
          (this.selectedStatus
            ? trangThai === this.selectedStatus.toLowerCase()
            : true) &&
          (this.selectedPayment
            ? thanhToan === this.selectedPayment.toLowerCase()
            : true)
        );
      });
    },
    async updateOrderInfo() {
      try {
        await axios.put(
          `http://localhost:3000/donhang/${this.selectedOrder.MaDH}`,
          this.updatedOrder
        );
        alert("Cập nhật thành công!");
        this.showUpdateForm = false;
        this.fetchOrders();
      } catch (err) {
        this.error = "Lỗi khi cập nhật: " + err.message;
      }
    },
    async refundOrder(orderId) {
      try {
        await axios.post(`http://localhost:3000/donhang/cancel/${orderId}`);
        this.showDialog = false;
      } catch (err) {
        this.error = "Lỗi khi hoàn tiền: " + err.message;
      }
    },
    openUpdateForm(order) {
      this.selectedOrder = order;
      this.updatedOrder = {
        HoTen: order.TenKH || "",
        SoDienThoai: order.SoDienThoai || "",
        DiaChi: order.DiaChi || ""
      };
      this.showUpdateForm = true;
    },
    openOrderDetails(order) {
      this.selectedOrder = order;
      this.showDialog = true;
    },
    closeDialog() {
      this.showDialog = false;
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString("vi-VN");
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND"
      }).format(value);
    },
    call() {
      alert("Liên hệ SDT sau: 180065432");
    },
    getStatusClass(status) {
      return {
        "status-pending": status === "ChoDuyet",
        "status-approved": status === "DaDuyet",
        "status-cancelled": status === "DaHuy",
        "status-refunded": status === "DaHoanTien"
      };
    }
  }
};
</script>

<style scoped>
/* ---------- Container & Layout ---------- */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
  font-family: 'Roboto', sans-serif;
  background: #f7f9fa; /* Nền nhẹ */
  color: #333;
  border-radius: 8px;
}

/* Header-row: tiêu đề và bộ lọc nằm cùng một dòng */
.header-row {
  display: flex;
  justify-content: space-between; /* Tiêu đề bên trái, filters bên phải */
  align-items: center;
  margin-bottom: 25px;
  flex-wrap: wrap; /* Cho responsive tốt hơn */
}

/* Tiêu đề */
.page-title {
  font-size: 3rem;
  font-weight: 850;
  color: #2980b9;
  margin: 0;
  margin-bottom: 10px;
}

/* Bộ lọc */
.filters {
  display: flex;
  gap: 20px;
}
.filter-group {
  display: flex;
  flex-direction: column;
}
.filter-group label {
  font-weight: 600;
  margin-bottom: 5px;
  color: #555;
}
.filter-group select {
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background-color: #fff;
  transition: border-color 0.3s;
}
.filter-group select:focus {
  border-color: #80bdff;
  outline: none;
}

/* ---------- Info & Error ---------- */
.info-message,
.error-message {
  text-align: center;
  font-size: 1rem;
  margin: 20px 0;
  font-weight: 500;
}

/* ---------- Orders Table ---------- */
.orders-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
}
.orders-table thead {
  background-color: #f2f2f2;
}
.orders-table th,
.orders-table td {
  padding: 14px 16px;
  border-bottom: 1px solid #eee;
  text-align: left;
  font-size: 0.95rem;
}
.orders-table th {
  font-weight: 600;
  color: #555;
}
.orders-table tr:hover {
  background-color: #fafafa;
}

/* ---------- Buttons ---------- */
.btn {
  padding: 8px 14px;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: 5px;
  margin-right: 5px;
  transition: background-color 0.3s, transform 0.2s;
}
.btn:hover {
  transform: translateY(-2px);
}
.btn-detail {
  background-color: #f39c12;
  color: #fff;
}
.btn-detail:hover {
  background-color: #e67e22;
}
.btn-update {
  background-color: #3498db;
  color: #fff;
}
.btn-update:hover {
  background-color: #2980b9;
}
.btn-refund {
  background-color: #2ecc71;
  color: #fff;
}
.btn-refund:hover {
  background-color: #27ae60;
}
.btn-close {
  background-color: #95a5a6;
  color: #fff;
}
.btn-close:hover {
  background-color: #7f8c8d;
}
.btn-action {
  background-color: #dc3545;
  color: #fff;
}
.btn-action:hover {
  background-color: #c82333;
}

/* ---------- Dialog Overlay ---------- */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}
.dialog-box {
  background: #fff;
  padding: 25px 30px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}
.order-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #2c3e50;
}
.input-field {
  width: 100%;
  padding: 10px;
  margin: 8px 0 16px 0;
  border: 1px solid #ced4da;
  border-radius: 4px;
  transition: border-color 0.3s;
}
.input-field:focus {
  border-color: #80bdff;
  outline: none;
}

/* ---------- Details List ---------- */
.details-title {
  margin-top: 20px;
  font-size: 1.05rem;
  color: #34495e;
  font-weight: 600;
}
.details-list {
  list-style-type: disc;
  padding-left: 20px;
  margin: 10px 0;
  font-size: 0.95rem;
}

/* ---------- Status Classes ---------- */
.status-pending {
  color: #e67e22;
  font-weight: 600;
}
.status-approved {
  color: #2ecc71;
  font-weight: 600;
}
.status-cancelled {
  color: #dc3545;
  font-weight: 600;
}
.status-refunded {
  color: #3498db;
  font-weight: 600;
}

/* ---------- Responsive ---------- */
@media (max-width: 768px) {
  .header-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  .filters {
    width: 100%;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
  .filter-group {
    min-width: 150px;
    margin-bottom: 10px;
  }

  /* Nếu cần bảng responsive: 
     hiển thị block, ẩn thead, hiển thị label trong td, v.v. */
  .orders-table,
  .orders-table thead,
  .orders-table tbody,
  .orders-table th,
  .orders-table td,
  .orders-table tr {
    display: block;
  }
  .orders-table thead {
    display: none;
  }
  .orders-table tr {
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
  }
  .orders-table td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border: none;
    border-bottom: 1px solid #eee;
  }
  .orders-table td::before {
    content: attr(data-label);
    font-weight: 600;
    color: #555;
    margin-right: 10px;
  }
}
</style>
