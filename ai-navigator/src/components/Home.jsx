import React, { useState } from 'react';
import { regionData } from '../data/regions';
import './Home.css'; // 1. CSS 파일을 import하는 방식이 변경되었습니다.

const Home = ({ onStart }) => {
  const [selectedSido, setSelectedSido] = useState('');
  const [selectedGungu, setSelectedGungu] = useState('');
  const [selectedDong, setSelectedDong] = useState('');

  // ... (함수 로직은 동일합니다)
  const handleSidoChange = (e) => {
    setSelectedSido(e.target.value);
    setSelectedGungu('');
    setSelectedDong('');
  };

  const handleGunguChange = (e) => {
    setSelectedGungu(e.target.value);
    setSelectedDong('');
  };
  
  const handleDongChange = (e) => {
    setSelectedDong(e.target.value);
  };

  const handleSearch = () => {
    if (selectedSido === '광주광역시' && selectedGungu) {
      onStart(regionData['광주광역시'].districts[selectedGungu].coords);
    } else if (selectedSido) {
      alert(`현재 '${selectedSido}' 지역은 상가 데이터를 준비 중입니다. 해당 지역의 중심으로 지도를 이동합니다.`);
      onStart(regionData[selectedSido].coords);
    } else {
      alert('시/도를 선택해주세요.');
    }
  };

  const sidoOptions = Object.keys(regionData);
  const gunguOptions = selectedSido ? Object.keys(regionData[selectedSido].districts) : [];
  const dongOptions = (selectedSido && selectedGungu) ? regionData[selectedSido].districts[selectedGungu]?.neighborhoods || [] : [];

  return (
    // 2. className에 일반 문자열을 사용합니다.
    <div className="home-container">
      <div className="background-video-container">
        <div 
            className="background-video-container"
            style={{ backgroundImage: "url('/39.gif')" }} // public 폴더의 39.gif 파일을 사용
        >
            <div className="overlay"></div>
        </div>
      </div>

      <div className="content">
        <h2 className="title">NaviArch</h2>
        <p className="subtitle">“창업 부담 ZERO, 인테리어·투자 컨설팅 무료!”</p>
        
        <div className="search-box">
          <select value={selectedSido} onChange={handleSidoChange} className="select">
            <option value="">-- 시/도 선택 --</option>
            {sidoOptions.map(sido => <option key={sido} value={sido}>{sido}</option>)}
          </select>

          <select value={selectedGungu} onChange={handleGunguChange} disabled={!selectedSido} className="select">
            <option value="">-- 시/군/구 선택 --</option>
            {gunguOptions.map(gungu => <option key={gungu} value={gungu}>{gungu}</option>)}
          </select>
          
          <select value={selectedDong} onChange={handleDongChange} disabled={!selectedGungu || dongOptions.length === 0} className="select">
            <option value="">-- 읍/면/동 선택 --</option>
            {dongOptions.map(dong => <option key={dong} value={dong}>{dong}</option>)}
          </select>
          
          <button
            onClick={handleSearch}
            disabled={!selectedSido}
            className="button"
          >
            검색
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;