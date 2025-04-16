<!--<template>
  <div class="product-detail-container">
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>
    <div v-else-if="!product.productId" class="error-container">
      <el-empty description="产品不存在或已下架">
        <el-button type="primary" @click="goBack">返回商品列表</el-button>
      </el-empty>
    </div>
    <div v-else class="product-detail-content">
      <el-page-header @back="goBack" :content="product.name" class="page-header"></el-page-header>

      <div class="product-info-container">
        <div class="product-image-section">
          <img :src="product.imageUrl || '/default-product.jpg'" alt="商品图片" class="product-image">
        </div>

        <div class="product-info-section">
          <h1 class="product-name">{{product.name}}</h1>
          <div class="product-category">分类：{{product.categoryId}}</div>
          <div class="product-id">商品编号：{{product.productId}}</div>
          <div class="product-description">{{product.desn || '暂无描述'}}</div>

          <div class="product-price">价格：<span class="price-value">¥{{product.price || '待询价'}}</span></div>

          <div class="product-items" v-if="product.itemList && product.itemList.length > 0">
            <h3>规格选择</h3>
            <el-radio-group v-model="selectedItemId">
              <el-radio
                v-for="item in product.itemList"
                :key="item.itemId"
                :label="item.itemId"
              >
                {{item.name}} - ¥{{item.price}}
              </el-radio>
            </el-radio-group>
          </div>

          <div class="product-quantity">
            <span class="quantity-label">数量：</span>
            <el-input-number
              v-model="quantity"
              :min="1"
              :max="99"
              size="small"
            ></el-input-number>
          </div>

          <div class="action-buttons">
            <el-button type="primary" @click="addToCart" :disabled="!isLoggedIn">加入购物车</el-button>
            <el-button type="danger" @click="buyNow" :disabled="!isLoggedIn">立即购买</el-button>
          </div>

          <div class="login-tip" v-if="!isLoggedIn">
            <el-alert
              title="请先登录，才能进行购买操作"
              type="info"
              show-icon
              :closable="false"
            >
              <el-button type="text" @click="toLogin">去登录</el-button>
            </el-alert>
          </div>
        </div>
      </div>

      <div class="product-detail-tabs">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="商品详情" name="detail">
            <div class="product-detail-content">
              <h3>商品详情</h3>
              <p v-if="product.detailDescription">{{product.detailDescription}}</p>
              <div v-else class="no-data">
                <el-empty description="暂无详细信息"></el-empty>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="规格参数" name="specs">
            <div class="product-specs-content">
              <h3>规格参数</h3>
              <el-table
                v-if="product.specs && product.specs.length > 0"
                :data="product.specs"
                stripe
                style="width: 100%"
              >
                <el-table-column prop="name" label="参数名称" width="180"></el-table-column>
                <el-table-column prop="value" label="参数值"></el-table-column>
              </el-table>
              <div v-else class="no-data">
                <el-empty description="暂无规格参数"></el-empty>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>-->
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
                            @click.native="viewProductDetail(product.productId)"
                    >
                        <div class="product-card-content">
                            <img :src="product.imageUrl || '/default-product.jpg'" alt="商品图片" class="product-image">
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
                                    <span class="product-price">¥{{ product.listPrice || '待询价' }}</span>
                                    <span class="product-price">¥{{ product.unitCost || '待询价' }}</span>
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
import { checkToken } from '@/utils/auth';

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
    async addToCart() {
      if (!this.isLoggedIn) {
        this.$message.warning('请先登录');
        return;
      }

      try {
        const selectedItem = this.selectedItemId ?
          this.product.itemList.find(item => item.itemId === this.selectedItemId) : null;

        const cartItem = {
          productId: this.product.productId,
          itemId: selectedItem ? selectedItem.itemId : null,
          quantity: this.quantity
        };

        await productService.addToCart(cartItem);
        this.$message.success('已添加到购物车');
      } catch (error) {
        console.error('添加到购物车失败:', error);
        this.$message.error('添加到购物车失败');
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
