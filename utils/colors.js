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
    //return '#' + (0x1000000+Math.random()*0xffffff).toString(16).substr(1,6)
};

export const randomHex = (min, max) => {
    const [start, end] = [Math.max(0, min), Math.min(max, MAX)];
    return Math.random() * (start - end) + end;
};

export const hex2bin = (hex) => {
    return ("00000000" + (parseInt(hex, 16)).toString(2)).substr(-8);
};

