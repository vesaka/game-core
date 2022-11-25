export const LANDSCAPE = 'landscpape';

export const PORTRAIT = 'portrait';

export const getOrientation = () => {
    var orientation = (screen.orientation || {}).type
            || screen.mozOrientation
            || screen.msOrientation;
    
    if (orientation) {
        if (orientation.indexOf(LANDSCAPE) > -1) {
            return LANDSCAPE;
        } else if (orientation.indexOf(PORTRAIT) > -1) {
            return PORTRAIT;
        }
    }

    if (window.innerWidth > window.innerHeight) {
        return LANDSCAPE;
    }

    return PORTRAIT;
};

export const isHorizontal = () => {
    return window.innerWidth >= window.innerHeight;
};

export const isVertical = () => {
    return window.innerWidth < window.innerHeight;
};

export const isLandscape = () => {
    return LANDSCAPE === getOrientation();
};

export const isPortrait = () => {
    return PORTRAIT === getOrientation();
};

