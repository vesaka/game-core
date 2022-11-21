import Container from '$lib/game/core/container';
import {LoadingManager, FileLoader, TextureLoader} from 'three';

class Loader extends Container {
    loaders = {};
    constructor(loaders = {}) {
        super();
        this.loaders = loaders;
        return this;
    }
    
    load() {
        const assets = this.assets;
        const base = this.settings.assets.base || '/';
        const manager = new LoadingManager();        
        for (let type in assets) {
            for(let id in assets[type]) {
                const item = assets[type][id];

                const asset = isNaN(id) ? id : type.replace(/s$/, '');
                const ext = item.substr(item.lastIndexOf(".") + 1);
                const typeLoader = this.loaders[ext] || FileLoader;
                const loader = new typeLoader(manager);

                loader.load(`/${item}`,
                    data => {
                        this.$emit(`${asset}_loaded`, data);
                    },
                    (obj) => {this.$emit(`${asset}_progress`, obj);},
                    (error) => {this.$emit(`${asset}_error`, error);}
                );
            }
        }
        
        manager.onStart = (url, itemsLoaded, itemsTotal) => {
            this.$emit('loader_started', url, itemsLoaded, itemsTotal);
        };
        
        manager.onLoad = (a, b) => {
            
            this.$emit('loader_completed');
        };
        
        manager.onProgress = (url, itemsLoaded, itemsTotal) => {
            this.$emit('loader_progress', {
                url, itemsLoaded, itemsTotal,
                progress: Math.round(itemsLoaded / itemsTotal * 100)
            });
        };
        
        manager.onError = () => {
            this.$emit('loader_error');
        };
    }
    
    resolveLoader(asset, type) {
        const ext = asset.substr(asset.lastIndexOf(".") + 1);
        if (this.loaders[ext]) {
            return this.loaders[ext];
        }
        
        return FileLoader;
    }
    
    onLoad() {
        this.$emit('loader_done');
    }
    
    onProgress(url, itemsLoaded, itemsTotal) {
        this.$emit('loader_progress', url, itemsLoaded, itemsTotal);
    }
    
    onStart() {
        this.$emit('loader_start');
    }
    
    onError() {
        this.$emit('loader_error');
    }
};

export default Loader;
