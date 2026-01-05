import React from 'react';

export default function MasterControlBar({
    symbol,
    expiry,
    viewMode,
    setViewMode
}) {
    return (
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#222]">
            <div className="font-mono font-bold">
                {symbol} · {expiry}
            </div>

            <div className="flex gap-2">
                {['CE', 'PE', 'BOTH'].map(v => (
                    <button
                        key={v}
                        onClick={() => setViewMode(v)}
                        className={viewMode === v ? 'text-yellow-400' : ''}
                    >
                        {v}
                    </button>
                ))}
            </div>
        </div>
    );
}
