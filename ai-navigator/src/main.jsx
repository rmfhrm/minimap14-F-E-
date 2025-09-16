import React from 'react';
import ReactDOM from 'react-dom/client';

// CSS 파일 import
import 'leaflet/dist/leaflet.css'; // 지도 스타일을 위한 import
import './index.css';             // 전역 스타일 import

// 최상위 컴포넌트 import
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);