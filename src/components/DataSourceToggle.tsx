/**
 * 데이터 소스 토글 컴포넌트 - 개발/테스트용 UI
 */

import React, { useState, useEffect } from 'react';
import { 
  enableFarmMapAPI, 
  disableFarmMapAPI,
  enableWeatherAPI,
  disableWeatherAPI,
  getDataSourceStatus 
} from '../config/data-sources';
import { hybridDataService } from '../services/hybrid-data-service';

interface DataSourceToggleProps {
  onDataSourceChange?: (source: 'mock' | 'api') => void;
  className?: string;
}

const DataSourceToggle: React.FC<DataSourceToggleProps> = ({ 
  onDataSourceChange, 
  className = '' 
}) => {
  const [status, setStatus] = useState(getDataSourceStatus());
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    farmMap: 'unknown' | 'connected' | 'failed';
    weather: 'unknown' | 'connected' | 'failed';
    dataPortal: 'unknown' | 'connected' | 'failed';
  }>({ farmMap: 'unknown', weather: 'unknown', dataPortal: 'unknown' });

  useEffect(() => {
    // 초기 연결 상태 확인
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setIsConnecting(true);
    try {
      const results = await hybridDataService.checkAPIConnection();
      setConnectionStatus({
        farmMap: results.farmMap ? 'connected' : (status.farmMapAPI ? 'failed' : 'unknown'),
        weather: results.weather ? 'connected' : (status.weatherAPI ? 'failed' : 'unknown'),
        dataPortal: results.dataPortal ? 'connected' : (status.dataPortalAPI ? 'failed' : 'unknown')
      });
    } catch (error) {
      setConnectionStatus({
        farmMap: status.farmMapAPI ? 'failed' : 'unknown',
        weather: status.weatherAPI ? 'failed' : 'unknown',
        dataPortal: status.dataPortalAPI ? 'failed' : 'unknown'
      });
    }
    setIsConnecting(false);
  };

  const handleToggleSource = async (source: 'mock' | 'api') => {
    if (source === 'api') {
      enableFarmMapAPI();
      enableWeatherAPI();
      // API 연결 테스트
      await checkConnection();
    } else {
      disableFarmMapAPI();
      disableWeatherAPI();
      setConnectionStatus({ farmMap: 'unknown', weather: 'unknown', dataPortal: 'unknown' });
    }
    
    setStatus(getDataSourceStatus());
    onDataSourceChange?.(source);
  };

  const getStatusIcon = () => {
    if (status.primary === 'mock') return '📦';
    if (isConnecting) return '🔄';
    
    const farmMapOk = connectionStatus.farmMap === 'connected';
    const weatherOk = connectionStatus.weather === 'connected';
    const dataPortalOk = connectionStatus.dataPortal === 'connected';
    
    const connectedCount = [farmMapOk, weatherOk, dataPortalOk].filter(Boolean).length;
    
    if (connectedCount === 3) return '🟢';
    if (connectedCount >= 1) return '🟡';
    return '🔴';
  };

  const getStatusText = () => {
    if (status.primary === 'mock') return '모크데이터';
    if (isConnecting) return '연결 확인 중...';
    
    const farmMapOk = connectionStatus.farmMap === 'connected';
    const weatherOk = connectionStatus.weather === 'connected';
    const dataPortalOk = connectionStatus.dataPortal === 'connected';
    
    const connected = [];
    if (farmMapOk) connected.push('팜맵');
    if (weatherOk) connected.push('기상청');
    if (dataPortalOk) connected.push('농진청');
    
    if (connected.length === 3) return `API 연결됨 (${connected.join(' + ')})`;
    if (connected.length > 0) return `API 부분 연결 (${connected.join(' + ')})`;
    if (connectionStatus.farmMap === 'failed' || connectionStatus.weather === 'failed' || connectionStatus.dataPortal === 'failed') return 'API 연결 실패';
    return 'API 상태 확인 필요';
  };

  // 프로덕션 환경에서는 숨김 (프로덕션에서는 항상 숨김)
  const isDevelopment = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname.includes('vercel.app');
  
  if (!isDevelopment) {
    return null;
  }

  return (
    <div className={`bg-white border border-gray-300 rounded-lg p-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getStatusIcon()}</span>
          <div>
            <p className="text-sm font-medium text-gray-900">
              데이터 소스: {getStatusText()}
            </p>
            <p className="text-xs text-gray-500">
              폴백: {status.fallback ? '활성' : '비활성'}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => handleToggleSource('mock')}
            className={`px-3 py-1 text-xs rounded ${
              status.primary === 'mock'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            모크데이터
          </button>
          <button
            onClick={() => handleToggleSource('api')}
            className={`px-3 py-1 text-xs rounded ${
              status.primary === 'api'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            disabled={isConnecting}
          >
            실제 API
          </button>
        </div>
      </div>
      
      {status.primary === 'api' && (
        <div className="mt-2 space-y-1">
          {/* FarmMap API 상태 */}
          <div className={`p-2 rounded text-xs flex items-center justify-between ${
            connectionStatus.farmMap === 'connected' 
              ? 'bg-green-50 border border-green-200 text-green-700'
              : connectionStatus.farmMap === 'failed'
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-gray-50 border border-gray-200 text-gray-700'
          }`}>
            <span>🗺️ FarmMap API</span>
            <span>{
              connectionStatus.farmMap === 'connected' ? '✅ 연결됨' :
              connectionStatus.farmMap === 'failed' ? '❌ 실패' : '⏳ 확인 중'
            }</span>
          </div>
          
          {/* 기상청 API 상태 */}
          <div className={`p-2 rounded text-xs flex items-center justify-between ${
            connectionStatus.weather === 'connected' 
              ? 'bg-green-50 border border-green-200 text-green-700'
              : connectionStatus.weather === 'failed'
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-gray-50 border border-gray-200 text-gray-700'
          }`}>
            <span>🌤️ 기상청 API</span>
            <span>{
              connectionStatus.weather === 'connected' ? '✅ 연결됨' :
              connectionStatus.weather === 'failed' ? '❌ 실패' : '⏳ 확인 중'
            }</span>
          </div>

          {/* 농촌진흥청 API 상태 */}
          <div className={`p-2 rounded text-xs flex items-center justify-between ${
            connectionStatus.dataPortal === 'connected' 
              ? 'bg-green-50 border border-green-200 text-green-700'
              : connectionStatus.dataPortal === 'failed'
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-gray-50 border border-gray-200 text-gray-700'
          }`}>
            <span>🌱 농촌진흥청 API</span>
            <span>{
              connectionStatus.dataPortal === 'connected' ? '✅ 연결됨' :
              connectionStatus.dataPortal === 'failed' ? '❌ 실패' : '⏳ 확인 중'
            }</span>
          </div>
          
          {(connectionStatus.farmMap === 'failed' || connectionStatus.weather === 'failed' || connectionStatus.dataPortal === 'failed') && (
            <div className="p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700">
              ⚠️ 일부 API 연결 실패. 실패한 API는 자동으로 모크데이터로 폴백됩니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DataSourceToggle;