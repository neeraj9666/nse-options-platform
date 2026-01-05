export function formatDateTime(ts) {
    if (!ts) return '';
    const d = new Date(ts);

    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();

    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');

    return `${dd}-${mm}-${yyyy} ${hh}:${min}:${ss}`;
}

export function formatDate(ts) {
    if (!ts) return '';
    const d = new Date(ts);

    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();

    return `${dd}-${mm}-${yyyy}`;
}
