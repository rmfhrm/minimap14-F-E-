import React, { useState, useRef, useEffect } from 'react';
import { DndContext } from '@dnd-kit/core';
import ReactMarkdown from 'react-markdown';
import FloorPlan from './FloorPlan';
import FurniturePalette from './FurniturePalette';
import PartitionWall from './PartitionWall';

const StoreDetail = ({ store, onClose }) => {
  const [placedItems, setPlacedItems] = useState([]);
  const [walls, setWalls] = useState([]);
  const floorPlanRef = useRef(null);
  const [businessType, setBusinessType] = useState('');
  const [report, setReport] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredItemId, setHoveredItemId] = useState(null);
  const [floorTexture, setFloorTexture] = useState('/textures/wood-floor.png');

  // 불러오기 기능: 상점이 바뀔 때마다 실행
  useEffect(() => {
    const savedLayout = localStorage.getItem(`layout-${store.id}`);
    
    if (savedLayout) {
      const { items, walls: savedWalls, texture } = JSON.parse(savedLayout);
      setPlacedItems(items || []);
      setWalls(savedWalls || []);
      setFloorTexture(texture || '/textures/wood-floor.png');
    } else {
      setPlacedItems([]);
      setWalls([]);
      setFloorTexture('/textures/wood-floor.png');
    }

    setBusinessType('');
    setReport('');
  }, [store]);

  // 저장 기능: 배치 정보가 변경될 때마다 자동 저장
  useEffect(() => {
    if (store && store.id) {
      const layoutData = {
        items: placedItems,
        walls: walls,
        texture: floorTexture,
      };
      localStorage.setItem(`layout-${store.id}`, JSON.stringify(layoutData));
    }
  }, [placedItems, walls, floorTexture, store]);


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'r' && hoveredItemId) {
        e.preventDefault();
        setPlacedItems((items) =>
          items.map((item) => {
            if (item.id === hoveredItemId) {
              const currentRotation = item.rotation || 0;
              return { ...item, rotation: (currentRotation + 90) % 360 };
            }
            return item;
          })
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [hoveredItemId, placedItems]);

  const handleDragEnd = (event) => {
    const { active, over, delta } = event;
    if (!over || over.id !== 'floor-plan-droppable-area') return;
    const isPlacedItem = active.data.current?.isPlacedItem;

    if (isPlacedItem) {
      setPlacedItems(items =>
        items.map(item =>
          item.id === active.id
            ? { ...item, x: item.x + delta.x, y: item.y + delta.y }
            : item
        )
      );
    } else {
      const floorPlanRect = floorPlanRef.current?.getBoundingClientRect();
      const droppedItemRect = active.rect.current.translated;
      if (!floorPlanRect || !droppedItemRect) return;

      const relativeX = droppedItemRect.left - floorPlanRect.left;
      const relativeY = droppedItemRect.top - floorPlanRect.top;

      const newItem = {
        id: `${active.id}-${Date.now()}`,
        name: active.data.current?.name,
        icon: active.data.current?.icon,
        x: relativeX,
        y: relativeY,
        rotation: 0,
        width: active.data.current?.width,
        height: active.data.current?.height,
      };
      setPlacedItems(prevItems => [...prevItems, newItem]);
    }
  };
  
  const handleDeleteItem = (itemIdToDelete) => {
    setPlacedItems((currentItems) =>
      currentItems.filter((item) => item.id !== itemIdToDelete)
    );
  };

  const handleGenerateReport = async () => {
    if (!businessType) {
      alert('업종을 입력해주세요!');
      return;
    }
    setIsLoading(true);
    setReport('');

    try {
      const response = await fetch('http://localhost:3001/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placedItems: placedItems,
          storeInfo: { area: store.area, address: store.address },
          businessType: businessType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '서버에서 오류가 발생했습니다.');
      }
      const data = await response.json();
      setReport(data.report);
    } catch (error) {
      console.error("리포트 생성 실패:", error);
      alert(`리포트 생성 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddWall = () => {
    const newWall = {
      id: `wall-${Date.now()}`,
      x: 50,
      y: 50,
      width: 150,
      height: 10,
    };
    setWalls(prevWalls => [...prevWalls, newWall]);
  };

  const handleWallChange = (id, updates) => {
    const numericUpdates = {};
    if (updates.width) numericUpdates.width = parseFloat(updates.width);
    if (updates.height) numericUpdates.height = parseFloat(updates.height);
    
    setWalls(currentWalls =>
      currentWalls.map(wall =>
        wall.id === id ? { ...wall, ...updates, ...numericUpdates } : wall
      )
    );
  };

  if (!store) {
    return null;
  }

  const floorOptions = [
    { name: 'Wood', path: '/textures/wood-floor.png' },
    { name: 'Tile', path: '/textures/tile-floor.png' },
    { name: 'Concrete', path: '/textures/concrete-floor.png' },
  ];

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="p-6 h-full overflow-y-auto relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl z-20"
          title="닫기"
        >
          &times;
        </button>

        <div className="bg-white p-6 rounded-xl shadow-sm mb-6 mt-8">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">{store.name}</h2>
          <p className="text-md text-gray-600">면적: {store.area}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">공간 시뮬레이터</h3>
          <h4 className="text-md font-semibold mb-2 mt-4 text-gray-700">가구/집기</h4>
          <FurniturePalette />
          
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-md font-semibold mb-2 text-gray-700">구조물</h4>
            <button
              onClick={handleAddWall}
              onMouseDownCapture={(e) => e.stopPropagation()}
              className="px-3 py-1.5 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 transition-colors text-sm"
            >
              + 가벽 추가
            </button>
          </div>

          <div className="mt-4 flex justify-center" ref={floorPlanRef}>
            <FloorPlan
              plan={store.floorPlan}
              placedItems={placedItems}
              walls={walls}
              onDeleteItem={handleDeleteItem}
              onSetHoveredItem={setHoveredItemId}
              floorTexture={floorTexture}
              onWallChange={handleWallChange}
            />
          </div>
          
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-600 mb-2 text-center">바닥 스타일 변경</p>
            <div className="flex justify-center gap-2">
              {floorOptions.map((option) => (
                <button
                  key={option.name}
                  onMouseDownCapture={(e) => e.stopPropagation()}
                  onClick={() => setFloorTexture(option.path)}
                  className={`px-3 py-1 text-sm font-semibold border-2 rounded-full transition-colors ${
                    floorTexture === option.path
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">AI 초기 비용 리포트</h3>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              placeholder="예: 카페, 식당, 소품샵"
              className="flex-grow p-2 border rounded-md focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleGenerateReport}
              disabled={isLoading || placedItems.length === 0}
              className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 disabled:bg-gray-400 transition-colors"
            >
              {isLoading ? '생성 중...' : '✨ 리포트 생성'}
            </button>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg prose max-w-none prose-h3:mt-0">
            {report ? <ReactMarkdown>{report}</ReactMarkdown> : <p className="text-gray-500">가구를 배치하고 업종을 입력한 뒤 리포트를 생성해주세요.</p>}
          </div>
        </div>
      </div>
    </DndContext>
  );
};
export default StoreDetail;