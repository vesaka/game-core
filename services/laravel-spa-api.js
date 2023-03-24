/* global env */

import axios from 'axios';
axios.defaults.withCredentials = false;
axios.defaults.headers.post['Content-Type'] = 'application/json';

const env = window.env || {};
const API_URL = env.apiUrl || '/';

let DEFAULT_LOCALE = 'en';
const applyDefaultParams = (params) => {
    return Object.assign(params, {
        locale: DEFAULT_LOCALE,
    });
};

class LaravelApi {
    static get(url, params = {}) {
        params.AUTH_KEY = AUTH_KEY;
        params.locale = DEFAULT_LOCALE;
        return axios.get(API_BASE + url, params);
    }
    
    static post(url, params = {}) {
        return axios.post(API_BASE + url, applyDefaultParams(params));
    }
    
    static login(params) {
        return axios.post(API_URL + '?' + applyDefaultParams(params));
    }
    
    static register(params) {
        return axios.post('?' + qs(applyDefaultParams(params)));
    }
    
    static setBearer(token) {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }
    
    static logout() {
        axios.defaults.headers.common['Authorization'] = ``;
    }
    
    static updateCsrf(token) {
        axios.defaults.headers.common['X-CSRF-Token'] = token;
    }
}

export default LaravelApi;


