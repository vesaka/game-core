import Container from '$core/container';
import FontFaceObserver from 'fontfaceobserver';
class FontLoader extends Container {
    constructor() {
        super();
        return this;
    }
    
    load() {
        const loader = this.app.loader;
        const fonts = [];
        const fontsToLoad = Object.keys(this.options.fonts).length;
        let family, data = {};
        let fontsLoaded = 0;
        for (let name in this.options.fonts) {
            if (typeof this.options.fonts[name] === 'string') {
                family = this.options.fonts[name];
                data = {};
            } else {
                family = this.options.fonts[name].family;
                data = this.options.fonts[name];
            }

            const font = new FontFaceObserver(family, data);
            console.log(family);
            fonts.push(font.load().then(font => { 
                this.$emit.bind(this, 'font_loaded', font, name);
                fontsLoaded++;
                if (fontsLoaded >= fontsToLoad) {
                    this.$emit('fonts_loaded');
                    this.$off('fonts_loaded');
                }
            }));
        }

    }
}

export default FontLoader;


