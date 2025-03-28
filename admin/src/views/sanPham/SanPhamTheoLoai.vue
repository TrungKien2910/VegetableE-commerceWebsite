<template>
    <div class="max-w-4xl mx-auto p-6">
      <h2 class="text-xl font-bold mb-4">Sản phẩm thuộc loại: {{ tenLoai }}</h2>
      <CRow class="g-4">
        <CCol v-for="sanPham in danhSachSanPham" :key="sanPham.id" cols="12" md="6" lg="4">
          <CCard>
            <CCardBody>
              <h3 class="text-lg font-semibold">{{ sanPham.ten }}</h3>
              <p>Giá: {{ sanPham.gia }} VNĐ</p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  const danhSachSanPham = ref([]);
  const tenLoai = ref('');
  
  const tatCaSanPham = [
    { id: 1, ten: 'Rau Muống', gia: 15000, MaLoai: 1 },
    { id: 2, ten: 'Cải Thìa', gia: 18000, MaLoai: 1 },
    { id: 3, ten: 'Khoai Lang', gia: 25000, MaLoai: 2 },
    { id: 4, ten: 'Bí Đỏ', gia: 23000, MaLoai: 2 },
];

  
  onMounted(() => {
    const maLoai = parseInt(route.params.maLoai);
    danhSachSanPham.value = tatCaSanPham.filter(sp => sp.MaLoai === maLoai);
  
    if (maLoai === 1) tenLoai.value = 'Rau Xanh';
    else if (maLoai === 2) tenLoai.value = 'Củ Quả';
    else tenLoai.value = 'Không xác định';
  });
  </script>
  