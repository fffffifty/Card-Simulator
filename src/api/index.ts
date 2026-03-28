

import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';

// 基础配置
const axiosConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_URL, // 你的 API 基础 URL
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
    // 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem(ConstantKey.USER) ?? '{}')?.access_token
  },
};

// 创建 Axios 实例
const axiosInstance: AxiosInstance = axios.create(axiosConfig);
// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 设置token
    config.headers['Authorization'] = 'Bearer ' + JSON.parse('{}')?.access_token
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做点什么
    console.log('URL:', response.request.responseURL);
    console.log('Response:', response.data);
    return response.data;
  },
  (error) => {
    // 对响应错误做点什么
    console.error('Response Error:', error);
    return Promise.reject(error);
  }
);

// 封装 登陆 POST 请求
const loginPOST = <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return axios.create({
    timeout: 10000,
    headers: {
      'Authorization': '',
    }
  }).post<T>(url, config) as Promise<T>;
};

// 封装 GET 请求
const get = <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return axiosInstance.get<T>(url, config) as Promise<T>;
};

// 封装 POST 请求
const post = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return axiosInstance.post<T>(url, data, config) as Promise<T>;
};

// 封装 PUT 请求
const put = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return axiosInstance.put<T>(url, data, config) as Promise<T>;
};

// 封装 DELETE 请求
export const del = <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return axiosInstance.delete<T>(url, config) as Promise<T>;
};

export const Api = {get, post, put, del, loginPOST };

export enum RequestPath {

}