import React from 'react';

export default function OptionChainTable({ data, viewMode, onRowClick }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center text-gray-500">
                Option Chain will render here
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-auto">
            <table className="w-full text-xs font-mono">
                <thead>
                    <tr>
                        <th>Strike</th>
                        <th>CE LTP</th>
                        <th>PE LTP</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(row => (
                        <tr
                            key={row.strike_price}
                            onClick={() => onRowClick(row)}
                            className="cursor-pointer hover:bg-[#222]"
                        >
                            <td>{row.strike_price}</td>
                            <td>{row.ce_ltp}</td>
                            <td>{row.pe_ltp}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
