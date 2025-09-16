import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const MapComponent = ({ stores, onStoreSelect }) => {
  const gwangjuPosition = [35.1601, 126.8514];

  return (
    <MapContainer center={gwangjuPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
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