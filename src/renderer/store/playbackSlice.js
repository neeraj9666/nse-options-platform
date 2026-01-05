import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    symbol: null,
    expiry: null,
    timestamp: null,

    isPlaying: false,
    speed: 1,

    availableTimestamps: [],
    currentIndex: -1
};

const playbackSlice = createSlice({
    name: 'playback',
    initialState,
    reducers: {
        initializePlayback(state, action) {
            const { symbol, expiry, timestamps } = action.payload;
            state.symbol = symbol;
            state.expiry = expiry;
            state.availableTimestamps = timestamps;
            state.currentIndex = timestamps.length - 1;
            state.timestamp = timestamps[state.currentIndex];
            state.isPlaying = false;
        },

        play(state) {
            state.isPlaying = true;
        },

        pause(state) {
            state.isPlaying = false;
        },

        setSpeed(state, action) {
            state.speed = action.payload;
        },

        stepForward(state) {
            if (state.currentIndex < state.availableTimestamps.length - 1) {
                state.currentIndex += 1;
                state.timestamp = state.availableTimestamps[state.currentIndex];
            }
        },

        stepBackward(state) {
            if (state.currentIndex > 0) {
                state.currentIndex -= 1;
                state.timestamp = state.availableTimestamps[state.currentIndex];
            }
        },

        jumpToIndex(state, action) {
            const idx = action.payload;
            if (idx >= 0 && idx < state.availableTimestamps.length) {
                state.currentIndex = idx;
                state.timestamp = state.availableTimestamps[idx];
            }
        }
    }
});

export const {
    initializePlayback,
    play,
    pause,
    setSpeed,
    stepForward,
    stepBackward,
    jumpToIndex
} = playbackSlice.actions;

export default playbackSlice.reducer;
