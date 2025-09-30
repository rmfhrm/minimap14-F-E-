import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

// 지도를 동적으로 이동시키기 위한 헬퍼 컴포넌트
const MapController = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 14); // 부드럽게 이동하는 효과
  }, [center, map]);
  return null;
};

const MapComponent = ({ stores, onStoreSelect, initialCenter }) => {
  return (
    <MapContainer 
        center={initialCenter} 
        zoom={14}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
    >
      <MapController center={initialCenter} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {stores.map(store => (
        <Marker 
          key={store.id} 
          position={store.position}
          eventHandlers={{
            click: () => {
              onStoreSelect(store);
            },
          }}
        >
          <Popup>
            <h3 className="font-bold">{store.name}</h3>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;