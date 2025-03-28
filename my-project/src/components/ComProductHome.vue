<template>
  <main>
    <div class="menu">
      <div class="menu-carousel">
        <div class="menu-item" v-for="product in products" :key="product.MaSP">
          <router-link :to="{ name: 'ProductDetail', params: { id: product.MaSP } }">
            <img :src="product.HinhAnh" alt="Product Image" class="product-image"
            @error="handleImageError">
                        <div class="menu-item-info">
              <h3 class="product-name">{{ product.TenSP }}</h3>
              <p class="product-description">{{ product.MoTa }}</p>
              <p class="product-price">{{ product.GiaBan }} VND</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, defineProps } from 'vue';

const defaultImage = ref('https://as1.ftcdn.net/v2/jpg/04/29/42/42/1000_F_429424279_dokEFwnSoJeOKpqvV1ttXum8piESsF5L.jpg');

const handleImageError = (event) => {
  event.target.src = defaultImage.value;
};

defineProps({
  products: {
    type: Array,
    required: true
  }
});
</script>
<style scoped>
/* Overall menu container */
.menu {
  text-align: center;
  padding: 40px 20px;
  background-color: #f4f4f9;
  /* Light background for better contrast */
}

/* Carousel layout */
.menu-carousel {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  max-width: 100%;
}

/* Product item container */
.menu-item {
  position: relative;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

/* Hover effect for product */
.menu-item:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.2);
}

/* Product image */
.product-image {
  width: 100%;
  height: 350px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

/* Product info overlay */
.menu-item-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  /* Darker background for better readability */
  color: #fff;
  text-align: left;
  padding: 15px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

/* Show info when hovered */
.menu-item:hover .menu-item-info {
  opacity: 1;
}

/* Product name styling */
.product-name {
  font-size: 18px;
  font-weight: bold;
  color: #ff6f00;
  /* Orange for attention */
  margin: 0 0 8px;
}

/* Product description limited to 2 lines */
.product-description {
  font-size: 14px;
  color: #bbb;
  /* Soft gray for description */
  margin-bottom: 5px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  /* Limit description to 2 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Product price styling */
.product-price {
  font-size: 18px;
  font-weight: 600;
  color: #fcb034;
  /* Bright yellow-orange */
  margin: 0;
}
</style>
