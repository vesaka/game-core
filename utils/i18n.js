import { deepGet, deepMerge, raw, extend } from '$core/utils/object.js';

export const i18n = {
    locales: {},
    locale: '',
    defaultLocale: null
};
export let locale = {};

export const t = (path, def = '') => {

    try {
        return deepGet(locale, path) || def;
    } catch (ex) {
        return def;
    }

    return def;
};

export const setDefault = (code) => {
    i18n.defaultLocale = code;
};

export const setLocales = locales => {
    i18n.locales = locales;
    
    if (!i18n.defaultLocale) {
        const code = Object.keys(locales)[0];
        i18n.defaultLocale = code;
        select(code);
    }
}

export const select = code => {
    i18n.locale = code;
    update(code);
};

export const update = code => {
    const { locales, defaultLocale } = i18n;
    
    locale = code !== defaultLocale 
                    ? deepMerge(raw(locales[defaultLocale]), raw(locales[code] || {}))
                    : raw(locales[defaultLocale]);
};