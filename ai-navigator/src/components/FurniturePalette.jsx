import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';

// 개별 가구 아이콘 컴포넌트 (수정 없음)
function DraggableFurniture({ id, children, iconSrc, itemData }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
    data: {
      isPlacedItem: false,
      name: children,
      icon: iconSrc,
      width: itemData.width,
      height: itemData.height,
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

// 가구 목록 데이터를 카테고리별로 구조화
const furnitureData = {
  "테이블/의자": [
    { id: '4인 사각테이블', name: '4인 사각테이블', icon: '/icons/table_4_rect.png', width: 140, height: 80 },
    { id: '2인 원형테이블', name: '2인 원형테이블', icon: '/icons/table_2_round.png', width: 70, height: 70 },
    { id: '1인 소파', name: '소파', icon: '/icons/armchair.png', width: 80, height: 80 },
  ],
  "수납/집기": [
    { id: '선반', name: '화분인테리어', icon: '/icons/display_shelf.png', width: 120, height: 40 },
    { id: '옷걸이', name: '화장실', icon: '/icons/coat_rack.png', width: 50, height: 50 },
  ],
  "주방": [
    { id: '주방', name: '주방', icon: '/icons/kitchen_island.png', width: 200, height: 100 },
    { id: '업소용냉장고', name: '아일랜드 식탁', icon: '/icons/fridge.png', width: 120, height: 80 },
  ],
  "사무/기타": [
    { id: '컴퓨터책상', name: '당구대', icon: '/icons/computer_desk.png', width: 120, height: 60 },
    { id: '화분', name: '화분', icon: '/icons/plant.png', width: 60, height: 60 },
  ]
};

const categories = Object.keys(furnitureData);

const FurniturePalette = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  return (
    <div className="bg-gray-100 rounded-lg p-4">
      {/* 카테고리 선택 탭 */}
      <div className="flex justify-center border-b mb-4">
        {categories.map(category => (
          <button
            key={category}
            onMouseDownCapture={(e) => e.stopPropagation()}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 text-sm font-semibold -mb-px border-b-2
                        ${activeCategory === category 
                          ? 'border-indigo-500 text-indigo-600' 
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 선택된 카테고리의 아이템 목록 */}
      <div className="flex flex-wrap justify-center gap-4">
        {furnitureData[activeCategory].map(item => (
          <DraggableFurniture 
            key={item.id} 
            id={item.id} 
            iconSrc={item.icon}
            itemData={item}
          >
            {item.name}
          </DraggableFurniture>
        ))}
      </div>
    </div>
  );
};

export default FurniturePalette;