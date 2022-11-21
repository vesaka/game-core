/* global env */

import Api from './api.js';
import axios from 'axios';

const API_URL = env.url;

axios.defaults.withCredentials = false;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.baseURL = API_URL;

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
axios.defaults.headers.common['X-CSRF-Token'] = `${token}`;

let DEFAULT_LOCALE = 'en';
const applyDefaultParams = (params) => {
    return Object.assign(params, {
        locale: DEFAULT_LOCALE,
    });
};

class LaravelApi extends Api {
    static get(url, params = {}) {
        return axios.get(url, params);
    }
    
    static post(url, params = {}) {
        return axios.post(url, applyDefaultParams(params));
    }
    
    static login(params) {
        return axios.post('login', applyDefaultParams(params));
    }
    
    static register(params) {
        return axios.post('register', applyDefaultParams(params));
    }
    
    static setBearer(token) {
        if (token) {
            axios.defaults.headers.common['X-CSRF-Token'] = `${token}`;
        }
    }
    
    static updateCsrf(token) {
        axios.defaults.headers.common['X-CSRF-Token'] = token;
        document.querySelector('meta[name="csrf-token"]').setAttribute('content', token);
    }
    
    static logout() {
        axios.defaults.headers.common['Authorization'] = ``;
    }
}

export default LaravelApi;


