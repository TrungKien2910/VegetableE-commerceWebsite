<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <CCard class="w-full max-w-xl shadow-lg rounded-lg bg-white">
        <CCardHeader class="bg-blue-600 text-black text-center py-3 rounded-t-lg">
          <h1 class="text-lg font-semibold">Chỉnh sửa sản phẩm</h1>
        </CCardHeader>
        <CCardBody class="p-6">
          <CForm class="row g-3">
            <!-- Tên sản phẩm -->
            <CCol md="12">
              <CFormLabel for="TenSP">Tên rau củ quả</CFormLabel>
              <CFormInput type="text" v-model="product.TenSP" placeholder="Nhập tên rau củ quả" />
            </CCol>
  
            <!-- Nhà cung cấp -->
            <CCol md="6">
              <CFormLabel for="MaNCC">Nhà cung cấp</CFormLabel>
              <CFormSelect v-model="product.MaNCC">
                <option v-for="ncc in nhaCungCap" :key="ncc.MaNCC" :value="ncc.MaNCC">
                  {{ ncc.TenNCC }}
                </option>
              </CFormSelect>
            </CCol>
  
            <!-- Loại sản phẩm -->
            <CCol md="6">
              <CFormLabel for="MaLoai">Loại sản phẩm</CFormLabel>
              <CFormSelect v-model="product.MaLoai">
                <option v-for="loai in loaiSanPham" :key="loai.MaLoai" :value="loai.MaLoai">
                  {{ loai.TenLoai }}
                </option>
              </CFormSelect>
            </CCol>
  
            <!-- Giá bán -->
            <CCol md="6">
              <CFormLabel for="GiaBan">Giá bán (VND/kg)</CFormLabel>
              <CFormInput type="number" v-model="product.GiaBan" placeholder="Nhập giá bán" min="0" />
            </CCol>
  
            <!-- Ảnh sản phẩm -->
            <CCol md="12">
              <CFormLabel for="HinhAnh">Ảnh rau củ quả</CFormLabel>
              <CFormInput type="file" accept="image/*" @change="handleFileUpload" />
              <div v-if="product.HinhAnh">
                <img :src=" product.HinhAnh" class="mt-2 w-32 h-32" />
              </div>
            </CCol>
  
            <!-- Nút lưu và hủy -->
            <CCol xs="12" class="d-flex justify-content-end gap-3 mt-3">
              <CButton color="primary" @click="updateProduct">Lưu</CButton>
              <CButton color="secondary" @click="cancel">Hủy</CButton>
            </CCol>
  
            <p v-if="message" class="text-center mt-2 text-red-500">{{ message }}</p>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  
  const route = useRoute();
  const router = useRouter();
  const product = ref({});
  const nhaCungCap = ref([]);
  const loaiSanPham = ref([]);
  const message = ref('');
  const HinhAnh = ref(null);
  
  // Xử lý chọn ảnh mới
  const handleFileUpload = (event) => {
    HinhAnh.value = event.target.files[0];
  };
  
  // Lấy thông tin sản phẩm từ API
  const fetchProduct = async () => {
  const MaSP = route.params.maSP;
  try {
    const response = await fetch(`http://localhost:3000/sanpham/${MaSP}`);
    if (!response.ok) throw new Error('Không tìm thấy sản phẩm');

    const data = await response.json();

    // Kiểm tra nếu data là mảng thì lấy phần tử đầu tiên
    if (Array.isArray(data) && data.length > 0) {
      product.value = data[0]; // Lấy đối tượng đầu tiên trong mảng

    } else {
      throw new Error("Dữ liệu sản phẩm không hợp lệ");
    }
  } catch (error) {
    message.value = error.message;
  }
};

  
  // Lấy danh sách loại sản phẩm & nhà cung cấp
  const fetchData = async () => {
    try {
      const loaiRes = await fetch('http://localhost:3000/loaisanpham');
      loaiSanPham.value = await loaiRes.json();
  
      const nccRes = await fetch('http://localhost:3000/nhacungcap');
      nhaCungCap.value = await nccRes.json();
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
    }
  };
  
  // Cập nhật sản phẩm
  const updateProduct = async () => {
    const MaSP = route.params.maSP;
  
    const formData = new FormData();
    formData.append('TenSP', product.value.TenSP);
    formData.append('GiaBan', product.value.GiaBan);
    formData.append('MaLoai', product.value.MaLoai);
    formData.append('MaNCC', product.value.MaNCC);
    if (HinhAnh.value) {
      formData.append('HinhAnh', HinhAnh.value);
    }
  
    try {
      const response = await fetch(`http://localhost:3000/sanpham/${MaSP}`, {
        method: 'PUT',
        body: formData,
      });
  
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Có lỗi xảy ra');
      }
      
      router.push('/SanPham/AllSanPham');
    } catch (error) {
      message.value = error.message;
    }
  };
  
  // Hủy chỉnh sửa
  const cancel = () => {
    router.push('/SanPham/AllSanPham');
  };
  
  // Gọi API khi component được mounted
  onMounted(() => {
    fetchProduct();
    fetchData();
  });
  </script>
  