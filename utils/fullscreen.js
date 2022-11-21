export const toggleFullscreen = (canvas) => {
    const fullscreenElement = isFullscreen();
    
    if (!fullscreenElement) {
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
        } else if (canvas.mozRequestFullscreen) {
            canvas.mozRequestFullscreen();
        } else if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
        } else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen();
        } else if (canvas.msRequestFullscreen) {
            canvas.msRequestFullscreen();
        }

    } else {
        
        if (canvas.exitFullscreen) {
            canvas.exitFullscreen();
        } else if (canvas.mozRequestFullscreen) {
            canvas.mozExitFullscreen();
        } else if (canvas.exitFullscreen) {
            canvas.exitFullscreen();
        } else if (canvas.webkitExitFullscreen) {
            canvas.webkitExitFullscreen();
        } else if (canvas.msExitFullscreen) {
            canvas.msExitFullscreen();
        }
        document.exitFullscreen();
    }
};

export const isFullscreen = () => {
    return !!(document.fullscreenElement
            || document.mozFullscreenElement
            || document.webkitFullscreenElement
            || document.msFullscreenElement);
};

