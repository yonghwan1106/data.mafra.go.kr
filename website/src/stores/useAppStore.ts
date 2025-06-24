import { create } from 'zustand';
import { Farm, ACIData, WeatherData, MarketPrice, Policy } from '../types';

interface AppState {
  // Data
  farms: Farm[];
  selectedFarm: Farm | null;
  aciHistory: Record<string, ACIData[]>;
  weatherData: WeatherData | null;
  marketPrices: Record<string, MarketPrice>;
  policies: Policy[];
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setFarms: (farms: Farm[]) => void;
  setSelectedFarm: (farm: Farm | null) => void;
  setACIHistory: (history: Record<string, ACIData[]>) => void;
  setWeatherData: (weather: WeatherData) => void;
  setMarketPrices: (prices: Record<string, MarketPrice>) => void;
  setPolicies: (policies: Policy[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Computed
  getCurrentFarmACI: () => ACIData | null;
  getFarmHistory: (farmId: string) => ACIData[];
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  farms: [],
  selectedFarm: null,
  aciHistory: {},
  weatherData: null,
  marketPrices: {},
  policies: [],
  isLoading: false,
  error: null,

  // Actions
  setFarms: (farms) => set({ farms }),
  setSelectedFarm: (farm) => set({ selectedFarm: farm }),
  setACIHistory: (history) => set({ aciHistory: history }),
  setWeatherData: (weather) => set({ weatherData: weather }),
  setMarketPrices: (prices) => set({ marketPrices: prices }),
  setPolicies: (policies) => set({ policies }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  // Computed
  getCurrentFarmACI: () => {
    const { selectedFarm, aciHistory } = get();
    if (!selectedFarm) return null;
    
    const farmHistory = aciHistory[selectedFarm.id];
    if (!farmHistory || farmHistory.length === 0) return null;
    
    return farmHistory[farmHistory.length - 1];
  },

  getFarmHistory: (farmId: string) => {
    const { aciHistory } = get();
    return aciHistory[farmId] || [];
  },
}));