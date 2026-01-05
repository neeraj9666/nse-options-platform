export default function HeaderBar({ optionType, setOptionType }) {
    const btn = (type, label, color) => (
        <button
            onClick={() => setOptionType(type)}
            className={`px-3 py-1 text-xs ${optionType === type
                    ? color
                    : 'text-neutral-400 hover:bg-neutral-800'
                }`}
        >
            {label}
        </button>
    );

    return (
        <div className="h-14 px-4 flex items-center gap-3 bg-neutral-900">
            {btn('CE', 'CE', 'text-emerald-400')}
            {btn('PE', 'PE', 'text-rose-400')}
            {btn('BOTH', 'BOTH', 'text-neutral-200')}
            <span className="ml-auto text-xs text-neutral-400">
                NIFTY · 29-May-2025
            </span>
        </div>
    );
}
