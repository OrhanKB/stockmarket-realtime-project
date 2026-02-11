import { useState, useEffect, useRef, useCallback } from 'react';

const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

export const useFinnhubSocket = (symbols = []) => {
    const [socketData, setSocketData] = useState({});
    const [status, setStatus] = useState("Initializing");
    const socketRef = useRef(null);

    const listenersRef = useRef([]);

    useEffect(() => {
        if (!API_KEY) {
            setStatus("API Key Missing");
            return;
        }

        if (symbols.length === 0) return;

        setStatus("Connecting to WebSocket");
        const socket = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`);
        socketRef.current = socket;

        socket.onopen = () => {
            setStatus("Connected");
            symbols.forEach(symbol => {
                socket.send(JSON.stringify({ type: "subscribe", symbol: symbol }));
            });
        };

        socket.onmessage = (event) => {
            try {
                const response = JSON.parse(event.data);
                if (response.type === "ping") return;

                if (response.data) {

                    setSocketData((prev) => {
                        const next = { ...prev };
                        response.data.forEach((trade) => {
                            const prevPrice = next[trade.s]?.price;
                            const newPrice = trade.p;
                            let direction = next[trade.s]?.direction || 'same';

                            if (newPrice > prevPrice) {
                                direction = 'up';
                            } else if (newPrice < prevPrice) {
                                direction = 'down';
                            }

                            next[trade.s] = {
                                price: newPrice,
                                volume: trade.v,
                                time: trade.t,
                                direction: direction
                            };
                        });
                        return next;
                    });

                    listenersRef.current.forEach(listener => listener(response));
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        socket.onerror = () => {
            setStatus("WebSocket Error");
        };

        socket.onclose = () => {
            if (status !== "API Key Missing") setStatus("Disconnected");
        };

        return () => {
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.close();
            }
        };
    }, [symbols.join(",")]);

    const addListener = useCallback((callback) => {
        listenersRef.current.push(callback);
    }, []);

    const removeListener = useCallback((callback) => {
        listenersRef.current = listenersRef.current.filter(cb => cb !== callback);
    }, []);

    return { socketData, status, addListener, removeListener };
};
