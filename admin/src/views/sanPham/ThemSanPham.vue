<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <CCard class="w-full max-w-xl shadow-lg rounded-lg bg-white">
      <CCardHeader class="bg-green-600 text-black text-center py-3 rounded-t-lg">
        <h1 class="text-lg font-semibold">Thêm Rau Củ Quả</h1>
      </CCardHeader>
      <CCardBody class="p-6">
        <CForm class="row g-3">
          <!-- Tên sản phẩm -->
          <CCol md="12">
            <CFormLabel for="TenSP">Tên rau củ quả</CFormLabel>
            <CFormInput type="text" v-model="TenSP" placeholder="Nhập tên rau củ quả" />
          </CCol>

             <!-- Nhà cung cấp (Dropdown từ API) -->
             <CCol md="6">
            <CFormLabel for="MaNCC">Nhà cung cấp</CFormLabel>
            <CFormSelect v-model="MaNCC">
              <option value="">Chọn nhà cung cấp</option>
              <option v-for="ncc in nhaCungCap" :key="ncc.MaNCC" :value="ncc.MaNCC">
                {{ ncc.TenNCC }}
              </option>
            </CFormSelect>
          </CCol>

          <!-- Mã loại sản phẩm (Dropdown từ API) -->
          <CCol md="6">
            <CFormLabel for="MaLoai">Loại sản phẩm</CFormLabel>
            <CFormSelect v-model="MaLoai">
              <option value="">Chọn loại sản phẩm</option>
              <option v-for="loai in loaiSanPham" :key="loai.MaLoai" :value="loai.MaLoai">
                {{ loai.TenLoai }}
              </option>
            </CFormSelect>
          </CCol>

          <!-- Giá bán -->
          <CCol md="6">
            <CFormLabel for="GiaBan">Giá bán (VND/kg)</CFormLabel>
            <CFormInput type="number" v-model="GiaBan" placeholder="Nhập giá bán" min="0" />
          </CCol>

       

          <!-- Ảnh sản phẩm -->
          <CCol md="12">
            <CFormLabel for="HinhAnh">Ảnh rau củ quả</CFormLabel>
            <CFormInput type="file" accept="image/*" @change="handleFileUpload" />
          </CCol>

          <!-- Nút lưu và hủy -->
          <CCol xs="12" class="d-flex justify-content-end gap-3 mt-3">
            <CButton color="success" @click="createSP">Lưu</CButton>
            <CButton color="secondary" @click="cancel">Hủy</CButton>
          </CCol>

          <!-- Thông báo -->
          <p v-if="message" class="text-center mt-2 text-red-500">{{ message }}</p>
        </CForm>
      </CCardBody>
    </CCard>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter(); // Sử dụng Vue Router
const TenSP = ref('');
const GiaBan = ref('');
const SoLuong = ref(0);
const MoTa = ref('');
const MaLoai = ref('');
const MaNCC = ref('');
const HinhAnh = ref(null);
const message = ref('');
const loaiSanPham = ref([]);
const nhaCungCap = ref([]);

// Xử lý chọn ảnh
const handleFileUpload = (event) => {
  HinhAnh.value = event.target.files[0];
};

// Lấy dữ liệu từ API
const fetchData = async () => {
  try {
    // Lấy danh sách loại sản phẩm
    const loaiRes = await fetch('http://localhost:3000/loaisanpham');
    loaiSanPham.value = await loaiRes.json();

    // Lấy danh sách nhà cung cấp
    const nccRes = await fetch('http://localhost:3000/nhacungcap');
    nhaCungCap.value = await nccRes.json();
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error);
  }
};

const cancel = ()=>{
  router.push('/SanPham/AllSanPham');
};
// Gửi dữ liệu lên API
const createSP = async () => {
  if (!TenSP.value || !GiaBan.value || !MaLoai.value || !MaNCC.value) {
    message.value = 'Vui lòng nhập đầy đủ thông tin';
    return;
  }

  const formData = new FormData();
  formData.append('TenSP', TenSP.value);
  formData.append('GiaBan', GiaBan.value);
  formData.append('SoLuong', SoLuong.value);
  formData.append('MoTa', MoTa.value);
  formData.append('MaLoai', MaLoai.value);
  formData.append('MaNCC', MaNCC.value);
  if (HinhAnh.value) {
    formData.append('HinhAnh', HinhAnh.value);
  }

  try {
    const response = await fetch('http://localhost:3000/sanpham', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Có lỗi xảy ra');
    }

    cancel();

  } catch (error) {
    message.value = error.message;
  }
};

// Gọi API khi component được tạo
onMounted(fetchData);
</script>
