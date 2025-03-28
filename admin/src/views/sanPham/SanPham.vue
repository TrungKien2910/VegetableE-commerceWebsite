<template>
  <div class="max-w-6xl mx-auto p-6">
    <!-- Thanh tìm kiếm & Nút thêm sản phẩm -->
    <CRow class="mb-6 items-center">
      <!-- Cột 1: Ô tìm kiếm -->
      <CCol cols="12" md="6">
        <CFormInput
          v-model="searchQuery"
          placeholder="🔍 Nhập tên sản phẩm..."
          class="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full"
        />
      </CCol>

      <!-- Cột 2: Chọn loại sản phẩm -->
      <CCol cols="12" md="3">
        <CFormSelect
          v-model="selectedLoai"
          class="p-3 border border-gray-300 rounded-lg shadow-sm w-full"
        >
          <option value="">📌 Tất cả loại sản phẩm</option>
          <option
            v-for="loai in loaiSanPhams"
            :key="loai.MaLoai"
            :value="loai.MaLoai"
          >
            {{ loai.TenLoai }}
          </option>
        </CFormSelect>
      </CCol>

      <!-- Cột 3: Nút thêm sản phẩm (canh phải) -->
      <CCol cols="12" md="3" class="text-end">
        <CButton
          color="primary"
          size="lg"
          shape="rounded-pill"
          class="shadow-md px-5"
          @click="goToAddProduct"
        >
          ➕ Thêm Sản Phẩm
        </CButton>
      </CCol>
    </CRow>

    <!-- Tiêu đề danh sách sản phẩm -->
    <h2 class="text-center text-3xl font-bold mt-5 mb-5 text-gray-800">
      📋 Danh Sách Sản Phẩm
    </h2>

    <!-- Danh sách sản phẩm -->
    <CRow class="g-4">
      <CCol
        v-for="sp in filteredSanPhams"
        :key="sp.MaSP"
        cols="12"
        md="6"
        lg="4"
      >
        <ProductCard
          :sanPham="sp"
          :getLoaiSP="getLoaiSP"
          :getTenNCC="getTenNCC"
          @edit="editProduct"
          @delete="deleteSanPham"
        />
      </CCol>
    </CRow>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ProductCard from './SanPhamCard.vue';

const router = useRouter();

const loaiSanPhams = ref([]);
const sanPhams = ref([]);
const nhacungcaps = ref([]);
const searchQuery = ref('');
const selectedLoai = ref('');

// Gọi API
const fetchSanPhams = async () => {
  try {
    const response = await fetch('http://localhost:3000/sanpham');
    if (!response.ok) throw new Error('Lỗi khi tải dữ liệu sản phẩm');
    sanPhams.value = await response.json();
  } catch (error) {
    console.error('Lỗi:', error);
  }
};

const fetchNhaCungCaps = async () => {
  try {
    const response = await fetch('http://localhost:3000/nhacungcap');
    if (!response.ok) throw new Error('Lỗi khi tải dữ liệu nhà cung cấp');
    nhacungcaps.value = await response.json();
  } catch (error) {
    console.error('Lỗi:', error);
  }
};

const fetchLoaiSanPhams = async () => {
  try {
    const response = await fetch('http://localhost:3000/loaisanpham');
    if (!response.ok) throw new Error('Lỗi khi tải dữ liệu loại sản phẩm');
    loaiSanPhams.value = await response.json();
  } catch (error) {
    console.error('Lỗi:', error);
  }
};

onMounted(() => {
  const savedLoai = localStorage.getItem('selectedLoai');
  if (savedLoai) {
    selectedLoai.value = savedLoai;
    localStorage.removeItem('selectedLoai');
  }
  fetchSanPhams();
  fetchLoaiSanPhams();
  fetchNhaCungCaps();
});

// Chuyển đến trang thêm sản phẩm
const goToAddProduct = () => {
  router.push('/SanPham/AllSanPham/ThemSanPham');
};

// Lấy tên loại sản phẩm
const getLoaiSP = (maLoai) => {
  const loai = loaiSanPhams.value.find((l) => l.MaLoai === maLoai);
  return loai ? loai.TenLoai : 'Không xác định';
};

const getTenNCC = (MaNCC) => {
  const nhacungcap = nhacungcaps.value.find((l) => l.MaNCC === MaNCC);
  return nhacungcap ? nhacungcap.TenNCC : 'Không xác định';
};

// Hàm xóa dấu tiếng Việt
const removeVietnameseTones = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

// Lọc sản phẩm
const filteredSanPhams = computed(() => {
  return sanPhams.value.filter((sp) => {
    const matchesSearch = removeVietnameseTones(sp.TenSP)
      .includes(removeVietnameseTones(searchQuery.value));
    const matchesLoai = selectedLoai.value === '' 
      || String(sp.MaLoai) === String(selectedLoai.value);
    return matchesSearch && matchesLoai;
  });
});

const editProduct = (sanPham) => {
  router.push(`/SanPham/AllSanPham/ChinhSuaSanPham/${sanPham.MaSP}`);
};

const deleteSanPham = async (maSP) => {
  try {
    const response = await fetch(`http://localhost:3000/sanpham/${maSP}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Lỗi khi xóa sản phẩm');
    // Cập nhật lại danh sách
    sanPhams.value = sanPhams.value.filter((sp) => sp.MaSP !== maSP);
  } catch (error) {
    console.error('Lỗi:', error);
  }
};
</script>
