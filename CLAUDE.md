# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AgriIndex (아그리인덱스)** is a comprehensive agricultural management dashboard for the 10th MAFRA (Ministry of Agriculture, Food and Rural Affairs) Public Data Competition. It calculates and visualizes an Agricultural Composite Index (ACI) based on 6 weighted indicators to help farmers make data-driven decisions.

**Live Demo**: https://data-mafra-go-kr.vercel.app/

## Development Commands

### Core Development
```bash
# Start development server (runs on localhost:3000)
npm run dev

# Production build
npm run build

# Lint code
npm run lint

# Preview build locally
npm run preview

# Vercel deployment build
npm run vercel-build
```

### No Testing Framework
This project currently does not have automated tests set up. Manual testing is done through the live demo and development server.

## Architecture Overview

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with agriculture-specific color scheme
- **State Management**: Zustand (lightweight global state)
- **Charts**: Chart.js + react-chartjs-2
- **Maps**: Leaflet + react-leaflet for interactive farm visualization
- **Deployment**: Vercel with automatic CI/CD

### Core System: Hybrid Data Architecture

The application uses a unique **Hybrid Data Service** that intelligently switches between mock data and real government APIs:

```typescript
// Configuration in src/config/data-sources.ts
DATA_SOURCE_CONFIG = {
  primarySource: 'mock',        // Default: stable mock data
  fallbackEnabled: true,        // Auto-fallback if API fails
  farmMapAPI: {
    enabled: false,             // Set to true for API testing
    baseUrl: 'https://agis.epis.or.kr/ASD/farmmapApi/'
  }
}
```

### Key Business Logic

#### ACI (Agricultural Composite Index) Calculation
Located in `src/utils/aci-calculator.ts`:
- **6 weighted indices**: Weather Risk (25%), Soil Health (20%), Pest Risk (20%), Market Value (15%), Policy Support (10%), Geographic Suitability (10%)
- **Grade system**: A (90-100), B (80-89), C (70-79), D (60-69), E (0-59)
- **AI Prediction**: 30-day trend analysis with noise simulation

#### Government API Integration
- **FarmMap API**: Real agricultural land data from MAFRA
- **JSONP CORS Solution**: Safely bypasses browser security for government APIs
- **Automatic Fallback**: Seamlessly switches to mock data if API fails
- **Regional Queries**: Supports querying by administrative district code (bjdCd)

## File Structure & Important Locations

### Core Business Logic
- `src/utils/aci-calculator.ts` - ACI calculation engine and grading system
- `src/services/hybrid-data-service.ts` - Smart data switching between mock/API
- `src/services/farmmap-api-client.ts` - Government API integration
- `src/config/data-sources.ts` - Data source configuration

### UI Components
- `src/components/ACICard.tsx` - Main ACI score display
- `src/components/TrendChart.tsx` - 30-day historical trends
- `src/components/DetailedChart.tsx` - Radar charts for index breakdown
- `src/components/DataSourceToggle.tsx` - Developer tool (dev only)

### Pages
- `src/pages/Dashboard.tsx` - Main farm monitoring interface
- `src/pages/MapView.tsx` - Geographic farm distribution
- `src/pages/Analytics.tsx` - Advanced comparison and prediction tools
- `src/pages/About.tsx` - Competition submission information

### State Management
- `src/stores/useAppStore.ts` - Zustand global store for selected farm, notifications, data source

### Mock Data
- `src/data/farms.json` - Sample farm data
- `src/data/aci-history.json` - Historical ACI scores
- `src/data/market-prices.json` - Crop price data
- `src/data/weather.json` - Weather information

## Development Guidelines

### Government Data Integration
When working with the FarmMap API:
- Test API connections using the DataSourceToggle component (appears only on localhost/vercel domains)
- Always implement fallback to mock data for production stability
- Use proper error handling since government APIs can be unreliable
- Respect API rate limits and timeout settings (10 seconds default)

### ACI Calculation System
- All index scores must be 0-100 range
- Use `ACICalculator.calculateACI()` for proper weighted calculation
- New indices require updating the 6-component formula in `aci-calculator.ts`
- Grade colors and labels are centralized in the calculator class

### Styling Conventions
- Use Tailwind's agriculture-specific color palette
- Follow the existing component structure with proper TypeScript interfaces
- Maintain responsive design patterns (mobile-first approach)

### Data Source Management
- Never hardcode data sources - use `DATA_SOURCE_CONFIG`
- Test both mock and API modes during development
- Implement proper loading states and error boundaries
- Log data source switching for debugging

## Production Considerations

### Deployment Settings
- Production uses stable mock data by default (`primarySource: 'mock'`)
- Developer tools (DataSourceToggle) hidden in production
- Source maps enabled for debugging
- Automatic deployment via Vercel on main branch push

### Performance
- Lazy loading for heavy components
- Chart.js optimizations for large datasets
- Efficient state updates with Zustand
- Optimized bundle size with Vite

### Error Handling
- Graceful degradation when APIs fail
- User-friendly error messages
- Comprehensive logging for debugging
- Fallback data ensures app never crashes

## Competition Context

This project was specifically designed for the 10th MAFRA Public Data Competition with these requirements:
- **Real government data integration** (FarmMap API)
- **Practical agricultural value** (ACI decision support system)
- **Technical innovation** (hybrid data architecture)
- **User accessibility** (simple interface for complex data)

The hybrid architecture balances innovation (real API integration) with reliability (stable demo experience) for competition judging.