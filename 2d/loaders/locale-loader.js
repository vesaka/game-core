import Loader from './loader';

import { deepMerge, raw, extend } from '$lib/game/core/utils/object';

class LocaleLoader extends Loader {
    constructor() {
        super();
        this.locales = {};
        this.$listen({
            locale: ['loaded', 'select']
        });
        this.usedLocales = Object.keys(this.assets.locale || {}).length;
        return this;
    }
    
    
    locale_select(code) {
        this.updateLocale(code);
    }
    
    updateLocale(code) {
        const { locales, options: { defaultLocale } } = this;
        const i18n = raw(locales[code] || {});
        if (typeof this.$store.commit === 'function') {
            this.$store.commit('model', {key: 'locale', value: code});
        } else {
            this.$store.locale = code;
        }
        this.$set('locale', code !== defaultLocale 
                    ? deepMerge(raw(locales[defaultLocale]), raw(locales[code] || {}))
                    : raw(locales[defaultLocale]));
        this.$emit('locale_update', code);
                    
        

    }
    
    locale_loaded(asset) {
        const { locales, options: {defaultLocale, locale}, usedLocales } = this;
        const code = asset.key;

        locales[asset.key] = raw(asset.data);        
        if (Object.keys(locales).length === usedLocales ) {
            this.updateLocale(locale);
        }
        

    }
    
    
}

export default LocaleLoader;
