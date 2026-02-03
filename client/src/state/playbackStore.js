import { useState } from 'react';

export function usePlaybackStore() {
    const [currentTime, setCurrentTime] = useState(
        '2025-05-15T03:45:00.000Z' // initial snapshot
    );
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1); // 1x, 5x, 10x etc.

    const play = () => setIsPlaying(true);
    const pause = () => setIsPlaying(false);

    return {
        currentTime,
        setCurrentTime,
        isPlaying,
        speed,
        setSpeed,
        play,
        pause,
    };
}
