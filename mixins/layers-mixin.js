import { Container } from 'pixi.js';

export default {
    //layers: {},
    data() {
        return {
            layers: {}
        };
    },
    addToLayer(object, layer = null) {
        if (null === layer) {
            const layer = object.$name;
        }

        this.addLayer(layer);
        this.layers[layer].addChild(object.instance);
    },
    removeFromLayer(object, layer = null) {
        if (null === layer) {
            const layer = object.$name;
        }

        if (this.layers[layer]) {
            this.layers[layer].removeChild(object.instance ? object.instance : object);
        }
    },
    addLayer(layer) {
        if (!this.layers[layer]) {
            this.layers[layer] = new Container;
            this.scene.addChild(this.layers[layer]);
        }
    },
    addLayers(...layers) {
        let $this = this;
        layers.forEach(layer => $this.addLayer(layer));

    },
    removeLayer(layer) {
        if (this.layers[layer]) {
            delete this.layers[layer];
        }
    },
    removeLayers(layers) {
        let $this = this;
        layers.forEach(layer => $this.removeLayer(layer));
    }
};

