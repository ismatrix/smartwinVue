import axios from 'axios';
import { showMessage } from "./status"
import { ElMessage } from 'element-plus'

axios.defaults.timeout = 60000;

// axios.defaults.baseURL = 'https://quantowin.com/api/' 
axios.defaults.baseURL = import.meta.env.VITE_API_DOMAIN;

axios.interceptors.request.use(
  config => {
    config.headers = {
      'Content-Type': 'application/json;charset=UTF-8'
    };
    if(localStorage.token) {
      config.headers.Authorization = 'Bearer ' + localStorage.token
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);



axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    const { response } = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围
      ElMessage.error(response.data.error)
      return Promise.reject(response.data)
    } else {
      ElMessage.error('Response Error');
    }
  }
);

// 封装 GET POST 请求并导出
export function request(baseURL = '', url = '', params = {}, type = 'POST') {
  //设置 url params type 的默认值
  return new Promise((resolve, reject) => {
    let promise
    if (type.toUpperCase() === 'GET') {
      promise = axios({
        url,
        params,
        baseURL: baseURL
      })
    } else if (type.toUpperCase() === 'POST') {
      promise = axios({
        method: 'POST',
        url,
        data: params,
        baseURL: baseURL
      })
    }
    //处理返回
    promise.then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}