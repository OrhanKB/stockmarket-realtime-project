import Crypto from "./Crypto";
import USStocks from "./USStocks";

const Content = ({ activeTab, gridMode, setGridMode, cryptoData, usStocksData }) => {
    return (
        <div className="flex flex-col w-[98%] max-w-none mx-auto">
            <div className="self-end flex items-center gap-2 mb-2 bg-white p-1 rounded-lg border border-blue-100 shadow-sm">
                <button
                    onClick={() => setGridMode(1)}
                    className={`w-10 h-10 flex items-center justify-center rounded transition-colors duration-200 focus:outline-none focus:ring-0 ${gridMode === 1 ? 'bg-blue-100 text-blue-600' : 'bg-white text-blue-300 hover:bg-blue-50 hover:text-blue-600'}`}
                >
                    <i className="fas fa-stop text-lg"></i>
                </button>
                <button
                    onClick={() => setGridMode(2)}
                    className={`w-10 h-10 flex items-center justify-center rounded transition-colors duration-200 focus:outline-none focus:ring-0 ${gridMode === 2 ? 'bg-blue-100 text-blue-600' : 'bg-white text-blue-300 hover:bg-blue-50 hover:text-blue-600'}`}
                >
                    <i className="fa-solid fa-table-cells text-lg"></i>
                </button>
            </div>

            {activeTab === 'Crypto' &&
                <Crypto data={cryptoData} gridMode={gridMode} />
            }

            {activeTab === 'US Stocks' &&
                <USStocks data={usStocksData} gridMode={gridMode} />
            }
        </div>
    );
};

export default Content;
