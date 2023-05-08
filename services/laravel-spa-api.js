/* global env */

import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/json';
const axiosInstance = axios.create({
    withCredentials: true,
});
let DEFAULT_LOCALE = 'en';
const applyDefaultParams = (params) => {
    return Object.assign(params, {
        locale: DEFAULT_LOCALE,
    });
};

class LaravelApi {

    static connect(options) {

        axiosInstance.defaults.baseURL = options.url
        axiosInstance.defaults.withCredentials = true;
        axios.defaults.baseURL = options.url;
        return axiosInstance.get('/sanctum/csrf-cookie', {withCredentials: true})
        .then((response) => {
            console.log(response);
        });
        return this;
    }

    static setBaseUrl(url) {
        axios.defaults.baseURL = url;
        return this;
    }

    static get(url, params = {}) {
        return axios.get(url, params);
    }
    
    static post(url, params = {}) {
        return axiosInstance.post(url, params, {withCredentials: true});
    }
    
    static async login(params) {
        return axios.post('login-test', params).then(console.log);
    }
    
    static register(params) {
        return axios.post('?' + applyDefaultParams(params));
    }
    
    static setBearer(token) {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        return this;
    }
    
    static logout() {
        axios.defaults.headers.common['Authorization'] = ``;
    }
    
    static updateCsrf(token) {
        axios.defaults.headers.common['X-CSRF-Token'] = token;
        return this;
    }

    static handshake(path) {
        axios.get(path || '/sanctum/csrf-cookie', { withCredentials: true })
        .then(response => {
            if (path) {
                //axios.defaults.headers.common['X-CSRF-TOKEN'] = response.data;
            }
            console.log(response.headers);
        });
        return this;
    }
}

export default LaravelApi;


