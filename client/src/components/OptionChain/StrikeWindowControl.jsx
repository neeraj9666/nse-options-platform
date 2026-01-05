export default function StrikeWindowControl({ windowSize, setWindowSize }) {
    return (
        <div className="px-4 py-2 flex items-center gap-3 border-b border-neutral-800 bg-neutral-900">
            <span className="text-xs text-neutral-400">
                Strikes above / below ATM
            </span>

            <input
                type="number"
                min={1}
                max={50}
                value={windowSize}
                onChange={(e) => setWindowSize(Number(e.target.value))}
                className="w-16 px-2 py-1 text-xs bg-neutral-800 border border-neutral-700 rounded outline-none"
            />

            <span className="text-xs text-neutral-500">
                (Total rows = {windowSize * 2 + 1})
            </span>
        </div>
    );
}
