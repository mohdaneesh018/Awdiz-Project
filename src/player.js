const audio = new Audio();
let onTimeUpdateCallback = null;
let onStateChange = null;
let onEndCallback = null;

const player = {
    load(src) {
        audio.src = src;
        audio.load();
    },

    play() {
        audio.play();
        onStateChange?.(true);
    },

    pause() {
        audio.pause();
        onStateChange?.(false);
    },

    seek(time) {
        audio.currentTime = time;
    },

    setVolume(v) {
        audio.volume = v;
    },

    onTimeUpdate(callback) {
        onTimeUpdateCallback = callback;
    },

    onStateChange(callback) {
        onStateChange = callback;
    },

    onSongEnd(callback) {
        onEndCallback = callback;
    }
};

audio.ontimeupdate = () => {
    onTimeUpdateCallback?.({
        currentTime: audio.currentTime,
        duration: audio.duration || 0
    });
};

audio.onended = () => {
    audio.currentTime = 0;
    onStateChange?.(false);
    onEndCallback?.();
};

export default player;
