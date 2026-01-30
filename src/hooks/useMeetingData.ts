import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export interface MeetingRecord {
    date: string;         // 開催日 (A列)
    nextAction: string;   // リライトをどうするか (B列)
    siteOpenDate: string; // 開設日 (G列)
    newArticles: string;  // 新記事数 (J列 2026年1月新記事) -> K列? Needs verifying logic
    rewrites: string;     // リライト数 (J列の下？)
    // ... based on CSV struct.
    // Given the complexity of the CSV structure (it's not a simple table, but a report format),
    // we may need a specific parser or just treat "Meeting Data" as the whole file content?

    // Checking the CSV again, it looks like a SINGLE report per file, not a list of meetings?
    // "2026年2月5日(木)" is in A1.

    // Wait, if the user wants to summarize "Meeting Minutes", usually it implies multiple records.
    // But this CSV looks like ONE detailed report for ONE meeting (or one person's report).
    // I will assume for now we are building a viewer for THIS format, 
    // and maybe later we can load multiple CSVs or a master list.

    // Let's create a generic interface for "Report Data" extracted from this specific layout.
    raw: string[][];
}

export const useMeetingData = () => {
    const [data, setData] = useState<string[][] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/data.csv');
                const reader = response.body?.getReader();
                const result = await reader?.read();
                const decoder = new TextDecoder('utf-8');
                const csv = decoder.decode(result?.value);

                Papa.parse(csv, {
                    complete: (results) => {
                        setData(results.data as string[][]);
                        setLoading(false);
                    },
                    error: (err: any) => {
                        setError(err.message);
                        setLoading(false);
                    }
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};
