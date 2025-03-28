<template>
  <div>
    <CCard class="cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden w-64">
      <!-- Ảnh nhà cung cấp -->
      <div class="image-container">
        <img :src="supplier.HinhAnh || defaultImage" alt="Ảnh nhà cung cấp" class="supplier-image" @error="handleImageError" />
      </div>

      <!-- Thông tin nhà cung cấp -->
      <CCardBody class="text-center p-4">
        <h3 class="font-semibold text-lg text-gray-800">{{ supplier.TenNCC }}</h3>
        <p class="text-gray-500 text-sm">📍 {{ supplier.DiaChi }}</p>
        <p class="text-gray-600 text-sm">☎️ {{ supplier.SoDienThoai }}</p>
        <p class="text-gray-600 text-sm">📧 {{ supplier.Email }}</p>

        <!-- Nút chi tiết -->
        <CButton color="primary" variant="outline" class="mt-3 w-full" @click="showDetails = true">
          📄 Xem Chi Tiết
        </CButton>
      </CCardBody>
    </CCard>

    <!-- Modal Chi Tiết Nhà Cung Cấp -->
    <CModal :visible="showDetails" @close="showDetails = false">
      <CModalHeader>
        <h3 class="font-bold text-lg">Thông Tin Nhà Cung Cấp</h3>
      </CModalHeader>
      <CModalBody>
        <p><strong>Mã NCC:</strong> {{ supplier.MaNCC }}</p>
        <p><strong>Tên:</strong> {{ supplier.TenNCC }}</p>
        <p><strong>Địa chỉ:</strong> {{ supplier.DiaChi }}</p>
        <p><strong>Liên hệ:</strong> {{ supplier.SoDienThoai }}</p>
        <p><strong>Email:</strong> {{ supplier.Email }}</p>
      </CModalBody>
      <CModalFooter>
        <CButton color="warning" @click="$emit('edit', supplier)">✏️ Sửa</CButton>
        <CButton color="danger" @click="$emit('delete', supplier.MaNCC)">🗑️ Xóa</CButton>
        <CButton color="secondary" @click="showDetails = false">Đóng</CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  supplier: {
    type: Object,
    required: true,
  }
});

const defaultImage = ref('https://as1.ftcdn.net/v2/jpg/04/29/42/42/1000_F_429424279_dokEFwnSoJeOKpqvV1ttXum8piESsF5L.jpg');

const showDetails = ref(false);

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
  height: 192px; /* 48 Tailwind units */
  background-color: #e2e8f0; /* Màu nền khi chưa có ảnh */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

/* Ảnh nhà cung cấp có kích thước cố định */
.supplier-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Giữ tỷ lệ ảnh, không bị méo */
}
</style>
