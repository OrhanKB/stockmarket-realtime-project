import { useState, useEffect, useRef } from 'react';

const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

export const useCandleData = (symbol, baseSocket) => {
    const [candles, setCandles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        if (baseSocket && baseSocket.getHistory) {
            const globalHistory = baseSocket.getHistory();
            if (globalHistory && globalHistory[symbol] && globalHistory[symbol].length > 0) {
                setCandles([...globalHistory[symbol]]);
                setLoading(false);
                return;
            }
        }

        const fetchFallback = async () => {
            try {

                const quoteEndpoint = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;

                const response = await fetch(quoteEndpoint);

                if (!response.ok) {
                    throw new Error(`Quote fetch failed: ${response.status}`);
                }

                const quoteData = await response.json();

                if (quoteData && quoteData.c) {
                    const now = Math.floor(Date.now() / 1000);
                    const todayStart = now - (now % 86400);

                    const dummyCandles = [
                        { time: todayStart - 86400, open: quoteData.pc, high: quoteData.pc, low: quoteData.pc, close: quoteData.pc },
                        { time: todayStart, open: quoteData.o, high: quoteData.h, low: quoteData.l, close: quoteData.c }
                    ];
                    setCandles(dummyCandles);
                } else {
                    setCandles([]);
                    setError("No Data Available");
                }
            } catch (err) {
                console.error("Error fetching quota/history:", err);
                setError(err.message || "Error loading data");
                setCandles([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFallback();

    }, [symbol]);

    useEffect(() => {
        if (!symbol || !baseSocket) return;

        const handleTrade = (response) => {
            if (response.type === 'trade' && response.data) {
                processTrades(response.data);
            }
        };

        baseSocket.addListener(handleTrade);

        return () => {
            baseSocket.removeListener(handleTrade);
        };
    }, [symbol, baseSocket]);

    const processTrades = (trades) => {
        setCandles(prevCandles => {

            const newCandles = [...prevCandles];

            trades.forEach(trade => {
                if (trade.s !== symbol) return;

                const tradePrice = trade.p;
                const tradeTime = Math.floor(trade.t / 1000);
                const candleTime = Math.floor(tradeTime / 60) * 60;
                const lastCandle = newCandles[newCandles.length - 1];

                if (lastCandle && lastCandle.time === candleTime) {

                    lastCandle.high = Math.max(lastCandle.high, tradePrice);
                    lastCandle.low = Math.min(lastCandle.low, tradePrice);
                    lastCandle.close = tradePrice;
                    // Open remains unchanged
                } else if (lastCandle && candleTime > lastCandle.time) {
                    newCandles.push({
                        time: candleTime,
                        open: tradePrice,
                        high: tradePrice,
                        low: tradePrice,
                        close: tradePrice
                    });
                } else if (!lastCandle) {
                    newCandles.push({
                        time: candleTime,
                        open: tradePrice,
                        high: tradePrice,
                        low: tradePrice,
                        close: tradePrice
                    });
                }

            });

            return newCandles;
        });
    };

    return { candles, loading, error };
};
