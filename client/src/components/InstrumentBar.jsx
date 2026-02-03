import { useEffect, useState } from 'react';

export default function InstrumentDateExpiryBar({
    symbol,
    tradeDate,
    expiry,
    onSymbolChange,
    onDateChange,
    onExpiryChange,
}) {
    const [symbols, setSymbols] = useState([]);
    const [dates, setDates] = useState([]);
    const [expiries, setExpiries] = useState([]);

    // Load instruments
    useEffect(() => {
        if (!window.api) return;
        window.api.getSymbols().then((result) => {
            setSymbols(result);
            if (!symbol && result?.length) {
                onSymbolChange(result[0]);
            }
        });
    }, [symbol, onSymbolChange]);

    // Load trading dates when symbol changes
    useEffect(() => {
        if (!symbol) return;

        onDateChange(null);
        onExpiryChange(null);
        setExpiries([]);

        if (!window.api) return;

        window.api.getDates({ symbol }).then((d) => {
            const formatted = d.map(x => new Date(x).toISOString().slice(0, 10));
            setDates(formatted);
            if (formatted.length) {
                onDateChange(formatted[0]);
            }
        });
    }, [symbol, onDateChange, onExpiryChange]);

    // Load expiries when date changes
    useEffect(() => {
        if (!symbol || !tradeDate) return;

        onExpiryChange(null);

        if (!window.api) return;

        window.api
            .getExpiriesByDate({ symbol, tradeDate })
            .then((e) => {
                const formatted = e.map(x => new Date(x).toISOString().slice(0, 10));
                setExpiries(formatted);
                if (formatted.length) {
                    onExpiryChange(formatted[0]);
                }
            });
    }, [symbol, tradeDate, onExpiryChange]);

    return (
        <div className="flex gap-4 px-4 py-2 border-b border-[#222] bg-[#0b0b0e]">

            {/* Instrument */}
            <select value={symbol} onChange={e => onSymbolChange(e.target.value)}>
                <option value="" disabled>Select symbol</option>
                {symbols.map(s => (
                    <option key={s} value={s}>{s}</option>
                ))}
            </select>

            {/* Trading Date (Calendar) */}
            <input
                type="date"
                value={tradeDate ?? ''}
                onChange={e => onDateChange(e.target.value)}
                min={dates[0]}
                max={dates[dates.length - 1]}
            />

            {/* Expiry */}
            <select
                value={expiry ?? ''}
                onChange={e => onExpiryChange(e.target.value)}
                disabled={!tradeDate}
            >
                <option value="" disabled>Select expiry</option>
                {expiries.map(e => (
                    <option key={e} value={e}>{e}</option>
                ))}
            </select>
        </div>
    );
}
