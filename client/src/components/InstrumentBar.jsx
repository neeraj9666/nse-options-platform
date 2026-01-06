import { useEffect, useState } from 'react';

export default function InstrumentBar({
    symbol,
    expiry,
    tradeDate,
    onSymbolChange,
    onExpiryChange,
    onDateChange,
}) {
    const [symbols, setSymbols] = useState([]);
    const [expiries, setExpiries] = useState([]);
    const [dates, setDates] = useState([]);

    useEffect(() => {
        window.api.getSymbols().then(setSymbols);
    }, []);

    useEffect(() => {
        if (!symbol) return;
        window.api.getExpiries(symbol).then(setExpiries);
    }, [symbol]);

    useEffect(() => {
        if (!symbol || !expiry) return;
        window.api.getDates({ symbol, expiry }).then(setDates);
    }, [symbol, expiry]);

    return (
        <div className="flex gap-3 px-4 py-2 border-b border-[#222] bg-[#0b0b0e]">

            <select value={symbol} onChange={e => onSymbolChange(e.target.value)}>
                {symbols.map(s => (
                    <option key={s} value={s}>{s}</option>
                ))}
            </select>

            <select
                value={expiry ?? ''}
                onChange={e => onExpiryChange(e.target.value)}
            >
                <option value="" disabled>Select expiry</option>

                {expiries.map(e => {
                    const iso = new Date(e).toISOString().slice(0, 10);
                    return (
                        <option key={iso} value={iso}>
                            {iso}
                        </option>
                    );
                })}
            </select>


            <select
                value={tradeDate ?? ''}
                onChange={e => onDateChange(e.target.value)}
            >
                <option value="" disabled>Select date</option>

                {dates.map(d => {
                    const iso = new Date(d).toISOString().slice(0, 10); // YYYY-MM-DD
                    return (
                        <option key={iso} value={iso}>
                            {iso}
                        </option>
                    );
                })}
            </select>
        </div>
    );
}
