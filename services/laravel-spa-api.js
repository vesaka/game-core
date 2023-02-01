/* global env */

import Api from './api.js';
import axios from 'axios';

axios.defaults.withCredentials = false;
axios.defaults.headers.post['Content-Type'] = 'application/json';

const API_URL = import.meta.env.VITE_BASE_URL;

let DEFAULT_LOCALE = 'en';
const applyDefaultParams = (params) => {
    return Object.assign(params, {
        locale: DEFAULT_LOCALE,
        rest_route: WP_JWT + (params.rest_route || '')
    });
};

class LaravelApi extends Api {
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
}

export default LaravelApi;


