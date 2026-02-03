import { useEffect, useMemo, useState } from 'react';

import AppShell from './app/AppShell';
import HeaderBar from './components/HeaderBar';
import InstrumentBar from './components/InstrumentBar';
import MasterControlBar from './components/MasterControlBar';
import OIDashboard from './components/OIDashboard';
import TimeTravelBar from './components/TimeTravelBar';
import ChainTable from './components/OptionChain/ChainTable';
import StrikeWindowControl from './components/OptionChain/StrikeWindowControl';
import { usePlaybackStore } from './state/playbackStore';

const EMPTY_ARRAY = [];

export default function App() {
    const [symbol, setSymbol] = useState('');
    const [tradeDate, setTradeDate] = useState('');
    const [expiry, setExpiry] = useState('');
    const [viewMode, setViewMode] = useState('BOTH');
    const [rows, setRows] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [windowSize, setWindowSize] = useState(15);
    const [timestamps, setTimestamps] = useState([]);
    const [error, setError] = useState('');

    const {
        currentTime,
        setCurrentTime,
        isPlaying,
        play,
        pause,
        speed,
    } = usePlaybackStore();

    useEffect(() => {
        if (!window.api) {
            setError('Electron API not available. Run the app via Electron.');
        }
    }, []);

    useEffect(() => {
        if (!window.api || !symbol || !tradeDate || !expiry) {
            setTimestamps([]);
            return;
        }

        window.api
            .getTimestamps({ symbol, tradeDate, expiry })
            .then((result) => {
                const list = result || [];
                setTimestamps(list);
                setCurrentIndex(0);
            })
            .catch((err) => {
                setError(err?.message || 'Failed to load timestamps.');
            });
    }, [symbol, tradeDate, expiry]);

    useEffect(() => {
        if (!timestamps.length) {
            setCurrentTime('');
            return;
        }

        const nextTime = timestamps[currentIndex] || '';
        setCurrentTime(nextTime);
    }, [timestamps, currentIndex, setCurrentTime]);

    useEffect(() => {
        if (!window.api || !symbol || !expiry || !currentTime) {
            setRows([]);
            return;
        }

        window.api
            .getSnapshot({ symbol, expiry, timestamp: currentTime })
            .then((result) => {
                setRows(result || []);
            })
            .catch((err) => {
                setError(err?.message || 'Failed to load snapshot.');
            });
    }, [symbol, expiry, currentTime]);

    const filteredRows = useMemo(() => {
        if (viewMode === 'BOTH') return rows;
        return rows.filter((row) => row.option_type === viewMode);
    }, [rows, viewMode]);

    const spotPrice =
        rows.length > 0 ? rows[0]?.underlying_value ?? null : null;

    const stepNext = () => {
        if (!timestamps.length) return;
        setCurrentIndex((prev) =>
            Math.min(prev + 1, timestamps.length - 1)
        );
    };

    const stepPrev = () => {
        if (!timestamps.length) return;
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    useEffect(() => {
        if (!isPlaying || !timestamps.length) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => {
                if (prev >= timestamps.length - 1) {
                    pause();
                    return prev;
                }
                return prev + 1;
            });
        }, 1000 / speed);

        return () => clearInterval(interval);
    }, [isPlaying, speed, timestamps.length, pause]);

    return (
        <AppShell
            header={
                <HeaderBar optionType={viewMode} setOptionType={setViewMode} />
            }
            footer={
                <TimeTravelBar
                    isPlaying={isPlaying}
                    onPlay={play}
                    onPause={pause}
                    onNext={stepNext}
                    onPrev={stepPrev}
                    currentTime={currentTime}
                />
            }
        >
            <div className="flex flex-col h-full">
                <InstrumentBar
                    symbol={symbol}
                    tradeDate={tradeDate}
                    expiry={expiry}
                    onSymbolChange={setSymbol}
                    onDateChange={setTradeDate}
                    onExpiryChange={setExpiry}
                />

                <MasterControlBar
                    symbol={symbol || '—'}
                    expiry={expiry || '—'}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    snapshotTime={currentTime}
                    spotPrice={spotPrice}
                />

                {error ? (
                    <div className="px-4 py-2 text-sm text-rose-400">
                        {error}
                    </div>
                ) : null}

                <OIDashboard />

                <StrikeWindowControl
                    windowSize={windowSize}
                    setWindowSize={setWindowSize}
                />

                <div className="flex-1">
                    <ChainTable rows={filteredRows || EMPTY_ARRAY} />
                </div>

                <div className="px-4 py-2 text-xs text-neutral-500">
                    {timestamps.length
                        ? `Loaded ${timestamps.length} timestamps`
                        : 'No timestamps loaded yet.'}
                </div>
            </div>
        </AppShell>
    );
}
