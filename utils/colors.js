export const MAX = 16777215;

export const random = (from) => {
    const letters = '0123456789ABCDEF';
    
    if (typeof from === 'string' && from.lenght > 0) {
        from = letters.match(new RegeExp(`[${ from }]`));
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

export const hex2base = hex => {
    let r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);
    return (r | g << 8 | b << 16);
};

