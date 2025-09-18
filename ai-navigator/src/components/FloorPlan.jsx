import React, { forwardRef } from 'react';
import { useDroppable } from '@dnd-kit/core';
import PlacedItem from './PlacedItem';
import PartitionWall from './PartitionWall';

const FloorPlan = forwardRef(({ plan, placedItems, walls, onDeleteItem, onSetHoveredItem, floorTexture, onWallChange, onItemChange }, ref) => {
  const { setNodeRef } = useDroppable({
    id: 'floor-plan-droppable-area',
  });

  if (!plan) {
    return (
      <div className="w-full h-96 bg-gray-200 border-2 border-dashed rounded-md flex items-center justify-center">
        <p className="text-gray-400">이 상가는 등록된 평면도가 없습니다.</p>
      </div>
    );
  }

  const scale = 400 / plan.height;

  const mergeRefs = (...refs) => {
    return (node) => {
      refs.forEach((ref) => {
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      });
    };
  };

  return (
    <div
      ref={mergeRefs(setNodeRef, ref)}
      className="border-2 border-gray-400 rounded-md relative shadow-inner bg-white"
      style={{
        width: plan.width * scale,
        height: plan.height * scale,
        backgroundImage: `url(${floorTexture})`,
        backgroundSize: '100px',
      }}
    >
      {plan.walls.map(wall => (
        <div
          key={wall.id}
          className="bg-gray-800 absolute shadow-xl"
          style={{
            left: wall.x * scale, top: wall.y * scale,
            width: wall.width * scale, height: wall.height * scale
          }}
        />
      ))}
      {placedItems.map(item => (
        <PlacedItem
          key={item.id}
          item={item}
          onDeleteItem={onDeleteItem}
          onSetHoveredItem={onSetHoveredItem}
          onItemChange={onItemChange}
        />
      ))}
      {walls.map(wall => (
        <PartitionWall
          key={wall.id}
          wall={wall}
          onWallChange={onWallChange}
        />
      ))}
    </div>
  );
});

export default FloorPlan;