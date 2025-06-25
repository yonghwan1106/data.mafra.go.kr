import { useEffect } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { Farm, ACIData, WeatherData, MarketPrice, Policy } from '../types';

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
        // Load all data in parallel
        const [
          farmsResponse,
          aciHistoryResponse,
          weatherResponse,
          marketPricesResponse,
          policiesResponse
        ] = await Promise.all([
          fetch('/data/farms.json'),
          fetch('/data/aci-history.json'),
          fetch('/data/weather.json'),
          fetch('/data/market-prices.json'),
          fetch('/data/policies.json')
        ]);

        // Parse JSON data
        const farms: Farm[] = await farmsResponse.json();
        const aciHistory: Record<string, ACIData[]> = await aciHistoryResponse.json();
        const weatherData: WeatherData = await weatherResponse.json();
        const marketPrices: Record<string, MarketPrice> = await marketPricesResponse.json();
        const policies: Policy[] = await policiesResponse.json();

        // Update store
        setFarms(farms);
        setACIHistory(aciHistory);
        setWeatherData(weatherData);
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