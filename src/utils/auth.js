
export const getToken = () => {
        return localStorage.getItem('jwt_token');
      };

export const setToken = (token) => {
        return localStorage.setItem('jwt_token',token);
      };

export const checkToken = () => {
        const token = localStorage.getItem('jwt_token');
        if (!token) return false; // Token 不存在
      
        // ✅ 验证 Token 是否过期（假设 Token 是 JWT）
        try {
          const payload = JSON.parse(atob(token.split('.')[1])); // 解码 JWT payload
          const isExpired = Date.now() > payload.exp * 1000;
          return !isExpired; // Token 未过期返回 true
        } catch (error) {
          return false; // Token 格式无效
        }
      };