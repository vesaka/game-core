/* global env */

import axios from 'axios';
import cookie from 'js-cookie';

axios.defaults.withCredentials = false;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';


let DEFAULT_LOCALE = 'en';
const applyDefaultParams = (params) => {
    return Object.assign(params, {
        locale: DEFAULT_LOCALE,
    });
};

class ExpressApi {
    static setBaseUrl(url) {
        axios.defaults.baseURL = url;
    }
    
    static get(url, params = {}) {
        return axios.get(url, params);
    }
    
    static post(url, params = {}) {
        return axios.post(url, applyDefaultParams(params));
    }
    
    static setBearer(token) {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }
    
    static logout() {
        axios.defaults.headers.common['Authorization'] = ``;
    }
    
    static getCsrfToken(url = 'csrf-token') {
        axios.get(url).then(res => {
            axios.defaults.headers.common['X-CSRF-TOKEN'] = res.data;
        });
    }
    
}

export default ExpressApi;


