<template>
  <div>
    <!-- Thanh điều hướng -->
    <nav class="navbar">
      <ul class="navbar-menu">
        <li class="dropdown">
          <!-- Combobox chọn danh mục -->
          <select v-model="selectedCategory" @change="handleCategoryChange" class="category-select">
            <option value="">Danh Mục Theo Loai</option>
            <option v-for="category in categories" :key="category.MaLoai" :value="category.MaLoai">
              {{ category.TenLoai }}
            </option>
          </select>
        </li>
        <li>
          <!-- Link Tất Cả Sản Phẩm -->
          <button @click="ProductAll" class="menu-item">Tất Cả Sản Phẩm</button>
        </li>
      </ul>
    </nav>

    <!-- Danh sách sản phẩm -->
    <div class="home-container">
      <h1 class="page-title">{{ pageTitle }}</h1>
      <div class="product-list">
        <Product v-for="item in filterproduct" :key="item.MaSP" :product="item" />
      </div>
      

      <!-- Điều khiển phân trang -->
      <div class="pagination-controls">
        <button v-if="currentpage > 1" @click="changepage(currentpage - 1)" class="page-button prev-button">
          <i class="fas fa-chevron-left"></i> Trước
        </button>

        <div class="pagination-numbers">
          <button v-if="currentpage !== 1" @click="changepage(1)" class="page-button">1</button>
          <span v-if="currentpage > 3" class="dots">...</span>
          <button v-for="i in middlePages" :key="i" @click="changepage(i)"
            :class="['page-button', { active: currentpage === i }]">
            {{ i }}
          </button>
          <span v-if="currentpage < totalpage - 2" class="dots">...</span>
          <button v-if="currentpage < totalpage" @click="changepage(totalpage)" class="page-button">{{ totalpage }}</button>
        </div>

        <button v-if="currentpage < totalpage" @click="changepage(currentpage + 1)" class="page-button next-button">
          Tiếp <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Product from './ComProduct.vue'
import axios from 'axios'

export default {
  name: 'ComDanhMuc',
  components: {
    Product
  },
  data() {
    return {
      products: [],
      categories: [],
      selectedCategory: '', 
      currentpage: 1,
      limit: 8,
      pageTitle: 'Danh Sách Sản Phẩm' 
    }
  },
  computed: {
    
    totalpage() {
      return Math.ceil(this.products.length / this.limit);
    },
    filterproduct() {
      const filteredProducts = this.selectedCategory
        ? this.products.filter(product => product.MaLoai === this.selectedCategory)
        : this.products;
      const start = (this.currentpage - 1) * this.limit;
      const result = filteredProducts.slice(start, start + this.limit);


return result;    },
    middlePages() {
      const range = 1;
      const pages = [];
      const start = Math.max(2, this.currentpage - range);
      const end = Math.min(this.totalpage - 1, this.currentpage + range);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    }
  },
  methods: {
    changepage(page) {
      if (page >= 1 && page <= this.totalpage) {
        this.currentpage = page;
      }
    },
    handleCategoryChange() {
      const selected = this.categories.find(c => c.MaLoai.toString() === this.selectedCategory);
      this.pageTitle = selected ? `Danh Mục ${selected.TenLoai}` : 'Danh Sách Sản Phẩm';
      
      this.fetchDataProduct();
      this.currentpage = 1; 
    },
    ProductAll() {
      this.fetchDataProduct();
      this.currentpage = 1;
      this.selectedCategory = ''; 
      this.pageTitle = 'Danh Sách Sản Phẩm';
    },
    async fetchDataProduct() {
      try {
        const response = await axios.get('http://localhost:3000/sanpham');
        this.products = response.data;
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
      }
    },
    async fetchCategories() {
      try {
        const response = await axios.get('http://localhost:3000/loaisanpham');
        this.categories = response.data;
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu danh mục sản phẩm:', error);
      }
    }
  },
  created() {
    this.fetchDataProduct();
    this.fetchCategories();
    
  }
}
</script>


<style scoped>
/* Tổng quan */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Thanh điều hướng */
.navbar {
  background-color: #f8f9fa;
  padding: 10px 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.navbar-menu {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
}

.category-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

.menu-item {
  padding: 10px 20px;
  margin-left: 10px;
  border: none;
  background-color: #ff6f61;
  color: white;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
}

.menu-item:hover {
  background-color: #ff8a75;
}

/* Danh sách sản phẩm */
.home-container {
  max-width: 1500px;
  margin: 0 auto;
  padding: 40px 25px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.page-title {
  text-align: center;
  margin-bottom: 20px;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
}

/* Phân trang */
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.page-button {
  padding: 8px 16px;
  margin: 0 5px;
  border: 1px solid #ddd;
  background-color: #f8f9fa;
  color: #333;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.page-button:hover {
  background-color: #ff6f61;
  color: white;
}

.page-button.active {
  background-color: #ff6f61;
  color: white;
  font-weight: bold;
}

.dots {
  font-size: 18px;
  color: #888;
}
</style>