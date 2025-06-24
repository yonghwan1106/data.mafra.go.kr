import { useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { Notification } from '../utils/notification-system';

const NotificationCenter = () => {
  const {
    notifications,
    settings,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    updateSettings,
    triggerTestNotification
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getNotificationIcon = (notification: Notification) => {
    const icons = {
      weather: '🌤️',
      pest: '🐛',
      soil: '🌱',
      market: '💰',
      policy: '📋',
      system: '⚙️'
    };
    return icons[notification.category] || '📢';
  };


  const getPriorityBadge = (priority: string) => {
    const badges = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-gray-100 text-gray-800'
    };
    return badges[priority as keyof typeof badges] || badges.low;
  };

  const filteredNotifications = selectedCategory === 'all' 
    ? notifications 
    : notifications.filter(n => n.category === selectedCategory);

  const categories = [
    { key: 'all', label: '전체', count: notifications.length },
    { key: 'weather', label: '기상', count: notifications.filter(n => n.category === 'weather').length },
    { key: 'pest', label: '병해충', count: notifications.filter(n => n.category === 'pest').length },
    { key: 'soil', label: '토양', count: notifications.filter(n => n.category === 'soil').length },
    { key: 'market', label: '시장', count: notifications.filter(n => n.category === 'market').length },
    { key: 'policy', label: '정책', count: notifications.filter(n => n.category === 'policy').length },
    { key: 'system', label: '시스템', count: notifications.filter(n => n.category === 'system').length }
  ];

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                알림 센터 {unreadCount > 0 && `(${unreadCount})`}
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-1 text-gray-500 hover:text-gray-700 rounded"
                  title="설정"
                >
                  ⚙️
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-500 hover:text-gray-700 rounded"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-1 mt-3">
              {categories.map(category => (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`px-2 py-1 text-xs rounded-full transition-colors ${
                    selectedCategory === category.key
                      ? 'bg-primary-100 text-primary-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category.label} {category.count > 0 && `(${category.count})`}
                </button>
              ))}
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="px-4 py-3 border-b border-gray-200 bg-blue-50">
              <h4 className="font-medium text-gray-900 mb-2">알림 설정</h4>
              
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.enabled}
                    onChange={(e) => updateSettings({ enabled: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">알림 활성화</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.sound}
                    onChange={(e) => updateSettings({ sound: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">소리 알림</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.desktop}
                    onChange={(e) => updateSettings({ desktop: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">데스크톱 알림</span>
                </label>
              </div>

              <div className="mt-3 flex space-x-2">
                <button
                  onClick={triggerTestNotification}
                  className="px-3 py-1 text-xs bg-primary-600 text-white rounded hover:bg-primary-700"
                >
                  테스트 알림
                </button>
                <button
                  onClick={clearAll}
                  className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  모두 삭제
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {!showSettings && filteredNotifications.length > 0 && (
            <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between">
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  모두 읽음 표시
                </button>
                <button
                  onClick={clearAll}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  모두 삭제
                </button>
              </div>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <div className="text-4xl mb-2">📭</div>
                <p>알림이 없습니다</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-lg mt-0.5">
                        {getNotificationIcon(notification)}
                      </span>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-medium truncate ${
                            !notification.read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h4>
                          
                          <div className="flex items-center space-x-2 ml-2">
                            <span className={`px-2 py-0.5 text-xs rounded-full ${getPriorityBadge(notification.priority)}`}>
                              {notification.priority === 'critical' ? '긴급' :
                               notification.priority === 'high' ? '높음' :
                               notification.priority === 'medium' ? '보통' : '낮음'}
                            </span>
                            
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {new Date(notification.timestamp).toLocaleString('ko-KR')}
                          </span>
                          
                          <div className="flex items-center space-x-2">
                            {notification.action && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  notification.action!.callback();
                                }}
                                className="text-xs text-primary-600 hover:text-primary-700 underline"
                              >
                                {notification.action.label}
                              </button>
                            )}
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notification.id);
                              }}
                              className="text-xs text-gray-400 hover:text-gray-600"
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default NotificationCenter;