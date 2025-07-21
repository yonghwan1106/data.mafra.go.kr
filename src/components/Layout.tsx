import { ReactNode, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../stores/useAppStore';
import { NotificationSystem } from '../utils/notification-system';
import NotificationCenter from './NotificationCenter';
import DataSourceToggle from './DataSourceToggle';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { selectedFarm, farms, setSelectedFarm, getCurrentFarmACI } = useAppStore();

  // Initialize notification system and generate sample notifications
  useEffect(() => {
    NotificationSystem.initialize();

    // Generate sample notifications for demo
    if (selectedFarm) {
      const currentACI = getCurrentFarmACI();
      if (currentACI) {
        // Generate weather-based notifications
        if (currentACI.wri < 70) {
          NotificationSystem.addNotification({
            type: 'warning',
            category: 'weather',
            title: '기상 주의보',
            message: `${selectedFarm.name}의 기상 위험도가 증가하고 있습니다.`,
            priority: 'high',
            farmId: selectedFarm.id
          });
        }

        // Generate pest notifications
        if (currentACI.pri < 60) {
          NotificationSystem.addNotification({
            type: 'error',
            category: 'pest',
            title: '병해충 위험 경보',
            message: `병해충 발생 위험이 높습니다. 예방적 방제를 실시하세요.`,
            priority: 'critical',
            farmId: selectedFarm.id
          });
        }

        // Generate market opportunity
        if (currentACI.mvi > 80) {
          NotificationSystem.addNotification({
            type: 'success',
            category: 'market',
            title: '출하 기회',
            message: `${selectedFarm.cropType} 가격이 상승했습니다. 출하를 고려하세요.`,
            priority: 'medium',
            farmId: selectedFarm.id
          });
        }
      }
    }
  }, [selectedFarm, getCurrentFarmACI]);

  const navItems = [
    { path: '/', label: '대시보드', icon: '📊' },
    { path: '/map', label: '지도', icon: '🗺️' },
    { path: '/analytics', label: '분석', icon: '📈' },
    { path: '/about', label: '소개', icon: 'ℹ️' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div>
                <h1 className="text-2xl font-bold text-primary-600">🌾 아그리인덱스</h1>
                <p className="text-xs text-gray-500 hidden sm:block">제10회 농림축산식품 공공데이터 활용 창업경진대회 출품작</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Data Source Toggle, Farm Selector & Notification Center */}
            <div className="flex items-center space-x-4">
              <NotificationCenter />
              {(window.location.hostname === 'localhost' || window.location.hostname.includes('vercel.app')) && (
                <div className="hidden lg:block">
                  <DataSourceToggle className="text-xs" />
                </div>
              )}
              {farms.length > 0 && (
                <select
                  value={selectedFarm?.id || ''}
                  onChange={(e) => {
                    const farm = farms.find(f => f.id === e.target.value);
                    setSelectedFarm(farm || null);
                  }}
                  className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {farms.map((farm) => (
                    <option key={farm.id} value={farm.id}>
                      {farm.name} ({farm.aciScore}점)
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200">
          <div className="px-4 py-2">
            {/* Mobile Farm Selector */}
            {farms.length > 0 && (
              <select
                value={selectedFarm?.id || ''}
                onChange={(e) => {
                  const farm = farms.find(f => f.id === e.target.value);
                  setSelectedFarm(farm || null);
                }}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 mb-2"
              >
                {farms.map((farm) => (
                  <option key={farm.id} value={farm.id}>
                    {farm.name} ({farm.aciScore}점)
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="flex">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex-1 flex flex-col items-center justify-center py-3 text-xs font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-primary-700 bg-primary-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg mb-1">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;