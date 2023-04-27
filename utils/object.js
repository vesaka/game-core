export const isSafeKey = (key) => {
    return key !== '__proto__' && key !== 'prototype' && key !== 'constructor';
};

export const isObject = (item) => {
    return (item && (typeof item === 'object') && !Array.isArray(item));
};

export const deepMerge = (target, ...sources) => {
    if (!sources.length)
        return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key])
                    Object.assign(target, {[key]: {}});
                deepMerge(target[key], source[key]);
            } else {
                Object.assign(target, {[key]: source[key]});
            }
        }
    }
    ;
    
    return target;

};

export const extend = (target, ...sources) => {
    if (!sources.length)
        return target;
    
    const source = sources.shift();
    target = raw(target);
    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key])
                    Object.assign(target, {[key]: {}});
                deepMerge(target[key], source[key]);
            } else {
                Object.assign(target, {[key]: source[key]});
            }
        }
    }
    ;
    
    return target;

};

export const raw = (target) => {
    if (!isObject(target)) {
        target = {};
    }
    return JSON.parse(JSON.stringify(target));
};

export const deepGet = (obj, path, defaultValue = null) => {
    if (!isObject(obj)) {
        return defaultValue;
    }
    let i, key, keys = path.split('.');
    for (i = 0; i < keys.length; i++) {
        key = keys[i];
        if (!obj || !obj.hasOwnProperty(key) || !isSafeKey(key)) {
            obj = defaultValue;
            break;
        }
        obj = obj[key];
    }
    return obj;
};

export const deepSet = (obj, path, value) => {
    let i, key, keys = path.split('.');
    for (i = 0; i < keys.length - 1; i++) {
        key = keys[i];
        if (!isSafeKey(key)) {
            return;
        }
        if (!obj.hasOwnProperty(key))
            obj[key] = {};
        obj = obj[key];
    }
    obj[keys[i]] = value;
    return value;
};

export const serialize = (obj) => {
    const arr = [];
    for (let k in obj) {
        arr.push(`${k}:${obj[k]}`);
    }
    return arr.join(',');
};

export const unserialize = (str) => {
    const o = {};
    str.split(',').forEach(f => {
        const [k, v] = f.split(':');
        o[k] = !isNaN(v) ? Number(v) : v;
    });
    return o;
};
