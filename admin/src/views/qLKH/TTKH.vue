<template>
    <div class="max-w-6xl mx-auto p-6">
      <CCard class="shadow-lg border-0">
        <CCardHeader class="bg-primary text-white text-center py-3 rounded-t-lg">
          <h2 class="text-xl font-semibold">Danh Sách Khách Hàng</h2>
        </CCardHeader>
  
        <CCardBody>
          <!-- Bộ lọc tìm kiếm -->
          <CRow class="mb-4">
            <CCol md="6">
              <CFormLabel for="searchName">Tìm kiếm khách hàng</CFormLabel>
              <CFormInput id="searchName" v-model="searchQuery" placeholder="Nhập tên hoặc email..." />
            </CCol>
          </CRow>
  
          <!-- Danh sách khách hàng -->
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Họ Tên</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Số Điện Thoại</CTableHeaderCell>
                <CTableHeaderCell>Địa Chỉ</CTableHeaderCell>
                <CTableHeaderCell>Vai Trò</CTableHeaderCell>
                <CTableHeaderCell>Hành Động</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
  
            <CTableBody>
              <CTableRow v-for="(user, index) in filteredUsers" :key="user.MaKH">
                <CTableDataCell>{{ index + 1 }}</CTableDataCell>
                <CTableDataCell>{{ user.HoTen }}</CTableDataCell>
                <CTableDataCell>{{ user.Email }}</CTableDataCell>
                <CTableDataCell>{{ user.SoDienThoai }}</CTableDataCell>
                <CTableDataCell>{{ user.DiaChi }}</CTableDataCell>
                <CTableDataCell>
                  <CBadge :color="getRoleColor(user.VaiTro)">
                    {{ user.VaiTro }}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  <CButton color="info" @click="showDetail(user)">Xem</CButton>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
  
          <!-- Chi tiết khách hàng (Modal) -->
          <CModal alignment="center" size="lg" :visible="showModal" @close="handleCloseModal">
            <CModalHeader>
              <CModalTitle>Thông Tin Khách Hàng #{{ selectedUser?.MaKH }}</CModalTitle>
            </CModalHeader>
  
            <CModalBody v-if="selectedUser">
              <p><strong>Họ Tên:</strong> {{ selectedUser.HoTen }}</p>
              <p><strong>Email:</strong> {{ selectedUser.Email }}</p>
              <p><strong>Số Điện Thoại:</strong> {{ selectedUser.SoDienThoai }}</p>
              <p><strong>Địa Chỉ:</strong> {{ selectedUser.DiaChi }}</p>
              <p><strong>Vai Trò:</strong> {{ selectedUser.VaiTro }}</p>
              <p><strong>Ngày Tạo:</strong> {{ formatDate(selectedUser.NgayTao) }}</p>
  
              <div v-if="errorMessage" class="alert alert-danger mt-4">
                {{ errorMessage }}
              </div>
            </CModalBody>
  
            <CModalFooter>
              <CButton color="secondary" @click="handleCloseModal">Đóng</CButton>
            </CModalFooter>
          </CModal>
        </CCardBody>
      </CCard>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        users: [],
        searchQuery: '',
        showModal: false,
        selectedUser: null,
        errorMessage: '',
      };
    },
    computed: {
      filteredUsers() {
        return this.users.filter(
          (user) =>
            user.HoTen.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            user.Email.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      },
    },
    methods: {
      async fetchUsers() {
        try {
          const response = await axios.get('http://localhost:3000/user');
          this.users = response.data;
        } catch (error) {
          this.errorMessage = 'Không thể tải danh sách khách hàng.';
        }
      },
      showDetail(user) {
        this.selectedUser = user;
        this.showModal = true;
      },
      handleCloseModal() {
        this.showModal = false;
        this.selectedUser = null;
      },
      getRoleColor(role) {
        switch (role) {
          case 'admin':
            return 'danger';
          case 'user':
            return 'primary';
          default:
            return 'secondary';
        }
      },
      formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('vi-VN');
      },
    },
    mounted() {
      this.fetchUsers();
    },
  };
  </script>
  