import axios from 'axios';

import nprogress from 'nprogress'
import { Message } from 'element-ui';
import 'nprogress/nprogress.css'
// `http://122.112.218.153:8893/api/private/v1/`
//'http://127.0.0.1:8888/api/private/v1/'
var obj = axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1/'
})
obj.interceptors.request.use(function(config) {
    nprogress.start();
    config.headers.Authorization = localStorage.getItem("token")
    return config;
})
obj.interceptors.response.use(function(config) {
    nprogress.done();

    if (config.data.meta.status == 500) {
        return Message.error(config.data.meta.msg);
    } else if (config.data.meta.status == 401) {
        return Message.error(config.data.meta.msg);
    } else if (config.data.meta.status == 404) {
        return Message.error("请求资源不存在");
    }

    return config;
})
export default obj