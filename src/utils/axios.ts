import axios from 'axios'

export const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
})


instance.interceptors.response.use(function (response) {
  return response;
}, async function (error) {
  const originalRequest = error.config;
  if (error.response.status == 401 && error.config && !error.config._isRetry) {
    originalRequest._retry = true;
    try {
      const deviceIdFromStorage = localStorage.getItem('deviceId');
      await instance.post(`/auth/refresh`, null,
        {
          withCredentials: true,
          params: {
            deviceId: deviceIdFromStorage
          }
        })
      return instance.request(originalRequest);
    } catch (e) {
      console.log('Not authorized')
    }
    return Promise.reject(error);
  }
  return Promise.reject(error);
});