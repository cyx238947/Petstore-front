
<template>
    <div class="category-detail-container">
        <div v-if="loading" class="loading-container">
            <el-skeleton :rows="10" animated />
        </div>
        <div v-else-if="!product.categoryId" class="error-container">
            <el-empty description="类别不存在或已下架">
                <el-button type="primary" @click="goBack">返回商品分类</el-button>
            </el-empty>
        </div>
        <div v-else class="category-detail-content">
            <el-page-header @back="goBack" :content="product.categoryId	" class="page-header"></el-page-header>

            <div class="category-info-container">
                <h1 class="product-name">{{ product.productId	 }}</h1>
                <p class="category-description">{{ product.desn || '暂无描述' }}</p>
            </div>

            <div class="product-list-section">
                <h3>商品列表</h3>
                <div v-if="product.itemList	 && product.itemList	.length > 0" class="product-list">
                    <el-card
                            v-for="product in product.itemList	"
                            :key="product.productId"
                            class="product-card"
                            @click.native="viewProductDetail(product.itemId)"
                    >
                        <div class="product-card-content">
                            <img :src="getImagePath(product.image)" alt="商品图片" class="product-image">
                            <div class="product-info">
                                <h3 class="product-name">{{ product.itemId	 }}</h3>
                                <h3 class="product-name">{{ product.productId		 }}</h3>
                                <h3 class="product-name">{{ product.listPrice		 }}</h3>
                                <h3 class="product-name">{{ product.unitCost			 }}</h3>
                                <h3 class="product-name">{{ product.supplierId			 }}</h3>
                                <h3 class="product-name">{{ product.status				 }}</h3>
                                <h3 class="product-name">{{ product.attribute1					 }}</h3>
                                <p class="product-description">{{ product.description || '暂无描述' }}</p>
                                <div class="product-footer">
                                    <span class="product-price">商品价格 ¥{{ product.listPrice || '待询价' }}</span>
                                    <span class="product-price">商品折后价 ¥{{ product.unitCost || '待询价' }}</span>
                                    <el-button type="primary" size="small" @click.stop="addToCart(product)">
                                        加入购物车
                                    </el-button>
                                </div>
                            </div>
                        </div>
                    </el-card>
                </div>
                <div v-else class="no-data">
                    <el-empty description="该类别下暂无商品"></el-empty>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import productService from '@/utils/productService';
import {checkToken, getToken } from '@/utils/auth';
export default {
  name: 'ProductDetail',
  data() {
    return {
      loading: true,
      productId: '',
      product: {},
      category: {}, // 初始化 category 对象
      categoryName: '',
      quantity: 1,
      selectedItemId: '',
      activeTab: 'detail',
      isLoggedIn: false
    };
  },
    created() {
        this.productId = this.$route.query.productId;
        this.isLoggedIn = checkToken();
        if (this.productId) {
            this.getProductDetail(this.productId);
        } else {
            this.loading = false;
        }
    },
  methods: {

      getImagePath(imageName) {
          if (!imageName) {
              return '/default-product.jpg'; // 默认图片路径
          }
          try {
              // 动态加载本地图片
              return require(`@/assets/imgs/${imageName}`);
          } catch (error) {
              console.warn(`Image not found: ${imageName}`);
              return '/default-product.jpg'; // 如果图片不存在，返回默认图片
          }
      },
      // viewProductDetail(itemId) {
      //     this.$router.push({
      //         path: '/front/commodityDetail',
      //         query: { itemId }
      //     });
      // },
      async getProductDetail(productId) {
          this.loading = true;
          try {
              const { data } = await productService.getProductDetail(productId);
              if (data && data.data) {
                  this.product = {
                      productId: data.data.productId,
                      name: data.data.name,
                      categoryId: data.data.categoryId,
                      description: data.data.description || '',
                      price: data.data.price,
                      detailDescription: data.data.detailDescription || '',
                      imageUrl: data.data.imageUrl,
                      itemList: data.data.itemList || [],
                      specs: data.data.specs || []
                  };
                  console.log("this.itemList")
                  console.log(this.product.itemList);
                  // 如果有商品规格，默认选中第一个
                  if (this.product.itemList && this.product.itemList.length > 0) {
                      this.selectedItemId = this.product.itemList[0].itemId;
                  }
                  // 获取分类名称
                  await this.getCategoryName(this.product.categoryId);
              } else {
                  this.product = {};
                  this.$message.warning('商品不存在或已下架');
              }
          } catch (error) {
              console.error('获取产品详情失败:', error);
              this.$message.error('获取产品详情失败');
              this.product = {};
          } finally {
              this.loading = false;
          }
      },
    async getCategoryName(categoryId) {
      try {
        // 如果有categoryId，尝试获取分类名称
        if (categoryId) {
          const res = await productService.getCategoryList();
          if (res.data && res.data.data) {
            const categories = res.data.data;
            const category = categories.find(c => c.categoryId === categoryId);
            if (category) {
              this.categoryName = category.categoryName;
              return;
            }
          }
        }
        this.categoryName = '未知分类';
      } catch (error) {
        console.error('获取分类名称失败:', error);
        this.categoryName = '未知分类';
      }
    },
    goBack() {
      // 返回商品列表页
      this.$router.push('/front/products');
    },
    toLogin() {
      // 跳转到登录页
      this.$router.push({
        path: '/login',
        query: { redirect: this.$route.fullPath }
      });
    },
      async addToCart(product) {
          console.log('Adding to cart:', product.itemId);
          console.log('jwt:');
          console.log('jwt:', getToken());
          if (!this.isLoggedIn) {
              this.$message.warning('请先登录');
              return;
          }
          try {

              // 调用后端接口
              const response = await productService.addToCart(product);

              if (response.data.statusInfo	==="success") {
                  this.$message.success('成功加入购物车');
              } else {
                  this.$message.error('加入购物车失败');
              }
          } catch (error) {
              console.error('加入购物车失败:', error);
              this.$message.error('加入购物车失败');
          }
      },
    buyNow() {
      if (!this.isLoggedIn) {
        this.$message.warning('请先登录');
        return;
      }

      // 先添加到购物车，然后跳转到购物车页面
      this.addToCart().then(() => {
        this.$router.push('/front/cart');
      });
    }
  }
};
</script>

<style scoped>
.category-detail-container {
    background-color: #f5f5f5;
    padding: 20px;
    min-height: 100vh;
}

.category-info-container {
    background-color: white;
    border-radius: 4px;
    padding: 20px;
    margin-bottom: 30px;
}

.category-name {
    font-size: 24px;
    margin-top: 0;
    margin-bottom: 15px;
}

.category-description {
    color: #666;
    margin-bottom: 20px;
}

.product-list-section {
    background-color: white;
    border-radius: 4px;
    padding: 20px;
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

/*.product-image {*/
/*    width: 100%;*/
/*    height: 200px;*/
/*    object-fit: cover;*/
/*    margin-bottom: 10px;*/
/*}*/
.product-image {
    width: 100%; /* 图片宽度占满容器 */
    height: auto; /* 自动高度，保持宽高比 */

    object-fit: cover;
    margin-bottom: 10px;
    transform: scale(0.8); /* 缩小到 80% */
    transform-origin: center; /* 缩放中心点为图片中心 */
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
    color: #666;
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

.no-data {
    padding: 30px 0;
}
</style>
