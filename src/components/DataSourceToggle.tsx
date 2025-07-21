/**
 * 데이터 소스 토글 컴포넌트 - 개발/테스트용 UI
 */

import React, { useState, useEffect } from 'react';
import { 
  enableFarmMapAPI, 
  disableFarmMapAPI,
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
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'failed'>('unknown');

  useEffect(() => {
    // 초기 연결 상태 확인
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (!status.apiEnabled) return;
    
    setIsConnecting(true);
    try {
      const isConnected = await hybridDataService.checkAPIConnection();
      setConnectionStatus(isConnected ? 'connected' : 'failed');
    } catch (error) {
      setConnectionStatus('failed');
    }
    setIsConnecting(false);
  };

  const handleToggleSource = async (source: 'mock' | 'api') => {
    if (source === 'api') {
      enableFarmMapAPI();
      // API 연결 테스트
      await checkConnection();
    } else {
      disableFarmMapAPI();
      setConnectionStatus('unknown');
    }
    
    setStatus(getDataSourceStatus());
    onDataSourceChange?.(source);
  };

  const getStatusIcon = () => {
    if (status.primary === 'mock') return '📦';
    if (isConnecting) return '🔄';
    if (connectionStatus === 'connected') return '🟢';
    if (connectionStatus === 'failed') return '🔴';
    return '🟡';
  };

  const getStatusText = () => {
    if (status.primary === 'mock') return '모크데이터';
    if (isConnecting) return '연결 확인 중...';
    if (connectionStatus === 'connected') return 'API 연결됨';
    if (connectionStatus === 'failed') return 'API 연결 실패';
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
      
      {status.primary === 'api' && connectionStatus === 'failed' && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
          ⚠️ API 연결에 실패했습니다. 자동으로 모크데이터로 폴백됩니다.
        </div>
      )}
      
      {status.primary === 'api' && connectionStatus === 'connected' && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
          ✅ FarmMap API가 정상적으로 연결되었습니다.
        </div>
      )}
    </div>
  );
};

export default DataSourceToggle;