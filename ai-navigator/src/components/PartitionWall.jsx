import React from 'react';
import { Rnd } from 'react-rnd';

const PartitionWall = ({ wall, onWallChange }) => {
  return (
    <Rnd
      size={{ width: wall.width, height: wall.height }}
      position={{ x: wall.x, y: wall.y }}
      onDragStop={(e, d) => {
        onWallChange(wall.id, { x: d.x, y: d.y });
      }}
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
    >
      <div
        className="bg-gray-800 w-full h-full shadow-lg"
        title="드래그: 이동 / 모서리, 가장자리: 크기 조절"
      />
    </Rnd>
  );
};

export default PartitionWall;