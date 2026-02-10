
const TabButtons = ({ activeTab, setActiveTab }) => {
    return (
        <div className="flex justify-center mb-6 gap-4">
            <button
                onClick={() => setActiveTab('Crypto')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${activeTab === 'Crypto'
                    ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
            >
                Crypto
            </button>
            <button
                onClick={() => setActiveTab('US Stocks')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${activeTab === 'US Stocks'
                    ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
            >
                US Stocks
            </button>
        </div>
    );
};

export default TabButtons;
