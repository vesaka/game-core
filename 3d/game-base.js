import Container from '$lib/game/core/container';
import {WebGLRenderer, Scene} from 'three';
import { Body, Vec3 } from 'cannon-es';
import Loader from '$lib/game/core/3d/loader';
class GameBase3D extends Container {
    
    constructor(options = {}) {
        super(options, true);
        this.$listen({
            loader: ['load', 'completed'],
            window: ['resize'],
            game: ['init', 'ready', 'destroy'],
            scene: ['created', 'ready'],
            renderer: ['created', 'ready'],
            camera: ['created', 'ready']
        });
        const {canvas} = this;
        
        this.width = window.innerWidth;
        this.height = window.innerHeight;        
        
        this.$set('scene', new Scene);
        this.$emit('scene_created', this.scene);
        
        const $renderer = this.options.renderer || {};
        $renderer.canvas = canvas;

        this.$set('renderer', new WebGLRenderer($renderer));
        
        this.$emit('renderer_created', this.renderer);
        this.$emit('game_init');
        
        
    }
    
    add(...objects) {
        objects.forEach(object => {
            this.world.addBody(object.body);
            this.scene.add(object.model);
        });
        
    }
    
    remove(...objects) {
        objects.forEach(object => {
            this.world.removeBody(object.body);
            this.scene.remove(object.model);
        });
    }
    
    load() {
        this.loader = new Loader();
        this.loader.load();
    }
    
    loader_completed() {
        this.build();
    }
    
    window_resize() {
        
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
    
};

export default GameBase3D;
