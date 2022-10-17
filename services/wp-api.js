import Api from './api.js';
import axios from 'axios';

axios.defaults.withCredentials = false;
axios.defaults.headers.post['Content-Type'] = 'application/json';

const API_URL = import.meta.env.VITE_BASE_URL;
const API_BASE = import.meta.env.VITE_API_BASE;
const AUTH_KEY = import.meta.env.VITE_AUTH_KEY;
const WP_JWT = import.meta.env.VITE_WP_JWT;
const qs = params => Object.keys(params).map(key => key + '=' + params[key]).join('&');
axios.defaults.baseURL = API_URL;

let DEFAULT_LOCALE = 'en';
const applyDefaultParams = (params) => {
    return Object.assign(params, {
        locale: DEFAULT_LOCALE,
        AUTH_KEY,
        rest_route: WP_JWT + (params.rest_route || '')
    });
};

class WpApi extends Api {
    static get(url, params = {}) {
        params.AUTH_KEY = AUTH_KEY;
        params.locale = DEFAULT_LOCALE;
        return axios.get(API_BASE + url, params);
    }
    
    static post(url, params = {}) {
        return axios.post(API_BASE + url, applyDefaultParams(params));
    }
    
    static login(params) {
        params.rest_route = 'auth';
        return axios.post(API_URL + '?' + qs(applyDefaultParams(params)));
    }
    
    static register(params) {
        params.rest_route = 'users';
        return axios.post('?' + qs(applyDefaultParams(params)));
    }
    
    static setBearer(token) {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }
    
    static logout() {
        return axios.post(API_URL + '?' + qs(applyDefaultParams({rest_route: 'auth/revoke'})));
        axios.defaults.headers.common['Authorization'] = ``;
    }
}

export default WpApi;


