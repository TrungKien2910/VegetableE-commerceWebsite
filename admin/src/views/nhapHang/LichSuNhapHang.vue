<template>
  <div class="max-w-6xl mx-auto p-6">
    <CCard class="shadow-lg border-0">
      <CCardHeader class="bg-primary text-white text-center py-3 rounded-t-lg">
        <h2 class="text-xl font-semibold">Lịch Sử Nhập Hàng</h2>
      </CCardHeader>

      <CCardBody>
        <!-- Bộ lọc -->
        <CRow class="mb-4">
          <CCol md="6">
            <CFormLabel for="searchNCC">Tìm kiếm nhà cung cấp</CFormLabel>
            <CFormInput id="searchNCC" v-model="searchQuery" placeholder="Nhập tên nhà cung cấp..." />
          </CCol>

          <CCol md="6">
            <CFormLabel for="filterStatus">Lọc theo trạng thái</CFormLabel>
            <CFormSelect id="filterStatus" v-model="filterStatus">
              <option value="">Tất cả</option>
              <option value="ChoDuyet">Chờ Duyệt</option>
              <option value="DaNhap">Đã Nhập</option>
              <option value="Huy">Hủy</option>
            </CFormSelect>
          </CCol>
        </CRow>

        <!-- Danh sách phiếu nhập -->
        <CTable striped hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>#</CTableHeaderCell>
              <CTableHeaderCell>Nhà Cung Cấp</CTableHeaderCell>
              <CTableHeaderCell>Ngày Nhập</CTableHeaderCell>
              <CTableHeaderCell>Tổng Tiền</CTableHeaderCell>
              <CTableHeaderCell>Trạng Thái</CTableHeaderCell>
              <CTableHeaderCell>Hành Động</CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody>
            <CTableRow v-for="(phieu, index) in filteredPhieuNhaps" :key="phieu.MaPhieuNhap">
              <CTableDataCell>{{ index + 1 }}</CTableDataCell>
              <CTableDataCell>{{ phieu.NhaCungCap }}</CTableDataCell>
              <CTableDataCell>{{ formatDate(phieu.NgayNhap) }}</CTableDataCell>
              <CTableDataCell>{{ phieu.TongTien.toLocaleString() }} VNĐ</CTableDataCell>
              <CTableDataCell>
                <CBadge :color="getStatusColor(phieu.TrangThai)">
                  {{ phieu.TrangThai }}
                </CBadge>
              </CTableDataCell>
              <CTableDataCell>
                <CButton color="info" @click="showDetail(phieu)">Xem</CButton>
              </CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>

        <!-- Chi tiết phiếu nhập (Modal) -->
        <CModal alignment="center" size="lg" :visible="showModal" @close="handleCloseModal">
          <CModalHeader>
            <CModalTitle>Chi Tiết Phiếu Nhập #{{ selectedPhieu?.MaPhieuNhap }}</CModalTitle>
          </CModalHeader>

          <CModalBody v-if="selectedPhieu">
            <p><strong>Nhà Cung Cấp:</strong> {{ selectedPhieu.NhaCungCap }}</p>
            <p><strong>Ngày Nhập:</strong> {{ formatDate(selectedPhieu.NgayNhap) }}</p>
            <p><strong>Tổng Tiền:</strong> {{ selectedPhieu.TongTien.toLocaleString() }} VNĐ</p>

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
                <CTableRow v-for="(item, i) in selectedPhieu.ChiTiet" :key="item.MaCTPN">
                  <CTableDataCell>{{ i + 1 }}</CTableDataCell>
                  <CTableDataCell>{{ item.TenSP }}</CTableDataCell>
                  <CTableDataCell>{{ item.SoLuong }}</CTableDataCell>
                  <CTableDataCell>{{ item.DonGia.toLocaleString() }} VNĐ</CTableDataCell>
                  <CTableDataCell>{{ (item.SoLuong * item.DonGia).toLocaleString() }} VNĐ</CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>

            <div v-if="errorMessage" class="alert alert-danger mt-4">
              {{ errorMessage }}
            </div>
          </CModalBody>

          <CModalFooter>
            <CButton color="success" @click="approvePhieu(selectedPhieu.MaPhieuNhap)">Duyệt</CButton>
            <CButton color="danger" @click="cancelPhieu(selectedPhieu.MaPhieuNhap)">Hủy</CButton>
            <CButton color="secondary" @click="handleCloseModal">Đóng</CButton>

                    </CModalFooter>
        </CModal>
      </CCardBody>
    </CCard>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Dữ liệu sẽ được lấy từ API
