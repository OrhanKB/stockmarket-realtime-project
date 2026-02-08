import { useFinnhub } from "../hooks/useFinnhub";

function Stocks() {
    const { sections, status } = useFinnhub();

    return (
        <div className="max-w-full px-5 py-4 mx-auto bg-gray-50 font-sans rounded-md">

            <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-lg shadow-sm">
                <h1 className="text-xl font-bold text-gray-800">Market Dashboard</h1>
                <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${status === "Connected" ? "bg-green-500 animate-pulse" : "bg-orange-500"}`}></span>
                    <span className={`font-medium text-sm ${status === "Connected" ? "text-green-600" : "text-orange-500"}`}>
                        {status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2  gap-4">
                {sections.map((section) => (
                    <div key={section.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">

                        <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-base font-semibold text-gray-700">{section.title}</h2>
                        </div>


                        <div className="divide-y divide-gray-100">
                            {section.items.map(item => (
                                <div key={item.symbol} className="px-4 py-2 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm text-gray-800">{item.symbol.replace('BINANCE:', '')}</span>
                                        <span className="text-[10px] text-gray-400">Time: {item.time ? new Date(item.time).toLocaleTimeString() : '--:--:--'}</span>
                                    </div>
                                    <div className="text-right flex flex-col items-end pl-2">
                                        {item.price ? (
                                            <div className={`flex items-center gap-1 ${item.direction === 'up' ? 'text-green-500' : item.direction === 'down' ? 'text-red-500' : 'text-gray-900'}`}>
                                                {item.direction === 'up' && (
                                                    <i class="fa-solid fa-arrow-trend-up"></i>
                                                )}
                                                {item.direction === 'down' && (
                                                    <i class="fa-solid fa-arrow-trend-down"></i>
                                                )}
                                                <span className="text-base font-mono font-bold tracking-tight">
                                                    ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic animate-pulse">Waiting</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Stocks;