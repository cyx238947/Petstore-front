<template>
  <div class="products-container">
    <!-- 搜索区域 -->
    <div class="search-area">
      <el-input
        v-model="searchKey"
        placeholder="请输入关键字"
        class="search-input"
      >
        <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
      </el-input>
    </div>

    <!-- 分类和商品展示区域 -->
    <div class="main-content">
      <!-- 分类列表 -->
      <div class="category-section">
        <h3>宠物分类</h3>
        <el-menu
          :default-active="selectedCategoryId"
          class="category-list"
          @select="handleCategorySelect"
        >
          <el-menu-item
            v-for="category in categories"
            :key="category.categoryId"
            :index="category.categoryId"
          >
              <span style="color: black;">{{ category.name }}</span>
          </el-menu-item>
        </el-menu>
      </div>

      <!-- 商品展示区域 -->
      <div class="product-section">
        <div v-if="loading" class="loading-container">
          <el-skeleton :rows="6" animated />
        </div>
        <div v-else>
          <div v-if="isSearch" class="search-results-header">
            <h2>搜索结果：{{ searchKey }}</h2>
            <el-button type="text" @click="clearSearch">返回分类浏览</el-button>
          </div>
          <div v-else class="category-header">
            <h2>{{ currentCategory.categoryName }}</h2>
            <p>{{ currentCategory.desn }}</p>
          </div>

          <el-empty v-if="products.length === 0" description="暂无商品" />

          <div v-else class="product-list">
            <el-card
              v-for="product in products"
              :key="product.productId"
              class="product-card"
              @click.native="viewProductDetail(product.productId)"
            >
              <div class="product-card-content">
<!--                <img :src="product.imageUrl || '/default-product.jpg'" alt="图片" class="product-image">-->
                <div class="product-info">
                  <h3 class="product-name">{{ product.name }}</h3>
                  <p class="product-description">描述：{{ product.description || '暂无描述' }}</p>
                  <div class="product-footer">
<!--                    <span class="product-price">¥{{ product.price || '待询价' }}</span>-->
                    <el-button size="mini" type="primary" @click.stop="viewProductDetail(product.productId)">查看详情</el-button>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import productService from '@/utils/productService';

export default {
  name: 'Products',
  data() {
    return {
      loading: false,
      searchKey: '',
      isSearch: false,
      selectedCategoryId: '',
      currentCategory: {
        categoryId: '',
        categoryName: '',
        desn: ''
      },
      categories: [], // 所有分类
      products: [] // 当前分类或搜索结果的产品列表
    };
  },
  created() {
    this.initCategories();

    // 如果URL中有搜索参数，则执行搜索
    const searchKey = this.$route.query.search;
    if (searchKey) {
      this.searchKey = searchKey;
      this.handleSearch();
      return;
    }

    // 如果URL中有分类ID参数，则选择该分类
    const categoryId = this.$route.query.categoryId;
    if (categoryId) {
      this.selectedCategoryId = categoryId;
      this.getProductsByCategory(categoryId);
    } else {
      // 如果没有指定分类，则在获取分类列表后选择第一个分类
      this.initCategories().then(() => {
        if (this.categories.length > 0) {
          this.selectedCategoryId = this.categories[0].categoryId;
          this.getProductsByCategory(this.selectedCategoryId);
        }
      });
    }
  },
  watch: {
    '$route.query.categoryId': function(newVal) {
      if (newVal) {
        this.selectedCategoryId = newVal;
        this.getProductsByCategory(newVal);
      }
    },
    '$route.query.search': function(newVal) {
      if (newVal) {
        this.searchKey = newVal;
        this.handleSearch();
      }
    }
  },
  methods: {
    // 初始化分类列表
    async initCategories() {
      try {
        const res = await productService.getCategoryList();
        if (res.data && res.data.data) {
          this.categories = res.data.data;
          console.log('分类列表:', this.categories);
          return true;
        }
        return false;
      } catch (error) {
        console.error('获取分类列表失败:', error);
        this.$message.error('获取分类列表失败');
        return false;
      }
    },
    // 根据分类ID获取产品列表
    async getProductsByCategory(categoryId) {
      this.loading = true;
      this.isSearch = false;
      try {
        const res = await productService.getCategoryProducts(categoryId);
        if (res && res.data) {
          this.currentCategory = {
            categoryId: res.data.categoryId,
            categoryName: res.data.categoryName,
            desn: res.data.desn
          };
          this.products = res.data.data.productList || [];
        } else {
          this.products = [];
          this.$message.warning('未能获取到该分类的商品');
        }
      } catch (error) {
        console.error('获取产品列表失败:', error);
        this.$message.error('获取产品列表失败');
        this.products = [];
      } finally {
        this.loading = false;
      }
    },
    // 搜索产品
    async handleSearch() {
      if (!this.searchKey.trim()) {
        this.$message.warning('请输入搜索关键字');
        return;
      }

      this.loading = true;
      this.isSearch = true;
      try {
        const { data } = await productService.searchProducts(this.searchKey);
        if (data && data.data) {
          this.currentCategory = {
            categoryId: 'search',
            categoryName: '搜索结果',
            desn: `关键字："${this.searchKey}"`
          };
          this.products = data.data.productList || [];
        } else {
          this.products = [];
        }
      } catch (error) {
        console.error('搜索产品失败:', error);
        this.$message.error('搜索产品失败');
        this.products = [];
      } finally {
        this.loading = false;
      }
    },
    // 清除搜索结果，返回分类浏览
    clearSearch() {
      this.isSearch = false;
      this.searchKey = '';
      this.getProductsByCategory(this.selectedCategoryId);
    },
    // 选择分类
    handleCategorySelect(categoryId) {
      this.selectedCategoryId = categoryId;
      this.getProductsByCategory(categoryId);
    },
    // 查看产品详情
    viewProductDetail(productId) {
      this.$router.push({
        path: '/front/detail',
        query: { productId }
      });
    }
  }
};
</script>

<style scoped>

.products-container {
  padding: 20px;
}

.search-area {
  margin-bottom: 20px;
}

.search-input {
  max-width: 500px;
}

.main-content {
  display: flex;
  gap: 20px;
}

.category-section {
  width: 200px;
  flex-shrink: 0;
}

.category-list {
  /*border-right: 1px solid #e6e6e6;*/
}

.product-section {
  flex: 1;
}

.category-header, .search-results-header {
  margin-bottom: 20px;
  padding-bottom: 10px;
  /*border-bottom: 1px solid #e6e6e6;*/
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.product-card {
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.product-card-content {
  display: flex;
  flex-direction: column;
}

.product-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  margin-bottom: 10px;
}

.product-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.product-name {
  margin-top: 0;
  font-size: 16px;
}

.product-description {
  /*color: #666;*/
  flex: 1;
  margin-bottom: 10px;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  color: #ff6700;
  font-weight: bold;
}

.loading-container {
  padding: 20px;
}
</style>
