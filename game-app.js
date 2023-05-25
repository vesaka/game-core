import { h, createApp  } from 'vue';
//import { usePlugins } from './plugins';
import useRouter from './router';

const createGame = (App, routes = []) => {
    const app = createApp({
        render() {return h(App);},
    });
    usePlugins(app);
    useRouter(app, routes);
    app.mount('#app');
    return app;
};
export default {};
export { createGame };

