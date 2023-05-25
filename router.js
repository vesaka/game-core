import { createRouter, createWebHashHistory, createWebHistory  } from 'vue-router';

const useRouter = (app, routes) => {   
    const router = createRouter({
        history: createWebHistory(),
        mode: 'history',
        routes
    });
    
    app.use(router);

};

export default useRouter;
