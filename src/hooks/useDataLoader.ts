import { useEffect } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { Farm, ACIData, WeatherData, MarketPrice, Policy } from '../types';
import { hybridDataService } from '../services/hybrid-data-service';

// Import JSON data directly (fallback only)
import aciHistoryData from '../data/aci-history.json';
import weatherData from '../data/weather.json';
import marketPricesData from '../data/market-prices.json';
import policiesData from '../data/policies.json';

export const useDataLoader = () => {
  const {
    setFarms,
    setACIHistory,
    setWeatherData,
    setMarketPrices,
    setPolicies,
    setLoading,
    setError,
    setSelectedFarm
  } = useAppStore();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. 농장 데이터는 하이브리드 서비스 사용 (모크 또는 API)
        console.log('🔄 농장 데이터 로딩 시작...');
        const farms: Farm[] = await hybridDataService.getFarms();
        
        // 2. 나머지 데이터는 기존 방식 유지 (안전성)
        const aciHistory: Record<string, ACIData[]> = aciHistoryData as Record<string, ACIData[]>;
        const weather: WeatherData = weatherData as WeatherData;
        const marketPrices: Record<string, MarketPrice> = marketPricesData as Record<string, MarketPrice>;
        const policies: Policy[] = policiesData as Policy[];

        // Update store
        setFarms(farms);
        setACIHistory(aciHistory);
        setWeatherData(weather);
        setMarketPrices(marketPrices);
        setPolicies(policies);

        // Set first farm as selected by default
        if (farms.length > 0) {
          setSelectedFarm(farms[0]);
        }

        console.log('✅ 모든 데이터 로딩 완료:', {
          farmsCount: farms.length,
          aciHistoryKeys: Object.keys(aciHistory).length,
          policiesCount: policies.length
        });

      } catch (error) {
        console.error('❌ 데이터 로딩 실패:', error);
        setError('데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [setFarms, setACIHistory, setWeatherData, setMarketPrices, setPolicies, setLoading, setError, setSelectedFarm]);
};