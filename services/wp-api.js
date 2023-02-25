import axios from 'axios';

axios.defaults.withCredentials = false;
axios.defaults.headers.post['Content-Type'] = 'application/json';

const env = window.env || {};
const API_URL = env.apiUrl || '/';
const API_BASE = env.apiBase || '';
const AUTH_KEY = env.authKey || '';
const WP_JWT = env.jwt || '';
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

class WpApi {
    static get(url, params = {}) {
        params.AUTH_KEY = AUTH_KEY;
        params.locale = DEFAULT_LOCALE;
        return axios.get(API_BASE + url, params);
    }
    
    static post(url, params = {}) {
        return axios.post(API_BASE + url, applyDefaultParams(params));
    }
    
    static $post(url, params = {}) {
        return axios.post(API_BASE + url, params);
    }
    
    static autologin(params = {}) {
        params.rest_route = 'autologin';
        return axios.get(API_URL + '?' + qs(applyDefaultParams(params)));
    }
    
    static login(params) {
        params.rest_route = 'auth';
        return axios.post(API_URL + '?' + qs(applyDefaultParams(params)));
    }
    
    static register(params) {
        params.rest_route = 'users';
        return axios.post('?' + qs(applyDefaultParams(params)));
    }
    
    static resetPassword(params, method = 'post') {
        params.rest_route = 'user/reset_password';
        return axios[method](API_URL + '?' + qs(applyDefaultParams(params)));
    }
    
    static setBearer(token) {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }
    
    static logout(token) {
        axios.defaults.headers.common['Authorization'] = ``;
        return axios.post(API_URL + '?' + qs(applyDefaultParams({
            rest_route: 'auth/revoke',
            jwt: token
        })));
        
    }
}

export default WpApi;


