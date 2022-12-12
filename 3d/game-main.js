import Container from '$lib/game/core/container';
import {WebGLRenderer, Scene} from 'three';
import Loader from '$lib/game/core/3d/loader';
class GameBase3D extends Container {
        
    constructor(options = {}) {
        super(options, true);
        this.$listen({
            loader: ['load', 'completed'],
            window: ['resize'],
            game: ['init', 'ready', 'destroy', 'start', 'over', 'reset'],
            scene: ['created', 'ready'],
            renderer: ['created', 'ready'],
            camera: ['created', 'ready']
        });
        const {canvas} = this;
        
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.running = true;
        
        this.$set('scene', new Scene);
        this.$emit('scene_created', this.scene);
        
        const $renderer = this.options.renderer || {};
        $renderer.canvas = canvas;

        this.animationID = undefined;
        this.$set('renderer', new WebGLRenderer($renderer));
        
        this.$emit('renderer_created', this.renderer);
        this.$emit('game_init');
                
    }
    
    add(...objects) {
        objects.forEach(object => {
            this.scene.add(object.model);
        });
        
    }
    
    remove(...objects) {
        objects.forEach(object => {
            this.scene.remove(object.model);
        });
    }
    
    load() {
        this.loader = new Loader(this.loaders);
        this.loader.load();
    }
    
    destroy() {
        this.$clear();
        if (this.animationID) {
            cancelAnimationFrame(this.animationID);
            this.animationID = undefined;
        }
        this.renderer.clear();
        this.$emit('game_destroy');
        
    }
    
    loader_completed() {
        this.build();
    }
    
    window_resize() {
        
    }
    
};

export default GameBase3D;
