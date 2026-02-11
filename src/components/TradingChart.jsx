import { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';

export default function TradingChart({ data, colors = {} }) {
    const chartContainerRef = useRef(null);
    const seriesRef = useRef(null);
    const chartRef = useRef(null);

    const {
        backgroundColor = '#ffffff',
        lineColor = '#2962FF',
        textColor = 'black',
        areaTopColor = '#2962FF',
        areaBottomColor = 'rgba(41, 98, 255, 0.28)',
    } = colors;

    useEffect(() => {
        const handleResize = () => {
            if (chartRef.current) {
                chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: backgroundColor },
                textColor,
            },
            width: chartContainerRef.current.clientWidth,
            height: 400,
            grid: {
                vertLines: { color: 'rgba(197, 203, 206, 0.5)' },
                horzLines: { color: 'rgba(197, 203, 206, 0.5)' },
            },
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
                barSpacing: 10,
                rightOffset: 12,
            },
            localization: {
                timeFormatter: (timestamp) => {
                    return new Date(timestamp * 1000).toLocaleTimeString();
                },
            },
        });
        chartRef.current = chart;

        const series = chart.addSeries(CandlestickSeries, {
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });
        seriesRef.current = series;


        if (data && data.length > 0) {
            series.setData(data);
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, []);

    useEffect(() => {
        if (seriesRef.current && data) {
            seriesRef.current.setData(data);

            if (chartRef.current && data.length > 0 && String(chartRef.current.timeScale().getVisibleLogicalRange()?.from) === 'null') {
                chartRef.current.timeScale().fitContent();
            }
        }
    }, [data]);

    return (
        <div ref={chartContainerRef} className="w-full relative" />
    );
}
