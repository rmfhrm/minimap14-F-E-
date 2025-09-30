import React from 'react';
import { Rnd } from 'react-rnd';

const PartitionWall = ({ wall, onWallChange, onDeleteWall, onSetHoveredWall }) => {
  return (
    <Rnd
      size={{ width: wall.width, height: wall.height }}
      position={{ x: wall.x, y: wall.y }}
      onDragStop={(e, d) => onWallChange(wall.id, { x: d.x, y: d.y })}
      onResizeStop={(e, direction, ref, delta, position) => {
        onWallChange(wall.id, {
          width: ref.style.width,
          height: ref.style.height,
          ...position,
        });
      }}
      bounds="parent"
      minWidth={10}
      minHeight={10}
      // ✨ 아래 이벤트 핸들러들을 추가합니다.
      onDoubleClick={() => onDeleteWall(wall.id)}
      onMouseEnter={() => onSetHoveredWall(wall.id)}
      onMouseLeave={() => onSetHoveredWall(null)}
      style={{
        backgroundColor: 'rgba(55, 65, 81, 0.8)',
        border: '1px solid #1f2937',
        // ✨ 회전을 적용하기 위한 transform 속성 추가
        transform: `rotate(${wall.rotation || 0}deg)`,
      }}
    >
      <div 
        className="w-full h-full"
        title="더블클릭: 삭제 / 'R'키: 회전 / 드래그: 이동 / 모서리: 크기 조절"
      />
    </Rnd>
  );
};

export default PartitionWall;