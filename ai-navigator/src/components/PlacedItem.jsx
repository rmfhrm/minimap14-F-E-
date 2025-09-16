import React from 'react';
import { useDraggable } from '@dnd-kit/core';

const PlacedItem = ({ item, onDeleteItem, onSetHoveredItem }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.id,
    data: {
      isPlacedItem: true,
    }
  });

  const style = {
    position: 'absolute',
    left: item.x,
    top: item.y,
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
      className="w-16 h-16 cursor-move filter drop-shadow-md"
      title="더블클릭: 삭제 / 마우스 올리고 'R'키: 회전"
    >
      <img src={item.icon} alt={item.name} className="w-full h-full" />
    </div>
  );
};

export default PlacedItem;