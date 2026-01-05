export async function fetchOptionChainSnapshot(symbol, expiry, timestamp) {
    return window.api.getOptionChainSnapshot({
        symbol,
        expiry,
        timestamp
    });
}
