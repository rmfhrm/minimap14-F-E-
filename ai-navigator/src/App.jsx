import React, { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import StoreDetail from './components/StoreDetail';

const Header = () => (
  <header className="bg-white shadow-md z-10 w-full">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <h1 className="text-xl font-bold text-gray-800">🚀 AI 창업 내비게이터</h1>
      </div>
    </div>
  </header>
);

function App() {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);

  useEffect(() => {
    fetch('/stores.json')
      .then((response) => response.json())
      .then((data) => setStores(data))
      .catch((error) => console.error("Error fetching stores data:", error));
  }, []);

  const handleStoreSelect = (store) => {
    setSelectedStore(store);
  };

  return (
    <div className="flex flex-col h-screen font-sans">
      <Header />
      <div className="flex flex-grow overflow-hidden">
        <div className="w-3/5 h-full">
          <MapComponent stores={stores} onStoreSelect={handleStoreSelect} />
        </div>
        <div className="w-2/5 h-full bg-slate-50">
          <StoreDetail store={selectedStore} />
        </div>
      </div>
    </div>
  );
}

export default App;