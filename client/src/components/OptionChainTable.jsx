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
            <table className="w-full text-xs font-mono border-collapse">
                <thead className="sticky top-0 bg-[#18181b]">
                    <tr>
                        <th className="px-2 py-1">Strike</th>
                        {(viewMode === 'CE' || viewMode === 'BOTH') && (
                            <th className="px-2 py-1 text-green-400">CE LTP</th>
                        )}
                        {(viewMode === 'PE' || viewMode === 'BOTH') && (
                            <th className="px-2 py-1 text-red-400">PE LTP</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data.map(row => (
                        <tr
                            key={row.strike_price}
                            onClick={() => onRowClick?.(row)}
                            className="cursor-pointer hover:bg-[#222]"
                        >
                            <td className="px-2 py-1 text-center font-bold">
                                {row.strike_price}
                            </td>

                            {(viewMode === 'CE' || viewMode === 'BOTH') && (
                                <td className="px-2 py-1 text-right">
                                    {row.ce_ltp ?? '-'}
                                </td>
                            )}

                            {(viewMode === 'PE' || viewMode === 'BOTH') && (
                                <td className="px-2 py-1 text-right">
                                    {row.pe_ltp ?? '-'}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
