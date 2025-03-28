<template>
    <div class="max-w-6xl mx-auto p-6">
      <CCard class="shadow-lg border-0">
        <CCardHeader class="bg-primary text-white text-center py-3 rounded-t-lg">
          <h2 class="text-xl font-semibold">Đơn Đặt Hàng</h2>
        </CCardHeader>
  
        <CCardBody>
          <!-- Bộ lọc -->
          <CRow class="mb-4">
            <CCol md="6">
              <CFormLabel for="searchMaDH">Tìm kiếm đơn hàng</CFormLabel>
              <CFormInput id="searchMaDH" v-model="searchQuery" placeholder="Nhập mã đơn hàng..." />
            </CCol>
            <CCol md="6">
              <CFormLabel for="searchMaDH">Tìm kiếm mã khách hàng</CFormLabel>
              <CFormInput id="searchMaDH" v-model="searchQuery2" placeholder="Nhập mã khách hàng..." />
            </CCol>
            <CCol md="6">
  <CFormLabel for="filterPayment">Lọc theo thanh toán</CFormLabel>
  <CFormSelect id="filterPayment" v-model="filterPayment">
    <option value="">Tất cả</option>
    <option value="DaHoanTien">Hoàn Tiền</option>
    <option value="ChuaThanhToan">Chưa Thanh Toán</option>
    <option value="DaThanhToan">Đã Thanh Toán</option>
  </CFormSelect>
</CCol>

  
            <CCol md="6">
              <CFormLabel for="filterStatus">Lọc theo trạng thái</CFormLabel>
              <CFormSelect id="filterStatus" v-model="filterStatus">
                <option value="">Tất cả</option>
                <option value="ChoDuyet">Chờ Duyệt</option>
                <option value="DaGiao">Đã Giao</option>
                <option value="Huy">Hủy</option>
              </CFormSelect>
            </CCol>
          </CRow>
  
          <!-- Danh sách đơn đặt hàng -->
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Mã Đơn Hàng</CTableHeaderCell>
                <CTableHeaderCell>Khách Hàng</CTableHeaderCell>
                <CTableHeaderCell>Ngày Đặt</CTableHeaderCell>
                <CTableHeaderCell>Tổng Tiền</CTableHeaderCell>
                <CTableHeaderCell>Thanh Toán</CTableHeaderCell>
                <CTableHeaderCell>Trạng Thái</CTableHeaderCell>
                <CTableHeaderCell>Hành Động</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
  
            <CTableBody>
              <CTableRow v-for="(don, index) in filteredDonDatHangs" :key="don.MaDH">
                <CTableDataCell>{{ index + 1 }}</CTableDataCell>
                <CTableDataCell>{{ don.MaDH }}</CTableDataCell>
                <CTableDataCell>{{ don.TenKH }}</CTableDataCell>
                <CTableDataCell>{{ formatDate(don.NgayDat) }}</CTableDataCell>
                <CTableDataCell>{{ don.TongTien.toLocaleString() }} VNĐ</CTableDataCell>
                <CTableDataCell>
                    <CBadge :color="getStatusColor(don.ThanhToan)">
                    {{ don.ThanhToan }}
                  </CBadge></CTableDataCell>
                <CTableDataCell>
                  <CBadge :color="getStatusColor(don.TrangThai)">
                    {{ don.TrangThai }}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  <CButton color="info" @click="showDetail(don)">Xem Chi Tiết</CButton>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
  
          <!-- Chi tiết đơn đặt hàng (Modal) -->
          <CModal alignment="center" size="lg" :visible="showModal" @close="handleCloseModal">
            <CModalHeader>
              <CModalTitle>Chi Tiết Đơn Đặt Hàng #{{ selectedDon?.MaDH }}</CModalTitle>
            </CModalHeader>
            <CAlert v-if="errorMessage" color="danger" dismissible @close="errorMessage = ''">
  {{ errorMessage }}
