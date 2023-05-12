import { getSize, getMouse } from '$core/utils/window';

const to = { x: 0, y: 0, z: 500 }
const onMouse = (e) => {
    const mouse = getMouse(e);
    to.x =  ( mouse.centerx * 0.95 );
    to.y = -( mouse.centery * 0.95 );
 };

const toggleEvents = bind => {
    const method = bind ? 'addEventListener' : 'removeEventListener';
    window[method]("mousemove", onMouse, false);
}

export default {
    game_init() {
        this.to = to;
        toggleEvents(true);
    },
    game_destroy() {
        toggleEvents();
    }
};