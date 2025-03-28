import { h, resolveComponent } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/pages/Login.vue'), // Trang đăng nhập
  },
  {
    path: '/',
    name: 'Home',
    component: DefaultLayout,
    redirect: '/dashboard',
    meta: { requiresAuth: true }, // Yêu cầu đăng nhập
    children: [
      {
        path: '/dashboard',
        name: 'Trang Chủ',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ '@/views/dashboard/Dashboard.vue'
          ),
      },
      {
        path: '/NhaCungCap',
        name: 'Nhà Cung Cấp',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/NhaCungCap',
        children: [
          {
            path: '',
            name: '',
            component: () => import('@/views/nhaCungCap/NhaCungCap.vue'),
          },
          {
            path: 'ThemNhaCungCap',
            name: 'Thêm Nhà Cung Cấp',
            component: () => import('@/views/nhaCungCap/AddNhaCungCap.vue'),
          },
          {
            path: 'CapNhatNhaCungCap/:MaNCC',
            name: 'Cập nhật nhà Cung Cấp',
            component: () => import('@/views/nhaCungCap/CapNhatNhaCungCap.vue'),
          },
        ],
      },
      
      {
        path: '/NhapHang',
        name: 'Nhập Hàng',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/NhapHang/PhieuNhap',
        children: [
          {
            path: 'PhieuNhap',
            name: 'Phiếu Nhập',
            component: () => import('@/views/nhapHang/PhieuNhap.vue'),
          },
          {
            path: 'LichSuNhapHang',
            name: 'Lịch Sử Nhập Hàng',
            component: () => import('@/views/nhapHang/LichSuNhapHang.vue'),
          },
        ],
      },
      {
        path: '/SanPham',
        name: 'Sản Phẩm',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        
        redirect: '/SanPham/AllSanPham',
        children: [
          {
            path: 'LoaiSanPham',
            name: 'Loại Sản Phẩm',
            component: () => import('@/views/sanPham/LoaiSanPham.vue'),
          },
          {
            path: 'AllSanPham',
            name: 'All Sản Phẩm',
            redirect : '/SanPham/AllSanPham',
            children: [
              {
              path: '',
              name: '',
              component: () => import('@/views/sanPham/SanPham.vue'),
            },
            {
              path : 'ChinhSuaSanPham/:maSP',
              name :'Chinh Sua Sản Phẩm',
              component : () => import('@/views/sanPham/ChinhSuaSanPham.vue')
            },
              {
                path : 'ThemSanPham',
                name :'Thêm Sản Phẩm',
                component : () => import('@/views/sanPham/ThemSanPham.vue')
              },
              {
                path: "/SanPham/AllSanPham/:maLoai",
                name: "Sản Phẩm Theo Loại",
                component: () => import("@/views/sanPham/SanPhamTheoLoai.vue")
              }
            ]
          },
        ],
      },
      {
        path: '/DonHang',
        name: 'Đơn hàng',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/DonHang/DonDatHang',
        children: [
          {
            path: 'DonDatHang',
            name: 'Đơn đặt hàng',
            component: () => import('@/views/donhang/DonDatHang.vue'),
          },
          {
            path: 'LichSuDonDatHang',
            name: 'Lịch sử đặt hàng',
            component: () => import('@/views/donhang/LichSuDonDatHang.vue'),
          }
         ],
      },
      {
        path: '/QLKH',
        name: 'QLKH',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/QLKH/TTKH',
        children: [
          {
            path: 'TTKH',
            name: 'TTKH',
            component: () => import('@/views/qLKH/TTKH.vue'),
          }
         ],
      },

    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    try {
      const response = await fetch("http://localhost:3000/user/check/check-auth", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok && data.user.VaiTro === "admin") {
        next(); // Nếu là Admin, cho phép vào trang
      } else {
        next("/login"); // Nếu không phải Admin, chuyển về trang đăng nhập
      }
    } catch (error) {
      next("/login");
    }
  } else {
    next();
  }
});

export default router
