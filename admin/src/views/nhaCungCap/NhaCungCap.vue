<template>
  <div class="max-w-7xl mx-auto p-6">
    <!-- Thanh tìm kiếm & nút thêm -->
    <CRow class="mb-6 align-items-center">
      <CCol cols="12" md="8">
        <CFormInput
          v-model="searchQuery"
          placeholder="🔍 Tìm kiếm nhà cung cấp..."
          class="p-2 border border-gray-300 rounded w-full"
        />
      </CCol>
      <CCol cols="12" md="4" class="text-end">
        <CButton color="primary" size="lg" shape="rounded-pill" @click="goToAddSupplier">
          + Thêm Nhà Cung Cấp
        </CButton>
      </CCol>
    </CRow>

    <h2 class="text-center text-3xl font-bold mt-5 mb-5 text-gray-800">
      📋 Danh Sách Nhà Cung Cấp
    </h2>

    <!-- Danh sách nhà cung cấp -->
    <CRow class="g-4" v-if="filteredSuppliers.length" :key="JSON.stringify(suppliers)">
      <CCol v-for="supplier in filteredSuppliers" :key="supplier.MaNCC" cols="12" md="6" lg="4">
        <SupplierCard :supplier="supplier" @edit="editSupplier" @delete="deleteSupplier" />
      </CCol>
    </CRow>
    <p v-else class="text-center text-gray-500 mt-6">Không tìm thấy nhà cung cấp.</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { nextTick } from "vue";
import { useRouter } from 'vue-router';
import SupplierCard from '@/views/nhaCungCap/SupplierCard.vue';

const router = useRouter();
const searchQuery = ref('');
const suppliers = ref([]);

const fetchSuppliers = async () => {
  try {
    const response = await fetch('http://localhost:3000/nhacungcap');
    if (!response.ok) throw new Error('Lỗi khi lấy dữ liệu nhà cung cấp');
    suppliers.value = await response.json();
  } catch (error) {
    console.error('Lỗi:', error);
  }
};

onMounted(fetchSuppliers);

const filteredSuppliers = computed(() =>
  suppliers.value.filter(supplier =>
    supplier.TenNCC?.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

const goToAddSupplier = () => {
  router.push('/NhaCungCap/ThemNhaCungCap');
};

const editSupplier = (supplier) => {
  router.push({
    path: `/NhaCungCap/CapNhatNhaCungCap/${supplier.MaNCC}`,
  });
};


const deleteSupplier = async (supplierId) => {
  try {
    const response = await fetch(`http://localhost:3000/nhacungcap/${supplierId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      suppliers.value = suppliers.value.filter((supplier) => supplier.MaNCC !== supplierId);

      // Đợi Vue cập nhật DOM rồi mới cho phép cuộn tiếp
      await nextTick();

// Bắt trình duyệt render lại UI
document.documentElement.scrollTop = document.documentElement.scrollTop + 1;
    } else {
      console.error("Lỗi khi xoá nhà cung cấp");
    }
  } catch (error) {
    console.error("Lỗi:", error);
  }
};
</script>
