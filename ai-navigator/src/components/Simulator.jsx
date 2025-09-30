import React, { useState, useRef, useEffect } from 'react';
import { DndContext } from '@dnd-kit/core';
import FloorPlan from './FloorPlan';
import FurniturePalette from './FurniturePalette';

const Simulator = ({ store, initialLayout, onLayoutChange, floorOptions }) => {
  const [placedItems, setPlacedItems] = useState(initialLayout.items);
  const [walls, setWalls] = useState(initialLayout.walls);
  const [floorTexture, setFloorTexture] = useState(initialLayout.texture);
  const [hoveredItemId, setHoveredItemId] = useState(null);
  const [hoveredWallId, setHoveredWallId] = useState(null); // ✨ 가벽 hover 상태 추가
  const floorPlanRef = useRef(null);

  useEffect(() => {
    setPlacedItems(initialLayout.items || []);
    setWalls(initialLayout.walls || []);
    setFloorTexture(initialLayout.texture || (floorOptions && floorOptions.length > 0 ? floorOptions[0].path : ''));
  }, [initialLayout, floorOptions]);

  useEffect(() => {
    onLayoutChange({ items: placedItems, walls, texture: floorTexture });
  }, [placedItems, walls, floorTexture]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || over.id !== 'floor-plan-droppable-area' || active.data.current?.isPlacedItem) return;
    const floorPlanRect = floorPlanRef.current?.getBoundingClientRect();
    if (!floorPlanRect) return;
    const droppedItemRect = active.rect.current.translated;
    if (!droppedItemRect) return;
    const newItem = {
      id: `${active.id}-${Date.now()}`, name: active.data.current?.name, icon: active.data.current?.icon,
      x: droppedItemRect.left - floorPlanRect.left, y: droppedItemRect.top - floorPlanRect.top,
      rotation: 0, width: active.data.current?.width, height: active.data.current?.height,
    };
    setPlacedItems((prev) => [...prev, newItem]);
  };
  
  const handleItemChange = (id, updates) => setPlacedItems((items) => items.map(item => item.id === id ? { ...item, ...updates } : item));
  const handleDeleteItem = (id) => setPlacedItems((items) => items.filter(item => item.id !== id));
  
  // ✨ 가벽 관련 핸들러 추가 및 수정
  const handleAddWall = () => setWalls((prev) => [...prev, { id: `wall-${Date.now()}`, x: 50, y: 50, width: 150, height: 10, rotation: 0 }]);
  const handleWallChange = (id, updates) => setWalls((walls) => walls.map(wall => wall.id === id ? { ...wall, ...updates } : wall));
  const handleDeleteWall = (id) => setWalls((walls) => walls.filter(wall => wall.id !== id));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() !== 'r') return;
      e.preventDefault();

      if (hoveredItemId) {
        setPlacedItems((items) =>
          items.map((item) => item.id === hoveredItemId ? { ...item, rotation: (item.rotation || 0) + 90 } : item)
        );
      } else if (hoveredWallId) { // ✨ 가벽 회전 로직 추가
        setWalls((walls) =>
          walls.map((wall) => wall.id === hoveredWallId ? { ...wall, rotation: (wall.rotation || 0) + 90 } : wall)
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hoveredItemId, hoveredWallId]); // ✨ hoveredWallId 의존성 추가

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">공간 시뮬레이터</h3>
        <h4 className="text-md font-semibold mb-2 mt-4 text-gray-700">가구/집기</h4>
        <FurniturePalette />
        <div className="mt-4 pt-4 border-t">
          <h4 className="text-md font-semibold mb-2 text-gray-700">구조물</h4>
          <button onClick={handleAddWall}  
          className="bg-red-500 p-4 text-white"
          //className="px-4 py-2 border-2 border-indigo-500 text-indigo-500 font-semibold rounded-lg hover:bg-indigo-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 text-sm"
            >+ 가벽 추가</button>
        </div>
        <div className="mt-4 flex flex-col items-center">
          <div className="w-full max-w-md mb-4">
            <label htmlFor="floorplan-select" className="block text-sm font-medium text-gray-700 mb-1">평면도 스타일 선택:</label>
            <select
              id="floorplan-select" value={floorTexture} onChange={(e) => setFloorTexture(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {floorOptions.map((option) => (
                <option key={option.path} value={option.path}>{option.name}</option>
              ))}
            </select>
          </div>
          <div ref={floorPlanRef}>
            <FloorPlan
              plan={store.floorPlan} placedItems={placedItems} walls={walls}
              onDeleteItem={handleDeleteItem} onSetHoveredItem={setHoveredItemId}
              floorTexture={floorTexture} onWallChange={handleWallChange} onItemChange={handleItemChange}
              onDeleteWall={handleDeleteWall} onSetHoveredWall={setHoveredWallId} // ✨ 새로운 props 전달
            />
          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default Simulator;