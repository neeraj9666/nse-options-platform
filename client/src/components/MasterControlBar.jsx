export default function MasterControlBar({
    symbol,
    expiry,
    viewMode,
    setViewMode,
    snapshotTime,
    spotPrice,
}) {
    return (
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#222] bg-[#0b0b0e]">
            {/* LEFT: Contract info */}
            <div className="flex flex-col">
                <div className="font-mono font-bold text-sm">
                    {symbol} · {expiry}
                </div>

                <div className="font-mono text-xs text-gray-400">
                    {snapshotTime
                        ? new Date(snapshotTime).toLocaleString()
                        : '—'}
                </div>

            </div>

            {/* CENTER: Spot price */}
            <div className="font-mono text-lg text-yellow-400">
                {spotPrice !== null ? `Spot ${spotPrice}` : '—'}
            </div>

            {/* RIGHT: View mode */}
            <div className="flex gap-3">
                {['CE', 'PE', 'BOTH'].map(v => (
                    <button
                        key={v}
                        onClick={() => setViewMode(v)}
                        className={
                            viewMode === v
                                ? 'text-yellow-400 font-bold'
                                : 'text-gray-400'
                        }
                    >
                        {v}
                    </button>
                ))}
            </div>
        </div>
    );
}
