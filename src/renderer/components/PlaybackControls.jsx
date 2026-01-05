import { useDispatch, useSelector } from 'react-redux';
import { play, pause, stepForward, stepBackward, setSpeed } from '../store/playbackSlice';

export default function PlaybackControls() {
    const dispatch = useDispatch();
    const { isPlaying, speed } = useSelector(s => s.playback);

    return (
        <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => dispatch(stepBackward())}>◀</button>
            <button onClick={() => dispatch(isPlaying ? pause() : play())}>
                {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button onClick={() => dispatch(stepForward())}>▶</button>

            <select value={speed} onChange={e => dispatch(setSpeed(Number(e.target.value)))}>
                <option value={1}>1x</option>
                <option value={2}>2x</option>
                <option value={5}>5x</option>
            </select>
        </div>
    );
}
