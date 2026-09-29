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
  Flame
} from 'lucide-react';
import L from 'leaflet';

interface HotspotMapProps {
  requests: CitizenRequest[];
  onSelectDistrictForDPR: (district: DistrictMetric) => void;
  onSelectRequestForDPR?: (req: CitizenRequest) => void;
}

export const HotspotMap: React.FC<HotspotMapProps> = ({
  requests,
  onSelectDistrictForDPR,
  onSelectRequestForDPR
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  const [selectedDistrict, setSelectedDistrict] = useState<DistrictMetric>(DISTRICT_METRICS[0]);
  const [selectedCitizenIssue, setSelectedCitizenIssue] = useState<CitizenRequest | null>(requests[0] || null);
  const [activeLayer, setActiveLayer] = useState<'all' | 'live_issues' | 'aspirational' | 'gatishakti' | 'water' | 'roads'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Centered on India
    const map = L.map(mapContainerRef.current, {
      center: [22.8, 81.5],
      zoom: 5,
      minZoom: 4,
      maxZoom: 12,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors | JanSetu National GIS Engine',
      maxZoom: 18
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersRef.current = markersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update map markers when layer or requests change
  useEffect(() => {
    if (!markersRef.current || !mapInstanceRef.current) return;

    markersRef.current.clearLayers();

    // 1. Render Live Individual Citizen Grievances / Distress Hotspots
    if (activeLayer === 'all' || activeLayer === 'live_issues' || activeLayer === 'water' || activeLayer === 'roads') {
      requests.forEach((req) => {
        if (activeLayer === 'water' && !req.category.includes('Water')) return;
        if (activeLayer === 'roads' && !req.category.includes('Roads')) return;

        const isReqSelected = selectedCitizenIssue?.id === req.id;
        const iconEmoji = req.category.includes('Water')
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

        const issueHtml = `
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: ${isReqSelected ? '38px' : '30px'};
            height: ${isReqSelected ? '38px' : '30px'};
            border-radius: 50%;
            background: #ffffff;
            border: 3px solid ${req.severity === 'Critical' ? '#ef4444' : '#f97316'};
            box-shadow: 0 4px 14px rgba(0,0,0,0.35);
            font-size: ${isReqSelected ? '18px' : '14px'};
            cursor: pointer;
          ">
            <span>${iconEmoji}</span>
            <div style="
              position: absolute;
              inset: -5px;
              border-radius: 50%;
              border: 2px solid ${req.severity === 'Critical' ? '#ef4444' : '#f97316'};
              animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
          </div>
        `;

        const reqIcon = L.divIcon({
          className: 'custom-citizen-req-marker',
          html: issueHtml,
          iconSize: [34, 34],
          iconAnchor: [17, 17]
        });

        const reqMarker = L.marker(req.coordinates, { icon: reqIcon });

        reqMarker.on('click', () => {
          setSelectedCitizenIssue(req);
          mapInstanceRef.current?.flyTo(req.coordinates, 8, { duration: 1.0 });
        });

        reqMarker.bindTooltip(`
          <div style="font-family: sans-serif; font-size: 12px; padding: 4px;">
            <div style="font-weight: 800; color: #002663;">${req.title}</div>
            <div style="color: #475569; font-size: 11px;">📍 ${req.blockOrWard || req.district}, ${req.state}</div>
            <div style="color: #ef4444; font-weight: 700; margin-top: 2px;">⚡ Priority Score: ${req.urgencyScore}/100 (${req.severity})</div>
            <div style="color: #15803d; font-size: 10px; font-weight: 600;">Token: ${req.trackingNumber}</div>
          </div>
        `);

        markersRef.current?.addLayer(reqMarker);
      });
    }

    // 2. Render District Metrics Aggregate Pins
    if (activeLayer !== 'live_issues') {
      DISTRICT_METRICS.forEach((dist) => {
        if (activeLayer === 'aspirational' && !dist.isAspirational) return;
        if (activeLayer === 'gatishakti' && dist.gatiShaktiGapScore < 80) return;
        if (activeLayer === 'water' && !dist.topSector.includes('Water')) return;
        if (activeLayer === 'roads' && !dist.topSector.includes('Roads')) return;

        const isSelected = selectedDistrict.id === dist.id;

        const iconHtml = `
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: ${isSelected ? '36px' : '28px'};
            height: ${isSelected ? '36px' : '28px'};
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
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker(dist.coordinates, { icon: customIcon });

        marker.on('click', () => {
          setSelectedDistrict(dist);
          mapInstanceRef.current?.flyTo(dist.coordinates, 7, { duration: 1.2 });
        });

        marker.bindTooltip(`
          <div style="font-family: sans-serif; font-size: 12px; padding: 2px 4px;">
            <strong>${dist.name}, ${dist.state}</strong><br/>
            <span style="color: #ea580c;">Deficit Score: ${dist.compositeDeficitScore}/100</span><br/>
            <span>${dist.totalRequests} aggregated citizen demands</span>
          </div>
        `);

        markersRef.current?.addLayer(marker);
      });
    }
  }, [activeLayer, selectedDistrict, selectedCitizenIssue, requests]);

  const filteredDistricts = DISTRICT_METRICS.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.topSector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & KPI Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Shasan-Drishti (शासन-दृष्टि) • Real-Time Geospatial Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            National Infrastructure Demand Hotspots
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Live real-time aggregation across all 28 States & UTs. Whenever an issue is submitted via Voice, Photo, or WhatsApp, it immediately appears on the map at the exact location.
          </p>
        </div>

        {/* Real-time stats widgets */}
        <div className="flex flex-wrap gap-3">
          <div className="bg-slate-800/80 px-3.5 py-2.5 rounded-xl border border-slate-700/60">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Live Logged Issues</span>
            <span className="text-lg font-black text-rose-400">{requests.length} Pins</span>
          </div>
          <div className="bg-slate-800/80 px-3.5 py-2.5 rounded-xl border border-slate-700/60">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">All States Tracked</span>
            <span className="text-lg font-black text-amber-400">28 States + 8 UTs</span>
          </div>
          <div className="bg-slate-800/80 px-3.5 py-2.5 rounded-xl border border-slate-700/60">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Funding Gap</span>
            <span className="text-lg font-black text-emerald-400">₹982.5 Cr</span>
          </div>
        </div>
      </div>

      {/* Layer Filters & Search Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Layer Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
            <Layers className="w-3.5 h-3.5 text-slate-600" /> Map Layers:
          </span>
          <button
            onClick={() => setActiveLayer('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeLayer === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Hotspots & Issues ({DISTRICT_METRICS.length + requests.length})
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
            <span>Live Logged Issues ({requests.length})</span>
          </button>
          <button
            onClick={() => setActiveLayer('aspirational')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
              activeLayer === 'aspirational'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            ★ NITI Aspirational Districts
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
        </div>

        {/* Quick Search */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Ranaghat, state, district..."
            className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Main Map + District Inspection Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Leaflet Map Container (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden relative">
          <div
            ref={mapContainerRef}
            className="w-full h-[600px] z-10"
            style={{ minHeight: '540px' }}
          ></div>

          {/* Map Overlay Legend */}
          <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-xs p-3.5 rounded-xl border border-slate-200 shadow-lg text-[11px] space-y-1.5">
            <span className="font-bold text-slate-800 block">Live Map Legend</span>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
              <span className="text-slate-700 font-semibold">Live Citizen Issue Beacon</span>
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
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                    {selectedCitizenIssue.severity} Priority ({selectedCitizenIssue.urgencyScore}/100)
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mt-2 leading-snug">
                  {selectedCitizenIssue.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span>
                    {selectedCitizenIssue.blockOrWard || selectedCitizenIssue.district}, {selectedCitizenIssue.state}
                  </span>
                </div>
              </div>

              {/* Description & AI Verification */}
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-700">
                  <span className="font-bold text-slate-900 block mb-1">Reported Grievance:</span>
                  <p className="line-clamp-3 leading-relaxed">{selectedCitizenIssue.description}</p>
                </div>

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
              </div>

              {/* Action CTA: Generate Autonomous DPR */}
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
            </>
          ) : (
            <div className="text-center py-6 text-slate-400">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs">Click on any marker on the map to inspect details</p>
            </div>
          )}

          {/* Quick Hotspot / Issue Switcher List */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 block mb-2">
              Recently Logged Locations on Map ({requests.length}):
            </span>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {requests.slice(0, 8).map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setSelectedCitizenIssue(r);
                    mapInstanceRef.current?.flyTo(r.coordinates, 8, { duration: 1.0 });
                  }}
                  className={`w-full text-left p-2 rounded-lg text-xs transition cursor-pointer border ${
                    selectedCitizenIssue?.id === r.id
                      ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold'
                      : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-mono text-slate-500">{r.trackingNumber}</span>
                    <span className="font-bold text-rose-600">{r.severity}</span>
                  </div>
                  <div className="truncate font-semibold mt-0.5">{r.district}, {r.state}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
