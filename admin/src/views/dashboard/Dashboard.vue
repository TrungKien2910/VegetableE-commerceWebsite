<template>
  <div class="container">
    <h1>Thống kê Doanh Thu</h1>

    <!-- Thống kê Đơn Hàng (Biểu đồ cột) -->
    <div class="section">
      <h2>Thống kê Đơn Hàng</h2>
      <canvas id="chartDonHang"></canvas>
    </div>

    <!-- Sản phẩm Bán Chạy (Biểu đồ ngang) -->
    <div class="section">
      <h2>Sản phẩm Bán Chạy</h2>
      <canvas id="chartSanPhamBanChay"></canvas>
    </div>

    <!-- Khách Hàng Mua Nhiều (Biểu đồ nhóm với 2 bộ dữ liệu: Số đơn và Tổng chi tiêu) -->
    <div class="section">
      <h2>Khách Hàng Mua Nhiều</h2>
      <canvas id="chartKhachHangMuaNhieu"></canvas>
    </div>

    <!-- Thống kê Nhập Hàng (Biểu đồ cột) -->
    <div class="section">
      <h2>Thống kê Nhập Hàng</h2>
      <canvas id="chartNhapHang"></canvas>
    </div>

    <!-- Doanh Thu Theo Ngày (Biểu đồ đường) -->
    <div class="section">
      <h2>Doanh Thu Theo Ngày</h2>
      <canvas id="chartDoanhThuTheoNgay"></canvas>
    </div>

    <!-- Tổng Hợp Doanh Thu (Biểu đồ nhóm) -->
    <div class="section">
      <h2>Tổng Hợp Doanh Thu</h2>
      <canvas id="chartTongHopDoanhThu"></canvas>
    </div>

  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  setup() {
    const thongKeDonHang = ref([]);
    const sanPhamBanChay = ref([]);
    const khachHangMuaNhieu = ref([]);
    const thongKeNhapHang = ref([]);
    const doanhThuTheoNgay = ref([]);
    const loiNhuan = ref([]);

    const fetchData = async (url, dataRef) => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        dataRef.value = data;
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    };

    const formatCurrency = (value) => {
      return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
    };

    // Biểu đồ Thống kê Đơn Hàng (Bar chart)
    const renderDonHangChart = () => {
      const ctx = document.getElementById('chartDonHang').getContext('2d');
      const labels = thongKeDonHang.value.map(item => item.TrangThai);
      const dataValues = thongKeDonHang.value.map(item => item.SoLuong);
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Số Lượng Đơn Hàng',
            data: dataValues,
            backgroundColor: '#2e7d32'
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true }
          },
          plugins: { legend: { display: false } }
        }
      });
    };

    // Biểu đồ Sản phẩm Bán Chạy (Horizontal bar chart)
    const renderSanPhamBanChayChart = () => {
      const ctx = document.getElementById('chartSanPhamBanChay').getContext('2d');
      const labels = sanPhamBanChay.value.map(item => item.TenSP);
      const dataValues = sanPhamBanChay.value.map(item => item.TongBan);
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Đã Bán',
            data: dataValues,
            backgroundColor: '#1976d2'
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          scales: { x: { beginAtZero: true } },
          plugins: { legend: { display: false } }
        }
      });
    };

    // Biểu đồ Khách Hàng Mua Nhiều (Grouped bar chart)
    const renderKhachHangMuaNhieuChart = () => {
      const ctx = document.getElementById('chartKhachHangMuaNhieu').getContext('2d');
      const labels = khachHangMuaNhieu.value.map(item => item.HoTen);
      const soDonData = khachHangMuaNhieu.value.map(item => item.SoLuongDon);
      const tongChiTieuData = khachHangMuaNhieu.value.map(item => item.TongChiTieu);
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Số Đơn',
              data: soDonData,
              backgroundColor: '#ff6384'
            },
            {
              label: 'Tổng Chi Tiêu',
              data: tongChiTieuData,
              backgroundColor: '#36a2eb'
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    };

    // Biểu đồ Thống kê Nhập Hàng (Bar chart)
    const renderNhapHangChart = () => {
      const ctx = document.getElementById('chartNhapHang').getContext('2d');
      const labels = thongKeNhapHang.value.map(item => item.TenNCC);
      const dataValues = thongKeNhapHang.value.map(item => item.TongTienNhap);
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Tổng Tiền Nhập',
            data: dataValues,
            backgroundColor: '#ff9f40'
          }]
        },
        options: {
          responsive: true,
          scales: { y: { beginAtZero: true } },
          plugins: { legend: { display: false } }
        }
      });
    };

    // Biểu đồ Doanh Thu Theo Ngày (Line chart)
    const renderDoanhThuTheoNgayChart = () => {
      const ctx = document.getElementById('chartDoanhThuTheoNgay').getContext('2d');
      const labels = doanhThuTheoNgay.value.map(item => item.Ngay);
      const dataValues = doanhThuTheoNgay.value.map(item => item.DoanhThu);
      new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Doanh Thu',
            data: dataValues,
            fill: false,
            borderColor: '#8e24aa',
            tension: 0.2
          }]
        },
        options: {
          responsive: true,
          scales: { y: { beginAtZero: true } },
          plugins: { legend: { display: false } }
        }
      });
    };

    // Biểu đồ Tổng Hợp Doanh Thu (Grouped bar chart)
    const renderTongHopDoanhThuChart = () => {
      const ctx = document.getElementById('chartTongHopDoanhThu').getContext('2d');
      if (loiNhuan.value.length === 0) return;
      const record = loiNhuan.value[0];
      const labels = ['Tiền Nhập', 'Đơn Thành Công', 'Tiền Hoàn Lại', 'Tiền Bán', 'Lợi Nhuận'];
      const dataValues = [
        record.TongTienNhap,
        record.TongTienThanhCong,
        record.TongTienHoanLai,
        record.TongTienBan,
        record.LoiNhuan
      ];
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Doanh Thu',
            data: dataValues,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
          }]
        },
        options: {
          responsive: true,
          scales: { y: { beginAtZero: true } },
          plugins: { legend: { display: false } }
        }
      });
    };

    onMounted(async () => {
      await fetchData('http://localhost:3000/api/doanh-thu/thong-ke-don-hang', thongKeDonHang);
      await fetchData('http://localhost:3000/api/doanh-thu/san-pham-ban-chay', sanPhamBanChay);
      await fetchData('http://localhost:3000/api/doanh-thu/khach-hang-mua-nhieu', khachHangMuaNhieu);
      await fetchData('http://localhost:3000/api/doanh-thu/thong-ke-nhap-hang', thongKeNhapHang);
      await fetchData('http://localhost:3000/api/doanh-thu/doanh-thu-theo-ngay', doanhThuTheoNgay);
      await fetchData('http://localhost:3000/api/doanh-thu/loi-nhuan', loiNhuan);
      await nextTick();
      renderDonHangChart();
      renderSanPhamBanChayChart();
      renderKhachHangMuaNhieuChart();
      renderNhapHangChart();
      renderDoanhThuTheoNgayChart();
      renderTongHopDoanhThuChart();
    });

    return {
      thongKeDonHang,
      sanPhamBanChay,
      khachHangMuaNhieu,
      thongKeNhapHang,
      doanhThuTheoNgay,
      loiNhuan,
      formatCurrency
    };
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
  color: #333;
}

.section {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: #fff;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.05);
}

h1, h2 {
  color: #333;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}

h2 {
  margin-bottom: 15px;
  font-size: 1.4rem;
  font-weight: 600;
  color: #2c3e50;
}

/* Canvas: đảm bảo biểu đồ responsive */
canvas {
  width: 100% !important;
  height: auto !important;
  margin-bottom: 20px;
}
</style>
