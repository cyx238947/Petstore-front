import request from './request';
import authrequest from './authrequest';

/**
 * 商品服务类，提供与商品相关的API调用
 */
export default {
  /**
   * 获取指定分类下的产品列表
   * @param {string} categoryId - 分类ID
   * @returns {Promise} - 返回Promise对象
   */
  getCategoryProducts(categoryId) {
    return request.get(`/catalog/category/${categoryId}`);
  },

  /**
   * 获取产品详情
   * @param {string} productId - 产品ID
   * @returns {Promise} - 返回Promise对象
   */
  getProductDetail(productId) {
    return request.get(`/catalog/product/${productId}`);
  },

  /**
   * 搜索产品
   * @param {string} keyword - 搜索关键词
   * @returns {Promise} - 返回Promise对象
   */
  searchProducts(keyword) {
    return request.get(`/catalog/search/${keyword}`);
  },

  /**
   * 向购物车添加商品（需要用户登录）
   * @param {Object} item - 商品信息
   * @returns {Promise} - 返回Promise对象
   */
  addToCart(item) {
    return request.post('/cart/add', item);

  },

  getCategoryList() {
    return request.get('/catalog/category');
  }
};
