export default [
  {
    component: 'CNavItem',
    name: 'Trang Chủ',
    to: '/dashboard',
    icon: 'cil-speedometer',
    badge: {
      color: 'primary',
      text: 'NEW',
    },
  },
  {
    component: 'CNavTitle',
    name: 'Quản lý chung',
  },
  {
    component: 'CNavItem',
    name: 'Nhà Cung Cấp',
    to: '/NhaCungCap',
    icon: 'cil-truck'
    },
  {
    component: 'CNavGroup',
    name: 'Nhập hàng',
    to: '/NhapHang',
    icon: 'cil-basket', // Thay thế 'cil-cart' bằng 'cil-basket'
    items: [
      {
        component: 'CNavItem',
        name: 'Phiếu Nhập',
        to: '/NhapHang/PhieuNhap',
        icon: 'cil-file', // Thay thế 'cil-note-add' bằng 'cil-file'
      },
      {
        component: 'CNavItem',
        name: 'Lịch sử nhập hàng',
        to: '/NhapHang/LichSuNhapHang',
        icon: 'cil-clock', // Thay thế 'cil-history' bằng 'cil-clock'
      },
    ],
  },
  {
    component: 'CNavTitle',
    name: 'Quản lý sản phẩm',
  },
  {
    component: 'CNavGroup',
    name: 'Sản phẩm',
    to: '/SanPham',
    icon: 'cil-apps',
    items: [
      {
        component: 'CNavItem',
        name: 'Loại sản phẩm',
        to: '/SanPham/LoaiSanPham',
        icon: 'cil-layers',
      },
      {
        component: 'CNavItem',
        name: 'Sản phẩm',
        to: '/SanPham/AllSanPham',
        icon: 'cil-storage', // Thay thế 'cil-box' bằng 'cil-storage'
      },
    ],
  },
  {
    component: 'CNavGroup',
    name: 'Đơn hàng',
    to: '/DonHang',
    icon: 'cil-dollar', // Thay thế 'cil-credit-card' bằng 'cil-dollar'
    items: [
      {
        component: 'CNavItem',
        name: 'Đơn đặt hàng',
        to: '/DonHang/DonDatHang',
        icon: 'cil-file',
      },
      {
        component: 'CNavItem',
        name: 'Lịch sử đơn hàng',
        to: '/DonHang/LichSuDonDatHang',
        icon: 'cil-list',
      }
    ],
  },
  {
    component: 'CNavGroup',
    name: 'Khách hàng',
    to: '/QLKH',
    icon: 'cil-user',
    items: [
      {
        component: 'CNavItem',
        name: 'Thông tin khách hàng',
        to: '/QLKH/TTKH',
        icon: 'cil-people', // Thay thế 'cil-address-book' bằng 'cil-people'
      },
    ],
  },
  {
    component: 'CNavTitle',
    name: 'Hệ thống',
  },
  {
    component: 'CNavGroup',
    name: 'Pages',
    to: '/pages',
    icon: 'cil-settings',
    items: [
      {
        component: 'CNavItem',
        name: 'Login',
        to: '/',
        icon: 'cil-lock-locked',
        badge: {
          color: 'danger',
          text: 'WAIT',
        },
      },
      {
        component: 'CNavItem',
        name: 'Register',
        to: '/',
        icon: 'cil-user-follow',
        badge: {
          color: 'danger',
          text: 'WAIT',
        },
      },
    ],
  },
]
