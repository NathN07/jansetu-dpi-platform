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
  Maximize2
} from 'lucide-react';
import L from 'leaflet';

interface HotspotMapProps {
  requests: CitizenRequest[];
  onSelectDistrictForDPR: (district: DistrictMetric) => void;
}

export const HotspotMap: React.FC<HotspotMapProps> = ({
  requests,
  onSelectDistrictForDPR
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  const [selectedDistrict, setSelectedDistrict] = useState<DistrictMetric>(DISTRICT_METRICS[0]);
  const [activeLayer, setActiveLayer] = useState<'all' | 'aspirational' | 'gatishakti' | 'water' | 'roads'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Centered on Central/Northern India
    const map = L.map(mapContainerRef.current, {
      center: [22.5937, 78.9629],
      zoom: 5,
      minZoom: 4,
      maxZoom: 10,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors | JanSetu DPI Master Plan',
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

    DISTRICT_METRICS.forEach((dist) => {
      // Filter logic
      if (activeLayer === 'aspirational' && !dist.isAspirational) return;
      if (activeLayer === 'gatishakti' && dist.gatiShaktiGapScore < 80) return;
      if (activeLayer === 'water' && !dist.topSector.includes('Water')) return;
      if (activeLayer === 'roads' && !dist.topSector.includes('Roads')) return;

      const isSelected = selectedDistrict.id === dist.id;
      const isAspirational = dist.isAspirational;

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
          ${
            dist.compositeDeficitScore > 85
              ? `<div style="
                  position: absolute;
                  inset: -6px;
                  border-radius: 50%;
                  border: 2px solid #ef4444;
                  animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
                "></div>`
              : ''
          }
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
          <span>${dist.totalRequests} citizen demands</span>
        </div>
      `);

      markersRef.current?.addLayer(marker);
    });
  }, [activeLayer, selectedDistrict]);

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
            <span>Shasan-Drishti (शासन-दृष्टि) • Geospatial Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            National Infrastructure Demand Hotspots
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Synthesizing 284,190+ citizen voice/photo reports with NITI Aayog Aspirational District Indicators & PM Gati Shakti National Master Plan.
          </p>
        </div>

        {/* Real-time stats widgets */}
        <div className="flex flex-wrap gap-3">
          <div className="bg-slate-800/80 px-3.5 py-2.5 rounded-xl border border-slate-700/60">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Active Hotspots</span>
            <span className="text-lg font-black text-rose-400">1,420</span>
          </div>
          <div className="bg-slate-800/80 px-3.5 py-2.5 rounded-xl border border-slate-700/60">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Aspirational Dists</span>
            <span className="text-lg font-black text-amber-400">112</span>
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
            All Hotspots ({DISTRICT_METRICS.length})
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
            onClick={() => setActiveLayer('gatishakti')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
              activeLayer === 'gatishakti'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
            }`}
          >
            ⚡ Gati Shakti High Gaps
          </button>
          <button
            onClick={() => setActiveLayer('water')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeLayer === 'water'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            💧 Jal Jeevan Mission
          </button>
          <button
            onClick={() => setActiveLayer('roads')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeLayer === 'roads'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            🛣️ PMGSY Rural Roads
          </button>
        </div>

        {/* Quick Search */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search district, state, sector..."
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
            className="w-full h-[580px] z-10"
            style={{ minHeight: '520px' }}
          ></div>

          {/* Map Overlay Legend */}
          <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-slate-200 shadow-lg text-[11px] space-y-1.5">
            <span className="font-bold text-slate-800 block">Interactive Legend</span>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span className="text-slate-600">Critical Hotspot (Deficit &gt; 85)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500"></span>
              <span className="text-slate-600">High Deficit (Score 70 - 85)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full border-2 border-yellow-400 bg-amber-500"></span>
              <span className="text-slate-600">Aspirational District Pin</span>
            </div>
          </div>
        </div>

        {/* Selected District Deep-Dive Card (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-6">
          {/* Header */}
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                District Profile
              </span>
              {selectedDistrict.isAspirational && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  ★ NITI Aspirational District
                </span>
              )}
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1">
              {selectedDistrict.name}
            </h3>
            <p className="text-xs text-slate-500">
              State: <strong className="text-slate-700">{selectedDistrict.state}</strong>
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                Deficit Score
              </span>
              <span className="text-xl font-black text-rose-600">
                {selectedDistrict.compositeDeficitScore}/100
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Composite index</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                Gati Shakti Gap
              </span>
              <span className="text-xl font-black text-indigo-600">
                {selectedDistrict.gatiShaktiGapScore}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Infra deficit</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                Population
              </span>
              <span className="text-base font-extrabold text-slate-800">
                {(selectedDistrict.population / 100000).toFixed(1)} Lakhs
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Census aligned</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                Pending Critical
              </span>
              <span className="text-base font-extrabold text-amber-600">
                {selectedDistrict.criticalPending} Demands
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Of {selectedDistrict.totalRequests} total</span>
            </div>
          </div>

          {/* Top Sector & Funding Gaps */}
          <div className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100 text-xs">
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">
                Primary Distress Sector:
              </span>
              <span className="font-bold text-blue-900 text-sm">
                {selectedDistrict.topSector}
              </span>
            </div>

            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-slate-600 text-[11px]">
                <span>Allocated: ₹{selectedDistrict.fundsAllocatedINR_Cr} Cr</span>
                <span>Required: ₹{selectedDistrict.fundsRequiredINR_Cr} Cr</span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{
                    width: `${Math.round(
                      (selectedDistrict.fundsAllocatedINR_Cr / selectedDistrict.fundsRequiredINR_Cr) * 100
                    )}%`
                  }}
                ></div>
              </div>
              <span className="text-[10px] text-slate-500 block text-right font-medium">
                Funding Gap: ₹{(selectedDistrict.fundsRequiredINR_Cr - selectedDistrict.fundsAllocatedINR_Cr).toFixed(1)} Crore
              </span>
            </div>
          </div>

          {/* Action CTA: Generate Autonomous DPR */}
          <button
            type="button"
            onClick={() => onSelectDistrictForDPR(selectedDistrict)}
            className="w-full py-3 px-4 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Generate Autonomous AI DPR for {selectedDistrict.name}</span>
          </button>

          {/* Quick District Switcher List */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 block mb-2">
              Select Another District to Inspect:
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              {filteredDistricts.map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    setSelectedDistrict(d);
                    mapInstanceRef.current?.flyTo(d.coordinates, 7);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                    selectedDistrict.id === d.id
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {d.name} ({d.state})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
