<template>
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
            itemId: '',
            product: {},
            categoryName: '',
            quantity: 1,
            selectedItemId: '',
            activeTab: 'detail',
            isLoggedIn: false
        };
    },
    created() {
        this.itemId = this.$route.query.itemId;
        console.log('itemId:', this.itemId);
        this.isLoggedIn = checkToken();
        if (this.itemId) {
            this.getProductDetail(this.itemId);
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
                    this.getCategoryName(this.product.categoryId);
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
.product-detail-container {
    background-color: #f5f5f5;
    padding: 20px;
    min-height: 100vh;
}

.loading-container {
    background-color: white;
    border-radius: 4px;
    padding: 20px;
}

.error-container {
    background-color: white;
    border-radius: 4px;
    padding: 50px 20px;
    text-align: center;
}

.product-detail-content {
    background-color: white;
    border-radius: 4px;
    padding: 20px;
}

.page-header {
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
}

.product-info-container {
    display: flex;
    gap: 30px;
    margin-bottom: 30px;
}

.product-image-section {
    flex: 1;
    max-width: 45%;
}

.product-image {
    width: 100%;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.product-info-section {
    flex: 1;
}

.product-name {
    font-size: 24px;
    margin-top: 0;
    margin-bottom: 15px;
}

.product-category, .product-id {
    color: #666;
    margin-bottom: 10px;
}

.product-description {
    margin: 20px 0;
    padding: 15px;
    background-color: #f9f9f9;
    border-radius: 4px;
}

.product-price {
    font-size: 18px;
    margin: 20px 0;
}

.price-value {
    color: #ff6700;
    font-size: 26px;
    font-weight: bold;
}

.product-items {
    margin: 20px 0;
}

.product-quantity {
    margin: 20px 0;
}

.quantity-label {
    margin-right: 10px;
}

.action-buttons {
    margin: 25px 0;
}

.login-tip {
    margin-top: 15px;
}

.product-detail-tabs {
    margin-top: 30px;
}

.no-data {
    padding: 30px 0;
}
</style>
