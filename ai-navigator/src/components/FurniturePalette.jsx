// src/components/FurniturePalette.jsx

import React from 'react';
import { useDraggable } from '@dnd-kit/core';

function DraggableFurniture({ id, children, iconSrc }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
    data: {
      isPlacedItem: false,
      name: children,
      icon: iconSrc,
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}
         className="p-2 bg-white border rounded-lg shadow-sm cursor-grab touch-none flex flex-col items-center w-24 hover:shadow-lg transition-shadow">
      <img src={iconSrc} alt={children} className="w-12 h-12 mb-2 object-contain" />
      <span className="text-sm text-gray-700 font-medium">{children}</span>
    </div>
  );
}

const FurniturePalette = () => {
  // furnitureList가 위에서 다운로드한 .png 파일들을 사용하도록 수정합니다.
  const furnitureList = [
    { id: '테이블', name: '테이블', icon: '/icons/table.png' },
    { id: '의자', name: '의자', icon: '/icons/chair.png' },
    { id: '선반', name: '선반', icon: '/icons/shelf.png' },
  ];

  return (
    <div className="bg-gray-100 rounded-lg">
      <div className="flex justify-center gap-4 p-4">
        {furnitureList.map(item => (
          <DraggableFurniture key={item.id} id={item.id} iconSrc={item.icon}>
            {item.name}
          </DraggableFurniture>
        ))}
      </div>
    </div>
  );
};

export default FurniturePalette;