<template>
    <div class="max-w-6xl mx-auto p-6">
      <CCard class="shadow-lg border-0">
        <CCardHeader class="bg-primary text-white text-center py-3 rounded-t-lg">
          <h2 class="text-xl font-semibold">Lịch Sử Đặt Hàng Theo Khách Hàng</h2>
        </CCardHeader>
  
        <CCardBody>
          <!-- Danh sách khách hàng -->
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Mã Khách Hàng</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Điện Thoại</CTableHeaderCell>
                <CTableHeaderCell>Hành Động</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
  
            <CTableBody>
              <CTableRow v-for="(user, index) in users" :key="user.MaKH">
                <CTableDataCell>{{ index + 1 }}</CTableDataCell>
                <CTableDataCell>{{ user.MaKH }}</CTableDataCell>
                <CTableDataCell>{{ user.Email }}</CTableDataCell>
                <CTableDataCell>{{ user.SoDienThoai }}</CTableDataCell>
                <CTableDataCell>
                  <CButton color="info" @click="fetchOrders(user.MaKH, user.HoTen)">Xem thêm</CButton>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
  
      <!-- Modal hiển thị danh sách đơn đặt hàng của khách hàng -->
      <CModal alignment="center" size="lg" :visible="showModal" @close="handleCloseModal">
        <CModalHeader>
          <CModalTitle>Lịch Sử Đơn Hàng - {{ selectedUserName }}</CModalTitle>
        </CModalHeader>
  
        <CModalBody>
          <CAlert v-if="errorMessage" color="danger" dismissible @close="errorMessage = ''">
            {{ errorMessage }}
          </CAlert>
  
          <CTable striped hover responsive v-if="orders.length">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Mã Đơn Hàng</CTableHeaderCell>
                <CTableHeaderCell>Ngày Đặt</CTableHeaderCell>
                <CTableHeaderCell>Tổng Tiền</CTableHeaderCell>
                <CTableHeaderCell>Thanh Toán</CTableHeaderCell>
                <CTableHeaderCell>Trạng Thái</CTableHeaderCell>
                <CTableHeaderCell>Hành Động</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
  
            <CTableBody>
  <CTableRow v-for="(order, index) in orders" :key="order.MaDH">
    <CTableDataCell>{{ index + 1 }}</CTableDataCell>
    <CTableDataCell>{{ order.MaDH }}</CTableDataCell>
    <CTableDataCell>{{ formatDate(order.NgayDat) }}</CTableDataCell>
    <CTableDataCell>{{ order.TongTien.toLocaleString() }} VNĐ</CTableDataCell>
    <CTableDataCell>
      <CBadge :color="getStatusColor(order.ThanhToan)">
        {{ order.ThanhToan }}
      </CBadge>
    </CTableDataCell>
    <CTableDataCell>
      <CBadge :color="getStatusColor(order.TrangThai)">
        {{ order.TrangThai }}
      </CBadge>
    </CTableDataCell>
    <CTableDataCell>
      <CButton color="info" @click="fetchOrderDetail(order.MaDH)">Xem Chi Tiết</CButton>
    </CTableDataCell>
  </CTableRow>
