// ✅ CORRECTED: useOptionChain.ts
import { useState, useEffect } from 'react';

export function useOptionChain(
    symbol: string,
    selectedExpiries: string[],
    timestamp: string
) {
    const [dataByExpiry, setDataByExpiry] = useState<Record<string, any[]>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // ✅ FIXED: Validate all parameters before fetching
        if (!symbol || !timestamp || selectedExpiries.length === 0) {
            console.log('⏭️ Skipping fetch - missing parameters:', {
                symbol: !!symbol,
                timestamp: !!timestamp,
                expiriesCount: selectedExpiries.length
            });
            setDataByExpiry({});
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const allData: Record<string, any[]> = {};

                for (const expiry of selectedExpiries) {
                    try {
                        console.log(`📊 Fetching snapshot:`, {
                            symbol,
                            expiry,
                            timestamp
                        });

                        // ✅ FIXED: Pass correct parameters
                        const result = await window.api.getSnapshot({
                            symbol,
                            expiry,  // This is now the actual date string
                            timestamp  // This is now the ISO string
                        });

                        allData[expiry] = result || [];
                        console.log(`✅ Loaded ${result?.length || 0} rows for ${expiry}`);
                    } catch (err: any) {
                        // ✅ FIXED: Proper quote escaping
                        console.error(`❌ Failed to fetch data for ${expiry}:`, err);
                        allData[expiry] = [];
                        setError(err.message);
                    }
                }

                setDataByExpiry(allData);
            } catch (err: any) {
                console.error('Failed to fetch option chain:', err);
                setError(err.message);
                setDataByExpiry({});
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [symbol, timestamp, JSON.stringify(selectedExpiries)]);

    return { dataByExpiry, loading, error };
}
