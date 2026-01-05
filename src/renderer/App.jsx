import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializePlayback } from './store/playbackSlice';
import PlaybackControls from './components/PlaybackControls';
import { usePlaybackTick } from './hooks/usePlaybackTick';

function App() {
    const dispatch = useDispatch();
    usePlaybackTick();

    useEffect(() => {
        dispatch(initializePlayback({
            symbol: 'NIFTY',
            expiry: '2024-01-25',
            timestamps: [
                '2024-01-25 09:15:00',
                '2024-01-25 09:16:00',
                '2024-01-25 09:17:00',
                '2024-01-25 09:18:00'
            ]
        }));
    }, []);

    return <PlaybackControls />;
}

export default App;
