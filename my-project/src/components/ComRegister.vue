<template>
  <div>
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h2>Đăng ký tài khoản</h2>

        <input v-model="username" type="text" placeholder="Tên đăng nhập" class="login-input" />
        <input v-model="password" type="password" placeholder="Mật khẩu" class="login-input" />
        <input v-model="confirmPassword" type="password" placeholder="Xác nhận mật khẩu" class="login-input" />
        <input v-model="email" type="email" placeholder="Email" class="login-input" />
        <input v-model="phone" type="text" placeholder="Số điện thoại" class="login-input" />

        <button @click="register" class="login-button">Đăng ký</button>

        <p v-if="error" class="error-message">{{ error }}</p>
        <p v-if="success" class="success-message">{{ success }}</p>

        <button @click="closeModal" class="close-button">×</button>
        <router-link to="/login" class="register-link">Đã có tài khoản? Đăng nhập</router-link>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from 'vue-router';


const route = useRouter();
const showModal = ref(true);
const username = ref("");
const password = ref("");
const confirmPassword = ref("");
const email = ref("");
const phone = ref("");
const error = ref("");
const success = ref("");

// Đóng modal
const closeModal = () => {
  showModal.value = false;
  route.push("/");

};

// Kiểm tra định dạng email
const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

// Kiểm tra số điện thoại (10 chữ số)
const isValidPhone = (phone) => /^[0-9]{10}$/.test(phone);

// Gửi dữ liệu đăng ký lên API
const register = async () => {
  error.value = "";
  success.value = "";

  // Kiểm tra các trường có trống không
  if (!username.value || !password.value || !confirmPassword.value || !email.value || !phone.value) {
    error.value = "Vui lòng nhập đầy đủ thông tin!";
    return;
  }

  // Kiểm tra mật khẩu có khớp không
  if (password.value !== confirmPassword.value) {
    error.value = "Mật khẩu không khớp!";
    return;
  }

  // Kiểm tra định dạng email
  if (!isValidEmail(email.value)) {
    error.value = "Email không hợp lệ!";
    return;
  }

  // Kiểm tra số điện thoại hợp lệ
  if (!isValidPhone(phone.value)) {
    error.value = "Số điện thoại phải có 10 chữ số!";
    return;
  }

  try {
    const response = await axios.post("http://localhost:3000/user", {
      Username: username.value,
      MatKhau: password.value,
      Email: email.value,
      SoDienThoai: phone.value
    });

    if (response.status === 201) {
      success.value = "Đăng ký thành công!";
      // Xóa dữ liệu form sau khi đăng ký thành công
      username.value = "";
      password.value = "";
      confirmPassword.value = "";
      email.value = "";
      phone.value = "";
      route.push("/");
    }
  } catch (err) {
    error.value = "Đăng ký thất bại! Vui lòng thử lại.";
  }
};
</script>

<style scoped>
.register-link {
  display: block;
  margin-top: 15px;
  font-size: 14px;
  color: #4CAF50;
  text-decoration: none;
  transition: color 0.3s ease;
}

.register-link:hover {
  color: #45a049;
  text-decoration: underline;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  text-align: center;
  width: 300px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  position: relative;
}

h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.login-input {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

.login-input:focus {
  border-color: #4CAF50;
  outline: none;
}

.login-button {
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #45a049;
}

.error-message {
  color: #ff4d4d;
  margin-top: 15px;
  font-size: 14px;
}

.success-message {
  color: #4CAF50;
  margin-top: 15px;
  font-size: 14px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  color: #333;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close-button:hover {
  color: #f44336;
}
</style>
