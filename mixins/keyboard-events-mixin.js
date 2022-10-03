import {useKeyboardEvents} from '$lib/core/utils/events';

const ALLOWED_EVENTS = ['keydown', 'keyup', 'keypress'];

const getKeyCharCode = (e) => {
    let keynum;
    if (window.event) { // IE                  
        keynum = e.keyCode;
    } else if (e.which) { // Netscape/Firefox/Opera                 
        keynum = e.which;
    }

    return keynum;
};
export default {
    useEvents(events) {
        useKeyboardEvents(events);
    },

    absorbEvent(ev) {
        const e = ev || window.event;
        e.preventDefault && e.preventDefault();
        e.stopPropagation && e.stopPropagation();
        e.cancelBubble = true;
        e.returnValue = false;
        return false;
    }
}