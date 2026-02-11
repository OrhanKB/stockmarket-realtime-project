import { useState } from 'react';
import TradingChart from './TradingChart';
import { useCandleData } from '../hooks/useCandleData';

const USStocks = ({ data, gridMode, baseSocket }) => {
    const [selectedSymbol, setSelectedSymbol] = useState(null);
    const { candles, loading, error } = useCandleData(selectedSymbol, baseSocket);

    if (!data) return null;

    // Detail View: Chart
    if (selectedSymbol) {
        return (
            <div className="flex flex-col gap-4 w-[500px] max-w-none mx-auto">
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 p-4 relative">
                    <div className="mb-2 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setSelectedSymbol(null)}
                                className="p-1 w-8 h-8 flex items-center justify-center bg-transparent hover:bg-blue-50 border border-blue-100 rounded-lg transition-colors"
                            >
                                <i className="fa-solid fa-arrow-left text-gray-500"></i>
                            </button>
                            <h3 className="text-lg font-bold text-gray-700">{selectedSymbol} Chart</h3>
                        </div>
                        {loading && <span className="text-xs text-blue-500 animate-pulse">Loading data...</span>}
                        {error && <span className="text-xs text-red-500 font-medium">{typeof error === 'string' ? error : 'Error loading chart'}</span>}
                    </div>
                    <div className="h-[400px] w-full">
                        <TradingChart data={candles} />
                    </div>
                </div>
            </div >
        );
    }

    // Master View: List
    return (
        <div className="bg-white rounded-xl shadow-md  overflow-hidden border border-gray-100 w-[500px]  max-w-none mx-auto">
            {/* Section Header */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-700">{data.title}</h2>
                <span className="text-[10px] font-medium text-gray-400 bg-gray-200 px-2 py-0.5 rounded">Live</span>
            </div>

            {/* List Items Grid */}
            <div className={`grid gap-0 divide-gray-100 ${gridMode === 2 ? 'grid-cols-1 md:grid-cols-2 md:divide-y-0 md:divide-x h-[350px] overflow-y-auto custom-scrollbar' : 'grid-cols-1 divide-y max-h-[350px] overflow-y-auto custom-scrollbar'}`}>
                {data.items.map((item, index) => (
                    <div
                        key={item.symbol}
                        onClick={() => setSelectedSymbol(item.symbol)}
                        className={`px-6 py-2 flex justify-between items-center whitespace-nowrap hover:bg-gray-50 transition-colors cursor-pointer ${gridMode === 2 ? 'border-b border-gray-100' : ''}`}
                    >
                        <div className="flex flex-col w-[45%]">
                            <span className="font-bold text-base text-gray-800 truncate">{item.symbol}</span>
                            <span className="text-xs text-gray-400">Time: {item.time ? new Date(item.time).toLocaleTimeString() : '--:--:--'}</span>
                        </div>
                        <div className="text-right pl-6 flex flex-col items-end w-[45%]">
                            {item.price ? (
                                <div className={`flex items-center gap-2 ${item.direction === 'up' ? 'text-green-500' : item.direction === 'down' ? 'text-red-500' : 'text-gray-900'}`}>
                                    {item.direction === 'up' && (
                                        <i className="fa-solid fa-arrow-trend-up text-lg"></i>
                                    )}
                                    {item.direction === 'down' && (
                                        <i className="fa-solid fa-arrow-trend-down text-lg"></i>
                                    )}
                                    <span className="text-md font-mono font-bold tracking-tight">
                                        ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-sm text-gray-400 italic animate-pulse">Waiting...</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default USStocks;
