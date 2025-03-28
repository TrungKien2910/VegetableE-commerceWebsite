<template>
  <div class="max-w-5xl mx-auto p-6">
    <CCard class="shadow-lg border-0">
      <CCardHeader class="bg-primary text-white text-center py-3 rounded-t-lg">
        <h2 class="text-xl font-semibold">Thêm Phiếu Nhập</h2>
      </CCardHeader>

      <CCardBody>
        <CForm @submit.prevent="handleSubmit">
          <!-- Thông tin chính -->
          <CCard class="mb-4 shadow-sm">
            <CCardBody>
              <CRow class="mb-3">
                <CCol cols="12" md="6">
                  <CFormLabel for="supplier">Nhà Cung Cấp</CFormLabel>
                  <CFormSelect v-model="form.maNCC" id="supplier" @change="filterProductsBySupplier" required>
                    <option value="-1" disabled selected>Vui lòng chọn nhà cung cấp...</option>
                    <option v-for="supplier in suppliers" :key="supplier.MaNCC" :value="supplier.MaNCC">
                      {{ supplier.TenNCC }}
                    </option>
                  </CFormSelect>  
                </CCol>

                <CCol cols="12" md="6">
                  <CFormLabel for="date">Ngày Nhập</CFormLabel>
                  <CFormInput type="date" v-model="form.ngayNhap" id="date" required />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>

          <!-- Chi tiết sản phẩm -->
          <CCard class="mb-4 shadow-sm">
            <CCardHeader class="bg-light text-dark font-semibold">Chi Tiết Sản Phẩm</CCardHeader>
            <CCardBody>
              <div v-for="(item, index) in form.chiTiet" :key="index" class="border p-3 mb-3 rounded-lg bg-gray-50">
                <h3 class="text-lg font-medium mb-2">Sản phẩm {{ index + 1 }}</h3>
                
                <CRow class="mb-2">
                  <CCol cols="12" md="4">
                    <CFormLabel>Tìm kiếm sản phẩm</CFormLabel>                    
                    <CFormSelect v-model="item.maSP" @change="updateProductPrice(index)">
                      <option value="-1" disabled selected>Vui lòng chọn sản phẩm...</option>
                      <option v-for="product in filteredProducts" :key="product.MaSP" :value="product.MaSP">
                        {{ product.TenSP }}
                      </option>
                    </CFormSelect>  
                  </CCol>

                  <CCol cols="6" md="3">
                    <CFormLabel>Số lượng</CFormLabel>
                    <CFormInput type="number" v-model.number="item.soLuong" min="1" required />
                  </CCol>

                  <CCol cols="6" md="3">
                    <CFormLabel>Đơn giá</CFormLabel>
                    <CFormInput type="number" v-model.number="item.donGia" min="0" step="0.01" />
                  </CCol>

                  <CCol cols="12" md="2" class="flex items-center">
                    <CButton color="danger" size="sm" @click="removeProduct(index)">Xóa</CButton>
                  </CCol>
                </CRow>
              </div>

              <CButton color="info" variant="outline" @click="addProduct">+ Thêm sản phẩm</CButton>
            </CCardBody>
          </CCard>

          <!-- Tổng tiền -->
          <CCard class="shadow-sm mb-4">
            <CCardBody class="text-right">
              <h3 class="text-lg font-bold">Tổng tiền: {{ totalAmount.toLocaleString() }} VNĐ</h3>
            </CCardBody>
          </CCard>

          <div class="text-center">
            <CButton type="submit" color="success" size="lg" shape="rounded-pill">Lưu Phiếu Nhập</CButton>
          </div>
        </CForm>
      </CCardBody>
    </CCard>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';

// Form dữ liệu
const form = ref({
  maNCC: null,
  ngayNhap: new Date().toISOString().substr(0, 10),
  chiTiet: []
});

// Danh sách nhà cung cấp và sản phẩm
const suppliers = ref([]);
const products = ref([]);
const filteredProducts = ref([]);

// 📌 Lấy danh sách nhà cung cấp và sản phẩm từ API
const fetchData = async () => {
  try {
    // Lấy nhà cung cấp
    const supplierRes = await fetch("http://localhost:3000/nhacungcap");
    suppliers.value = await supplierRes.json();

    // Lấy sản phẩm
    const productRes = await fetch("http://localhost:3000/sanpham");
    products.value = await productRes.json();
    
  } catch (error) {
    console.error("Lỗi tải dữ liệu:", error);
  }
};

// 📌 Lọc sản phẩm theo nhà cung cấp
const filterProductsBySupplier = (event) => {
  const maNCC = Number(event.target.value);  // Ép kiểu thành số

  // Lọc lại các sản phẩm theo nhà cung cấp đã chọn
  filteredProducts.value = products.value.filter(product => product.MaNCC === maNCC);

  // Reset lại ô tìm kiếm mỗi khi thay đổi nhà cung cấp
  form.value.chiTiet.forEach(item => {
    item.search = '';
  });
};
  

// 📌 Cập nhật giá sản phẩm khi chọn
const updateProductPrice = (index) => {
  const selectedProduct = products.value.find(p => p.MaSP === form.value.chiTiet[index].maSP);
  if (selectedProduct) {
    form.value.chiTiet[index].donGia = selectedProduct.DonGia;
  }
};

// 📌 Thêm sản phẩm vào chi tiết phiếu nhập
const addProduct = () => {
  form.value.chiTiet.push({ maSP: null, search: '', soLuong: 1, donGia: 0 });
};

// 📌 Xóa sản phẩm khỏi phiếu nhập
const removeProduct = (index) => {
  form.value.chiTiet.splice(index, 1);
};


// 📌 Tính tổng tiền
const totalAmount = computed(() =>
  form.value.chiTiet.reduce((sum, item) => sum + (item.soLuong * item.donGia || 0), 0)
);

// 📌 Gửi phiếu nhập lên API
const handleSubmit = async () => {
  if (!form.value.maNCC) {
    alert("Vui lòng chọn nhà cung cấp.");
    return;
  }

  for (const item of form.value.chiTiet) {
    if (!item.maSP || !item.donGia || item.donGia <= 0) {
      alert("Vui lòng chọn sản phẩm và nhập đúng giá cho tất cả các sản phẩm.");
      return;
    }
  }

  const payload = {
    MaNCC: form.value.maNCC,
    ChiTietPhieuNhaps: form.value.chiTiet.map(item => ({
      MaSP: item.maSP,
      SoLuong: item.soLuong,
      DonGia: item.donGia
    }))
  };

  try {
    const response = await fetch("http://localhost:3000/phieunhap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      alert("Phiếu nhập đã được lưu!");
      form.value.chiTiet = [];
    } else {
      const errorText = await response.text();
      alert("Lỗi khi lưu phiếu nhập: " + errorText);
    }
  } catch (error) {
    console.error("Lỗi gửi dữ liệu:", error);
    alert("Có lỗi xảy ra khi gửi dữ liệu.");
  }
};

// 📌 Gọi API khi component được tạo
onMounted(fetchData);
</script>

<style scoped>
/* Hiệu ứng input */
input:focus, select:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 8px rgba(49, 130, 206, 0.5);
}

/* Hiệu ứng nút */
button:hover {
  transform: scale(1.02);
  transition: all 0.2s;
}
</style>