const phieuNhaps = ref([]);
const searchQuery = ref('');
const filterStatus = ref('');
const showModal = ref(false);
const selectedPhieu = ref(null);
const errorMessage = ref(''); // Thêm biến lưu thông báo lỗi

// Lấy dữ liệu từ API khi component được mount
onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/phieunhap');
    const data = await response.json();
    phieuNhaps.value = data.map(phieu => ({
      MaPhieuNhap: phieu.MaPhieuNhap,
      NhaCungCap: phieu.TenNCC,
      NgayNhap: phieu.NgayNhap,
      TongTien: phieu.TongTien,
      TrangThai: phieu.TrangThai,
      ChiTiet: phieu.ChiTietPhieuNhaps.map(item => ({
        MaCTPN: item.MaCTPN,
        TenSP: item.TenSP,
        SoLuong: item.SoLuong,
        DonGia: item.DonGia,
        TongTienCT: item.TongTienCT
      }))
    }));
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu phiếu nhập:', error);
  }
});

// Bộ lọc danh sách phiếu nhập
const filteredPhieuNhaps = computed(() =>
  phieuNhaps.value.filter(phieu =>
    (!searchQuery.value || phieu.NhaCungCap.toLowerCase().includes(searchQuery.value.toLowerCase())) &&
    (!filterStatus.value || phieu.TrangThai === filterStatus.value)
  )
);

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN');
};

const getStatusColor = (status) => {
  switch (status) {
    case 'ChoDuyet': return 'warning';
    case 'DaNhap': return 'success';
    case 'Huy': return 'danger';
    default: return 'secondary';
  }
};
const handleCloseModal = () => {
  showModal.value = false;
  errorMessage.value = ''; // Khi đóng modal, làm rỗng thông báo lỗi
};

const showDetail = (phieu) => {
  selectedPhieu.value = phieu;
  showModal.value = true;
};

// Gọi API để duyệt phiếu nhập
const approvePhieu = async () => {
  if (selectedPhieu.value) {
    try {
      const response = await fetch(`http://localhost:3000/phieunhap/${selectedPhieu.value.MaPhieuNhap}/approve`, {
        method: 'GET',
      });
      const data = await response.json();
    if (data.message == "Phiếu nhập đã được duyệt thành công") {
      selectedPhieu.value.TrangThai = 'DaNhap';
      errorMessage.value = ''; 
      showModal.value = false;
    } else {
      errorMessage.value = data.message; 
    }
    } catch (error) {
      console.error('Lỗi khi duyệt phiếu nhập:', error);
    }
  }
};

// Gọi API để hủy phiếu nhập
const cancelPhieu = async () => {
  if (selectedPhieu.value) {
    try {
      const response = await fetch(`http://localhost:3000/phieunhap/${selectedPhieu.value.MaPhieuNhap}/cancel`, {
        method: 'GET',
      });
      const data = await response.json();
    if (data.message=="Phiếu nhập đã bị hủy thành công") {
      selectedPhieu.value.TrangThai = 'Huy';
      errorMessage.value = ''; 
      showModal.value = false;
    } else {
      errorMessage.value = data.message; 
    }
      
    } catch (error) {
      console.error('Lỗi khi hủy phiếu nhập:', error);
    }
  }
};

</script>

<style scoped>
/* Cải thiện UI */
input:focus, select:focus {
  border-color: #3182ce;
  box-shadow: 0 0 8px rgba(49, 130, 206, 0.5);
}
button:hover {
  transform: scale(1.02);
  transition: all 0.2s;
}
</style>
