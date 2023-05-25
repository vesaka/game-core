/* global Promise */

import Container from '$core/container';
import { Composite, Engine, Runner } from 'matter-js';
import { Application, Container as PixiContainer, Ticker } from 'pixi.js';

import localforage from 'localforage';
import AppLoader from './loaders/loader';
import FontLoader from './loaders/font-loader';

import { isLandscape } from '$core/utils/window';

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
            //resizeTo: window,
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

        Object.assign(this.app.view.style, this.options.view.style);
        Object.assign(this.app.renderer, this.options.renderer);
        Object.assign(this.app.stage, this.options.stage);

        //container.style.minHeight = `${Math.min(app.renderer.height, window.innerHeight)}px`;
        // container.style.minWidth = `${Math.min(app.renderer.width, window.innerWidth)}px`;
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
        if (true === object.__group__) {
            this.addGroup(object, layer);
            return;
        }
        
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
    
    addGroup(group, layer = null) {
        
        for (let key in group.components) {
            this.add(group.components[key], layer);
        }
        
        Composite.add(this.engine.world, group.constraints);
    }

    addMultiple(items, layer = null) {
        for (let i in items) {
            this.add(items[i], layer);
        }
    }

    remove(object, layer = null) {
        if (true === object.__group__) {
            this.removeGroup(object, layer);
            return;
        }
        Composite.remove(this.engine.world, object.body);
        if (typeof layer === 'string' && this.layers[layer]) {
            this.layers[layer].removeChild(object.model);
        } else {
            this.scene.removeChild(object.model);
        }
    }
    
    removeGroup(group, layer) {
        for (let key in group.components) {
            this.remove(group.components[key], layer);
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
        }
        const {app, options, container} = $this;

        const canvas = app.view;
        clearTimeout($this.doResize);
        $this.doResize = setTimeout((ev) => $this.resizeCanvas(ev), 300);

    }

    resizeCanvas(ev) {
        const {app, container} = this;
        const {clientWidth: w, clientHeight: h} = container;
        const {innerWidth: ww, innerHeight: wh} = window;
        const ratio = (app.renderer.width / app.renderer.height).toFixed(2);

        if (isLandscape()) {
            sizes.width = Math.min(w, ww);
            sizes.height = Math.min(h, wh); 
            sizes.angle = 0;
            app.stage.position.set(0, 0); 
        } else {
            sizes.width = Math.min(h, wh);
            sizes.height = Math.min(w, ww); 
            sizes.angle = 90;
            app.stage.position.set(app.renderer.width/2, app.renderer.height/2); 
        }


        app.view.style.width = `${sizes.width}px`;
        app.view.style.height = `${sizes.height}px`;
       // app.view.style.transform = `rotate(${sizes.angle}deg)`


        //app.stage.pivot.set(app.screen.width / 2, app.screen.height / 2);
        //app.stage.rotation = sizes.angle * (Math.PI / 180);

        app.stage.rotation = sizes.angle * (Math.PI / 180);
        app.stage.pivot.set(app.renderer.width/2, app.renderer.height/2); // camera coords, but i think in that case its same as screen center
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

