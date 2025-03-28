<template>
  <div>
    <CCard class="cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden w-72 h-[400px] flex flex-col">
      <!-- Ảnh sản phẩm -->
      <div class="image-container">
        <img 
          :src="sanPham.HinhAnh || defaultImage" 
          alt="Hình ảnh sản phẩm" 
          class="product-image"
          @error="handleImageError"
        />
      </div>

      <!-- Thông tin sản phẩm -->
      <CCardBody class="text-center p-4 flex flex-col justify-between flex-1">
        <div class="flex-1">
          <h3 class="font-semibold text-lg text-gray-800 truncate">{{ sanPham.TenSP }}</h3>
          <p class="text-gray-500 text-sm">{{ getLoaiSP(sanPham.MaLoai) }}</p>
          <p class="text-green-600 font-bold text-lg">{{ sanPham.GiaBan.toLocaleString() }} VNĐ</p>
          <p class="text-gray-600 text-sm">Kho: {{ sanPham.SoLuong }} sản phẩm</p>
        </div>

        <!-- Nút chi tiết -->
        <CButton color="primary" variant="outline" class="mt-3 w-full" @click="showDetails = true">
          📄 Xem Chi Tiết
        </CButton>
      </CCardBody>
    </CCard>

    <!-- Modal Chi Tiết Sản Phẩm -->
    <CModal :visible="showDetails" @close="showDetails = false">
      <CModalHeader>
        <h3 class="font-bold text-lg">Thông Tin Sản Phẩm</h3>
      </CModalHeader>
      <CModalBody>
        <p><strong>Tên:</strong> {{ sanPham.TenSP }}</p>
        <p><strong>Nha cung cap:</strong> {{ getTenNCC(sanPham.MaNCC) }}</p>
        <p><strong>Loại:</strong> {{ getLoaiSP(sanPham.MaLoai) }}</p>
        <p><strong>Giá:</strong> {{ sanPham.GiaBan.toLocaleString() }} VNĐ</p>
        <p><strong>Mo ta</strong> {{ sanPham.MoTa || "Khong co mo ta" }}</p>
        <p><strong>Số lượng:</strong> {{ sanPham.SoLuong }}</p>
      </CModalBody>
      <CModalFooter>
        <CButton color="warning" @click="$emit('edit', sanPham)">✏️ Sửa</CButton>
        <CButton color="danger" @click="$emit('delete', sanPham.MaSP)">🗑️ Xóa</CButton>
        <CButton color="secondary" @click="showDetails = false">Đóng</CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  sanPham: Object,
  getLoaiSP: Function,
  getTenNCC: Function,
});

const emit = defineEmits(['edit', 'delete']);
const showDetails = ref(false);

// Ảnh mặc định nếu sản phẩm không có ảnh
const defaultImage = ref('https://th.bing.com/th/id/OIP.eKDD8uv9dWuB25ChnLFqkgAAAA?rs=1&pid=ImgDetMain');

// Xử lý khi ảnh bị lỗi (hiển thị ảnh mặc định)
const handleImageError = (event) => {
  event.target.src = defaultImage.value;
};
</script>

<style scoped>
/* Định kích thước card */
.CCard {
  width: 256px; /* 64 Tailwind units */
  min-height: 360px; /* Giữ kích thước card cố định */
}

/* Khung chứa ảnh */
.image-container {
  width: 100%;
  height: 350px; /* 48 Tailwind units */
  background-color: #e2e8f0; /* Màu nền khi chưa có ảnh */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

/* Ảnh nhà cung cấp có kích thước cố định */
.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Giữ tỷ lệ ảnh, không bị méo */
}
</style>

