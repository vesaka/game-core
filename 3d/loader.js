import Container from '$lib/game/core/container';
import {LoadingManager, FileLoader, TextureLoader} from 'three';
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader';

class Loader extends Container {
    constructor() {
        super();
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
                const typeLoader = this.resolveLoader(item);
                const loader = new typeLoader(manager);

                loader.load(`/${type}/${item}`,
                    data => {this.$emit(`${asset}_loaded`, data);},
                    () => {this.$emit(`${asset}_progress`);},
                    (error) => {this.$emit(`${asset}_error`, error);}
                );
            }
        }
        
        manager.onStart = (url, itemsLoaded, itemsTotal) => {
            this.$emit('loader_started', url, itemsLoaded, itemsTotal);
        };
        
        manager.onLoad = () => {
            this.$emit('loader_completed');
        };
        
        manager.onProgres = (url, itemsLoaded, itemsTotal) => {
            this.$emit('loader_progress', url, itemsLoaded, itemsTotal);
        };
        
        manager.onError = () => {
            this.$emit('loader_error');
        };
    }
    
    resolveLoader(asset, type) {
        const ext = asset.substr(asset.lastIndexOf(".") + 1);

        
        let loader;
        if ('ttf' === ext) {
            loader = TTFLoader;
        } else if ('obj' === ext) {
            loader = OBJLoader;
        } else if (['jpg', 'png', 'tif'].indexOf(ext) > -1) {
            loader = TextureLoader;
        } else {
            loader = FileLoader;
        }
        
        
        return loader;
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
