import React, { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import StoreDetail from './components/StoreDetail';

const Header = () => (
  <header className="bg-white shadow-md z-20 w-full">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <h1 className="text-xl font-bold text-gray-800">🚀 AI 창업 내비게이터</h1>
      </div>
    </div>
  </header>
);

const InitialPanel = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <p className="text-xl font-semibold text-gray-500">← 지도에서 상가를 선택해주세요.</p>
      <p className="text-gray-400 mt-2">상가를 선택하면 상세 정보가 여기에 표시됩니다.</p>
    </div>
  </div>
);

function App() {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);

  useEffect(() => {
    fetch('/stores.json')
      .then((response) => response.json())
      .then(rawData => {
        const formattedData = rawData
          .filter(store => store['위도'] && store['경도'])
          .map(store => ({
            id: store['점포(ID)'],
            name: store['점포명'],
            address: store['소재지도로명주소'] || store['소재지지번주소'],
            area: `${store['width']}㎡`,
            position: [store['위도'], store['경도']],
            floorPlan: {
              width: 500,
              height: 400,
              walls: [
                { id: 'w1', x: 0, y: 0, width: 500, height: 10 },
                { id: 'w2', x: 0, y: 390, width: 500, height: 10 },
                { id: 'w3', x: 0, y: 10, width: 10, height: 380 },
                { id: 'w4', x: 490, y: 10, width: 10, height: 380 }
              ]
            }
          }));
        setStores(formattedData);
      })
      .catch(error => console.error("데이터를 불러오거나 처리하는 중 오류 발생:", error));
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
          {selectedStore ? <StoreDetail store={selectedStore} /> : <InitialPanel />}
        </div>
      </div>
    </div>
  );
}

export default App;