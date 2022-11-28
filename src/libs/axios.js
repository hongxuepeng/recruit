import axios from 'axios';
import { Notify } from 'vant';
import { clearUserCookie, getStorage } from './utils';
// 统一请求路径前缀
let base = process.env.VUE_APP_ENV==='prod' ? 'http://agentwebapi.szmyxxjs.com/api/App' : 'http://txwebapi.szmyxxjs.com/api/App'
// 超时设定
axios.defaults.timeout = 15000;

axios.interceptors.request.use(config => {
    return config;
}, err => {
    Notify({ type: 'danger', message: '请求超时' });
    return Promise.resolve(err);
});
// http response 拦截器
axios.interceptors.response.use(response => {
    // 根据返回的code值来做不同的处理(和后端约定)
    const res = response.data;
    switch (res.code) {
        case 2:
            // token失效，退到登录
            clearUserCookie();
            Notify({ type: 'danger', message: res.msg || 'token失效，请重新登录' });
            break;
        case 0:
            // 错误
            Notify({ type: 'danger', message: res.msg || '程序异常，请稍后重试' });
            break;
        default:
            return res;
    }

    return response;
}, (err) => {
    // 返回状态码不为200时候的错误处理
    Notify({ type: 'danger', message: err.toString() });
    return Promise.reject(err);
});

export const getRequest = (url, params) => {
    let token = getStorage('token') || '';
    let agentGuid = getStorage('agentGuid') || '';
    params = {
        token,
        agentGuid,
        ...params
    }
    return axios({
        method: 'get',
        url: `${base}${url}`,
        params: params
    });
};

export const postRequest = (url, params) => {
    let token = getStorage('token') || '';
    let agentGuid = getStorage('agentGuid') || '';
    params = {
        token,
        agentGuid,
        ...params
    }
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        headers: {
            'Content-Type': 'application/json'
        }
    });
};
