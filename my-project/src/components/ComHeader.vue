<template>
    <div>
      <header>
        <div class="container">
          <!-- Logo -->
          <div class="logo">
            <router-link to="/">
              <img src="/Images/logo.png" alt="Organic Farm Logo" />
            </router-link>
          </div>
  
          <!-- Navigation Menu -->
          <nav>
            <ul>
              <li><router-link to="/">Trang Chủ</router-link></li>
              <li class="dropdown">
                <router-link to="/danhmuc">Danh Mục</router-link>
                <!-- Nếu có dropdown cho danh mục, có thể thêm menu ở đây -->
              </li>
            </ul>
          </nav>
  
          <!-- CTA: Cart & User -->
          <div class="cta">
            <router-link to="/cart" class="cta-button">
              <img src="/Images/cart-icon.png" alt="Giỏ hàng" class="cart-icon" />
            </router-link>
            <router-link v-if="!user" to="/login" class="cta-button login-button">
              Đăng Nhập
            </router-link>
            <div v-if="user" class="user-info">
              <p>Xin Chào, {{ user.HoTen }}</p>
              <div @click="toggleDropdown" class="avatar-wrapper">
                <img :src="user.avatar || '/Images/3.jpg'" alt="User Avatar" class="avatar-img" />
              </div>
              <div v-if="showDropdown" class="dropdown-menu1">
                <router-link :to="`/order-history/${user.MaKH}`" class="dropdown-item1" @click="toggleDropdown">
                  Lịch Sử Đơn Hàng
                </router-link>
                <router-link :to="`/info/${user.MaKH}`" class="dropdown-item1" @click="toggleDropdown">
                  Thông Tin Cá Nhân
                </router-link>
                <span @click="openChangePasswordDialog" class="dropdown-item1">
                  Đổi Mật Khẩu
                </span>
                <button @click="logout" class="dropdown-item1 logout-button">
                  Đăng Xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
  
      <!-- Form Đổi Mật Khẩu -->
      <div v-if="showChangePasswordDialog" class="dialog-overlay">
        <div class="dialog">
          <h2>Đổi Mật Khẩu</h2>
          <input v-model="oldPassword" type="password" placeholder="Mật khẩu cũ" />
          <input v-model="newPassword" type="password" placeholder="Mật khẩu mới" />
          <input v-model="confirmPassword" type="password" placeholder="Xác nhận mật khẩu mới" />
          <div class="dialog-actions">
            <button @click="changePassword">Xác nhận</button>
            <button @click="closeChangePasswordDialog">Hủy</button>
          </div>
        </div>
      </div>
  
      <router-view />
    </div>
  </template>
  
  <script>
  import eventBus from '@/eventBus';
  
  export default {
    data() {
      return {
        user: null,
        showDropdown: false,
        showChangePasswordDialog: false,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      };
    },
    created() {
      this.getUserFromServer();
      eventBus.on("userUpdated", () => {
        this.getUserFromServer();
      });
    },
    beforeUnmount() {
      eventBus.off("userUpdated");
    },
    methods: {
      async getUserFromServer() {
        try {
          const response = await fetch("http://localhost:3000/user/check/check-auth", {
            method: "GET",
            credentials: "include",
          });
          const data = await response.json();
          if (response.ok && data.user.VaiTro === "user") {
            this.user = data.user;
          } else {
            this.user = null;
          }
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu user:", error);
        }
      },
      toggleDropdown() {
        this.showDropdown = !this.showDropdown;
      },
      async logout() {
        try {
          const response = await fetch("http://localhost:3000/user/logout", {
            method: "POST",
            credentials: "include",
          });
          if (response.ok) {
            this.user = null;
            this.toggleDropdown();
            this.$router.push("/");
          } else {
            console.error("Đăng xuất thất bại:", await response.text());
          }
        } catch (error) {
          console.error("Lỗi khi đăng xuất:", error);
        }
      },
      openChangePasswordDialog() {
        this.showChangePasswordDialog = true;
        this.showDropdown = false;
      },
      closeChangePasswordDialog() {
        this.showChangePasswordDialog = false;
        this.oldPassword = "";
        this.newPassword = "";
        this.confirmPassword = "";
      },
      async changePassword() {
        if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
          alert("Vui lòng nhập đầy đủ thông tin.");
          return;
        }
        if (this.newPassword !== this.confirmPassword) {
          alert("Mật khẩu mới không trùng khớp.");
          return;
        }
        try {
          const response = await fetch("http://localhost:3000/user/change-password", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              idUser: String(this.user.MaKH),
              oldPassword: this.oldPassword,
              newPassword: this.newPassword,
            }),
          });
          if (response.ok) {
            alert("Đổi mật khẩu thành công!");
            this.closeChangePasswordDialog();
          } else {
            const errorText = await response.text();
            alert("Lỗi: " + errorText);
          }
        } catch (error) {
          console.error("Lỗi khi đổi mật khẩu:", error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Reset margin & padding cho body, html */
  body,
  html {
    margin: 0;
    padding: 0;
  }
  
  /* Header */
  header {
    background-color: #2e7d32; /* Màu xanh lá chủ đạo */
    color: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  /* Container */
  .container {
    padding: 10px 94px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: 'Roboto', sans-serif;
    position: relative;
  }
  
  /* Logo */
  .logo img {
    height: 80px;
    transition: transform 0.3s ease;
  }
  
  .logo img:hover {
    transform: scale(1.05);
  }
  
  /* Navigation Menu */
  nav ul {
    display: flex;
    gap: 25px;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  nav ul li a {
    color: #ffffff;
    font-weight: 500;
    font-size: 16px;
    text-decoration: none;
    padding: 10px 15px;
    border-radius: 8px;
    transition: background-color 0.3s ease, color 0.3s ease;
  }
  
  nav ul li a:hover {
    background-color: #1b5e20; /* Sắc độ tối hơn để tạo điểm nhấn */
  }
  
  /* CTA Section */
  .cta {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  /* Cart & Login Button */
  .cta-button {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    padding: 12px;
    border: 2px solid #ffffff;
    background-color: #1b5e20;
    cursor: pointer;
    transition: transform 0.3s ease, background-color 0.3s ease;
  }
  
  .cta-button:hover {
    background-color: #1a6b1a;
  }
  
  .cta-button img {
    width: 30px;
    transition: transform 0.3s ease;
  }
  
  .cta-button:hover img {
    transform: scale(1.1);
  }
  
  /* Login Button (nếu hiển thị dưới dạng button) */
  .login-button,
  .logout-button {
    background-color: #ffffff;
    color: #2e7d32;
    border: none;
    padding: 10px 20px;
    border-radius: 25px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
  }
  
  .login-button:hover,
  .logout-button:hover {
    background-color: #1b5e20;
    color: #ffffff;
    transform: scale(1.05);
  }
  
  /* User Info Section */
  .user-info {
    position: relative;
    display: flex;
    align-items: center;
  }
  
  .user-info p {
    font-size: 14px;
    color: #ffffff;
    margin-right: 10px;
  }
  
  /* Avatar */
  .avatar-wrapper {
    cursor: pointer;
  }
  
  .avatar-img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid #ffffff;
    transition: transform 0.3s ease;
  }
  
  .avatar-img:hover {
    transform: scale(1.05);
  }
  
  /* Dropdown Menu */
  .dropdown-menu1 {
    position: absolute;
    top: 60px;
    right: 0;
    background: #ffffff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    width: 180px;
    z-index: 10;
    display: flex;
    flex-direction: column;
  }
  
  .dropdown-item1 {
    padding: 10px;
    text-align: left;
    color: #2e7d32;
    text-decoration: none;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  
  .dropdown-item1:hover {
    background: #f5f5f5;
  }
  
/* ---------- Dialog Overlay ---------- */
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-in-out;
}

/* ---------- Dialog Box ---------- */
.dialog {
  background: #fff;
  padding: 25px 30px;
  border-radius: 12px;
  width: 360px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  text-align: center;
  animation: slideIn 0.3s ease-in-out;
}

/* ---------- Dialog Title ---------- */
.dialog h2 {
  margin-bottom: 15px;
  font-size: 1.6rem;
  font-weight: 600;
  color: #2e7d32;
}

/* ---------- Input Fields ---------- */
.dialog input {
  display: block;
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.dialog input:focus {
  border-color: #2e7d32;
  box-shadow: 0 0 6px rgba(46, 125, 50, 0.4);
  outline: none;
}

/* ---------- Dialog Actions ---------- */
.dialog-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
}

.dialog-actions button {
  flex: 1;
  padding: 12px 0;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dialog-actions button:first-child {
  background: #2e7d32;
  color: white;
}

.dialog-actions button:first-child:hover {
  background: #27632a;
  box-shadow: 0 4px 8px rgba(46, 125, 50, 0.3);
}

.dialog-actions button:last-child {
  background: #f0f0f0;
  color: #333;
}

.dialog-actions button:last-child:hover {
  background: #e0e0e0;
}

/* ---------- Animations ---------- */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
} 
  /* Responsive Mobile */
  @media (max-width: 768px) {
    .container {
      flex-direction: column;
      align-items: center;
      padding: 15px 20px;
    }
  
    nav ul {
      flex-direction: column;
      gap: 15px;
    }
  
    .cta {
      flex-direction: column;
      gap: 10px;
    }
  
    .cta-button {
      padding: 10px;
    }
  
    .login-button,
    .logout-button {
      padding: 10px 18px;
    }
  }
  </style>
  