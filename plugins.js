/* global require */

/** Register plugins */
const requirePlugins = require.context('$v/game/plugins', false, /[a-z]\w+(-plugin.js)$/);

const usePlugins = function (app) {

    requirePlugins.keys().forEach(name => {
        const plugin = requirePlugins(name).default;
        app.use(plugin, plugin.options || {});
    });
};
export default {};
export {usePlugins};