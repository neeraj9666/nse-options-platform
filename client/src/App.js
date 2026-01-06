import React, { useCallback, useEffect, useRef, useState } from 'react';
import InstrumentBar from './components/InstrumentBar';
import MasterControlBar from './components/MasterControlBar';
import TimeTravelBar from './components/TimeTravelBar';
import OptionChainTable from './components/OptionChainTable';

export default function App() {
  // ===== Selection State =====
  const [symbol, setSymbol] = useState('NIFTY');
  const [expiry, setExpiry] = useState(null);
  const [tradeDate, setTradeDate] = useState(null);

  // ===== Playback State =====
  const [rows, setRows] = useState([]);
  const [currentTime, setCurrentTime] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // ===== View State =====
  const [viewMode, setViewMode] = useState('BOTH');

  // ===== Ref to avoid stale interval =====
  const currentTimeRef = useRef(null);
  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);

  // ===== Core playback step (DB decides time) =====
  const step = useCallback(async (direction = 'NEXT') => {
    if (!symbol || !expiry) return;

    const res = await window.api.playbackStep({
      symbol,
      expiry,
      currentTime: currentTimeRef.current,
      direction,
    });

    if (!res || !res.success) {
      setIsPlaying(false);
      return;
    }

    setCurrentTime(res.time);
    setRows(res.rows);
  }, [symbol, expiry]);

  // ===== Reset playback when selection changes =====
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(null);
    setRows([]);

    if (!symbol || !expiry || !tradeDate) return;

    window.api.playbackStep({
      symbol,
      expiry,
      currentTime: `${tradeDate} 09:15:00+05:30`,
      direction: 'NEXT',
    }).then(res => {
      if (res?.success) {
        setCurrentTime(res.time);
        setRows(res.rows);
      }
    });
  }, [symbol, expiry, tradeDate]);

  // ===== Playback loop =====
  useEffect(() => {
    if (!isPlaying) return;

    const id = setInterval(() => {
      step('NEXT');
    }, 1000);

    return () => clearInterval(id);
  }, [isPlaying, step]);

  // ===== UI handlers =====
  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleNext = () => step('NEXT');
  const handlePrev = () => step('PREV');

  // ===== Derived spot price =====
  const spotPrice =
    rows.length > 0 ? rows[0].underlying_value : null;

  // ===== Render =====
  return (
    <div className="flex flex-col h-screen bg-[#09090b] text-gray-200">

      <InstrumentBar
        symbol={symbol}
        expiry={expiry}
        tradeDate={tradeDate}
        onSymbolChange={setSymbol}
        onExpiryChange={setExpiry}
        onDateChange={setTradeDate}
      />

      <MasterControlBar
        symbol={symbol}
        expiry={expiry}
        viewMode={viewMode}
        setViewMode={setViewMode}
        snapshotTime={currentTime}
        spotPrice={spotPrice}
      />

      <TimeTravelBar
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onNext={handleNext}
        onPrev={handlePrev}
        currentTime={currentTime}
      />

      <OptionChainTable
        data={rows}
        viewMode={viewMode}
      />
    </div>
  );
}
