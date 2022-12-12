export const mimeTypes = {
    mp3: 'audio/mpeg',
    mp4: 'video/mp4',
    mpeg: 'video/mpeg',
    oga: 'audio/ogg',
    ogg: 'audio/ogg',
    wav: 'audio/wav'
};

export const getFirstPlayableFormat = (extensions) => {
    const audio = document.createElement('audio')
    for (let i in extensions) {
        if (audio.canPlayType(mimeTypes[extensions[i]] || extensions[i]) === 'probably') {
            return extensions[i];
        }
    }
    
    return 'wav';
};