'use client';

import React, { useEffect, useRef, useState } from 'react';
import { LiveTrain, AIDetection } from '@/lib/types';
import { TRACK_SECTIONS, AI_DETECTIONS } from '@/lib/mockData';

interface InteractiveTrainMapProps {
  trains: LiveTrain[];
  selectedTrain: LiveTrain | null;
  onSelectTrain: (train: LiveTrain) => void;
  onSelectDefect?: (defect: AIDetection) => void;
  showWeatherLayer?: boolean;
}

// Track polyline coordinates for live paths
const TRACK_COORDINATES: Record<string, [number, number][]> = {
  'NDLS-GZB': [
    [28.6429, 77.2195], // New Delhi
    [28.6500, 77.2500], // Tilak Bridge
    [28.6554, 77.2912], // KM 142.6 Defect Point
    [28.6620, 77.3100], // Sahibabad
    [28.6700, 77.4200], // Ghaziabad
  ],
  'NDLS-TKD': [
    [28.6429, 77.2195], // New Delhi
    [28.5880, 77.2530], // Nizamuddin
    [28.5800, 77.2400], // Okhla
    [28.5742, 77.2481], // KM 88.2 Fastener Anomaly
    [28.5100, 77.2800], // Tuglakabad
  ],
  'DLI-UMB': [
    [28.6600, 77.2280], // Old Delhi
    [28.7200, 77.1700], // Subzi Mandi
    [28.7900, 77.1300], // Narela
    [28.8500, 77.0800], // Sonipat / Ambala Corridor
  ],
  'NZM-AGC': [
    [28.5880, 77.2530], // Nizamuddin
    [28.4500, 77.3100], // Faridabad
    [28.3500, 77.3400], // Ballabgarh
    [28.2500, 77.3800], // Palwal / Agra Corridor
  ],
  'ANVR-MB': [
    [28.6500, 77.3150], // Anand Vihar
    [28.6400, 77.3900], // Chander Nagar
    [28.6300, 77.5200], // Moradabad Line
  ],
};

const STATIONS = [
  { code: 'NDLS', name: 'New Delhi Junction', lat: 28.6429, lng: 77.2195, major: true },
  { code: 'DLI', name: 'Old Delhi Main', lat: 28.6600, lng: 77.2280, major: true },
  { code: 'NZM', name: 'Hazrat Nizamuddin', lat: 28.5880, lng: 77.2530, major: true },
  { code: 'GZB', name: 'Ghaziabad Junction', lat: 28.6700, lng: 77.4200, major: true },
  { code: 'ANVR', name: 'Anand Vihar Terminal', lat: 28.6500, lng: 77.3150, major: false },
  { code: 'TKD', name: 'Tuglakabad Yard', lat: 28.5100, lng: 77.2800, major: false },
  { code: 'FDB', name: 'Faridabad', lat: 28.4500, lng: 77.3100, major: false },
  { code: 'SNP', name: 'Sonipat', lat: 28.8500, lng: 77.0800, major: false },
];

