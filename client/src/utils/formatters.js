// dd-mm-yyyy hh:mm:ss (24h)
export function formatDateTime(ts) {
    if (!ts) return '--';

    return new Date(ts).toLocaleString('en-GB', {
        hour12: false,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// dd-mm-yyyy
export function formatDate(d) {
    if (!d) return '--';

    return new Date(d).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}
