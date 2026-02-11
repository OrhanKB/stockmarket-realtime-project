import { useState, useEffect, useMemo, useRef } from 'react';
import { useFinnhubSocket } from './useFinnhubSocket';
import { useHistoryAccumulator } from './useHistoryAccumulator';

const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

export const useFinnhub = () => {
    const STATIC_US_STOCKS = [
        "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA",
        "NVDA", "META", "NFLX", "AMD", "INTC"
    ];
    const STATIC_CRYPTO = [
        "BINANCE:BTCUSDT", "BINANCE:ETHUSDT", "BINANCE:SOLUSDT",
        "BINANCE:BNBUSDT", "BINANCE:XRPUSDT", "BINANCE:ADAUSDT",
        "BINANCE:DOGEUSDT", "BINANCE:AVAXUSDT", "BINANCE:DOTUSDT", "BINANCE:MATICUSDT"
    ];

    const [initialData, setInitialData] = useState({});

    const allSymbols = [...STATIC_US_STOCKS, ...STATIC_CRYPTO];
    const { socketData, status, addListener, removeListener } = useFinnhubSocket(allSymbols);


    const { getHistory } = useHistoryAccumulator({ addListener, removeListener });



    useEffect(() => {
        if (!API_KEY) return;

        const fetchInitial = async () => {
            const initialDatas = {};
            try {

                const promises = allSymbols.map(async (symbol) => {
                    try {
                        const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`);
                        const data = await res.json();
                        if (data.c) {
                            initialDatas[symbol] = {
                                price: data.c,
                                volume: 0,
                                time: Date.now()
                            };
                        }
                    } catch (e) {
                        console.warn(`Failed to fetch: ${symbol}`, e);
                    }
                });
                await Promise.all(promises);
                setInitialData(initialDatas);
            } catch (err) {
                console.error("Error fetching initial:", err);
            }
        };

        fetchInitial();
    }, []);


    const realtimeData = { ...initialData, ...socketData };

    const sections = [
        {
            id: 1,
            title: "US Stocks",
            items: STATIC_US_STOCKS.map(symbol => ({
                symbol,
                ...realtimeData[symbol]
            }))
        },
        {
            id: 2,
            title: "Crypto",
            items: STATIC_CRYPTO.map(symbol => ({
                symbol,
                ...realtimeData[symbol]
            }))
        }
    ];

    // 3. Expose Base Socket Interface
    // We pass the socket methods + getHistory from the hook directly
    const baseSocket = useMemo(() => ({
        addListener,
        removeListener,
        getHistory
    }), [addListener, removeListener, getHistory]);

    return { sections, status, baseSocket };
};
