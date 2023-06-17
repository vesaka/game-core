import { createRouter, createWebHistory } from 'vue-router';
import { t } from '$core/utils/i18n';
export const createAppRouter = (options) => {
    const router = createRouter({
        history: createWebHistory(),
        mode: 'history',
        routes: options.routes
    });

    if (typeof options.beforeEach === 'function') {
        router.beforeEach(options.beforeEach);
    }

    if(typeof options.afterEach === 'function') {
        router.afterEach(options.afterEach);
    }

    router.afterEach((to, from) => {
        document.body.classList.remove(from.name);
        document.body.classList.add(to.name);
        
        if (from.meta.className) {
            document.body.classList.remove(from.meta.className);
        }
        
        if (to.meta.className) {
            document.body.classList.add(to.meta.className);
        }
        
        nextTick(() => {
            
            if (to.meta.title) {
                document.title = `${to.meta.title} | ${t('title')}`;
            } else {
                document.title = t('title');
            }
    
        });
    });

    return router;

};
