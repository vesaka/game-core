/* global env */

import axios from 'axios';

class LaravelApi {

    static connect(options) {
        
        axios.defaults.baseURL = options.url
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        return axios.get('/sanctum/csrf-cookie');
    }

    static setBaseUrl(url) {
        axios.defaults.baseURL = url;
        return this;
    }

    static get(url, params = {}) {
        return axios.get(url, params);
    }
    
    static post(url, params = {}) {
        return axios.post(url, params, { 
            headers: {
                //'Access-Control-Allow-Credentials': true,
            }
         });
    }
    
    static async login(params) {
        return axios.post('login', params).then(console.log);
    }
    
    static register(params) {
        return axios.post('register', params);
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

}

export default LaravelApi;


