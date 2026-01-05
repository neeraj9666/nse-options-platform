export function sliceCenterStrike(rows, windowSize) {
    if (!rows || rows.length === 0) return [];

    // Use underlying_value to find ATM
    const spot = rows[0].underlying_value;

    // Group by strike
    const uniqueStrikes = [...new Set(rows.map(r => Number(r.strike_price)))]
        .sort((a, b) => a - b);

    // Find ATM strike
    let atmStrike = uniqueStrikes.reduce((prev, curr) =>
        Math.abs(curr - spot) < Math.abs(prev - spot) ? curr : prev
    );

    const atmIndex = uniqueStrikes.indexOf(atmStrike);

    const from = Math.max(0, atmIndex - windowSize);
    const to = Math.min(uniqueStrikes.length - 1, atmIndex + windowSize);

    const allowedStrikes = new Set(
        uniqueStrikes.slice(from, to + 1)
    );

    return rows.filter(r =>
        allowedStrikes.has(Number(r.strike_price))
    );
}
