const MAP = {
    mouse: ['click', 'dblclick'],
    keyboard: ['keydown', 'keyup', 'keypress'],
    touch: ['touchstart', 'touchend', 'touchmove']
};

const useEvents = (events, key, handle = null) => {
    if (!handle) {
        handle = this.$emit;
    }
    for (let group in events) {
        if (!MAP[key].hasOwnProperty(group)) {
            continue;
        }
        if (typeof events[group] === 'string') {
            events[group] = events[group].split(',');
            events[group].forEach(event => {
                window.addEventListener(event, ev => handle.call(this, ev), false);
            });
        }
}
};

const useMouseEvents = (events) => {
    useEvents(events, 'mouse');
};

const useKeyboardEvents = (events) => {
    useEvents(events, 'keyboard', ev => {
        const code = getKeyCode(ev);
        this.$emit(ev.type + '_' + code, ev);
    });
};

const useTouchEvents = (events) => {
    useEvents(events, 'touch');
};

const getKeyCode = (e) => {
    let keynum;
    if (window.event) { // IE                  
        keynum = e.keyCode;
    } else if (e.which) { // Netscape/Firefox/Opera                 
        keynum = e.which;
    }

    return keynum;
};

export {getKeyCode, useKeyboardEvents, useTouchEvents, useEvents};

