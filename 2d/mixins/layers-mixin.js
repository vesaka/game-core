export default {
    addLayer() {
        const { layers, scene } = this;
        for (let i in arguments) {
            if (typeof arguments[i] === 'string') {
                if (!this.layers[arguments[i]]) {
                    this.layers[arguments[i]] = new PixiContainer();
                    this.scene.addChild(this.layers[arguments[i]]);
                }
            }
        }
    },
    addLayers(...args) {
        this.addLayers.call(this, args);
    },
    removeLayer() {
        const { layers, scene } = this;
        for (let i in arguments) {
            if (typeof arguments[i] === 'string') {
                if (layers[arguments[i]]) {
                    scene.removeChild(layers[arguments[i]]);
                    delete layers[arguments[i]];
                }
            }
        }
    }
}