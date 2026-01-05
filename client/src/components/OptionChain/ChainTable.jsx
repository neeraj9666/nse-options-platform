import { formatDateTime, formatDate } from '../../utils/formatters';

// ...

export default function ChainTable({ rows }) {
    return (
        <div className="h-full overflow-auto text-xs">
            <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-neutral-900 z-10">
                    <tr className="border-b border-neutral-800">
                        <th className="px-2 py-1 text-left">Time</th>
                        <th className="px-2 py-1 text-left">Expiry</th>
                        <th className="px-2 py-1 text-right">Strike</th>
                        <th className="px-2 py-1 text-center">Type</th>
                        <th className="px-2 py-1 text-right">OI</th>
                        <th className="px-2 py-1 text-right">ΔOI</th>
                        <th className="px-2 py-1 text-right">LTP</th>
                    </tr>
                </thead>

                <tbody>
                    {rows.map((r, idx) => (
                        <tr
                            key={idx}
                            className="border-b border-neutral-800 hover:bg-neutral-800/60"
                        >
                            <td>{formatDateTime(r.time)}</td>
                            <td>{formatDate(r.expiry_date)}</td>
                            <td className="px-2 py-1 text-right">{r.strike_price}</td>
                            <td
                                className={`px-2 py-1 text-center font-semibold ${r.option_type === 'CE'
                                    ? 'text-emerald-400'
                                    : 'text-rose-400'
                                    }`}
                            >
                                {r.option_type}
                            </td>
                            <td className="px-2 py-1 text-right">{r.open_interest}</td>
                            <td className="px-2 py-1 text-right">{r.oi_change}</td>
                            <td className="px-2 py-1 text-right">{r.last_price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