export function InteractiveTrainMap({
  trains,
  selectedTrain,
  onSelectTrain,
  onSelectDefect,
  showWeatherLayer = true,
}: InteractiveTrainMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const trainMarkersRef = useRef<Map<string, any>>(new Map());
  const pathPolylineRef = useRef<any>(null);
  const weatherCircleRef = useRef<any>(null);

  // Initialize Map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let L: any;
    try {
      L = require('leaflet');
    } catch {
      return;
    }

    if (mapInstanceRef.current) return;

    // Create Map
    const map = L.map(mapContainerRef.current, {
      center: [28.635, 77.28],
      zoom: 11,
      minZoom: 9,
      maxZoom: 16,
      zoomControl: false,
    });

    // Dark Map Tile Layer (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO &copy; RailRakshak AI',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Zoom control at top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    mapInstanceRef.current = map;

    // Draw Railway Corridors (Base Network Lines)
    Object.entries(TRACK_COORDINATES).forEach(([key, coords]) => {
      const isCriticalCorridor = key === 'NDLS-GZB';
      const isWarningCorridor = key === 'NDLS-TKD';

      L.polyline(coords, {
        color: isCriticalCorridor ? '#EF4444' : isWarningCorridor ? '#FFB044' : '#4EDEA3',
        weight: isCriticalCorridor ? 4.5 : 3.5,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: isCriticalCorridor ? '6, 4' : undefined,
      }).addTo(map);
    });

    // Add Station Markers
    STATIONS.forEach((st) => {
      const stationIcon = L.divIcon({
        className: 'custom-station-marker',
        html: `
          <div style="display: flex; align-items: center; gap: 4px; pointer-events: auto; cursor: default;">
            <div style="width: ${st.major ? '12px' : '8px'}; height: ${st.major ? '12px' : '8px'}; border-radius: 50%; background: #111317; border: 2.5px solid ${st.major ? '#00D1FF' : '#859399'}; box-shadow: 0 0 8px rgba(0,209,255,0.4);"></div>
            <span style="font-family: 'JetBrains Mono', monospace; font-size: ${st.major ? '10px' : '9px'}; font-weight: bold; color: ${st.major ? '#A4E6FF' : '#BBC9CF'}; background: rgba(17,19,23,0.85); padding: 1px 4px; border-radius: 3px; border: 1px solid #333A48; white-space: nowrap;">
              ${st.code}
            </span>
          </div>
        `,
        iconSize: [60, 20],
        iconAnchor: [6, 10],
      });

      L.marker([st.lat, st.lng], { icon: stationIcon }).addTo(map);
    });

    // Add Defect Marker at KM 142.6 (NDLS-GZB)
    const defect = AI_DETECTIONS[0];
    const defectIcon = L.divIcon({
      className: 'custom-defect-marker',
      html: `
        <div style="position: relative; width: 28px; height: 28px; cursor: pointer;">
          <div style="position: absolute; inset: 0; border-radius: 50%; background: #EF4444; opacity: 0.6; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: relative; width: 28px; height: 28px; border-radius: 50%; background: #111317; border: 2px solid #EF4444; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 14px #EF4444;">
            <span style="color: #EF4444; font-size: 14px; font-weight: bold; line-height: 1;">⚠</span>
          </div>
          <div style="position: absolute; top: 30px; left: 50%; transform: translateX(-50%); background: #93000A; color: #FFDAD6; border: 1px solid rgba(255,180,171,0.5); font-family: 'JetBrains Mono', monospace; font-size: 9px; padding: 2px 5px; border-radius: 3px; white-space: nowrap; box-shadow: 0 2px 8px rgba(0,0,0,0.5);">
            KM 142.6 CRACK
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const defectMarker = L.marker([defect.coordinates.lat, defect.coordinates.lng], {
      icon: defectIcon,
    }).addTo(map);

    defectMarker.on('click', () => {
      if (onSelectDefect) onSelectDefect(defect);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Weather Layer Overlay
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const L = require('leaflet');
    const map = mapInstanceRef.current;

    if (showWeatherLayer) {
      if (!weatherCircleRef.current) {
        weatherCircleRef.current = L.circle([28.655, 77.31], {
          radius: 12000,
          color: '#00D1FF',
          fillColor: '#00D1FF',
          fillOpacity: 0.08,
          weight: 1.5,
          dashArray: '5, 5',
        }).addTo(map);
      }
    } else {
      if (weatherCircleRef.current) {
        map.removeLayer(weatherCircleRef.current);
        weatherCircleRef.current = null;
      }
    }
  }, [showWeatherLayer]);

  // Update Live Train Markers and Active Live Path
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const L = require('leaflet');
    const map = mapInstanceRef.current;

    trains.forEach((train) => {
      const isSelected = selectedTrain?.id === train.id;
      const isAlert = train.approachingAlert !== undefined && train.approachingAlert !== null;
      const isDelayed = train.status === 'DELAYED';

      const markerColor = isSelected ? '#00D1FF' : isAlert ? '#EF4444' : isDelayed ? '#FFB044' : '#4EDEA3';
      const glowColor = isSelected ? 'rgba(0,209,255,0.7)' : isAlert ? 'rgba(239,68,68,0.7)' : isDelayed ? 'rgba(255,176,68,0.6)' : 'rgba(78,222,163,0.5)';

      const trainIcon = L.divIcon({
        className: 'custom-live-train-marker',
        html: `
          <div style="position: relative; width: 34px; height: 34px; cursor: pointer; transition: transform 0.3s ease;">
            ${
              isSelected || isAlert
                ? `<div style="position: absolute; inset: -4px; border-radius: 50%; background: ${markerColor}; opacity: 0.4; animation: ping 1.8s infinite;"></div>`
                : ''
            }
            <div style="position: relative; width: 34px; height: 34px; border-radius: 50%; background: ${isSelected ? markerColor : '#111317'}; border: 2.5px solid ${markerColor}; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 16px ${glowColor}; color: ${isSelected ? '#001F28' : markerColor};">
              <svg style="width: 18px; height: 18px; fill: currentColor;" viewBox="0 0 24 24">
                <path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
              </svg>
            </div>
            <div style="position: absolute; top: 36px; left: 50%; transform: translateX(-50%); background: #1A1D24; color: ${isSelected ? '#00D1FF' : '#E2E2E8'}; border: 1px solid ${isSelected ? '#00D1FF' : '#333A48'}; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.6);">
              ${train.trainNumber} (${train.speedKmH} km/h)
            </div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      if (trainMarkersRef.current.has(train.id)) {
        const marker = trainMarkersRef.current.get(train.id);
        marker.setLatLng([train.latitude, train.longitude]);
        marker.setIcon(trainIcon);
      } else {
        const marker = L.marker([train.latitude, train.longitude], { icon: trainIcon }).addTo(map);
        marker.on('click', () => onSelectTrain(train));
        trainMarkersRef.current.set(train.id, marker);
      }
    });

    // Draw Glowing Active Live Path / Route Trajectory for Selected Train
    if (pathPolylineRef.current) {
      map.removeLayer(pathPolylineRef.current);
      pathPolylineRef.current = null;
    }

    if (selectedTrain) {
      // Find matching corridor for selected train
      let routeKey = 'NDLS-GZB';
      if (selectedTrain.trainNumber === '12424') routeKey = 'DLI-UMB';
      if (selectedTrain.trainNumber === '22436') routeKey = 'NZM-AGC';
      if (selectedTrain.trainNumber === '14041' || selectedTrain.trainNumber === 'BOXN-4028') routeKey = 'NDLS-TKD';

      const corridorCoords = TRACK_COORDINATES[routeKey] || TRACK_COORDINATES['NDLS-GZB'];

      // Active live path polyline with cyan glow
      pathPolylineRef.current = L.polyline(corridorCoords, {
        color: '#00D1FF',
        weight: 6,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: '8, 8',
      }).addTo(map);
    }
  }, [trains, selectedTrain]);

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden border border-[#333A48] bg-[#0A0C10]">
      {/* Map Container Leaflet Element */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[500px]" />

      {/* Floating Map Legend & HUD Overlay */}
      <div className="absolute top-4 left-4 z-[400] glass-panel px-3 py-1.5 rounded text-xs font-mono flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-[#00D1FF] animate-pulse" />
        <span className="text-[#E2E2E8] font-bold">Delhi Railway Geospatial Grid</span>
        <span className="text-[#859399]">|</span>
        <span className="text-[#00D1FF] font-bold">{trains.length} Active Locos Tracked</span>
      </div>

      {/* Bottom Floating Legend */}
      <div className="absolute bottom-4 left-4 z-[400] glass-panel px-3 py-2 rounded text-xs font-mono flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00D1FF] shadow-[0_0_8px_#00D1FF]" />
          <span className="text-[#BBC9CF]">Selected Train</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4EDEA3] shadow-[0_0_6px_#4EDEA3]" />
          <span className="text-[#BBC9CF]">Normal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFB044] shadow-[0_0_6px_#FFB044]" />
          <span className="text-[#BBC9CF]">Delayed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] shadow-[0_0_8px_#EF4444]" />
          <span className="text-[#BBC9CF]">Critical Alert</span>
        </div>
      </div>
    </div>
  );
}
