import { getKeyCode } from '$core/utils/events';

export default {
        
        pause: false,
        game_init() {
            
            window.addEventListener('keydown', (ev) => {
                this.pause = false;
            });
            
            window.addEventListener('keyup', (ev) => {
                this.pause = true;
            });
        }
}
