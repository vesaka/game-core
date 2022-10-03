import { createRouter, createWebHashHistory, createWebHistory  } from 'vue-router';
import VueAxios from 'vue-axios';
import axios from 'axios';

const useRouter = (app, routes) => {   
    const router = createRouter({
        history: createWebHistory(),
        mode: 'history',
        routes
    });
    
    app.use(router);
    app.use(VueAxios, axios);
};

export default useRouter;
