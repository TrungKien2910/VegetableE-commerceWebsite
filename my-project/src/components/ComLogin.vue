<template>
  <div>
    <!-- Modal đăng nhập -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <h2>Đăng nhập</h2>
        <input v-model="username" type="text" placeholder="Tên đăng nhập" class="login-input" />
        <input v-model="password" type="password" placeholder="Mật khẩu" class="login-input" />
        <button @click="login" class="login-button">Đăng nhập</button>

        <!-- Lỗi thông báo trong modal -->
        <p v-if="error" class="error-message">{{ error }}</p>

        <!-- Nút đóng modal (X ở góc trên bên phải) -->
        <button @click="closeModal" class="close-modal-button">×</button>

        <router-link to="/register" class="register-link">Chưa có tài khoản? Đăng ký</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import eventBus from '@/eventBus';

export default {
  data() {
    return {
      username: "",
      password: "",
      error: "",
      showModal: true, // Điều khiển hiển thị modal
    };
  },
  methods: {
    async login() {
    try {
        const response = await fetch("http://localhost:3000/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                Username: this.username,
                MatKhau: this.password,
            }),
            credentials: "include", // Quan trọng để trình duyệt lưu cookie
        });

        if (!response.ok) {
            throw new Error("Tên đăng nhập hoặc mật khẩu không đúng");
        }
        this.error = "";
        this.closeModal();

        eventBus.emit('userUpdated'); // Cập nhật thông tin user
        this.$router.push("/");
    } catch (err) {
        this.error = err.message;
    }
}
,
    closeModal() {
      this.showModal = false;
      this.$router.push("/");
    },
  },
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
  transition: opacity 0.3s ease;
}

.modal {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  text-align: center;
  width: 350px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  /* Make room for the close button */
  transition: transform 0.3s ease, opacity 0.3s ease;
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

.close-modal-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 24px;
  color: #333;
  cursor: pointer;
  padding: 0;
  transition: color 0.3s ease;
}

.close-modal-button:hover {
  color: #f44336;
}

.close-modal-button:focus {
  outline: none;
}

/* Add fade-in and fade-out transition for modal */
.modal-overlay {
  opacity: 1;
}

.modal-overlay.fade-out {
  opacity: 0;
  pointer-events: none;
}

.modal.fade-in {
  transform: translateY(0);
}

.modal.fade-out {
  transform: translateY(-30px);
}
</style>