</CAlert>
  
            <CModalBody v-if="selectedDon">
              <p><strong>Khách Hàng:</strong> {{ selectedDon.TenKH }}</p>
              <p><strong>Số Điện Thoại:</strong> {{ selectedDon.SoDienThoai }}</p>
              <p><strong>Địa Chỉ:</strong> {{ selectedDon.DiaChi }}</p>
              <p><strong>Ngày Đặt:</strong> {{ formatDate(selectedDon.NgayDat) }}</p>
              <p><strong>Tổng Tiền:</strong> {{ selectedDon.TongTien.toLocaleString() }} VNĐ</p>
  
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
                  <CTableRow v-for="(item, i) in selectedDon.ChiTietDonHangs" :key="item.MaSP">
                    <CTableDataCell>{{ i + 1 }}</CTableDataCell>
                    <CTableDataCell>{{ item.TenSP }}</CTableDataCell>
                    <CTableDataCell>{{ item.SoLuong }}</CTableDataCell>
                    <CTableDataCell>{{ item.DonGia.toLocaleString() }} VNĐ</CTableDataCell>
                    <CTableDataCell>{{ (item.SoLuong * item.DonGia).toLocaleString() }} VNĐ</CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CModalBody>
  
            <CModalFooter class="d-flex justify-content-between align-items-center">
                <div>
                    <CButton color="success" @click="approveDon(selectedDon.MaDH)">Duyệt</CButton>
              <CButton color="danger" @click="cancelDon(selectedDon.MaDH)">Hủy</CButton>
                </div>
              
              <CButton color="secondary" @click="handleCloseModal">Đóng</CButton>
            </CModalFooter>
          </CModal>
        </CCardBody>
      </CCard>
    </div>
  </template>
  
  <script>
import axios from 'axios';

export default {
  data() {
    return {
      donDatHangs: [],
      searchQuery: "",
      searchQuery2:"",
      filterStatus: "",
      filterPayment:"",
      showModal: false,
      selectedDon: null,
      errorMessage: "" // Thêm biến lưu lỗi

    };
  },
  computed: {
  filteredDonDatHangs() {
    return this.donDatHangs
      .filter(don =>
        (!this.searchQuery2 || don.MaKH.toString().includes(this.searchQuery2)) &&
        (!this.searchQuery || don.MaDH.toString().includes(this.searchQuery)) &&
        (!this.filterStatus || don.TrangThai === this.filterStatus) &&
        (!this.filterPayment || don.ThanhToan === this.filterPayment) // Lọc theo thanh toán
      )
      .sort((a, b) => new Date(b.NgayDat) - new Date(a.NgayDat)); // Sắp xếp mới nhất lên đầu
  }
}

,
  methods: {
    async fetchData() {
      try {
        const response = await axios.get("http://localhost:3000/donhang"); // Sửa lại URL API
        this.donDatHangs = response.data;
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      }
    },
    formatDate(date) {
  return new Date(date).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
,
    getStatusColor(status) {
      switch (status) {
        case "ChoDuyet":
          return "warning";
        case "DaGiao":
          return "success";
        case "Huy":
          return "danger";
        case "ChuaThanhToan":
          return "danger";
        case "DaThanhToan":
          return "success";
        case "DaHoanTien":
          return "warning";
        default:
          return "secondary";
      }
    },
    showDetail(don) {
      this.selectedDon = don;
      this.showModal = true;
    },
    handleCloseModal() {
      this.showModal = false;
      this.selectedDon = null;
      this.errorMessage = ""; // Xóa thông báo lỗi khi đóng modal
    },
    async approveDon(maDH) {
  try {
    const response = await axios.post(`http://localhost:3000/donhang/approve/${maDH}`);
    alert(response?.data?.message||"Duyệt đơn thành công!"); // Thêm thông báo
    this.fetchData();
    this.handleCloseModal();
  } catch (error) {
    this.errorMessage = error.response?.data?.message || "Lỗi duyệt đơn hàng!"; 
    console.error("Lỗi duyệt đơn hàng:", error);
  }
},

async cancelDon(maDH) {
  try {
    const response = await axios.post(`http://localhost:3000/donhang/cancel/${maDH}?userRole=admin`);
    alert(response?.data?.message||"Hủy đơn thành công!");
    this.fetchData();
    this.handleCloseModal();
  } catch (error) {
    this.errorMessage = error.response?.data?.message || "Lỗi hủy đơn hàng!";
    console.error("Lỗi hủy đơn hàng:", error);
  }
}

  },
  mounted() {
    this.fetchData();
  }
};
</script>
