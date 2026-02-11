import { useState } from 'react';
import { useFinnhub } from "../hooks/useFinnhub";
import Content from "./Content";
import TabButtons from "./TabButtons";

function Stocks() {
    const { sections, status, baseSocket } = useFinnhub();
    const [activeTab, setActiveTab] = useState('Crypto');

    const usStocksData = sections.find(s => s.title === "US Stocks");
    const cryptoData = sections.find(s => s.title === "Crypto");

    return (
        <div width="400px" className="max-w-full px-4 py-8 mx-auto bg-gray-50 h-[630] font-sans">
            {/* Header / Status Bar */}
            <div className={`flex justify-between items-center bg-white rounded-lg shadow-sm border border-gray-100 w-[98%] max-w-none mx-auto gap-4 mb-4 px-4 py-2 h-14`}>
                <h1 className={`font-bold text-gray-800 whitespace-nowrap text-base `}>Market Dashboard</h1>
                <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${status === "Connected" ? "bg-green-500 animate-pulse" : "bg-orange-500"}`}></span>
                    <span className={`font-medium text-sm ${status === "Connected" ? "text-green-600" : "text-orange-500"}`}>
                        {status}
                    </span>
                </div>
            </div>


            <TabButtons activeTab={activeTab} setActiveTab={setActiveTab} />

            <Content
                activeTab={activeTab}
                cryptoData={cryptoData}
                usStocksData={usStocksData}
                baseSocket={baseSocket}
            />
        </div>
    );
}

export default Stocks;
