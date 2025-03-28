<template>
  <div class="wrapper min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm @submit.prevent="login">
                  <h1>Đăng nhập</h1>
                  <p class="text-body-secondary">Đăng nhập vào tài khoản của bạn</p>

                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput
                      v-model="username"
                      placeholder="Tên đăng nhập"
                      autocomplete="username"
                    />
                  </CInputGroup>

                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      v-model="password"
                      type="password"
                      placeholder="Mật khẩu"
                      autocomplete="current-password"
                    />
                  </CInputGroup>

                  <CRow>
                    <CCol :xs="6">
                      <CButton type="submit" color="primary" class="px-4">
                        Đăng nhập
                      </CButton>
                    </CCol>
                  </CRow>

                  <!-- Hiển thị lỗi nếu có -->
                  <p v-if="errorMessage" class="text-danger mt-2">{{ errorMessage }}</p>

                </CForm>
              </CCardBody>
            </CCard>

            <CCard class="text-white bg-primary py-5" style="width: 44%">
              <CCardBody class="text-center">
                <div>
                  <h2>Đăng ký</h2>
                  <p>Chào mừng bạn đến với hệ thống của chúng tôi!</p>
                  <CButton color="light" variant="outline" class="mt-3"  @click="openRegisterModal">
                    Đăng ký ngay!
                  </CButton>
                </div>
              </CCardBody>
            </CCard>

          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>

    <!-- Modal hiển thị thông tin liên hệ -->
    <CModal :visible="showRegisterModal" @update:visible="showRegisterModal = $event" backdrop="static" @close="closeRegisterModal">
      <CModalHeader>
        <CModalTitle>Thông tin liên hệ</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p><strong>📞 Số điện thoại:</strong> {{ systemPhone }}</p>
        <p><strong>✉️ Email:</strong> {{ systemEmail }}</p>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="closeRegisterModal">Đóng</CButton>
      </CModalFooter>
    </CModal>

    
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router';
const router = useRouter();


const username = ref('')
const password = ref('')
const errorMessage = ref('')
const showRegisterModal = ref(false);

// Thông tin liên hệ của hệ thống
const systemPhone = ref('0987 654 321');
const systemEmail = ref('support@hethong.com');

async function login() {
  try {
    const response = await fetch("http://localhost:3000/user/login", {
      method: "POST",
      credentials: "include", // QUAN TRỌNG: Cho phép nhận cookie từ server
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Username: username.value,
        MatKhau: password.value,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Đăng nhập thành công, kiểm tra quyền...");

      // ✅ Gọi API check-auth để xác nhận token hợp lệ
      const authResponse = await fetch("http://localhost:3000/user/check/check-auth", {
        method: "GET",
        credentials: "include" ,// ✅ Cần có để gửi cookie
});;

      const authData = await authResponse.json();
      console.log("Kết quả xác thực:", authData);

      if (authResponse.ok && authData.user?.VaiTro === "admin") {
        router.push("/dashboard");
      } else {
        errorMessage.value = "Bạn không có quyền truy cập!";
      }
    } else {
      errorMessage.value = data.message || "Đăng nhập thất bại";
    }
  } catch (error) {
    console.error("Lỗi:", error);
    errorMessage.value = "Có lỗi xảy ra, vui lòng thử lại!";
  }
};


// Mở modal
const openRegisterModal = () => {
  showRegisterModal.value = true;
};

// Đóng modal
const closeRegisterModal = () => {
  showRegisterModal.value = false;
};

</script>