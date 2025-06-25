import { useEffect } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { Farm, ACIData, WeatherData, MarketPrice, Policy } from '../types';

// Import JSON data directly
import farmsData from '../data/farms.json';
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
    const loadData = () => {
      setLoading(true);
      setError(null);

      try {
        // Use directly imported data
        const farms: Farm[] = farmsData as Farm[];
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

      } catch (error) {
        console.error('Failed to load data:', error);
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [setFarms, setACIHistory, setWeatherData, setMarketPrices, setPolicies, setLoading, setError, setSelectedFarm]);
};