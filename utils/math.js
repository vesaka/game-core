const between = (min, max) => {
    return Math.random() * (max - min) + min;
};

const rand = (min, max) => {
    return ~~(Math.random() * (max - min + 1) + min);
};

const factoriel = (num) => {
    let val = 1;

    for (let i = 2; i <= num; i++)
        val = val * i;
    return val;
};

const degrees = angle => {
    return angle * (180 / Math.PI);
};

const radians = (angle) => {
    return angle * (Math.PI / 180);
};

const binom = (n, k) => {
    return factoriel(n) / (factoriel(k) * factoriel(n - k));
};

const radius = (point, round = 0) => {
    if (Array.isArray(point)) {
        point = {x: point[0] || 0, y: point[1]};
    }
    return Math.round(Math.sqrt(point.x * point.x + point.y * point.y));
};

const rotate = (x, y, cx, cy, angle = 0) => {
    let rotate = radians(angle),
            cos = Math.cos(rotate),
            sin = Math.sin(rotate);

    return {
        x: (cos * (x - cx)) + (sin * (y - cy)) + cx,
        y: (cos * (y - cy)) - (sin * (x - cx)) + cy
    };
};

const fixed = (num) => {
    return Math.round((num + Number.EPSILON) * 100) / 100;
};

const gamble = (success, badLuck, odds = 50) => {
    let roll = Math.floor(Math.random() * 100) + 1,
            result = roll < odds ? success : badLuck;
    return typeof result === 'function' ? result() : result;
};

const roll = (options = {}) => {
    let cases = {}, roll = Math.floor(Math.random() * 100) + 1,
            current = 0,
            keys = [];
    biggest = 0,
            result = options.default || null;

    options[0] = null;
    options[101] = options.default || null;

    for (let key in options) {
        let chance = parseInt(key);
        if (!isNaN(chance)) {
            cases[key] = options[key];
            keys.push(key);
        }
    }

    for (let key = 1; key < keys.length; key++) {
        let chance = parseInt(keys[key]),
                previous = parseInt(keys[key - 1]);
        if ((roll >= previous) && (roll < chance)) {
            result = cases[keys[key]];
            break;
        }
    }

    return typeof result === 'function' ? result() : result;
};

const decimals = (num) => {
    if (Math.floor(num.valueOf()) === num.valueOf()) {
        return 0;
    }
    return num.toString().split(".")[1].length || 0;
};

const percents = (num, n) => {
    if (0 === num) {
        return 0;
    }
    return (100 * n) / num;
};

const normalize = (v, vmin, vmax, tmin, tmax) => {
    const nv = Math.max(Math.min(v, vmax), vmin);
    return tmin + (((nv - vmin) / (vmax - vmin)) * (tmax - tmin));
}

export const round = (num, to) => {
    return Math.round(num / to) * to;
};

export const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
};

export const randFromArray = (value) => {
    if (Array.isArray(value)) {
        value = rand(Number(value[0]), Number(value[1]));
    }
    
    return value;
}

export {
between, rand, factoriel, degrees,
        radians, binom, radius, rotate, fixed,
        gamble, roll, decimals, percents, normalize
        };