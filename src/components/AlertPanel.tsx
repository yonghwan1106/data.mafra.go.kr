import { WeatherData, ACIData } from '../types';

interface AlertPanelProps {
  weatherData: WeatherData | null;
  currentACI: ACIData;
}

const AlertPanel = ({ weatherData, currentACI }: AlertPanelProps) => {
  const getAlerts = () => {
    const alerts = [];

    // Weather alerts
    if (weatherData?.alerts) {
      weatherData.alerts.forEach(alert => {
        alerts.push({
          type: 'weather',
          severity: alert.severity,
          message: alert.message,
          icon: '🌡️',
          color: alert.severity === 'warning' ? 'text-orange-600' : 'text-red-600',
          bgColor: alert.severity === 'warning' ? 'bg-orange-50' : 'bg-red-50',
          borderColor: alert.severity === 'warning' ? 'border-orange-200' : 'border-red-200'
        });
      });
    }

    // ACI-based alerts
    if (currentACI.pri < 70) {
      alerts.push({
        type: 'pest',
        severity: 'warning',
        message: '병해충 위험도가 높습니다. 방제 조치를 검토하세요.',
        icon: '🐛',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      });
    }

    if (currentACI.shi < 60) {
      alerts.push({
        type: 'soil',
        severity: 'info',
        message: '토양 건강도가 낮습니다. 토양 개량을 고려하세요.',
        icon: '🌱',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
      });
    }

    if (currentACI.mvi > 85) {
      alerts.push({
        type: 'market',
        severity: 'good',
        message: '시장 가격이 좋습니다. 출하 타이밍을 검토하세요.',
        icon: '💰',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      });
    }

    return alerts;
  };

  const alerts = getAlerts();

  const getWeatherIcon = (condition: string) => {
    const icons: Record<string, string> = {
      'sunny': '☀️',
      'partly_cloudy': '⛅',
      'cloudy': '☁️',
      'rain': '🌧️',
      'light_rain': '🌦️',
      'hot': '🔥',
      'very_hot': '🌡️'
    };
    return icons[condition] || '🌤️';
  };

  return (
    <div className="space-y-6">
      {/* Weather Card */}
      {weatherData && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">현재 날씨</h3>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <span className="text-4xl">
                {getWeatherIcon(weatherData.current.condition)}
              </span>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {weatherData.current.temperature}°C
                </div>
                <div className="text-sm text-gray-600">
                  습도 {weatherData.current.humidity}%
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">강수량</div>
              <div className="font-semibold text-blue-600">
                {weatherData.current.rainfall}mm
              </div>
            </div>
          </div>

          {/* 3-day forecast */}
          <div className="pt-4 border-t border-gray-100">
            <div className="text-sm font-medium text-gray-700 mb-3">3일 예보</div>
            <div className="space-y-2">
              {weatherData.forecast.slice(0, 3).map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{getWeatherIcon(day.condition)}</span>
                    <span className="text-sm text-gray-600">
                      {new Date(day.date).toLocaleDateString('ko-KR', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {day.tempMin}° / {day.tempMax}°
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Alerts Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">농장 알림</h3>
        
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-gray-600">현재 특별한 알림이 없습니다</p>
            <p className="text-sm text-gray-500 mt-1">농장 상태가 양호합니다</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border ${alert.bgColor} ${alert.borderColor}`}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-xl">{alert.icon}</span>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${alert.color}`}>
                      {alert.message}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500 capitalize">
                        {alert.type} 알림
                      </span>
                      {alert.severity === 'good' && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          기회
                        </span>
                      )}
                      {alert.severity === 'warning' && (
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                          주의
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertPanel;