import React from 'react';
import { useDraggable } from '@dnd-kit/core';

const PIXEL_SCALE = 0.5;

const PlacedItem = ({ item, onDeleteItem, onSetHoveredItem }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.id,
    data: { isPlacedItem: true, }
  });

  const style = {
    position: 'absolute',
    left: item.x,
    top: item.y,
    width: (item.width || 128) * PIXEL_SCALE, // 기본 크기를 64px로 고정
    height: (item.height || 128) * PIXEL_SCALE, // 기본 크기를 64px로 고정
    transform: `
      ${transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : ''}
      rotate(${item.rotation || 0}deg)
    `,
    touchAction: 'none',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onDoubleClick={() => onDeleteItem(item.id)}
      onMouseEnter={() => onSetHoveredItem(item.id)}
      onMouseLeave={() => onSetHoveredItem(null)}
      className="cursor-move filter drop-shadow-xl hover:scale-105 hover:drop-shadow-2xl transition-all duration-200"
      title="더블클릭: 삭제 / 마우스 올리고 'R'키: 회전"
    >
      <img src={item.icon} alt={item.name} className="w-full h-full object-contain" />
    </div>
  );
};

export default PlacedItem;