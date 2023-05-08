export const MAX = 16777215;

export const random = (from) => {
    const letters = '0123456789ABCDEF';

    if (typeof from === 'string' && from.lenght > 0) {
        from = letters.match(new RegeExp(`[${from}]`));
    }

    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

export const randomHex = (min, max) => {
    const [start, end] = [Math.max(0, min), Math.min(max, MAX)];
    return Math.random() * (start - end) + end;
};

export const hex2bin = (hex) => {
    return ("00000000" + (parseInt(hex, 16)).toString(2)).substr(-8);
};

export const hex2dec = (hex) => {
    return parseInt(hex.replace(/^#/, ''), 16);
};

export const cmpToHex = c => {
    return c.toString(16).padStart(2, '0');
};

export const hexToRgb = (hex) => {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return [r, g, b];
};

export const rgbToHex = (r = 0, g = 0, b = 0) => {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
};

export const generateShades = (color, n = 5, darker = true) => {

    color = colorToHex(color)
    
    const rgbColor = hexToRgb(color);
    const increment = darker ? -1 : 1;
    const stepSize = Math.floor(255 / (n - 1));
    const shades = [];
    for (let i = 0; i < n; i++) {
        const shadeRgb = rgbColor.map((c) => Math.max(Math.min(c + i * increment * stepSize, 255), 0));
        const shadeHex = `#${shadeRgb.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
        shades.push(shadeHex);
    }

    return shades;

}

export const colorToHex = (str) => {
    var ctx = document.createElement("canvas").getContext("2d");
    ctx.fillStyle = str;
    return ctx.fillStyle;
}

export const hex2base = hex => {
    let r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);
    return (r | g << 8 | b << 16);
};

