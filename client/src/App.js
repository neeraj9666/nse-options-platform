import React, { useEffect, useState } from 'react';
import MasterControlBar from './components/MasterControlBar';
import TimeTravelBar from './components/TimeTravelBar';
import OptionChainTable from './components/OptionChainTable';

export default function App() {
  const [data, setData] = useState([]);
  const [viewMode, setViewMode] = useState('BOTH');

  // 🔒 LOCKED SNAPSHOT (for validation)
  const symbol = 'NIFTY';
  const expiry = '2025-05-29';
  const atTime = '2025-05-15 09:15:00+05:30';

  useEffect(() => {
    async function loadSnapshot() {
      const res = await window.api.getOptionChainSnapshot({
        symbol,
        expiry,
        atTime,
        windowSize: 10   // ⬅️ default 21 strikes
      });

      if (res.success) setData(res.data);
    }

    loadSnapshot();
  }, []);


  return (
    <div className="flex flex-col h-screen bg-[#09090b] text-gray-200">
      <MasterControlBar />
      <TimeTravelBar />
      <OptionChainTable data={data} viewMode={viewMode} />
    </div>
  );
}
