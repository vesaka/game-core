/* global Promise */

import Container from '$core/container';
import { Application, InteractionManager, Container as PixiContainer } from 'pixi.js';
import FontFaceObserver from 'fontfaceobserver';
import { raw, extend } from '$core/utils/object';

import AppLoader from './loaders/loader';
import FontLoader from './loaders/font-loader';
import LocaleLoader from './loaders/locale-loader';

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};
const cursor = {
    x: 0,
    y: 0
};

const aspectRatio = sizes.width / sizes.height;
let $this = null;

class GameBase extends Container {
    constructor(options) {
        super(options, true);
        const {container} = this;
        this.width = container.clientWidth;
        this.height = container.clientHeight;
        this.layers = [];
        if (typeof options.options === 'string') {
            this.$set('options', require(`$lib/game/${options.options}.json`));
        } else if (typeof options.options !== 'object') {
            this.$set('options', {});
        }

        window.addEventListener('orientationchange', this.onResize);
        window.addEventListener('resize', this.onResize);

        this.app = new Application(Object.assign({
            width: this.options.game.width,
            height: this.options.game.height,
            //resizeTo: window,
            sharedLoader: true,
            resolution: Math.min(window.devicePixelRatio || 1, 2)
        }, this.options.app));

        this.$set('app', this.app);
        
        this.$set('scale', this.options.scale || 1);        
        Object.assign(this.app.view.style, this.options.view.style);
        Object.assign(this.app.renderer, this.options.renderer);
        Object.assign(this.app.stage, this.options.stage);

        container.appendChild(this.app.view);

        this.app.stage.interactive = true;
        this.app.stage.hitArea = this.app.screen;
        this.doResize = null;
        this.ready = false;
        $this = this;
        this.onResize();
        
        this.$listen({
            loader: ['complete'],
            game: ['init', 'ready', 'destroy'],
        });
        this.$emit('game_init');
        
        return this;
    }

    load() {
        const { resources, progress } = this.app.loader;
        if (progress === 100) {
            this.app.loader.reset();
        } 
        
        const appLoader = new AppLoader;
        const fontLoader = new FontLoader;
        const localeLoader = new LocaleLoader;
        appLoader.preload();
        fontLoader.load();
    }
    
    reload() {
        
    }
    
    loader_complete() {
        if (!this.ready) {
            this.build();
            this.ready = true;
        }
    }

    createWorld(props = {}) {
        if (!this.world) {
            const attr = Object.assign({
                gravity: {
                    x: 0,
                    y: 0
                }
            }, props);
        }
    }

    ready() {

    }

    build() {

    }

    render() {

    }

    destroy() {
        this.$emit('game_destroy');
        this.$clear();
        this.app.loader.reset();
        this.app.ticker.stop();
        
        window.removeEventListener('orientationchange', this.onResize);
        window.removeEventListener('resize', this.onResize);
        this.$set('app', null);
    }

    add(object, layer = null) {
        if (typeof layer === 'string') {
            if (!this.layers[layer]) {
                this.layers[layer] = new PixiContainer;
                this.scene.addChild(this.layers[layer]);
            }

            this.layers[layer].addChild(object.model);
        } else {
            this.scene.addChild(object.model);
        }
    }
    
    addMultiple(items, layer = null) {
        for (let i in items) {
            this.add(items[i], layer);
        }
    }

    remove(object, layer = null) {
        if (typeof layer === 'string' && this.layers[layer]) {
            this.layers[layer].removeChild(object.model);
        } else {
            this.scene.removeChild(object.model);
        }
    }

    getKeyCharCode(e) {
        let keynum;
        if (window.event) {               
            keynum = e.keyCode;
        } else if (e.which) {        
            keynum = e.which;
        }

        return keynum;
    }

    onResize(ev) {
        if (!$this) {
            return;
        }
        if (ev) {
            ev.stopPropagation();
        }
        const {app, options, container} = $this;

        const canvas = app.view;
        clearTimeout($this.doResize);
        $this.doResize = setTimeout((ev) => $this.resizeCanvas(ev), 300);

    }
    
    resizeCanvas(ev) {
        const {app, options, container, ui} = this;
        const {clientWidth: w, clientHeight: h} = container;
        const ratio = (app.renderer.width / app.renderer.height).toFixed(2);

        if (w / h >= ratio) {
            sizes.width = w / ratio;
            sizes.height = h; 
        } else {
            sizes.width = w;
            sizes.height = (w / ratio).toFixed(2);
        }
        
        app.view.style.width = `${sizes.width}px`;
        app.view.style.height = `${sizes.height}px`;
        
        this.$emit('window_resize', ev);
    }
    
    getContainerSize() {
        const {clientWidth: w, clientHeight: h} = this.container;
        return {w, h};
    }

    absorbEvent(ev) {
        const e = ev || window.event;
        e.preventDefault && e.preventDefault();
        e.stopPropagation && e.stopPropagation();
        e.cancelBubble = true;
        e.returnValue = false;
        return false;
    }

    registerMixins() {
        if (Array.isArray(this.mixins)) {
            for (let i in this.mixins) {
                this.registerMixin(this.mixins[i]);
            }
        }
    }

    registerMixin(mixin) {
        for (let attribute in mixin) {
            if (typeof this[attribute] === 'function' && typeof mixin[attribute] === 'function') {
                this.$on(attribute, (...args) => {
                    mixin[attribute].apply(this, args);
                });

            } else {
                this[attribute] = mixin[attribute];
            }
        }
    }

}
;

const mapInteractions = {
    click: 'onClick',
    dblclick: 'onDoubleClick',
    keydown: 'onKeyDown',
    keyup: 'onKeyUp',
};

export default GameBase;

