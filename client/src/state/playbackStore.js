import { useEffect, useRef, useState } from 'react';

export function usePlaybackStore() {
    const [currentTime, setCurrentTime] = useState(
        '2025-05-15T03:45:00.000Z' // initial snapshot
    );
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1); // 1x, 5x, 10x etc.

    const timerRef = useRef(null);

    const STEP_SECONDS = 60; // one candle = one minute

    const stepForward = () => {
        setCurrentTime(t =>
            new Date(new Date(t).getTime() + STEP_SECONDS * 1000).toISOString()
        );
    };

    const stepBackward = () => {
        setCurrentTime(t =>
            new Date(new Date(t).getTime() - STEP_SECONDS * 1000).toISOString()
        );
    };

    const play = () => setIsPlaying(true);
    const pause = () => setIsPlaying(false);

    useEffect(() => {
        if (!isPlaying) {
            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = null;
            return;
        }

        timerRef.current = setInterval(() => {
            stepForward();
        }, 1000 / speed);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = null;
        };
    }, [isPlaying, speed]);

    return {
        currentTime,
        isPlaying,
        speed,
        setSpeed,
        play,
        pause,
        stepForward,
        stepBackward
    };
}
