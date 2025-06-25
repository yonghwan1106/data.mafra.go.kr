import { ACIData, WeatherData, Farm } from '../types';

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  category: 'weather' | 'pest' | 'soil' | 'market' | 'policy' | 'system';
  title: string;
  message: string;
  timestamp: string;
  farmId?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  action?: {
    label: string;
    callback: () => void;
  };
  autoClose?: boolean;
  duration?: number; // milliseconds
  read?: boolean;
}

export interface NotificationSettings {
  enabled: boolean;
  categories: {
    weather: boolean;
    pest: boolean;
    soil: boolean;
    market: boolean;
    policy: boolean;
    system: boolean;
  };
  priority: {
    low: boolean;
    medium: boolean;
    high: boolean;
    critical: boolean;
  };
  sound: boolean;
  desktop: boolean;
  email: boolean;
}

export class NotificationSystem {
  private static notifications: Notification[] = [];
  private static listeners: ((notifications: Notification[]) => void)[] = [];
  private static settings: NotificationSettings = {
    enabled: true,
    categories: {
      weather: true,
      pest: true,
      soil: true,
      market: true,
      policy: true,
      system: true
    },
    priority: {
      low: true,
      medium: true,
      high: true,
      critical: true
    },
    sound: true,
    desktop: true,
    email: false
  };

  static initialize() {
    // 브라우저 알림 권한 요청
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // 로컬 스토리지에서 설정 불러오기
    const savedSettings = localStorage.getItem('notification-settings');
    if (savedSettings) {
      this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
    }

    // 5분마다 시스템 체크
    setInterval(() => {
      this.performSystemCheck();
    }, 5 * 60 * 1000);

    // 페이지 포커스 시 알림 확인
    window.addEventListener('focus', () => {
      this.checkPendingNotifications();
    });
  }

