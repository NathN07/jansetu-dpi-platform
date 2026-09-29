import React, { useState } from 'react';
import { NATIONAL_STATS } from '../data/mockData';
import { 
  BarChart3, 
  Database, 
  Terminal, 
  Play, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  RefreshCw,
  Search,
  ExternalLink,
  Building2
} from 'lucide-react';

export const NationalAnalytics: React.FC = () => {
  const [activeSqlQuery, setActiveSqlQuery] = useState<string>(
    `SELECT 
  state, 
  COUNT(tracking_number) AS total_grievances,
  ROUND(AVG(urgency_score), 1) AS avg_urgency,
  COUNT(CASE WHEN aspirational_district = TRUE THEN 1 END) AS aspirational_pings,
  ROUND(SUM(estimated_cost_inr_cr), 2) AS total_dpr_capital_cr
FROM \`jansetu-dpi.telemetry.citizen_requests_v2\`
GROUP BY state
ORDER BY total_grievances DESC
LIMIT 6;`
  );

  const [isQueryExecuting, setIsQueryExecuting] = useState(false);
  const [queryExecutionTime, setQueryExecutionTime] = useState<number>(0.18);
  const [bytesScanned, setBytesScanned] = useState<string>('482.4 MB');

  // Query Results
  const [queryResults, setQueryResults] = useState([
    { state: 'Uttar Pradesh', total_grievances: 74210, avg_urgency: 88.4, aspirational_pings: 32410, total_dpr_capital_cr: 485.6 },
    { state: 'Bihar', total_grievances: 58940, avg_urgency: 86.1, aspirational_pings: 28900, total_dpr_capital_cr: 390.2 },
    { state: 'Jharkhand', total_grievances: 41200, avg_urgency: 91.2, aspirational_pings: 24100, total_dpr_capital_cr: 295.4 },
    { state: 'Odisha', total_grievances: 38450, avg_urgency: 89.5, aspirational_pings: 19800, total_dpr_capital_cr: 260.8 },
    { state: 'Maharashtra', total_grievances: 34100, avg_urgency: 81.3, aspirational_pings: 12400, total_dpr_capital_cr: 210.5 },
    { state: 'Tamil Nadu', total_grievances: 22100, avg_urgency: 77.8, aspirational_pings: 8900, total_dpr_capital_cr: 145.0 }
  ]);

  const handleRunQuery = () => {
    setIsQueryExecuting(true);
    setTimeout(() => {
      setIsQueryExecuting(false);
      setQueryExecutionTime(parseFloat((0.12 + Math.random() * 0.15).toFixed(2)));
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-400/30 mb-2">
            <Database className="w-3.5 h-3.5 text-purple-400" />
            <span>BigQuery & data.gov.in High-Throughput Analytics Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            National Telemetry & Public Finance Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Real-time aggregation across 28 Indian States & 8 Union Territories. Live reconciliation between citizen distress pings, ministry budgets, and PM Gati Shakti logistics master plans.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs text-emerald-400 font-mono font-bold">
            BigQuery Live Pipeline: Healthy (18k events/sec)
          </span>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
            Total Requests Processed
          </span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">
            {NATIONAL_STATS.totalRequestsProcessed.toLocaleString()}
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +24% month-over-month
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
            Vision AI Authenticated
          </span>
          <span className="text-2xl sm:text-3xl font-black text-blue-600 mt-1 block">
            {NATIONAL_STATS.verifiedByVisionAI.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-500 font-medium mt-1">
            Gemini 3.8 Multimodal
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
            Capital Outlay Formulated
          </span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1 block">
            ₹{NATIONAL_STATS.fundsRecommendedINR_Cr} Cr
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1">
            Across {NATIONAL_STATS.dprsGeneratedAutonomously} Autonomous DPRs
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
            Avg. Sanction Velocity
          </span>
          <span className="text-2xl sm:text-3xl font-black text-indigo-600 mt-1 block">
            {NATIONAL_STATS.avgResolutionTimeDays} Days
          </span>
          <span className="text-[11px] text-indigo-700 font-semibold mt-1">
            vs 270 days traditional baseline
          </span>
        </div>
      </div>

      {/* BigQuery Interactive Query Simulator */}
      <div className="bg-slate-950 text-white rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        {/* Terminal Header */}
        <div className="bg-slate-900 px-6 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-purple-400" />
            <span className="font-mono text-xs font-bold text-slate-200">
              BigQuery SQL Console (Live Dataset: `jansetu-dpi.telemetry`)
            </span>
          </div>

          <button
            onClick={handleRunQuery}
            disabled={isQueryExecuting}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition cursor-pointer disabled:opacity-50"
          >
            {isQueryExecuting ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>Execute SQL</span>
          </button>
        </div>

        {/* Code Editor */}
        <div className="p-4 bg-slate-950 font-mono text-xs text-purple-200">
          <textarea
            value={activeSqlQuery}
            onChange={(e) => setActiveSqlQuery(e.target.value)}
            rows={7}
            className="w-full bg-transparent border-none text-purple-300 focus:outline-hidden resize-none font-mono leading-relaxed"
          ></textarea>
        </div>

        {/* Query execution meta */}
        <div className="bg-slate-900/80 px-6 py-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Status: Query completed successfully</span>
          <span>Elapsed: {queryExecutionTime}s | Bytes billed: {bytesScanned}</span>
        </div>

        {/* Result Table */}
        <div className="p-4 overflow-x-auto bg-slate-900/40">
          <table className="min-w-full divide-y divide-slate-800 text-xs font-mono">
            <thead>
              <tr className="text-slate-400">
                <th className="py-2 px-3 text-left">state</th>
                <th className="py-2 px-3 text-right">total_grievances</th>
                <th className="py-2 px-3 text-right">avg_urgency</th>
                <th className="py-2 px-3 text-right">aspirational_pings</th>
                <th className="py-2 px-3 text-right">total_dpr_capital_cr</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {queryResults.map((r, i) => (
                <tr key={i} className="hover:bg-slate-800/40">
                  <td className="py-2 px-3 font-bold text-white">{r.state}</td>
                  <td className="py-2 px-3 text-right text-emerald-400 font-semibold">
                    {r.total_grievances.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right text-amber-400">{r.avg_urgency}</td>
                  <td className="py-2 px-3 text-right text-indigo-300">
                    {r.aspirational_pings.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right text-purple-300">₹{r.total_dpr_capital_cr} Cr</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sectoral Breakdown & Data.gov.in Synchronizer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sectoral Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <span>Infrastructure Sector Demand Distribution</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>💧 Piped Water / Jal Jeevan Mission</span>
                <span className="font-bold text-slate-900">34.2% (97,200 pings)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '34.2%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>🛣️ Rural & State Roads / PMGSY</span>
                <span className="font-bold text-slate-900">28.4% (80,700 pings)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '28.4%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>🏥 Primary Healthcare / Ayushman Bharat</span>
                <span className="font-bold text-slate-900">18.6% (52,800 pings)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '18.6%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>🏫 School Infrastructure / Samagra Shiksha</span>
                <span className="font-bold text-slate-900">11.1% (31,500 pings)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '11.1%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>⚡ Power & Solar / PM Surya Ghar</span>
                <span className="font-bold text-slate-900">7.7% (21,900 pings)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '7.7%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Open Data Synchronization Feeds */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Digital Public Good (DPG) Ecosystem Integrations</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">data.gov.in (Open Government Data)</span>
                <span className="text-slate-500 text-[11px]">Syncs Census demographics & district amenities</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono font-bold text-[10px] border border-emerald-200">
                ACTIVE • 100%
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">PM Gati Shakti National Master Plan</span>
                <span className="text-slate-500 text-[11px]">GIS Layer 14 (Rural Waterways & Arterials)</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono font-bold text-[10px] border border-emerald-200">
                ACTIVE • GIS SYNC
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">NITI Aayog Aspirational Districts Portal</span>
                <span className="text-slate-500 text-[11px]">Delta ranking indicators for 112 priority districts</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono font-bold text-[10px] border border-emerald-200">
                ACTIVE • REAL-TIME
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">GeM (Government e-Marketplace)</span>
                <span className="text-slate-500 text-[11px]">Automated tender requisition & schedule of rates</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono font-bold text-[10px] border border-emerald-200">
                CONNECTED
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
