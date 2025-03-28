<template>
    <div class="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 class="text-2xl font-bold text-center mb-4">📝 Cập Nhật Nhà Cung Cấp</h2>
  
      <CForm v-if="supplier" @submit.prevent="updateSupplier">
        <CFormInput v-model="supplier.TenNCC" placeholder="Tên Nhà Cung Cấp" required />
        <CFormInput v-model="supplier.Email" placeholder="Email" required type="email" />
        <CFormInput v-model="supplier.SoDienThoai" placeholder="Số Điện Thoại" required />
        <CFormInput v-model="supplier.DiaChi" placeholder="Địa Chỉ" required />
  
        <label class="block mt-3">Ảnh Nhà Cung Cấp:</label>
        <input type="file" @change="handleFileUpload" accept="image/*" />
        <img v-if="supplier.HinhAnh" :src="supplier.HinhAnh" alt="Hình ảnh" class="w-32 mt-2" />
  
        <CButton type="submit" color="primary" class="mt-4 w-full">Lưu Cập Nhật</CButton>
      </CForm>
  
      <p v-else class="text-center text-gray-500">Đang tải dữ liệu...</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  
  const route = useRoute();
  const router = useRouter();
  const supplier = ref(null);
  const selectedFile = ref(null);
  
  // 📌 1️⃣ Lấy dữ liệu từ API khi vào trang
  const fetchSupplier = async () => {
  try {
    const response = await fetch(`http://localhost:3000/nhacungcap/${route.params.MaNCC}`);
    if (!response.ok) throw new Error('Không tìm thấy nhà cung cấp');
    
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      supplier.value = data[0]; // Lấy phần tử đầu tiên trong mảng
    } else {
      throw new Error('Dữ liệu trống');
    }
  } catch (error) {
    console.error('Lỗi:', error);
    alert("Không thể tải dữ liệu nhà cung cấp!");
  }
};


onMounted(() => {
  console.log("Route params:", route.params); // Kiểm tra toàn bộ params
  console.log("Fetching supplier with ID:", route.params.MaNCC); // Kiểm tra giá trị id
  fetchSupplier();
});
  
  // 📌 2️⃣ Xử lý chọn file ảnh
  const handleFileUpload = (event) => {
    selectedFile.value = event.target.files[0];
  };
  
  // 📌 3️⃣ Cập nhật dữ liệu nhà cung cấp
  const updateSupplier = async () => {
    const formData = new FormData();
    formData.append('TenNCC', supplier.value.TenNCC);
    formData.append('Email', supplier.value.Email);
    formData.append('SoDienThoai', supplier.value.SoDienThoai);
    formData.append('DiaChi', supplier.value.DiaChi);
    if (selectedFile.value) {
      formData.append('HinhAnh', selectedFile.value);
    }
  
    try {
  const response = await fetch(`http://localhost:3000/nhacungcap/${route.params.MaNCC}`, {
    method: 'PUT',
    body: formData
  });

  const data = await response.json(); // Chuyển response thành JSON

  if (response.ok) {
    alert('Cập nhật thành công!');
    router.push('/NhaCungCap');
  } else {
    throw new Error(data.message || 'Lỗi khi cập nhật');
  }
} catch (error) {
  alert(error.message); // Hiển thị thông báo lỗi chính xác từ server
}

  };
  </script>
  