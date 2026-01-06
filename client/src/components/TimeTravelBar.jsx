export default function TimeTravelBar({
    isPlaying,
    onPlay,
    onPause,
    onNext,
    onPrev,
    currentTime,
}) {
    return (
        <div className="flex items-center gap-3 px-4 py-2 border-b border-[#222]">
            <button onClick={onPrev}>⏮</button>

            {isPlaying ? (
                <button onClick={onPause}>⏸</button>
            ) : (
                <button onClick={onPlay}>▶️</button>
            )}

            <button onClick={onNext}>⏭</button>

            <div className="ml-4 text-sm font-mono text-gray-400">
                {currentTime ? new Date(currentTime).toLocaleString() : '—'}
            </div>
        </div>
    );
}
