// App.jsx (최종 확인 버전)

import React, { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import StoreDetail from './components/StoreDetail';
import Home from './components/Home';
import clsx from 'clsx';

// --- 스타일 상수 정의 ---
const appLayout = "flex flex-col h-screen font-sans";
const headerStyles = "bg-white shadow-md z-20 w-full";
const headerInner = "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"; 
const headerContent = "flex items-center justify-between h-16";
const logoButton = "text-xl font-bold text-gray-800 cursor-pointer transition-transform active:scale-95";
const mainLayout = "flex flex-grow overflow-hidden";
const mapArea = "flex-grow h-full";
const panelBase = "transition-all duration-500 ease-in-out bg-white shadow-lg";

// --- 컴포넌트 정의 ---
const Header = ({ onLogoClick }) => (
  <header className={headerStyles}>
    <div className={headerInner}>
      <div className={headerContent}>
        <h1 onClick={onLogoClick} className={logoButton}>
          🗺️ NaviArch
        </h1>
      </div>
    </div>
  </header>
);

const MainApp = ({ stores, initialCenter }) => {
  const [selectedStore, setSelectedStore] = useState(null);
  const handleStoreSelect = (store) => { setSelectedStore(store); };
  const handleClosePanel = () => { setSelectedStore(null); };

  return (
    <div className={mainLayout}>
      <div className={mapArea}>
        <MapComponent stores={stores} onStoreSelect={handleStoreSelect} initialCenter={initialCenter} />
      </div>
      <div
        className={clsx(
          panelBase,
          {
            'w-2/5 lg:w-[400px]': selectedStore,
            'w-0': !selectedStore,
          }
        )}
        style={{ overflow: 'hidden' }}
      >
        <div className="w-full h-full overflow-y-auto">
          {selectedStore && <StoreDetail store={selectedStore} onClose={handleClosePanel} />}
        </div>
      </div>
    </div>
  );
};

function App() {
  const [stores, setStores] = useState([]);
  const [mapCenter, setMapCenter] = useState(null);

  useEffect(() => {
    fetch('/stores.json')
      .then((response) => response.json())
      .then(rawData => {
        const formattedData = rawData
          .filter(store => store['위도'] && store['경도'])
          .map(store => ({
            id: store['점포(ID)'],
            name: store['소재지도로명주소'],
            address: store['소재지도로명주소'] || store['소재지지번주소'],
            area: `${store['width']}㎡`,
            position: [store['위도'], store['경도']],
            floorPlan: {
              width: 500, height: 400,
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

  const handleStart = (centerCoords) => { setMapCenter(centerCoords); };
  const handleGoHome = () => { setMapCenter(null); };

  return (
    <div className={appLayout}>
      <Header onLogoClick={handleGoHome} />
      {mapCenter ? (
        <MainApp stores={stores} initialCenter={mapCenter} />
      ) : (
        <Home onStart={handleStart} />
      )}
    </div>
  );
}

export default App;