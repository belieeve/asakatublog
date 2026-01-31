import { useState, useEffect } from 'react';

// シートごとのデータ構造
export interface SheetData {
    sheetName: string;
    data: string[][];
}

export const useMeetingData = () => {
    const [sheets, setSheets] = useState<SheetData[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 環境変数からGASのWebアプリURLを取得
                // NOTE: 開発中はここに直接URLを入れるか、.envファイルを作成して VITE_API_URL=... を設定してください
                const API_URL = import.meta.env.VITE_API_URL;

                if (!API_URL) {
                    // URL未定時のデモ用フォールバック（既存のCSVロジックを一時的に使用する場合など）
                    // ここではエラーとしてユーザーに通知し、URL設定を促す
                    throw new Error('API URL is not configured. Please set VITE_API_URL in .env');
                }

                const response = await fetch(API_URL);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const json = await response.json();

                // GASからのレスポンスが配列であることを確認
                if (Array.isArray(json)) {
                    setSheets(json);
                } else {
                    throw new Error('Invalid data format received from API');
                }

                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch meeting data:", err);
                setError(err instanceof Error ? err.message : 'Unknown error');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { sheets, loading, error };
};

