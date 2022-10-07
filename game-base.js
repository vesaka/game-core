import Container from '$lib/game/core/container';
import { World } from 'cannon-es';
import { Scene, LoadingManager, TextureLoader, FileLoader, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};
const cursor = {
    x: 0,
    y: 0
};
const aspectRatio = sizes.width / sizes.height;

class GameBase extends Container {
    constructor(options) {
        super(options);
        Object.assign(this, options);
        const {canvas} = this;
        this.width = canvas.width;
        this.height = canvas.height;
        this.scene = new Scene();
        this.assets = {};
        if (typeof options.options === 'string') {
            this.options = require(`$lib/game/${options.options}.json`);
        } else if (typeof options.options !== 'object') {
            this.options = {};
        }
        
        window.addEventListener('resize', (ev) => this.onResize(ev));
        
        const $renderer = this.options.renderer || {};
        $renderer.canvas = canvas;

        this.renderer =  new WebGLRenderer($renderer);
        this.onResize();
        this.$emit('renderer_created', this.renderer);
        this.$emit('game_init');

        return this;
    }
    
    load() {
        const assets = this.options.assets;
        const base = assets.base || '/';
        const manager = new LoadingManager();
        manager.onStart = (url, itemsLoaded, itemsTotal) => { this.onStart.call(this, url, itemsLoaded, itemsTotal) };
        manager.onLoad = () => { this.onLoad.call(this) };
        manager.onProgress = (url, itemsLoaded, itemsTotal) => { this.onProgress.call(this, url, itemsLoaded, itemsTotal) };
        manager.onError = (url ) => { this.onError.call(this, url ) };
        
        for (let type in assets) {
            if (Array.isArray(assets[type])) {
                for (let i in assets[type]) {
                    const singularType = type.replace(/s$/, '');
                    const callbacks = this.resolveCallbacks(singularType);
                    const loader = this.resolveLoader(assets[type][i], type.replace(/s$/, ''), manager);
                    
                    loader.load(`${base}${type}/${assets[type][i]}`, 
                        (data) => { callbacks.loaded.call(this, data); },
                        () => { callbacks.progres.call(this) },
                        (error) => {callbacks.error.call(this, error)}
                    );
                }
            }
        }

        const fontLoader = new FontLoader();
        const ttfLoader = new TTFLoader();
        ttfLoader.load(`/assets/fonts/${this.options.ui.font}.ttf`, font => this.setupUI(font));
    }
    
    resolveCallbacks(type) {
        const ucType = type.charAt(0).toUpperCase() + type.slice(1);
        const callbacks = {
            loaded() {},
            progres() {},
            error() {}
        };
        for (let name in callbacks) {
            const method = `on${ucType}${name.charAt(0).toUpperCase() + name.slice(1)}`;
            
            if (typeof this[method] === 'function') {
                callbacks[name] = this[method];
            }
        }
        
        return callbacks;
    }
    
    resolveLoader(asset, type, manager) {
        const ext = asset.substr(asset.lastIndexOf(".") + 1);
        const ucType = type.charAt(0).toUpperCase() + type.slice(1);
        const callbacks = {
            loaded() {},
            progres() {},
            error() {}
        };
        for (let name in callbacks) {
            const method = `on${ucType}${name.charAt(0).toUpperCase() + name.slice(1)}`;
            
            if (typeof this[method] === 'function') {
                callbacks[name] = this[method];
            }
        }
        

        
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
        
        
        return new loader(manager);
    }
    
    onLoad() {
        this.build();
    }
    
    onProgress(url, itemsLoaded, itemsTotal) {
    }
    
    onStart() {
    }
    
    onError() {
        
    }

    build() {

    }

    render() {

    }
    
    destroy() {
    }
    
    createCamera() {
        const {options} = this.options.camera;
        
        const camera = new PerspectiveCamera(
                options.fov,
                width / height,
                options.near,
                options.far
        );

        camera.position.set(
            options.position.x,
            options.position.y,
            options.position.z
        );

        


        return camera;
    }
    
    setupOrbitControls() {
        const { camera, canvas } = this;
        const controls = new OrbitControls(camera, canvas);
        controls.enableDamping = true;
        
        this.controls = controls;
    }
    
    add(object) {
        this.world.addBody(object.body);
        this.scene.add(object.model);
    }
    
    remove(object) {
        this.world.removeBody(object.body);
        this.scene.remove(object.model);
    }
    
    listenForEvents() {
        for (name in mapInteractions) {
            if (typeof this[mapInteractions[name]] === 'function') {
                this.canvas.addEventListener(name, (ev) => {
                    //$this[mapInteractions[name]].call($this, ev);
                });
            }
        }
    }
    
    getKeyCharCode(e) {
        let keynum;
        if(window.event) { // IE                  
          keynum = e.keyCode;
        } else if(e.which){ // Netscape/Firefox/Opera                 
          keynum = e.which;
        }
        
        return keynum;
    }
    
    onResize() {
        const {camera, renderer, canvas, controls} = this;
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;
        //Update camera
        if (camera) {
            camera.aspect = sizes.width / sizes.height;
            camera.updateProjectionMatrix();
        }
        //Update renderer
        canvas.style.width = `${sizes.width}px`;
        canvas.style.height = `${sizes.height}px`;
        renderer.setSize(sizes.width, sizes.height);
    }
    
    absorbEvent(ev) {
        const e = ev || window.event;
        e.preventDefault && e.preventDefault();
        e.stopPropagation && e.stopPropagation();
        e.cancelBubble = true;
        e.returnValue = false;
        return false;
    }
    
};

const mapInteractions = {
    click: 'onClick',
    dblclick: 'onDoubleClick',
    keydown: 'onKeyDown',
    keyup: 'onKeyUp',
};

export default GameBase;

