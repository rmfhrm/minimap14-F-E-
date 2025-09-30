import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const ReportGenerator = ({ store, placedItems }) => {
  const [businessType, setBusinessType] = useState('');
  const [report, setReport] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">AI 초기 비용 리포트</h3>
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text" value={businessType} onChange={(e) => setBusinessType(e.target.value)}
          placeholder="예: 카페, 식당, 소품샵"
          className="flex-grow p-2 border rounded-md focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={handleGenerateReport} disabled={isLoading || placedItems.length === 0}
        className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? '생성 중...' : '✨ 리포트 생성'}
        </button>
      </div>
      <div className="p-4 bg-gray-50 rounded-lg prose max-w-none prose-h3:mt-0">
        {report ? <ReactMarkdown>{report}</ReactMarkdown> : <p className="text-gray-500">가구를 배치하고 업종을 입력한 뒤 리포트를 생성해주세요.</p>}
      </div>
    </div>
  );
};

export default ReportGenerator;