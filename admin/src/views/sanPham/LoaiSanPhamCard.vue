<template>
  <div>
    <CCard class="cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden w-72 h-[400px] flex flex-col">
      <!-- Vùng hiển thị hình ảnh -->
      <div class="image-container">
        <img 
          v-if="loaiSanPham.HinhAnh" 
          :src="loaiSanPham.HinhAnh" 
          alt="Ảnh loại sản phẩm" 
          class="categoryproduct-image"
        />
        <span v-else class="text-gray-500">Không có ảnh</span>
      </div>

      <!-- Nội dung card -->
      <CCardBody class="flex flex-col justify-between flex-grow text-center p-4">
        <div>
          <h3 class="font-semibold text-lg text-gray-800">{{ loaiSanPham.TenLoai }}</h3>
        </div>

        <!-- Nút hành động -->
        <div class="flex justify-between mt-4">
          <CButton color="primary" variant="outline" @click="showDetails = true">📄 Chi Tiết</CButton>
          <CButton color="danger" variant="outline" @click="emitDelete">🗑 Xóa</CButton>
        </div>
      </CCardBody>
    </CCard>

    <!-- Modal chi tiết sản phẩm -->
    <CModal :visible="showDetails" @close="showDetails = false">
      <CModalHeader>
        <h3 class="font-bold text-lg">Thông Tin Loại Sản Phẩm</h3>
      </CModalHeader>
      <CModalBody>
        <p><strong>Tên Loại:</strong> {{ loaiSanPham.TenLoai }}</p>

        <!-- Nút mở form cập nhật -->
        <CButton color="warning" variant="outline" class="mt-3" @click="showUpdateForm = !showUpdateForm">
          ✏️ Cập Nhật
        </CButton>

        <!-- Form cập nhật -->
        <div v-if="showUpdateForm" class="mt-4">
          <CForm @submit.prevent="updateLoaiSanPham">
            <CFormInput v-model="updatedTenLoai" placeholder="Nhập tên mới" required class="mb-3" />
            <CFormInput type="file" @change="handleFileUpload" accept="image/*" class="mb-3" />
            <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
            <CButton type="submit" color="success" block>✔ Lưu</CButton>
          </CForm>
        </div>
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" @click="showDetails = false">Đóng</CButton>
        <CButton color="primary" @click="goToSanPhamPage">🔍 Xem tất cả sản phẩm</CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  loaiSanPham: Object
});

const emit = defineEmits(['delete', 'update']);
const router = useRouter();
const showDetails = ref(false);
const showUpdateForm = ref(false);
const updatedTenLoai = ref(props.loaiSanPham.TenLoai);
const errorMessage = ref('');
const selectedFile = ref(null);

const emitDelete = () => {
  emit('delete', props.loaiSanPham.MaLoai);
};

const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0];
};

const goToSanPhamPage = () => {
  // Đặt selectedLoai vào localStorage trước khi chuyển trang
  localStorage.setItem('selectedLoai', props.loaiSanPham.MaLoai);

  showDetails.value = false;

  // Chuyển trang sau khi đã set xong
  router.push({ name: 'All Sản Phẩm' });
};


const updateLoaiSanPham = async () => {
  if (!updatedTenLoai.value.trim()) {
    errorMessage.value = "Tên loại sản phẩm không được để trống!";
    return;
  }

  try {
    const formData = new FormData();
    formData.append("TenLoai", updatedTenLoai.value);
    if (selectedFile.value) {
      formData.append("HinhAnh", selectedFile.value);
    }

    const response = await fetch(`http://localhost:3000/loaisanpham/${props.loaiSanPham.MaLoai}`, {
      method: 'PUT',
      body: formData
    });

    const responseData = await response.json(); // Lấy dữ liệu phản hồi từ API

    if (!response.ok) {
      errorMessage.value = responseData.message || "Lỗi khi cập nhật sản phẩm!";
      return;
    }

    emit('update');

    // Reset lỗi, đóng modal khi cập nhật thành công
    errorMessage.value = "";
    showUpdateForm.value = false;
    showDetails.value = false;
  } catch (error) {
    console.error(error);
    errorMessage.value = "Lỗi kết nối đến máy chủ!";
  }
};

</script>

<style scoped>
.image-container {
  width: 100%;
  height: 200px;
  background-color: #e2e8f0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.categoryproduct-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
