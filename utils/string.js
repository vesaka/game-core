const ucfirst = (str) => {
    return str.charAt(0).toUpperCase() + str.substr(1);
};

const kebab = (str) => {
    return str.split('').map((letter, idx) => {
        return letter.toUpperCase() === letter
                ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
                : letter;
    }).join('');
};

const aprintf = (str, params) => {
    return str.replace(/{(\d+|\w+)}/g, (match, key) => {
        return typeof params[key] !== 'undefined' ? params[key] : match;
    });
};

export const ordinal = (i, noNum = true) => {
    const j = i % 10;
    const k = i % 100;
    if (noNum) {
        i = '';
    }
    if (j === 1 && k !== 11) {
        return i + "st";
    }
    if (j === 2 && k !== 12) {
        return i + "nd";
    }
    if (j === 3 && k !== 13) {
        return i + "rd";
    }
    return i + "th";
}

export {kebab, ucfirst, aprintf};