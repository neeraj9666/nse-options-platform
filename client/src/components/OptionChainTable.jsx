export default function OptionChainTable({ data, viewMode }) {
    return (
        <table>
            <thead>
                <tr>
                    {viewMode !== 'PE' && <th>CE LTP</th>}
                    {viewMode !== 'PE' && <th>CE OI</th>}
                    <th>Strike</th>
                    {viewMode !== 'CE' && <th>PE LTP</th>}
                    {viewMode !== 'CE' && <th>PE OI</th>}
                </tr>
            </thead>
            <tbody>
                {data.map((r, i) => (
                    <tr key={i}>
                        {viewMode !== 'PE' && <td>{r.ce_ltp}</td>}
                        {viewMode !== 'PE' && <td>{r.ce_oi}</td>}
                        <td>{r.strike_price}</td>
                        {viewMode !== 'CE' && <td>{r.pe_ltp}</td>}
                        {viewMode !== 'CE' && <td>{r.pe_oi}</td>}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
