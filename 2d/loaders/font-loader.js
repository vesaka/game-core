import Container from '$lib/game/core/container';
import FontFaceObserver from 'fontfaceobserver';
class FontLoader extends Container {
    constructor() {
        super();
        return this;
    }
    
    load() {
        const loader = this.app.loader;
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
            fonts.push(font.load().then(font => this.$emit.bind(this, 'font_loaded', font, name)));
        }
        
        return Promise.all(fonts)
                .then(() => {this.$emit('fonts_loaded')})
                .catch(err => {});
    }
}

export default FontLoader;


