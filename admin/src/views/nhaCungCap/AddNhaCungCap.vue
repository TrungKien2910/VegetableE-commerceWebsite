<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <CCard class="w-full max-w-xl shadow-lg rounded-lg bg-white">
      <CCardHeader
            class="text-white text-center py-3 rounded-t-lg"
            style="background-color: #5F52F2;"
>
  <h1 class="text-lg font-semibold">Thêm Nhà Cung Cấp</h1>
</CCardHeader>
      <CCardBody class="p-6">
        <CForm @submit.prevent="submitForm" class="row g-3">
          <CCol md="12">
            <CFormLabel for="TenNCC">Tên nhà cung cấp</CFormLabel>
            <CFormInput v-model="TenNCC" type="text" id="TenNCC" placeholder="Nhập tên nhà cung cấp" required/>
          </CCol>

          <CCol md="6">
            <CFormLabel for="SoDienThoai">Số điện thoại</CFormLabel>
            <CFormInput v-model="SoDienThoai" type="tel" id="SoDienThoai" placeholder="Nhập số điện thoại"/>
          </CCol>

          <CCol md="6">
            <CFormLabel for="Email">Email</CFormLabel>
            <CFormInput v-model="Email" type="email" id="Email" placeholder="Nhập email"/>
          </CCol>

          <CCol md="12">
            <CFormLabel for="DiaChi">Địa chỉ</CFormLabel>
            <CFormInput v-model="DiaChi" id="DiaChi" placeholder="Nhập địa chỉ"/>
          </CCol>

          <CCol md="12">
            <CFormLabel for="HinhAnh">Ảnh nhà cung cấp</CFormLabel>
            <CFormInput type="file" id="HinhAnh" accept="image/*" @change="handleFileUpload"/>
            <div v-if="imagePreview" class="mt-3">
              <p class="text-sm text-gray-500">Ảnh xem trước:</p>
              <img :src="imagePreview" alt="Ảnh xem trước" class="w-32 h-32 rounded-lg border"/>
            </div>
          </CCol>

          <CCol xs="12" class="d-flex justify-content-end gap-3 mt-3">
            <CButton type="submit" color="success">Lưu</CButton>
            <CButton type="button" color="secondary" @click="resetForm">Hủy</CButton>
          </CCol>
        </CForm>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import axios from 'axios';


export default {
  data() {
    return {
      TenNCC: '',
      SoDienThoai: '',
      Email: '',
      DiaChi: '',
      HinhAnh: null,
      imagePreview: null
    };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.HinhAnh = file;
        this.imagePreview = URL.createObjectURL(file);
      }
    },
    async submitForm() {
      const formData = new FormData();
      formData.append('TenNCC', this.TenNCC);
      formData.append('SoDienThoai', this.SoDienThoai);
      formData.append('Email', this.Email);
      formData.append('DiaChi', this.DiaChi);
      if (this.HinhAnh) {
        formData.append('HinhAnh', this.HinhAnh);
      }

      try {
        const response = await axios.post('http://localhost:3000/nhacungcap', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert(response?.data?.message);
        this.resetForm();
      } catch (error) {
        console.error('Lỗi khi thêm nhà cung cấp:', error);
        alert(error.response?.data?.message || "Thêm thất bại!");
      }
    },
    resetForm() {
  this.$router.push('/NhaCungCap');
}
  }
};
</script>

