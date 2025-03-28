<template>
  <div class="page-background">
    <!-- Form thông tin ban đầu ẩn khi dialog mở -->
    <div v-if="!showDialog" class="info-container">
      <h2 class="page-title">Thông Tin Cá Nhân</h2>
      <div v-if="user" class="user-details">
        <div class="user-field">
          <label>Họ Tên:</label>
          <span>{{ user.HoTen || "Chưa cập nhật" }}</span>
        </div>
        <div class="user-field">
          <label>Email:</label>
          <span>{{ user.Email }}</span>
        </div>
        <div class="user-field">
          <label>Số Điện Thoại:</label>
          <span>{{ user.SoDienThoai }}</span>
        </div>
        <div class="user-field">
          <label>Địa Chỉ:</label>
          <span>{{ user.DiaChi || "Chưa cập nhật" }}</span>
        </div>
        <div class="user-field">
          <label>Tên Đăng Nhập:</label>
          <span>{{ user.Username }}</span>
        </div>
        <div class="user-field">
          <label>Ngày Tạo:</label>
          <span>{{ formatDate(user.NgayTao) }}</span>
        </div>
        <button @click="openUpdateDialog" class="update-btn">Cập Nhật</button>
      </div>
      <div v-else class="loading">
        <p>Đang tải dữ liệu...</p>
      </div>
    </div>

    <!-- Dialog cập nhật thông tin (đặt bên ngoài info-container) -->
    <div v-if="showDialog" class="dialog-overlay">
      <div class="dialog">
        <h3 class="dialog-title">Cập Nhật Thông Tin</h3>
        <form @submit.prevent="updateUser">
          <div class="form-group">
            <label>Họ Tên:</label>
            <input
              v-model="form.HoTen"
              type="text"
              placeholder="Nhập họ tên"
            />
          </div>
          <div class="form-group">
            <label>Email: <span class="required">*</span></label>
            <input
              v-model="form.Email"
              type="email"
              required
              placeholder="Nhập email"
            />
          </div>
          <div class="form-group">
            <label>Số Điện Thoại: <span class="required">*</span></label>
            <input
              v-model="form.SoDienThoai"
              type="tel"
              required
              placeholder="Nhập số điện thoại"
            />
          </div>
          <div class="form-group">
            <label>Địa Chỉ:</label>
            <input
              v-model="form.DiaChi"
              type="text"
              placeholder="Nhập địa chỉ"
            />
          </div>
          <div class="dialog-actions">
            <button type="submit" class="btn btn-save">Cập Nhật</button>
            <button type="button" @click="closeDialog" class="btn btn-cancel">
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: null,
      showDialog: false,
      form: {
        HoTen: "",
        Email: "",
        SoDienThoai: "",
        DiaChi: ""
      }
    };
  },
  async created() {
    this.fetchUserData();
  },
  methods: {
    async fetchUserData() {
      const idUser = this.$route.params.idUser;
      try {
        const response = await fetch(`http://localhost:3000/user/${idUser}`);
        if (response.ok) {
          const data = await response.json();
          this.user = data[0];
          // Khởi tạo giá trị form dựa trên thông tin người dùng
          this.form = { ...this.user };
        } else {
          console.error("Lỗi khi lấy dữ liệu:", await response.text());
        }
      } catch (error) {
        console.error("Lỗi kết nối API:", error);
      }
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString("vi-VN");
    },
    openUpdateDialog() {
      this.showDialog = true;
    },
    closeDialog() {
      this.showDialog = false;
    },
    async updateUser() {
      if (!this.form.Email || !this.form.SoDienThoai) {
        alert("Email và Số Điện Thoại là bắt buộc!");
        return;
      }
      try {
        const response = await fetch(`http://localhost:3000/user/${this.user.MaKH}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            HoTen: this.form.HoTen,
            Email: this.form.Email,
            SoDienThoai: this.form.SoDienThoai,
            DiaChi: this.form.DiaChi
          })
        });
        if (response.ok) {
          alert("Cập nhật thành công!");
          this.showDialog = false;
          this.fetchUserData();
        } else {
          try {
            const errorData = await response.json();
            alert(errorData.message || "Có lỗi xảy ra, vui lòng thử lại.");
          } catch (error) {
            alert("Không thể kết nối đến server. Vui lòng thử lại sau.");
          }
        }
      } catch (error) {
        console.error("Lỗi kết nối API:", error);
      }
    }
  }
};
</script>

<style scoped>
/* ---------- Nền trang ---------- */
.page-background {
  min-height: 100vh;
  background: linear-gradient(135deg, #e0eafc, #f4f5f7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
}

/* ---------- Container chính ---------- */
.info-container {
  width: 100%;
  max-width: 800px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 40px 35px;
  font-family: 'Roboto', sans-serif;
  color: #333;
  transition: transform 0.3s;
}
.info-container:hover {
  transform: translateY(-3px);
}

/* ---------- Tiêu đề ---------- */
.page-title {
  text-align: center;
  margin-bottom: 35px;
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  letter-spacing: 0.5px;
}

/* ---------- Thông tin người dùng ---------- */
.user-details {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.user-field {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #ececec;
}
.user-field:last-child {
  border-bottom: none;
}
.user-field label {
  width: 150px;
  font-weight: 600;
  color: #555;
}
.user-field span {
  font-size: 1rem;
  color: #333;
}

/* ---------- Nút Cập Nhật ---------- */
.update-btn {
  display: block;
  margin: 30px auto 0;
  padding: 14px 28px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.3s, box-shadow 0.3s, transform 0.3s;
}
.update-btn:hover {
  background: #0056b3;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

/* ---------- Loading ---------- */
.loading {
  text-align: center;
  font-size: 1.1rem;
  padding: 25px;
  color: #666;
}

/* ---------- Dialog Overlay ---------- */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease-in-out;
}

/* ---------- Dialog Box ---------- */
.dialog {
  background: #ffffff;
  width: 90%;
  max-width: 500px;
  border-radius: 16px;
  padding: 40px 35px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-in-out;
}

/* ---------- Dialog Title ---------- */
.dialog-title {
  text-align: center;
  margin-bottom: 25px;
  font-size: 1.6rem;
  font-weight: 700;
  color: #333;
}

/* ---------- Form Groups (Horizontal Layout) ---------- */
.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.form-group label {
  width: 120px; /* Căn chỉnh chiều rộng của nhãn */
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  color: #555;
  text-align: right;
  margin-right: 15px;
}

.form-group input {
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-group input:focus {
  border-color: #80bdff;
  outline: none;
  box-shadow: 0 0 6px rgba(0, 123, 255, 0.5);
}

.required {
  color: #dc3545;
}

/* ---------- Dialog Actions ---------- */
.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s, box-shadow 0.3s;
}

.btn-save {
  background: #28a745;
  color: #fff;
}

.btn-save:hover {
  background: #218838;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-cancel {
  background: #dc3545;
  color: #fff;
}

.btn-cancel:hover {
  background: #c82333;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* ---------- Animations ---------- */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
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
</style>
