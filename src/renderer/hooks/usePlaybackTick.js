import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { stepForward } from '../store/playbackSlice';

export function usePlaybackTick() {
    const dispatch = useDispatch();
    const { isPlaying, speed } = useSelector(s => s.playback);

    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            dispatch(stepForward());
        }, 1000 / speed);

        return () => clearInterval(interval);
    }, [isPlaying, speed, dispatch]);
}
