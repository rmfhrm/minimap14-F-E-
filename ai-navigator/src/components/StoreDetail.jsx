import React, { useState, useRef, useEffect } from 'react';
import { DndContext } from '@dnd-kit/core';
import ReactMarkdown from 'react-markdown';
import FloorPlan from './FloorPlan';
import FurniturePalette from './FurniturePalette';
import ReportGenerator from './ReportGenerator'; // ReportGenerator는 분리된 상태 유지

const StoreDetail = ({ store, onClose }) => {
  const [placedItems, setPlacedItems] = useState([]);
  const [walls, setWalls] = useState([]);
  const [floorTexture, setFloorTexture] = useState('');
  const [hoveredItemId, setHoveredItemId] = useState(null);
  const [hoveredWallId, setHoveredWallId] = useState(null);
  const floorPlanRef = useRef(null);

  const floorOptions = [
    { name: 'cad1 (10-30)', path: '/textures/cad1_10-30.png' },
    { name: 'cad2 (10-30)', path: '/textures/cad2_10-30.png' },
    { name: 'cad3 (10-30)', path: '/textures/cad3_10-30.png' },
    { name: 'cad7 (30-100)', path: '/textures/cad7_30-100.png' },
    { name: 'cad8 (100)', path: '/textures/cad8_100.png' },
    { name: 'cad9 (100)', path: '/textures/cad1.png' },
  ];

  useEffect(() => {
    if (!store) return;
    const savedLayout = localStorage.getItem(`layout-${store.id}`);
    if (savedLayout) {
      const { items, walls, texture } = JSON.parse(savedLayout);
      setPlacedItems(items || []);
      setWalls(walls || []);
      setFloorTexture(texture || floorOptions[0].path);
    } else {
      setFloorTexture(floorOptions[0].path);
      setPlacedItems([]);
      setWalls([]);
    }
  }, [store]);

  useEffect(() => {
    if (store && store.id) {
      localStorage.setItem(`layout-${store.id}`, JSON.stringify({ items: placedItems, walls, texture: floorTexture }));
    }
  }, [placedItems, walls, floorTexture, store]);

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
  const handleAddWall = () => setWalls((prev) => [...prev, { id: `wall-${Date.now()}`, x: 50, y: 50, width: 150, height: 10, rotation: 0 }]);
  const handleWallChange = (id, updates) => setWalls((walls) => walls.map(wall => wall.id === id ? { ...wall, ...updates } : wall));
  const handleDeleteWall = (id) => setWalls((walls) => walls.filter(wall => wall.id !== id));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        if (hoveredItemId) handleDeleteItem(hoveredItemId);
        if (hoveredWallId) handleDeleteWall(hoveredWallId);
      }
      if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        if (hoveredItemId) {
          setPlacedItems((items) => items.map((item) => item.id === hoveredItemId ? { ...item, rotation: (item.rotation || 0) + 90 } : item));
        } else if (hoveredWallId) {
          setWalls((walls) => walls.map((wall) => wall.id === hoveredWallId ? { ...wall, rotation: (wall.rotation || 0) + 90 } : wall));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hoveredItemId, hoveredWallId]);

  if (!store) return null;

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="p-6 h-full overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl z-20" title="닫기">&times;</button>
        
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 mt-8">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">{store.name}</h2>
          <p className="text-md text-gray-600">면적: {store.area}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">공간 시뮬레이터</h3>
          <h4 className="text-md font-semibold mb-2 mt-4 text-gray-700">가구/집기</h4>
          <FurniturePalette />
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-md font-semibold mb-2 text-gray-700">구조물</h4>
            <button onClick={handleAddWall} className="px-4 py-2 border border-indigo-500 text-indigo-500 font-semibold rounded-lg hover:bg-indigo-500 hover:text-white transition-colors duration-200 text-sm">+ 가벽 추가</button>
          </div>
          <div className="mt-4 flex flex-col items-center">
            <div className="w-full max-w-md mb-4">
              <label htmlFor="floorplan-select" className="block text-sm font-medium text-gray-700 mb-1">평면도 스타일 선택:</label>
              <select
                id="floorplan-select" value={floorTexture} onChange={(e) => setFloorTexture(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
              >
                {floorOptions.map((option) => (
                  <option key={option.path} value={option.path}>{option.name}</option>
                ))}
              </select>
            </div>
            <div ref={floorPlanRef}>
              <FloorPlan
                plan={store.floorPlan} placedItems={placedItems} walls={walls}
                onSetHoveredItem={setHoveredItemId}
                floorTexture={floorTexture} onWallChange={handleWallChange} onItemChange={handleItemChange}
                onSetHoveredWall={setHoveredWallId}
              />
            </div>
          </div>
        </div>

        <ReportGenerator 
          store={store}
          placedItems={placedItems}
        />
      </div>
    </DndContext>
  );
};

export default StoreDetail;