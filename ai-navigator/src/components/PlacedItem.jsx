import React from 'react';
import { Rnd } from 'react-rnd';

const PIXEL_SCALE = 0.5;

const PlacedItem = ({ item, onDeleteItem, onSetHoveredItem, onItemChange }) => {
  const itemWidth = (item.width || 128) * PIXEL_SCALE;
  const itemHeight = (item.height || 128) * PIXEL_SCALE;

  const rotation = item.rotation || 0;
  const isSideways = rotation === 90 || rotation === 270;
  const displayWidth = isSideways ? itemHeight : itemWidth;
  const displayHeight = isSideways ? itemWidth : itemHeight;

  return (
    <Rnd
      size={{ width: displayWidth, height: displayHeight }}
      position={{ x: item.x, y: item.y }}
      onDragStop={(e, d) => {
        onItemChange(item.id, { x: d.x, y: d.y });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        let newWidth = parseFloat(ref.style.width) / PIXEL_SCALE;
        let newHeight = parseFloat(ref.style.height) / PIXEL_SCALE;

        onItemChange(item.id, {
          width: isSideways ? newHeight : newWidth,
          height: isSideways ? newWidth : newHeight,
          ...position,
        });
      }}
      onMouseEnter={() => onSetHoveredItem(item.id)}
      onMouseLeave={() => onSetHoveredItem(null)}
      onDoubleClick={() => onDeleteItem(item.id)}
      bounds="parent"
      lockAspectRatio={false}
    >
      <div 
        className="w-full h-full cursor-move filter drop-shadow-md"
        title="더블클릭: 삭제 / 'R'키: 회전"
        style={{
          transform: `rotate(${rotation}deg)`,
          transformOrigin: 'center center',
        }}
      >
        <img src={item.icon} alt={item.name} className="w-full h-full object-contain" />
      </div>
    </Rnd>
  );
};

export default PlacedItem;