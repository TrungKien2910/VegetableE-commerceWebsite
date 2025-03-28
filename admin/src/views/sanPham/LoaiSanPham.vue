<template>
  <div class="max-w-4xl mx-auto p-6">
    <CRow class="mb-6 items-center justify-between">
      <CCol cols="12" md="8">
        <CFormInput
          v-model="searchQuery"
          placeholder="🔍 Tìm kiếm loại sản phẩm..."
          class="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full"
        />
      </CCol>
      <CCol cols="12" md="4" class="text-end">
        <CButton color="primary" size="lg" shape="rounded-pill" class="shadow-md px-5" @click="showAddForm = true">
          ➕ Thêm loại Sản Phẩm
        </CButton>
      </CCol>
    </CRow>

    <h2 class="text-center text-3xl font-bold mt-5 mb-5 text-gray-800">📋 Danh Sách Loại Sản Phẩm</h2>

    <!-- Hiển thị danh sách loại sản phẩm -->
    <CRow class="g-4">
      <CCol v-for="loai in filteredLoaiSanPhams" :key="loai.MaLoai" cols="12" md="6" lg="4">
        <LoaiSanPhamCard :loaiSanPham="loai" @delete="confirmDeleteLoaiSanPham(loai.MaLoai)" @update="fetchLoaiSanPhams" />
      </CCol>
    </CRow>

    <!-- Modal Thêm Loại Sản Phẩm -->
    <CModal :visible="showAddForm" @close="showAddForm = false">
      <CModalHeader><h3>Thêm Loại Sản Phẩm</h3></CModalHeader>
      <CModalBody>
        <CForm @submit.prevent="addLoaiSanPham">
          <CFormInput v-model="newLoaiSanPham.TenLoai" placeholder="Tên loại sản phẩm" required class="mb-3" />
          <CFormInput type="file" @change="handleFileUpload" accept="image/*" class="mb-3" />
          <img v-if="previewImage" :src="previewImage" class="w-full h-40 object-cover rounded-lg mb-3" />
          <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
          <CButton type="submit" color="success" block>✔ Lưu</CButton>
        </CForm>
      </CModalBody>
    </CModal>

    <!-- Modal Xác Nhận Xóa -->
    <CModal :visible="showConfirmDelete" @close="showConfirmDelete = false">
      <CModalHeader><h3>Xác nhận xóa</h3></CModalHeader>
      <CModalBody>
        <p>Bạn có chắc chắn muốn xóa loại sản phẩm này không?</p>
      </CModalBody>
      <CModalFooter>
        <CButton color="danger" @click="deleteLoaiSanPham">🗑 Xóa</CButton>
        <CButton color="secondary" @click="showConfirmDelete = false">❌ Hủy</CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import LoaiSanPhamCard from './LoaiSanPhamCard.vue';

const loaiSanPhams = ref([]);
const searchQuery = ref('');
const showAddForm = ref(false);
const newLoaiSanPham = ref({ TenLoai: '', HinhAnh: null });
const previewImage = ref(null);
const errorMessage = ref('');
const showConfirmDelete = ref(false);
const selectedLoaiSanPhamId = ref(null);

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    newLoaiSanPham.value.HinhAnh = file;
    const reader = new FileReader();
    reader.onload = () => {
      previewImage.value = reader.result;
    };
    reader.readAsDataURL(file);
  }
};

const fetchLoaiSanPhams = async () => {
  try {
    const response = await fetch('http://localhost:3000/loaisanpham');
    if (!response.ok) throw new Error('Lỗi khi lấy dữ liệu');
    loaiSanPhams.value = await response.json();
  } catch (error) {
    console.error(error);
  }
};

onMounted(fetchLoaiSanPhams);

const removeVietnameseTones = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

const filteredLoaiSanPhams = computed(() =>
  loaiSanPhams.value.filter((loai) =>
    removeVietnameseTones(loai.TenLoai).includes(removeVietnameseTones(searchQuery.value))
  )
);

const addLoaiSanPham = async () => {
  if (!newLoaiSanPham.value.TenLoai.trim()) return;

  errorMessage.value = '';

  const formData = new FormData();
  formData.append('TenLoai', newLoaiSanPham.value.TenLoai);
  formData.append('HinhAnh', newLoaiSanPham.value.HinhAnh);

  try {
    const response = await fetch('http://localhost:3000/loaisanpham', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      errorMessage.value = result.message || 'Có lỗi xảy ra khi thêm loại sản phẩm';
      return;
    }


    // Reset form
    newLoaiSanPham.value = { TenLoai: '', HinhAnh: null };
    previewImage.value = null;
    await fetchLoaiSanPhams(); // Gọi lại API để cập nhật danh sách mới
    showAddForm.value = false;
  } catch (error) {
    console.error(error);
    errorMessage.value = 'Lỗi kết nối đến máy chủ';
  }
};


const confirmDeleteLoaiSanPham = (maLoai) => {
  selectedLoaiSanPhamId.value = maLoai;
  showConfirmDelete.value = true;
};

const deleteLoaiSanPham = async () => {
  try {
    const response = await fetch(`http://localhost:3000/loaisanpham/${selectedLoaiSanPhamId.value}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Lỗi khi xóa sản phẩm');

    loaiSanPhams.value = loaiSanPhams.value.filter((loai) => loai.MaLoai !== selectedLoaiSanPhamId.value);
  } catch (error) { 
    console.error(error);
  }

  showConfirmDelete.value = false;
  await fetchLoaiSanPhams();
};
</script>
