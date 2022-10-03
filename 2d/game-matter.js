/* global Promise */

import Container from '$lib/game/core/container';
import { Composite, Engine, Render, Bodies, Runner, World } from 'matter-js';
import { Application, InteractionManager, Container as PixiContainer, Ticker } from 'pixi.js';

import localforage from 'localforage';
import { getOrientation } from '$lib/game/utils/window';
import { getKeyCode } from '$lib/game/core/utils/events';
import { deepMerge, deepGet, deepSet, raw } from '$lib/game/utils/object';
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
class GameMatter extends Container {
    constructor(options) {
        super(options, true);
        const { container} = this;
        
        this.width = container.clientWidth;
        this.height = container.clientHeight;
        this.$set('layers', {});

        if (typeof options.options === 'string') {
            this.$set('options', require(`$lib/game/${options.options}.json`));
        } else if (typeof options.options !== 'object') {
            this.$set('options', {});
        }

        this.$set('settings', options.settings || {});
        window.addEventListener('orientationchange', this.onResize);
        window.addEventListener('resize', this.onResize);
        
        this.fps = this.options.fps || 60;
        const app = new Application(Object.assign({}, {
            width: this.options.world.size.width,
            height: this.options.world.size.height,
            //resizeTo: this.container,
            resolution: Math.min(window.devicePixelRatio || 1, 2)
        }, this.options.app));

        this.$set('app', app);
        
        this.$set('scale', this.options.scale || 1);
        
        if(!this.$db) {
            this.$set('$db', localforage);
        }

        this.$set('engine', Engine.create({
            world: this.createWorld(),
            gravity: this.options.engine.gravity
        }));

        if (!this.runner) {
            this.$set('runner', Runner.create());
        }
        this.$set('world', this.engine.world);
        //this.$db.clear();
        Object.assign(this.app.view.style, this.options.view.style);
        Object.assign(this.app.renderer, this.options.renderer);
        Object.assign(this.app.stage, this.options.stage);

        container.style.minHeight = `${app.renderer.height}px`;
        container.appendChild(this.app.view);

        this.app.stage.interactive = true;
        this.app.stage.hitArea = this.app.screen;
        this.doResize = null;
        this.onResize();
        this.resizeCanvas();
        
        this.$listen({
            loader: ['complete'],
            game: ['init', 'ready', 'destroy'],
        });
        this.$emit('game_init');
        $this = this;
        return this;
    }

    load() {
        const appLoader = new AppLoader;
        const fontLoader = new FontLoader;
        const localeLoader = new LocaleLoader;
        appLoader.preload();
        fontLoader.load();
        
    }
    /**
     * @public
     * @description Fires after all files were loaded
     */
    loader_complete() {
        this.build();
    }

    createWorld(props = {}) {
        return Composite.create(this.options.engine.world);
    }

    ready() {

    }
    
    build() {

    }

    render() {

    }

    /**
     * Clears the game instance
     * @returns void
     */
    destroy() {
        this.$emit('game_destroy');
        this.$clear();
        this.app.loader.reset();
        this.app.ticker.stop();
        
        Composite.clear(this.engine.world);
        Engine.clear(this.engine);
        Runner.stop(this.runner);
        
//        this.$set('world', null);
//        this.$set('engine', null);
//        this.$set('runner', null);
        
        this.app.destroy(true, {
            children: true,
            texture: true,
            baseTexture: true
        });
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

        Composite.add(this.engine.world, object.body);
    }

    addMultiple(items, layer = null) {
        for (let i in items) {
            this.add(items[i], layer);
        }
    }

    remove(object, layer = null) {
        Composite.remove(this.engine.world, object.body);
        if (typeof layer === 'string' && this.layers[layer]) {
            this.layers[layer].removeChild(object.model);
        } else {
            this.scene.removeChild(object.model);
        }
    }
    
    removeMultiple(items, layer = null) {
        for (let i in items) {
            this.remove(items[i], layer);
        }
    }

    addLayer() {
        for (let i in arguments) {
            if (typeof arguments[i] === 'string') {
                if (!this.layers[arguments[i]]) {
                    this.layers[arguments[i]] = new PixiContainer();
                    this.scene.addChild(this.layers[arguments[i]]);
                }
            }
        }
    }

    getKeyCharCode(e) {
        let keynum;
        if (window.event) { // IE                  
            keynum = e.keyCode;
        } else if (e.which) { // Netscape/Firefox/Opera                 
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
        //const ratio = Math.min(w / app.renderer.width, h / app.renderer.height);

        if (w / h >= ratio) {
            sizes.width = w / ratio;
            sizes.height = h; 
        } else {
           // console.log('yuck');
            sizes.width = w;
            sizes.height = (w / ratio).toFixed(2);
        }
        
//        app.renderer.resize(Math.ceil(w * ratio), Math.ceil(h * ratio));
//        this.ui.scale.x = this.scene.ascale.x = this.ui.scale.y = this.scene.scale.y = ratio
        app.view.style.width = `${sizes.width}px`;
        app.view.style.height = `${sizes.height}px`;
        
        if (ui) {
            //ui.pivot.set(app.renderer.width / 2, app.renderer.height / 2);
        }
        this.$emit('window_resize', ev);
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

export default GameMatter;

