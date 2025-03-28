import { createWebHistory, createRouter } from "vue-router";
import Home from '@/components/ComHome'
import DanhMuc from '@/components/ComDanhMuc'
import ProductDetail from '@/components/ComProductDetail'
import Cart from '@/components/ComCart'
import Register from '@/components/ComRegister'
import Login from '@/components/ComLogin'
import HoaDon from '@/components/ComHoaDon'
import OrderHistory from '@/components/ComOderHistory'
import Info from '@/components/ComInfo'

// Danh sách route
const routes = [
    { path: "/", name: "Home", component: Home },
    { path: "/danhmuc", name: "DanhMuc", component: DanhMuc },
    { path: "/product/:id", name: "ProductDetail", component: ProductDetail },
    { path: "/cart", name: "Cart", component: Cart },
    { path: "/register", name: "Register", component: Register },
    { path: "/login", name: "Login", component: Login },

    // Các route yêu cầu đăng nhập
    { 
        path: "/hoadon/:MaKH", 
        name: "HoaDon", 
        component: HoaDon, 
        meta: { requiresAuth: true } 
    },
    { 
        path: "/order-history/:idUser", 
        name: "OrderHistory", 
        component: OrderHistory, 
        meta: { requiresAuth: true } 
    },
    { 
        path: "/info/:idUser", 
        name: "Info", 
        component: Info, 
        meta: { requiresAuth: true } 
    }
];

// Khởi tạo router
const router = createRouter({
    history: createWebHistory(),
    routes
});

// Middleware kiểm tra đăng nhập bằng API
router.beforeEach(async (to, from, next) => {
    if (to.meta.requiresAuth) {
        try {
            const response = await fetch("http://localhost:3000/user/check-auth", {
                method: "GET",
                credentials: "include", 
            });

            if (response.ok ) {
                next(); 
            } else {
                next("/"); 
            }
        } catch (error) {
            next("/");
        }
    } else {
        next(); 
    }
});

export default router;
