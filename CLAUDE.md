# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AgriIndex (아그리인덱스)** is a React-based agricultural dashboard application built for the 10th Korean Agricultural Public Data Startup Contest. The application calculates and visualizes an Agricultural Composite Index (ACI) that helps farmers and agricultural stakeholders assess farming conditions across different regions in Korea.

## Core Architecture

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom agricultural color scheme
- **State Management**: Zustand stores (`useAgriStore`, `useDataStore`)
- **Routing**: React Router DOM with 3 main routes
- **Data Visualization**: Chart.js + React-ChartJS-2, Leaflet maps
- **Build System**: Vite with Vercel deployment configuration

### Application Structure
```
src/
├── components/     # Reusable UI components (Header, ACI cards, charts)
├── pages/         # Main application pages (Dashboard, MapView, Analytics)
├── stores/        # Zustand state management
├── utils/         # Core calculation logic and utilities
├── hooks/         # Custom React hooks for data loading
├── types/         # TypeScript type definitions
└── data/          # JSON mock data files
```

### Key Business Logic

**ACI Calculator**: The core algorithm in `utils/aciCalculator.ts` computes a weighted Agricultural Composite Index from 6 sub-indices:
- Weather Risk Index (기상 위험도)
- Soil Health Index (토양 건강도) 
- Pest Risk Index (병해충 위험도)
- Market Value Index (시장 가치)
- Policy Support Index (정책 지원도)
- Geographic Suitability Index (지리적 적합성)

**Data Flow**: Mock data is loaded from JSON files in `data/` directory, processed through Zustand stores, and consumed by components via custom hooks.

## Development Commands

```bash
# Development server (runs on port 3000)
npm run dev

# Production build
npm run build

# Vercel-specific build (includes data processing)
npm run vercel-build

# Type checking
npx tsc --noEmit

# Linting
npx eslint src/
```

## Key Components

- **Dashboard** (`pages/Dashboard.tsx`): Main page with ACI overview, farm cards, and summary charts
- **MapView** (`pages/MapView.tsx`): Geographic visualization of ACI data across Korean regions
- **Analytics** (`pages/Analytics.tsx`): Detailed analysis with historical trends and predictions
- **ACICard** (`components/ACICard.tsx`): Reusable component for displaying individual ACI scores
- **AGIChart** (`components/AGIChart.tsx`): Line chart component for historical ACI trends

## Data Structure

Mock data includes:
- `mockFarms.json`: Farm information with ACI scores and sub-indices
- `mockACIHistory.json`: Historical ACI data for trend analysis
- `mockWeatherData.json`: Weather-related agricultural data
- `mockMarketData.json`: Market price and value information
- `mockPolicyData.json`: Government policy support data

## State Management

**useAgriStore**: Manages application state including selected farm, filters, and ACI calculations
**useDataStore**: Handles data loading and caching for JSON files

## Special Considerations

- **Korean Language**: All UI text and data labels are in Korean
- **Agricultural Domain**: Deep integration of Korean agricultural knowledge and terminology
- **Mobile Responsive**: Tailwind classes ensure mobile-friendly layouts
- **Mock Data**: Currently uses static JSON data; real API integration would replace `hooks/useDataLoader.ts`
- **Vercel Deployment**: Special build configuration handles static file serving on Vercel platform

## Development Patterns

- Use TypeScript strict mode for all new code
- Follow the existing Zustand store patterns for state management
- Implement responsive design using Tailwind utility classes
- Use custom hooks for data fetching and business logic
- Maintain Korean language consistency in UI text and comments