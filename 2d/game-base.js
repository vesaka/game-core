/* global Promise */

import Container from '$lib/game/core/container';
//import planck, { World, Vec2 } from 'planck';
import { Application, Loader, InteractionManager, Container as PixiContainer } from 'pixi.js';
import Model from '$lib/game/core/2d/models/model';
import FontFaceObserver from 'fontfaceobserver';
import { getOrientation } from '$lib/game/utils/window';
import localforage from 'localforage';

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
        const {container} = this;
        this.width = container.clientWidth;
        this.height = container.clientHeight;
        this.assets = {};
        this.layers = [];

        if (typeof options.options === 'string') {
            this.$set('options', require(`$lib/game/${options.options}.json`));
        } else if (typeof options.options !== 'object') {
            this.$set('options', {});
        }

        if (options.settings) {
            this.$set('settings', options.settings);
        }

        window.addEventListener('orientationchange', (ev) => this.onResize(ev));
        window.addEventListener('resize', (ev) => this.onResize(ev));

        this.createWorld(this.options.world);
        this.fps = this.options.fps || 60;
        this.app = new Application(Object.assign, {
            width: this.options.game.width,
            height: this.options.game.height,
            resizeTo: window,
            sharedLoader: true,
            resolution: Math.min(window.devicePixelRatio || 1, 2)
        }, this.options.app);

        this.$set('app', this.app);
        this.$set('$db', localforage);
        
        this.$set('scale', this.options.scale || 1);
        
        //this.$db.clear();
        
        Object.assign(this.app.view.style, this.options.view.style);
        Object.assign(this.app.renderer, this.options.renderer);
        Object.assign(this.app.stage, this.options.stage);

        container.appendChild(this.app.view);

        this.app.stage.interactive = true;
        this.app.stage.hitArea = this.app.screen;
        this.doResize = null;
        this.onResize();
        return this;
    }

    load() {
        const loader = this.loader = Loader.shared;
        const assets = this.options.assets;
        loader.baseUrl = this.options.assetsBaseUrl || '/';

        const $this = this;
        for (let type in assets) {
            if (typeof assets[type] === 'string') {
                
                this.loadAsset(type, assets[type]);
            } else if (Array.isArray(assets[type])) {
                const singularType = type.replace(/s$/, '');
                for (let i in assets[type]) {
                    const name = `${singularType}_${i}`;
                    this.loadAsset(`${singularType}_${i}`, assets[type][i], singularType);
                }
            } else if (null !== assets[type] && typeof assets[type] === 'object') {

                for (let name in assets[type]) {
                    this.loadAsset(`${type}_${name}`, `${assets[type][name]}`, type);
                }
            }
        }
        const fonts = [];
        let family, data = {};
        for (let name in this.options.fonts) {
            if (typeof this.options.fonts[name] === 'string') {
                family = this.options.fonts[name];
                data = {};
            } else {
                family = this.options.fonts[name].family;
                data = this.options.fonts[name];

            }
            const font = new FontFaceObserver(family, data);
            fonts.push(font.load().then((font) => {
                $this.onFontLoaded(font, name);
            }));
        }
        
//        loader.pre((asset, next) => {
//            this.$db.getItem(asset.name, _asset => {
//                if (_asset) {
//                    console.log('yes');
//                    next(_asset);
//                }
//            });
//            next();
//        });

        Promise.all(fonts).then(() => {

            loader.onProgress.add((loader, asset) => {
                $this.onProgress(loader, asset);
            });
            loader.onComplete.add(() => {
                $this.onComplete();
                $this.build();
            });

            loader.onStart.add((loader) => {
                $this.onStart(loader);
            });
            loader.onLoad.add((loader) => {
                $this.onLoad(loader);
            });
            loader.onError.add((loader) => {
                $this.onError(loader);
            });
            
            loader.load();
        });
    }

    loadAsset(name, url, type = null) {
        const $this = this;

        const method = `${type || name}_loaded`;
        const key = type ? name.replace(`${type}_`, '') : name;
        this.loader.add({
            name,
            url,
            onComplete(asset) {

                asset.key = key;
                $this.$emit(method, asset);
//                $this.$db.getItem(asset.name, _asset => {
//                    if (!_asset) {
//                        console.log('no asset');
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

    locale_loaded(asset) {
        const {options} = this;

        const locale = asset.name.replace('locale_', '');
        if (locale === options.defaultLocale) {
            this.$set('default_i18n', asset.data);
        } else if (locale === options.locale) {
            this.$set(asset.name, asset.data);
        }

        const key = `locale_${options.locale}`;
        if ((options.locale !== options.defaultLocale) && this.default_i18n && this[key]) {
            this.$set('locale', Object.assign({}, this.default_i18n, this[key]));
        } else if ((options.locale === options.defaultLocale) && this.default_i18n) {
            this.$set('locale', this.default_i18n);
        }

    }

    loadLocale(path) {
        let i18n = {};
        try {
            i18n = require(`${path.replace('%s', this.options.defaultLocale)}`);

            if (this.options.locale !== this.options.defaultLocale) {
                Object.assign(i18n, `${path.replace('%s', this.options.locale)}`);
            }
        } catch (e) {
            console.log(e);
        }

        this.$set('i18n', i18n);


    }

    createWorld(props = {}) {
        if (!this.world) {
            const attr = Object.assign({
                gravity: {
                    x: 0,
                    y: 0
                }
            }, props);
            this.$set('world', new World({
                gravity: [attr.gravity.x, attr.gravity.y],
            }));
            

        }
    }

    ready() {

    }

    resolveCallbacks(type) {
        const ucType = type.charAt(0).toUpperCase() + type.slice(1);
        const callbacks = {
            onLoad() {},
            onProgres() {},
            onError() {},
            onComplete() {}
        };
        for (let name in callbacks) {
            const method = `${name}${ucType}`;

            if (typeof this[method] === 'function') {
                callbacks[name] = (...args) => {
                    this[method].apply(this, args);
                };
            } else {
                delete callbacks[name];
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


        return new loader(manager);
    }

    onLoad() {
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

    onFontLoaded(font) {
        this.$emit('font_loaded', font);
    }

    add(object, layer = null) {
        this.scene.addChild(object.model);
        this.world.addBody(object.body);
    }

    addToLayer(object, layer) {
        if (!this.layers[layer]) {
            this.layers[layer] = new PixiContainer;
            this.scene.addChild(this.layers[layer]);
        }

        this.layers[layer].addChild(object);
    }

    remove(object) {
        this.world.removeBody(object.body);
        this.scene.remove(object.model);
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

    onResize() {
        const {app, options, container} = this;

        const canvas = app.view;
        clearTimeout(this.doResize);
        this.doResize = setTimeout((ev) => {

            const {innerWidth: w, innerHeight: h} = window;
            //const {clientWidth: w, clientHeight: h} = container;
            const ratio = Math.round(canvas.width / canvas.height * 100) / 100;

            if (w / h >= ratio) {
                sizes.width = w / ratio;
                sizes.height = h;
            } else {
                sizes.width = w;
                sizes.height = Math.round(w / ratio);
            }
//
//            //Update renderer
            app.view.style.width = `${sizes.width}px`;
            app.view.style.height = `${Math.min(canvas.height, sizes.height)}px`;
//              app.renderer.resize(container.clientWidth, container.clientHeight);
            this.$emit('window_resize', ev);
        }, 300);

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

