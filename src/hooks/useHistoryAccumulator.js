import { useRef, useEffect, useCallback } from 'react';

export const useHistoryAccumulator = (baseSocket) => {
    const historyRef = useRef({});

    useEffect(() => {
        if (!baseSocket || !baseSocket.addListener) return;

        const handleHistory = (response) => {
            if (response.type === 'trade' && response.data) {

                response.data.forEach((trade) => {
                    const symbol = trade.s;
                    const tradePrice = trade.p;
                    const tradeTime = Math.floor(trade.t / 1000);
                    const candleTime = Math.floor(tradeTime / 60) * 60;

                    if (!historyRef.current[symbol]) {
                        historyRef.current[symbol] = [];
                    }

                    const symbolHistory = historyRef.current[symbol];
                    const lastCandle = symbolHistory[symbolHistory.length - 1];

                    if (lastCandle && lastCandle.time === candleTime) {
                        lastCandle.high = Math.max(lastCandle.high, tradePrice);
                        lastCandle.low = Math.min(lastCandle.low, tradePrice);
                        lastCandle.close = tradePrice;
                    } else if (lastCandle && candleTime > lastCandle.time) {
                        symbolHistory.push({
                            time: candleTime,
                            open: tradePrice,
                            high: tradePrice,
                            low: tradePrice,
                            close: tradePrice
                        });

                    } else if (!lastCandle) {
                        symbolHistory.push({
                            time: candleTime,
                            open: tradePrice,
                            high: tradePrice,
                            low: tradePrice,
                            close: tradePrice
                        });
                    }
                });
            }
        };

        baseSocket.addListener(handleHistory);

        return () => {
            if (baseSocket.removeListener) {
                baseSocket.removeListener(handleHistory);
            }
        };
    }, [baseSocket]);

    const getHistory = useCallback(() => {
        return historyRef.current;
    }, []);

    return { getHistory };
};
