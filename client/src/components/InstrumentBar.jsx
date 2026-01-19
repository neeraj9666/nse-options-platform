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
        window.api.getSymbols().then(setSymbols);
    }, []);

    // Load trading dates when symbol changes
    useEffect(() => {
        if (!symbol) return;

        onDateChange(null);
        onExpiryChange(null);
        setExpiries([]);

        window.api.getDates({ symbol }).then(d =>
            setDates(d.map(x => new Date(x).toISOString().slice(0, 10)))
        );
    }, [symbol]);

    // Load expiries when date changes
    useEffect(() => {
        if (!symbol || !tradeDate) return;

        onExpiryChange(null);

        window.api
            .getExpiriesByDate({ symbol, tradeDate })
            .then(e =>
                setExpiries(e.map(x => new Date(x).toISOString().slice(0, 10)))
            );
    }, [symbol, tradeDate]);

    return (
        <div className="flex gap-4 px-4 py-2 border-b border-[#222] bg-[#0b0b0e]">

            {/* Instrument */}
            <select value={symbol} onChange={e => onSymbolChange(e.target.value)}>
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
