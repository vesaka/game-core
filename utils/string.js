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

export {kebab, ucfirst};