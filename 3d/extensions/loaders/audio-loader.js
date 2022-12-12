import { AudioLoader as ThreeAudioLoader } from 'three';
//import { isAgent } from '$core/utils/agent';

const FORMATS = {
    ogg: 'audio/ogg',
    mp3: 'audio/mp3',
    wav: 'audio/mp3'
};
class AudioLoader extends ThreeAudioLoader {
    load(url, onLoad, onProgress, onError) {
        if (this.canPlay()) {

        }

        super.load(url, onLoad, onProgress, onError);
    }
}

export default AudioLoader;