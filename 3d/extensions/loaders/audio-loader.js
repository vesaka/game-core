import { AudioLoader as ThreeAudioLoader } from 'three';
//import { isAgent } from '$core/utils/agent';

const FORMATS = {
    ogg: 'audio/ogg',
    mp3: 'audio/mp3',
    wav: 'audio/mp3'
};

let audio;

class AudioLoader extends ThreeAudioLoader {
    load(url, onLoad, onProgress, onError) {
        const matches = url.match(/\{([a-z,]+)\}$/);
        const formats = matches[1].split(',');
        const audio = document.createElement('audio');

        for(const format of formats) {
            if (audio.canPlayType(FORMATS[format])) {
                url = url.replace(matches[0], format);
                break;
            }
        }

        super.load(url, onLoad, onProgress, onError);
    }
}

export default AudioLoader;