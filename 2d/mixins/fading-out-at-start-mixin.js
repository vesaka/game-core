import { Ticker } from 'pixi.js';

export default {
        /**
         * Fires after ameinstance was initialized
         * @returns {undefined}
         */
    game_init() {

    },
    /**
     * Fires when user starts the game
     * @returns {undefined}
     */
    game_start() {
        const step = this.fadingStep || 0.01;
        const elements = this.getFadableElements();

        if (!this.ticker) {
            this.ticker = new Ticker;
        }

        this.ticker.add(delta => {

            let fadedElements = 0;
            elements.forEach(element => {
                if (element.alpha > 0) {
                    element.alpha -= step;

                    if (element.alpha <= 0) {
                        fadedElements++;
                    }
                }


            });

            if (fadedElements >= elements.length) {
                this.ticker.stop();
            }
        });

        this.ticker.start();
    },
    /**
     * Fires when game was reset
     * Brings the object to initials state
     * @returns {undefined}
     */
    game_reset() {

        const elements = this.getFadableElements();
        elements.forEach(element => {
            element.alpha = 1;
        });
    },

}