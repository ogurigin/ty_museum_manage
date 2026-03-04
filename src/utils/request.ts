import axios, { AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import { ElMessage } from 'element-plus';
import router from '@/router';

const baseURL = import.meta.env.VITE_APP_BASE_API;

const service: AxiosInstance = axios.create({
    baseURL,
    timeout: 15000,
});
service.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        if (config.headers) {
            // config.headers["Content-Type"] = 'application/x-www-form-urlencoded'
        }
        return config;
    },
    (error: AxiosError) => {
        ElMessage.error(error.message);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    (response: AxiosResponse) => {
        const { data } = response 
        if (response.status === 200 && data.success) {
            return response;
        } else if (data.errorCode === '401') {
            router.push({ path: '/login' });
        }
        else {
            ElMessage.error(data.errorMessage);
            return Promise.reject();
        }
    },
    (error: AxiosError) => {
        ElMessage.error(error.message);
        return Promise.reject();
    }
);

export default service;
