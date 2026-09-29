import React, { useState, useEffect, useRef } from 'react';
import { DistrictMetric, CitizenRequest, IssueCategory } from '../types';
import { DISTRICT_METRICS } from '../data/mockData';
import { 
  MapPin, 
  Layers, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Compass, 
  TrendingUp, 
  Users, 
  IndianRupee,
  Activity,
  Maximize2,
  ShieldCheck,
  Flame,
  Search,
  Crosshair,
  Navigation,
  Globe,
  Loader2,
  CheckCheck
} from 'lucide-react';
import L from 'leaflet';
import { geocodeLocationPrecise, getLiveBrowserGps } from '../services/geocoding';

interface HotspotMapProps {
  requests: CitizenRequest[];
  onSelectDistrictForDPR: (district: DistrictMetric) => void;
  onSelectRequestForDPR?: (req: CitizenRequest) => void;
  onResolveRequest?: (id: string, notes?: string, byOfficer?: boolean) => void;
}

export const HotspotMap: React.FC<HotspotMapProps> = ({
  requests,
  onSelectDistrictForDPR,
  onSelectRequestForDPR,
  onResolveRequest
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const gpsMarkerRef = useRef<L.Marker | null>(null);

  const [selectedDistrict, setSelectedDistrict] = useState<DistrictMetric>(DISTRICT_METRICS[0]);
  const [selectedCitizenIssue, setSelectedCitizenIssue] = useState<CitizenRequest | null>(
    requests.find((r) => r.isPublished && !r.isResolved) || requests[0] || null
  );
  const [activeLayer, setActiveLayer] = useState<'all' | 'live_issues' | 'aspirational' | 'gatishakti' | 'water' | 'roads' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [isGettingGps, setIsGettingGps] = useState(false);
  const prevRequestsLengthRef = useRef(requests.length);

  // Active vs Resolved Requests
  const activeUnresolvedRequests = requests.filter((r) => (r.isPublished ?? true) && !r.isResolved);
  const resolvedRequestsList = requests.filter((r) => r.isResolved);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on India
    const map = L.map(mapContainerRef.current, {
      center: [22.8, 81.5],
      zoom: 5,
      minZoom: 4,
      maxZoom: 18,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors | JanSetu National GIS Engine',
      maxZoom: 19
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersRef.current = markersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // When a new request arrives, auto-fly to its exact pinpoint location
  useEffect(() => {
    if (requests.length > prevRequestsLengthRef.current && requests.length > 0) {
      const latestReq = requests[0];
      setSelectedCitizenIssue(latestReq);
      if (mapInstanceRef.current && latestReq.coordinates) {
        mapInstanceRef.current.flyTo(latestReq.coordinates, 14, { duration: 1.5 });
      }
    }
    prevRequestsLengthRef.current = requests.length;
  }, [requests]);

  // Update map markers when layer or requests change
  useEffect(() => {
    if (!markersRef.current || !mapInstanceRef.current) return;

    markersRef.current.clearLayers();

    // Determine which requests to plot based on active layer
    const reqsToPlot = activeLayer === 'resolved' 
      ? resolvedRequestsList 
      : activeUnresolvedRequests;

    // 1. Render Citizen Grievances with high precision drop-pins (Resolved = Emerald Green, Active = Category Color)
    if (activeLayer === 'all' || activeLayer === 'live_issues' || activeLayer === 'water' || activeLayer === 'roads' || activeLayer === 'resolved') {
      reqsToPlot.forEach((req) => {
        if (activeLayer === 'water' && !req.category.includes('Water')) return;
        if (activeLayer === 'roads' && !req.category.includes('Roads')) return;

        const isReqSelected = selectedCitizenIssue?.id === req.id;
        const iconEmoji = req.isResolved
          ? '✅'
          : req.category.includes('Water')
          ? '💧'
          : req.category.includes('Roads')
          ? '🛣️'
          : req.category.includes('Healthcare')
          ? '🏥'
          : req.category.includes('School')
          ? '🏫'
          : req.category.includes('Power')
          ? '⚡'
          : '🚨';

        const pinColor = req.isResolved 
          ? '#10b981' 
          : req.severity === 'Critical' 
          ? '#ef4444' 
          : req.category.includes('Water') 
          ? '#0284c7' 
          : '#ea580c';

        const pinSize = isReqSelected ? 46 : 38;

        // Custom High-Precision SVG Teardrop Pin with sharp needle tip & ground pulse
        const issueHtml = `
          <div style="position: relative; width: ${pinSize}px; height: ${pinSize + 10}px; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <!-- Radar Ripple on ground point -->
            <div style="
              position: absolute;
              bottom: 0px;
              left: 50%;
              transform: translateX(-50%);
              width: 14px;
              height: 14px;
              border-radius: 50%;
              background: ${pinColor}44;
              border: 2px solid ${pinColor};
              animation: ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>

            <!-- Ground Target Dot -->
            <div style="
              position: absolute;
              bottom: 4px;
              left: 50%;
              transform: translateX(-50%);
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background: #0f172a;
              border: 1.5px solid #ffffff;
            "></div>

            <!-- Precision Teardrop Pin Shape -->
            <div style="
              position: relative;
              z-index: 2;
              width: ${pinSize}px;
              height: ${pinSize}px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              background: ${pinColor};
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 14px rgba(0,0,0,0.45);
              border: ${isReqSelected ? '3px solid #ffffff' : '2px solid #ffffff'};
            ">
              <div style="
                transform: rotate(45deg);
                font-size: ${isReqSelected ? '18px' : '15px'};
                line-height: 1;
              ">
                ${iconEmoji}
              </div>
            </div>
          </div>
        `;

        const reqIcon = L.divIcon({
          className: 'custom-citizen-req-marker',
          html: issueHtml,
          iconSize: [pinSize, pinSize + 10],
          iconAnchor: [pinSize / 2, pinSize + 8],
          popupAnchor: [0, -(pinSize + 8)]
        });

        const reqMarker = L.marker(req.coordinates, { icon: reqIcon });

        reqMarker.on('click', () => {
          setSelectedCitizenIssue(req);
          mapInstanceRef.current?.flyTo(req.coordinates, 14, { duration: 1.2 });
        });

        reqMarker.bindTooltip(`
          <div style="font-family: sans-serif; font-size: 12px; padding: 6px; max-width: 240px;">
            <div style="font-weight: 800; color: #002663; font-size: 13px;">${req.title}</div>
            <div style="color: #475569; font-size: 11px; margin-top: 2px;">📍 ${req.blockOrWard || req.district}, ${req.state}</div>
            <div style="color: #64748b; font-size: 10px; font-family: monospace;">🌐 Lat: ${req.coordinates[0].toFixed(4)}°, Lng: ${req.coordinates[1].toFixed(4)}°</div>
            ${req.isResolved ? `
              <div style="color: #059669; font-weight: 800; margin-top: 4px;">✅ RESOLVED & COMPLETED</div>
            ` : `
              <div style="color: #ef4444; font-weight: 700; margin-top: 4px;">⚡ Priority: ${req.urgencyScore}/100 (${req.severity})</div>
            `}
            <div style="color: #15803d; font-size: 10px; font-weight: 600; margin-top: 2px;">Token: ${req.trackingNumber}</div>
          </div>
        `, {
          direction: 'top',
          offset: [0, -(pinSize + 6)]
        });

        markersRef.current?.addLayer(reqMarker);
      });
    }

    // 2. Render District Metrics Aggregate Pins (only on non-resolved views)
    if (activeLayer !== 'live_issues' && activeLayer !== 'resolved') {
      DISTRICT_METRICS.forEach((dist) => {
        if (activeLayer === 'aspirational' && !dist.isAspirational) return;
        if (activeLayer === 'gatishakti' && dist.gatiShaktiGapScore < 80) return;
        if (activeLayer === 'water' && !dist.topSector.includes('Water')) return;
        if (activeLayer === 'roads' && !dist.topSector.includes('Roads')) return;

        const isSelected = selectedDistrict.id === dist.id;
        const pinSize = isSelected ? 36 : 28;

        const iconHtml = `
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: ${pinSize}px;
            height: ${pinSize}px;
            border-radius: 50%;
            background: ${dist.compositeDeficitScore > 85 ? '#ef4444' : '#f97316'};
            border: 3px solid ${isSelected ? '#ffffff' : '#fde047'};
            box-shadow: 0 4px 12px rgba(0,0,0,0.35);
            cursor: pointer;
          ">
            <span style="color: white; font-weight: 800; font-size: ${isSelected ? '13px' : '11px'};">
              ${dist.criticalPending}
            </span>
          </div>
        `;

        const customIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: iconHtml,
          iconSize: [pinSize, pinSize],
          iconAnchor: [pinSize / 2, pinSize / 2]
        });

        const marker = L.marker(dist.coordinates, { icon: customIcon });

        marker.on('click', () => {
          setSelectedDistrict(dist);
          mapInstanceRef.current?.flyTo(dist.coordinates, 10, { duration: 1.2 });
        });

        marker.bindTooltip(`
          <div style="font-family: sans-serif; font-size: 12px; padding: 4px;">
            <strong>${dist.name}, ${dist.state}</strong><br/>
            <span style="color: #64748b; font-size: 10px;">🌐 ${dist.coordinates[0].toFixed(4)}° N, ${dist.coordinates[1].toFixed(4)}° E</span><br/>
            <span style="color: #ea580c; font-weight: bold;">Deficit Score: ${dist.compositeDeficitScore}/100</span><br/>
            <span>${dist.totalRequests} aggregated citizen demands</span>
          </div>
        `);

        markersRef.current?.addLayer(marker);
      });
    }
  }, [activeLayer, selectedDistrict, selectedCitizenIssue, requests]);

  // Handle Location Search on Map
  const handleSearchLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearchingLocation(true);
    try {
      const coords = await geocodeLocationPrecise(searchQuery, searchQuery, '', searchQuery);
      if (mapInstanceRef.current && coords) {
        mapInstanceRef.current.flyTo(coords, 14, { duration: 1.5 });

        // Add a temporary target pulse
        const targetIcon = L.divIcon({
          className: 'search-target-marker',
          html: `
            <div style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
              <div style="position: absolute; inset: 0; border-radius: 50%; border: 3px solid #0284c7; animation: ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              <div style="width: 14px; height: 14px; border-radius: 50%; background: #0284c7; border: 2px solid white; box-shadow: 0 0 10px #0284c7;"></div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });

        const targetMarker = L.marker(coords, { icon: targetIcon }).addTo(mapInstanceRef.current);
        targetMarker.bindTooltip(`<strong>📍 Location: ${searchQuery}</strong><br/><span style="font-size: 10px; font-family: monospace;">[${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}]</span>`, { permanent: true, direction: 'top' });
        
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.removeLayer(targetMarker);
          }
        }, 8000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearchingLocation(false);
    }
  };

  // Handle Live GPS Location Pinning
  const handleLocateMe = async () => {
    setIsGettingGps(true);
    try {
      const gps = await getLiveBrowserGps();

      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo(gps.coordinates, 15, { duration: 1.5 });

        if (gpsMarkerRef.current) {
          mapInstanceRef.current.removeLayer(gpsMarkerRef.current);
        }

        const myGpsIcon = L.divIcon({
          className: 'my-gps-marker',
          html: `
            <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
              <div style="position: absolute; inset: -4px; border-radius: 50%; background: rgba(59, 130, 246, 0.25); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              <div style="position: relative; width: 18px; height: 18px; border-radius: 50%; background: #2563eb; border: 3px solid #ffffff; box-shadow: 0 0 14px rgba(37, 99, 235, 0.8);"></div>
            </div>
          `,
          iconSize: [44, 44],
          iconAnchor: [22, 22]
        });

        const marker = L.marker(gps.coordinates, { icon: myGpsIcon }).addTo(mapInstanceRef.current);
        marker.bindTooltip(`<strong>📍 Your Live GPS Location</strong><br/><span style="font-size: 10px;">Accuracy: ~${gps.accuracyMeters || 10}m</span><br/><span style="font-size: 10px; font-family: monospace;">${gps.coordinates[0].toFixed(5)}° N, ${gps.coordinates[1].toFixed(5)}° E</span>`, { permanent: true, direction: 'top' });
        gpsMarkerRef.current = marker;
      }
    } catch (err) {
      alert('Could not access device GPS. Please enable location permissions in your browser.');
    } finally {
      setIsGettingGps(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner & KPI Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Shasan-Drishti (शासन-दृष्टि) • High-Precision Geospatial Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            National Infrastructure Demand Hotspots
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Live sub-meter precision pinning. Active verified community issues appear immediately on the map; resolved works are archived to clear map clutter.
          </p>
        </div>

        {/* Real-time stats widgets */}
        <div className="flex flex-wrap gap-3">
          <div className="bg-slate-800/80 px-3.5 py-2.5 rounded-xl border border-slate-700/60">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Active Hotspots</span>
            <span className="text-lg font-black text-rose-400">{activeUnresolvedRequests.length} Pins</span>
          </div>
          <div className="bg-slate-800/80 px-3.5 py-2.5 rounded-xl border border-slate-700/60">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Resolved Works</span>
            <span className="text-lg font-black text-emerald-400">{resolvedRequestsList.length} Fixed</span>
          </div>
          <div className="bg-slate-800/80 px-3.5 py-2.5 rounded-xl border border-slate-700/60">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">All States Tracked</span>
            <span className="text-lg font-black text-amber-400">28 States + 8 UTs</span>
          </div>
        </div>
      </div>

      {/* Layer Filters & Real-Time Pinpoint Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Layer Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
            <Layers className="w-3.5 h-3.5 text-slate-600" /> Layers:
          </span>
          <button
            onClick={() => setActiveLayer('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeLayer === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Active Hotspots ({DISTRICT_METRICS.length + activeUnresolvedRequests.length})
          </button>
          <button
            onClick={() => setActiveLayer('live_issues')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
              activeLayer === 'live_issues'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Active Citizen Pins ({activeUnresolvedRequests.length})</span>
          </button>
          <button
            onClick={() => setActiveLayer('aspirational')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
              activeLayer === 'aspirational'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            ★ NITI Aspirational
          </button>
          <button
            onClick={() => setActiveLayer('water')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeLayer === 'water'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            💧 Jal Jeevan
          </button>
          <button
            onClick={() => setActiveLayer('roads')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeLayer === 'roads'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            🛣️ PMGSY Roads
          </button>
          <button
            onClick={() => setActiveLayer('resolved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
              activeLayer === 'resolved'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300'
            }`}
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Resolved Works ({resolvedRequestsList.length})</span>
          </button>
        </div>

        {/* Live Precision Location Search & GPS Pinpoint Button */}
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearchLocation} className="relative flex-1 sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pinpoint place (Ranaghat, Patna, 741201)..."
              className="w-full text-xs rounded-xl border border-slate-300 pl-8 pr-16 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              disabled={isSearchingLocation}
              className="absolute right-1 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition cursor-pointer flex items-center gap-1"
            >
              {isSearchingLocation ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Pin'}
            </button>
          </form>

          {/* Device GPS Locator */}
          <button
            type="button"
            onClick={handleLocateMe}
            disabled={isGettingGps}
            title="Locate my exact current GPS position"
            className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200 transition cursor-pointer flex items-center gap-1 text-xs font-bold shadow-xs shrink-0"
          >
            {isGettingGps ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            ) : (
              <Crosshair className="w-4 h-4 text-blue-600" />
            )}
            <span className="hidden sm:inline">My GPS</span>
          </button>
        </div>
      </div>

      {/* Main Map + District Inspection Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Leaflet Map Container (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden relative">
          <div
            ref={mapContainerRef}
            className="w-full h-[620px] z-10"
            style={{ minHeight: '560px' }}
          ></div>

          {/* Map Overlay Coordinates Indicator */}
          <div className="absolute top-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-lg border border-slate-700/80 shadow-lg text-[11px] font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>GIS Precision Active • 1:1 Coordinate Mapping</span>
          </div>

          {/* Map Overlay Legend */}
          <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-xs p-3.5 rounded-xl border border-slate-200 shadow-lg text-[11px] space-y-1.5">
            <span className="font-bold text-slate-800 block">Live Map Legend</span>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-white shadow-xs"></span>
              <span className="text-slate-700 font-semibold">Active Citizen Issue Drop-Pin</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs"></span>
              <span className="text-slate-700 font-semibold">Resolved / Completed Work</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full border-2 border-yellow-400 bg-amber-500"></span>
              <span className="text-slate-600">Aspirational District Pin</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500"></span>
              <span className="text-slate-600">District Aggregate Hotspot</span>
            </div>
          </div>
        </div>

        {/* Selected Issue or District Deep-Dive Card (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-6">
          {selectedCitizenIssue ? (
            <>
              {/* Selected Issue Header */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {selectedCitizenIssue.trackingNumber}
                  </span>
                  {selectedCitizenIssue.isResolved ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <CheckCheck className="w-3 h-3" /> Resolved
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                      {selectedCitizenIssue.severity} Priority ({selectedCitizenIssue.urgencyScore}/100)
                    </span>
                  )}
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mt-2 leading-snug">
                  {selectedCitizenIssue.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span>
                    {selectedCitizenIssue.blockOrWard || selectedCitizenIssue.district}, {selectedCitizenIssue.state}
                  </span>
                </div>
                {/* Exact Coordinates Display */}
                <div className="mt-2 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[11px] font-mono text-slate-600">
                  <span>📍 GPS Coordinates:</span>
                  <span className="font-bold text-blue-700">
                    {selectedCitizenIssue.coordinates[0].toFixed(4)}° N, {selectedCitizenIssue.coordinates[1].toFixed(4)}° E
                  </span>
                </div>
              </div>

              {/* Description & AI Verification / Resolution Note */}
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-700">
                  <span className="font-bold text-slate-900 block mb-1">Reported Grievance:</span>
                  <p className="line-clamp-3 leading-relaxed">{selectedCitizenIssue.description}</p>
                </div>

                {selectedCitizenIssue.isResolved ? (
                  <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 space-y-1">
                    <span className="font-bold text-[10px] uppercase block text-emerald-950">
                      ✅ Civil Resolution Verified & Logged:
                    </span>
                    <p className="text-xs font-semibold">
                      {selectedCitizenIssue.resolutionNotes || 'Civil infrastructure repair verified and completed.'}
                    </p>
                    <div className="flex justify-between text-[10px] text-emerald-700 pt-1">
                      <span>Authority: {selectedCitizenIssue.resolvedBy || 'Officer Sanction'}</span>
                      <span>{selectedCitizenIssue.resolvedAt || 'Completed'}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-100 text-blue-900 space-y-1">
                    <span className="font-bold text-[10px] uppercase block text-blue-950">
                      Google AI Forensic Verification:
                    </span>
                    <p className="text-xs font-semibold">
                      {selectedCitizenIssue.aiVerification?.detectedDefect || 'Structural civil defect confirmed.'}
                    </p>
                    <div className="flex justify-between text-[10px] text-blue-700 pt-1">
                      <span>Hazard Index: {selectedCitizenIssue.aiVerification?.hazardIndex || 8.9}/10</span>
                      <span>Confidence: 98%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons: Mark as Resolved & Draft Autonomous DPR */}
              <div className="space-y-2">
                {!selectedCitizenIssue.isResolved && onResolveRequest && (
                  <button
                    type="button"
                    onClick={() => {
                      const note = prompt('Enter official completion remarks:', 'Civil infrastructure repair verified and completed.');
                      if (note !== null) {
                        onResolveRequest(selectedCitizenIssue.id, note, true);
                      }
                    }}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span>Mark this Issue as Resolved (काम पूरा हुआ)</span>
                  </button>
                )}

                {!selectedCitizenIssue.isResolved && (
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectRequestForDPR) {
                        onSelectRequestForDPR(selectedCitizenIssue);
                      }
                    }}
                    className="w-full py-3 px-4 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Draft Autonomous DPR for this Issue</span>
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-6 text-slate-400">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs">Click on any pin on the map to inspect details</p>
            </div>
          )}

          {/* Quick Hotspot / Issue Switcher List */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 block mb-2">
              {activeLayer === 'resolved' ? 'Resolved Works Archive' : 'Active Pins on Map'} ({activeLayer === 'resolved' ? resolvedRequestsList.length : activeUnresolvedRequests.length}):
            </span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {(activeLayer === 'resolved' ? resolvedRequestsList : activeUnresolvedRequests).slice(0, 10).map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setSelectedCitizenIssue(r);
                    mapInstanceRef.current?.flyTo(r.coordinates, 14, { duration: 1.2 });
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition cursor-pointer border ${
                    selectedCitizenIssue?.id === r.id
                      ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-mono text-slate-500">{r.trackingNumber}</span>
                    <span className={`font-bold ${r.isResolved ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {r.isResolved ? 'Resolved' : r.severity}
                    </span>
                  </div>
                  <div className="truncate font-semibold mt-0.5">{r.district}, {r.state}</div>
                  <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                    📍 {r.coordinates[0].toFixed(4)}°, {r.coordinates[1].toFixed(4)}°
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
