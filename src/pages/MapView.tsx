import { useEffect, useRef } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { ACICalculator } from '../utils/aci-calculator';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapView = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const { farms, selectedFarm, setSelectedFarm } = useAppStore();

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([36.5, 127.5], 7);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || farms.length === 0) return;

    const map = mapInstanceRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add farm markers
    farms.forEach((farm) => {
      const gradeColor = ACICalculator.getGradeColor(farm.aciGrade);
      
      // Create custom icon based on ACI grade
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: 40px; 
            height: 40px; 
            border-radius: 50%; 
            background-color: ${gradeColor}; 
            border: 3px solid white; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
            font-size: 14px;
          ">
            ${farm.aciGrade}
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const marker = L.marker([farm.location.lat, farm.location.lng], {
        icon: customIcon
      }).addTo(map);

      // Create popup content
      const popupContent = `
        <div style="min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">
            ${farm.name}
          </h3>
          <div style="margin-bottom: 8px;">
            <strong>농장주:</strong> ${farm.owner}<br>
            <strong>작물:</strong> ${farm.cropType}<br>
            <strong>규모:</strong> ${farm.farmSize}ha
          </div>
          <div style="
            padding: 8px; 
            background-color: ${gradeColor}20; 
            border-radius: 4px; 
            border-left: 4px solid ${gradeColor};
            margin-bottom: 8px;
          ">
            <div style="font-size: 18px; font-weight: bold; color: ${gradeColor};">
              ACI ${farm.aciScore}점 (${farm.aciGrade}등급)
            </div>
            <div style="font-size: 14px; color: #666;">
              ${ACICalculator.getGradeLabel(farm.aciGrade)}
            </div>
          </div>
          <button 
            onclick="window.selectFarm('${farm.id}')"
            style="
              width: 100%; 
              padding: 6px 12px; 
              background-color: ${gradeColor}; 
              color: white; 
              border: none; 
              border-radius: 4px; 
              cursor: pointer;
              font-size: 14px;
            "
          >
            이 농장 선택
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);

      // Highlight selected farm
      if (selectedFarm && selectedFarm.id === farm.id) {
        marker.openPopup();
      }

      // Click handler
      marker.on('click', () => {
        setSelectedFarm(farm);
      });
    });

    // Global function for popup button
    (window as any).selectFarm = (farmId: string) => {
      const farm = farms.find(f => f.id === farmId);
      if (farm) {
        setSelectedFarm(farm);
      }
    };

    // Fit map to show all farms
    if (farms.length > 0) {
      const group = new L.FeatureGroup(
        farms.map(farm => L.marker([farm.location.lat, farm.location.lng]))
      );
      map.fitBounds(group.getBounds().pad(0.1));
    }

  }, [farms, selectedFarm, setSelectedFarm]);

  const getGradeStats = () => {
    const stats = farms.reduce((acc, farm) => {
      acc[farm.aciGrade] = (acc[farm.aciGrade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return ['A', 'B', 'C', 'D', 'E'].map(grade => ({
      grade,
      count: stats[grade] || 0,
      color: ACICalculator.getGradeColor(grade as any),
      label: ACICalculator.getGradeLabel(grade as any)
    }));
  };

  const gradeStats = getGradeStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">농장 지도</h1>
            <p className="text-gray-600 mt-1">
              전체 {farms.length}개 농장의 ACI 분포를 확인하세요
            </p>
          </div>
          
          {/* Grade Legend */}
          <div className="flex items-center space-x-4">
            {gradeStats.map((stat) => (
              <div key={stat.grade} className="text-center">
                <div 
                  className="w-6 h-6 rounded-full mx-auto mb-1"
                  style={{ backgroundColor: stat.color }}
                ></div>
                <div className="text-xs font-medium text-gray-700">
                  {stat.grade}({stat.count})
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div ref={mapRef} className="h-[600px] w-full"></div>
      </div>

      {/* Farm List */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">농장 목록</h2>
        
        <div className="grid gap-4">
          {farms.map((farm) => (
            <div 
              key={farm.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                selectedFarm?.id === farm.id 
                  ? 'border-primary-300 bg-primary-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedFarm(farm)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: ACICalculator.getGradeColor(farm.aciGrade) }}
                  >
                    {farm.aciGrade}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{farm.name}</h3>
                    <p className="text-sm text-gray-600">
                      {farm.owner} | {farm.cropType} | {farm.location.region}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {farm.aciScore}점
                  </div>
                  <div className="text-sm text-gray-600">
                    {ACICalculator.getGradeLabel(farm.aciGrade)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapView;