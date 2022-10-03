import Container from '$lib/game/core/container';
import { deepMerge, deepGet, deepSet, raw, isObject } from '$lib/game/core/utils/object';
class Loader extends Container {
    constructor() {
        super();

        this.$set('loader', this.app.loader);
        const events = {
            fonts: ['loaded']
        };

        this.$listen(events);

        return this;
    }

    

    preload() {
        const {assets, options} = this;
        this.loader.baseUrl = options.assetsBaseUrl || '/';
        for (let type in assets) {
            if (typeof assets[type] === 'string') {

                this.loadAsset(type, assets[type]);
            } else if (Array.isArray(assets[type])) {
                const singularType = type.replace(/s$/, '');
                for (let i in assets[type]) {
                    this.loadAsset(`${singularType}_${i}`, assets[type][i], singularType);
                }
            } else if (isObject(assets[type])) {
                for (let name in assets[type]) {
                    this.loadAsset(`${type}_${name}`, `${assets[type][name]}`, type);
                }
            }
        }
    }

    loadAsset(name, url, type = null) {
        const $this = this;
        const method = `${type || name}_loaded`;
        const key = type ? name.replace(`${type}_`, '') : name;
        
        if (this.loader.resources[name]) {
            return;
        }
        
        this.loader.add({
            name,
            url,
            onComplete(asset) {
                asset.key = key;
                $this.$emit(method, asset);
//                $this.$db.getItem(asset.name, _asset => {
//                    if (!_asset) {
//                        $this.$db.setItem(asset.name, {
//                            name: asset.name,
//                            key: asset.key,
//                            //data: asset.data
//                        }, a => {
//                            console.log(a);
//                        });
//                    }
//                });
            }
        });

    }
    
    load() {
        const loader = this.loader;

        loader.onProgress.add((loader, asset) => {
            this.$emit('loader_progress', loader);
            this.$emit(`${asset.key}_progress`, asset, loader);
            
        });
        
        loader.onError.add((error, asset) => {
            this.$emit(`${asset.key}_error`, error);
        });

        loader.onStart.add((loader, asset) => {
            this.$emit(`loader_start`, asset, loader);
            
        });
        
        loader.onLoad.add((loader, asset) => {
            //this.$emit(`${asset.key}_loaded`, asset);
        });
        loader.onComplete.add((loader) => {
            this.$emit(`loader_complete`, loader);
            this.$off('loader_complete');
            loader.onComplete.detachAll();
         });

        loader.load();
    }
    
    fonts_loaded() {
        this.load();
    }

}
;


export default Loader;