</CTableBody>

          </CTable>
  
          <p v-else class="text-center text-muted">Không có đơn hàng nào.</p>
        </CModalBody>
  
        <CModalFooter class="d-flex justify-content-between align-items-center">
            <div>
            <strong>Tổng số đơn hàng:</strong> {{ orders.length }} |
            <strong>Tổng tiền:</strong> {{ totalAmount.toLocaleString() }} VNĐ
            </div>
          <CButton color="secondary" @click="handleCloseModal">Đóng</CButton>
        </CModalFooter>
      </CModal>

    

      <CModal alignment="center" size="lg" :visible="showOrderDetailModal" @close="handleCloseOrderDetail">
    <CModalHeader>
        <CModalTitle>Chi Tiết Đơn Hàng #{{ selectedOrder?.MaDH }}</CModalTitle>
  </CModalHeader>
  <CAlert v-if="errorMessage" color="danger" dismissible @close="errorMessage = ''">
    {{ errorMessage }}
        </CAlert>

  <CModalBody v-if="selectedOrder">
    <p><strong>Khách Hàng:</strong> {{ selectedOrder.TenKH }}</p>
    <p><strong>Địa Chỉ:</strong> {{ selectedOrder.DiaChi }}</p>
    <p><strong>Ngày Đặt:</strong> {{ formatDate(selectedOrder.NgayDat) }}</p>
    <p><strong>Tổng Tiền:</strong> {{ selectedOrder.TongTien }} VNĐ</p>

    <h4 class="mt-4">Danh sách sản phẩm:</h4>
    <CTable striped hover responsive>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>#</CTableHeaderCell>
          <CTableHeaderCell>Tên Sản Phẩm</CTableHeaderCell>
          <CTableHeaderCell>Số Lượng</CTableHeaderCell>
          <CTableHeaderCell>Đơn Giá</CTableHeaderCell>
          <CTableHeaderCell>Thành Tiền</CTableHeaderCell>
        </CTableRow>
      </CTableHead>

      <CTableBody>
        <CTableRow v-for="(item, i) in selectedOrder.ChiTietDonHangs" :key="item.MaSP">
          <CTableDataCell>{{ i + 1 }}</CTableDataCell>
          <CTableDataCell>{{ item.TenSP }}</CTableDataCell>
          <CTableDataCell>{{ item.SoLuong }}</CTableDataCell>
          <CTableDataCell>{{ item.DonGia.toLocaleString() }} VNĐ</CTableDataCell>
          <CTableDataCell>{{ item.TongTienCT }} VNĐ</CTableDataCell>
        </CTableRow>
      </CTableBody>
    </CTable>
  </CModalBody>

  <CModalFooter class="d-flex justify-content-between align-items-center">
    <div>
        <CButton color="success" @click="approveDon(selectedOrder.MaDH)">Duyệt</CButton>
        <CButton color="danger" @click="cancelDon(selectedOrder.MaDH)">Hủy</CButton></div>
    <CButton color="secondary" @click="handleCloseOrderDetail">Đóng</CButton>
  </CModalFooter>
</CModal>

    </div>
  </template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      users: [], // Danh sách khách hàng
      orders: [], // Danh sách đơn hàng của khách hàng
      showModal: false,
      selectedOrder: null, 
      showOrderDetailModal: false, 
      selectedUserName: "",
      errorMessage: ""
    };
  },
  computed: {
  totalAmount() {
    return this.orders.reduce((sum, order) => sum + order.TongTien, 0);
  }
},
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get("http://localhost:3000/user");
        this.users = response.data;
      } catch (error) {
        console.error("Lỗi tải danh sách khách hàng:", error);
      }
    },

    async fetchOrders(userId, userName) {
      try {
        const response = await axios.get(`http://localhost:3000/donhang/user?UserId=${userId}`);
        this.orders = response.data;
        this.selectedUserName = userName;
        this.showModal = true;
      } catch (error) {
        this.errorMessage = "Lỗi tải lịch sử đơn hàng!";
        console.error("Lỗi tải đơn hàng:", error);
      }
    },
    async fetchOrderDetail(maDH) {
  try {
    const response = await axios.get(`http://localhost:3000/donhang/${maDH}`);

    if (response.data.length > 0) {
      this.selectedOrder = response.data[0]; // Lấy phần tử đầu tiên
    } else {
      this.selectedOrder = null;
    }
        this.showOrderDetailModal = true;
  } catch (error) {
    console.error("Lỗi tải chi tiết đơn hàng:", error);
    this.errorMessage = "Không thể tải chi tiết đơn hàng!";
  }
 },

  handleCloseOrderDetail() {
    this.showOrderDetailModal = false;
    this.selectedOrder = null;
    this.errorMessage = "";
  },

    formatDate(date) {
      return new Date(date).toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
    },

    getStatusColor(status) {
      switch (status) {
        case "ChoDuyet": return "warning";
        case "DaGiao": return "success";
        case "Huy": return "danger";
        case "ChuaThanhToan": return "danger";
        case "DaThanhToan": return "success";
        case "DaHoanTien": return "warning";
        default: return "secondary";
      }
    },

    handleCloseModal() {
      this.showModal = false;
      this.orders = [];
      this.errorMessage = "";
    },

  async approveDon(maDH) {
  try {
    const response = await axios.post(`http://localhost:3000/donhang/approve/${maDH}`);
    alert(response?.data?.message||"Duyệt đơn thành công!"); // Thêm thông báo
  } catch (error) {
    this.errorMessage = error.response?.data?.message || "Lỗi duyệt đơn hàng!"; 
    console.error("Lỗi duyệt đơn hàng:", error);
  }
 },

 async cancelDon(maDH) {
  try {
    const response = await axios.post(`http://localhost:3000/donhang/cancel/${maDH}?userRole=admin`);
    alert(response?.data?.message||"Hủy đơn thành công!");
  } catch (error) {
    this.errorMessage = error.response?.data?.message || "Lỗi hủy đơn hàng!";
    console.error("Lỗi hủy đơn hàng:", error);
  } 
 }
},

  mounted() {
    this.fetchUsers();
  }
};

</script>
  