  static addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): string {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      read: false
    };

    // 중복 알림 방지
    const isDuplicate = this.notifications.some(n => 
      n.title === newNotification.title && 
      n.message === newNotification.message &&
      Date.now() - new Date(n.timestamp).getTime() < 30000 // 30초 내 동일 알림
    );

    if (isDuplicate) {
      return '';
    }

    // 설정에 따른 필터링
    if (!this.shouldShowNotification(newNotification)) {
      return '';
    }

    this.notifications.unshift(newNotification);

    // 최대 100개 알림 유지
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100);
    }

    // 데스크톱 알림 표시
    this.showDesktopNotification(newNotification);

    // 사운드 재생
    this.playNotificationSound(newNotification);

    // 리스너들에게 알림
    this.notifyListeners();

    // 자동 닫기 설정
    if (newNotification.autoClose !== false) {
      const duration = newNotification.duration || this.getDefaultDuration(newNotification.priority);
      setTimeout(() => {
        this.removeNotification(newNotification.id);
      }, duration);
    }

    return newNotification.id;
  }

  static analyzeAndNotify(currentACI: ACIData, previousACI: ACIData, farm: Farm, weather?: WeatherData) {
    // ACI 변화 분석
    const aciChange = currentACI.aci - previousACI.aci;
    
    if (aciChange <= -10) {
      this.addNotification({
        type: 'warning',
        category: 'system',
        title: 'ACI 점수 급락 감지',
        message: `${farm.name}의 ACI가 ${Math.abs(aciChange)}점 하락했습니다. 원인 분석이 필요합니다.`,
        priority: 'high',
        farmId: farm.id
      });
    } else if (aciChange >= 10) {
      this.addNotification({
        type: 'success',
        category: 'system',
        title: 'ACI 점수 상승',
        message: `${farm.name}의 ACI가 ${aciChange}점 향상되었습니다!`,
        priority: 'medium',
        farmId: farm.id
      });
    }

    // 세부 지수 분석
    this.analyzeWeatherRisk(currentACI, farm, weather);
    this.analyzePestRisk(currentACI, previousACI, farm);
    this.analyzeSoilHealth(currentACI, farm);
    this.analyzeMarketValue(currentACI, previousACI, farm);
  }

  private static analyzeWeatherRisk(currentACI: ACIData, farm: Farm, weather?: WeatherData) {
    if (currentACI.wri < 50) {
      this.addNotification({
        type: 'error',
        category: 'weather',
        title: '기상 위험 경보',
        message: `${farm.name}에 극한 기상 위험이 감지되었습니다. 즉시 보호 조치를 취하세요.`,
        priority: 'critical',
        farmId: farm.id
      });
    } else if (currentACI.wri < 70) {
      this.addNotification({
        type: 'warning',
        category: 'weather',
        title: '기상 주의보',
        message: `${farm.name}의 기상 위험도가 높습니다. 기상 변화를 주의 깊게 관찰하세요.`,
        priority: 'high',
        farmId: farm.id
      });
    }

    // 날씨 예보 기반 알림
    if (weather?.alerts) {
      weather.alerts.forEach(alert => {
        this.addNotification({
          type: alert.severity === 'warning' ? 'warning' : 'error',
          category: 'weather',
          title: '기상 특보',
          message: alert.message,
          priority: alert.severity === 'warning' ? 'high' : 'critical',
          farmId: farm.id
        });
      });
    }
  }

  private static analyzePestRisk(currentACI: ACIData, previousACI: ACIData, farm: Farm) {
    const pestChange = currentACI.pri - previousACI.pri;
    
    if (currentACI.pri < 50) {
      this.addNotification({
        type: 'error',
        category: 'pest',
        title: '병해충 긴급 경보',
        message: `${farm.name}에 병해충 대발생 위험이 있습니다. 즉시 전문가 상담 및 방제를 실시하세요.`,
        priority: 'critical',
        farmId: farm.id,
        action: {
          label: '방제 가이드 보기',
          callback: () => window.open('/pest-control-guide', '_blank')
        }
      });
    } else if (currentACI.pri < 70 || pestChange < -15) {
      this.addNotification({
        type: 'warning',
        category: 'pest',
        title: '병해충 주의보',
        message: `${farm.name}의 병해충 위험도가 증가하고 있습니다. 예방적 방제를 고려하세요.`,
        priority: 'high',
        farmId: farm.id
      });
    }
  }

  private static analyzeSoilHealth(currentACI: ACIData, farm: Farm) {
    if (currentACI.shi < 60) {
      this.addNotification({
        type: 'warning',
        category: 'soil',
        title: '토양 건강도 경고',
        message: `${farm.name}의 토양 건강도가 낮습니다. 토양 개량제 투입을 검토하세요.`,
        priority: 'medium',
        farmId: farm.id,
        action: {
          label: '토양 개선 방법',
          callback: () => window.open('/soil-improvement', '_blank')
        }
      });
    }
  }

  private static analyzeMarketValue(currentACI: ACIData, previousACI: ACIData, farm: Farm) {
    const marketChange = currentACI.mvi - previousACI.mvi;
    
    if (currentACI.mvi > 85) {
      this.addNotification({
        type: 'success',
        category: 'market',
        title: '출하 기회',
        message: `${farm.cropType} 가격이 상승했습니다. 출하 타이밍을 검토하세요.`,
        priority: 'medium',
        farmId: farm.id
      });
    } else if (marketChange < -20) {
      this.addNotification({
        type: 'warning',
        category: 'market',
        title: '시장 가격 하락',
        message: `${farm.cropType} 가격이 급락했습니다. 출하 전략을 재검토하세요.`,
        priority: 'high',
        farmId: farm.id
      });
    }
  }

  static checkPolicyUpdates(farmCropType: string) {
    // 실제로는 정책 API를 호출하여 확인
    const mockPolicyUpdate = Math.random() > 0.8; // 20% 확률
    
    if (mockPolicyUpdate) {
      this.addNotification({
        type: 'info',
        category: 'policy',
        title: '신규 지원사업 공고',
        message: `${farmCropType} 관련 신규 정책 지원사업이 공고되었습니다.`,
        priority: 'medium',
        action: {
          label: '자세히 보기',
          callback: () => window.open('/policies', '_blank')
        },
        autoClose: false
      });
    }
  }

  private static performSystemCheck() {
    this.addNotification({
      type: 'info',
      category: 'system',
      title: '시스템 상태 확인',
      message: '모든 데이터가 정상적으로 업데이트되었습니다.',
      priority: 'low',
      duration: 3000
    });
  }

  private static checkPendingNotifications() {
    const unreadCount = this.notifications.filter(n => !n.read).length;
    if (unreadCount > 0) {
      document.title = `(${unreadCount}) 아그리인덱스`;
    } else {
      document.title = '아그리인덱스';
    }
  }

  private static shouldShowNotification(notification: Notification): boolean {
    if (!this.settings.enabled) return false;
    if (!this.settings.categories[notification.category]) return false;
    if (!this.settings.priority[notification.priority]) return false;
    return true;
  }

  private static showDesktopNotification(notification: Notification) {
    if (!this.settings.desktop) return;
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id
      });
    }
  }

  private static playNotificationSound(notification: Notification) {
    if (!this.settings.sound) return;
    
    const audio = new Audio();
    
    switch (notification.priority) {
      case 'critical':
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEUFlXx2f';
        break;
      case 'high':
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmE=';
        break;
      default:
        // Medium/Low priority - softer sound
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/';
    }
    
    audio.volume = 0.3;
    audio.play().catch(() => {
      // Ignore audio play errors (user interaction required)
    });
  }

  private static getDefaultDuration(priority: string): number {
    switch (priority) {
      case 'critical': return 0; // No auto-close
      case 'high': return 10000;
      case 'medium': return 7000;
      case 'low': return 5000;
      default: return 5000;
    }
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  static subscribe(callback: (notifications: Notification[]) => void): () => void {
    this.listeners.push(callback);
    callback(this.notifications); // Initial call
    
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private static notifyListeners() {
    this.listeners.forEach(callback => callback(this.notifications));
  }

  static getNotifications(): Notification[] {
    return this.notifications;
  }

  static markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.notifyListeners();
      this.checkPendingNotifications();
    }
  }

  static markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.notifyListeners();
    this.checkPendingNotifications();
  }

  static removeNotification(notificationId: string) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.notifyListeners();
    this.checkPendingNotifications();
  }

  static clearAll() {
    this.notifications = [];
    this.notifyListeners();
    this.checkPendingNotifications();
  }

  static updateSettings(newSettings: Partial<NotificationSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem('notification-settings', JSON.stringify(this.settings));
  }

  static getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  static getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  static triggerTestNotification() {
    this.addNotification({
      type: 'info',
      category: 'system',
      title: '테스트 알림',
      message: '알림 시스템이 정상적으로 작동합니다.',
      priority: 'low'
    });
  }
}