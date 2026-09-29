import React, { useState } from 'react';
import { DetailedProjectReport, IssueCategory } from '../types';
import { INITIAL_DPRS, DISTRICT_METRICS } from '../data/mockData';
import { generateAiDpr, askPolicyCopilot } from '../services/gemini';
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Download, 
  Send, 
  Bot, 
  DollarSign, 
  Users, 
  Clock, 
  Building, 
  TrendingUp,
  RefreshCw,
  Printer,
  Share2,
  ChevronRight,
  ShieldCheck,
  IndianRupee,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DprEngineProps {
  dprs: DetailedProjectReport[];
  onAddDpr: (dpr: DetailedProjectReport) => void;
  onUpdateDprStatus: (id: string, newStatus: DetailedProjectReport['status']) => void;
  preselectedHotspot?: {
    district: string;
    state: string;
    category?: IssueCategory;
  } | null;
}

export const DprEngine: React.FC<DprEngineProps> = ({
  dprs,
  onAddDpr,
  onUpdateDprStatus,
  preselectedHotspot
}) => {
  const [selectedDpr, setSelectedDpr] = useState<DetailedProjectReport>(dprs[0] || INITIAL_DPRS[0]);

  // Generator form state
  const [district, setDistrict] = useState(preselectedHotspot?.district || 'Bahraich');
  const [stateName, setStateName] = useState(preselectedHotspot?.state || 'Uttar Pradesh');
  const [category, setCategory] = useState<IssueCategory>(
    preselectedHotspot?.category || 'Piped Water / Jal Jeevan Mission'
  );
  const [hotspotLocation, setHotspotLocation] = useState('Nanpara and Jarwal Rural Blocks');
  const [citizenPingsCount, setCitizenPingsCount] = useState(384);
  const [beneficiariesEstimate, setBeneficiariesEstimate] = useState(42000);
  const [isGenerating, setIsGenerating] = useState(false);

  // Copilot chat state
  const [chatMessages, setChatMessages] = useState<
    { role: 'user' | 'assistant'; content: string }[]
  >([
    {
      role: 'assistant',
      content: `Namaste! I am **Shasan-Mitra (शासन-मित्र)**, your AI Policy & Infrastructure Strategy Copilot. I analyze live citizen demand hotspots alongside NITI Aayog Aspirational District indices and PM Gati Shakti GIS layers. How may I assist your policy or budgetary deliberations today?`
    }
  ]);
  const [copilotInput, setCopilotInput] = useState('');
  const [isCopilotThinking, setIsCopilotThinking] = useState(false);

  // Handle autonomous DPR generation
  const handleGenerateDpr = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const generated = await generateAiDpr({
        district,
        state: stateName,
        category,
        hotspotLocation,
        citizenPingsCount,
        beneficiariesEstimate
      });
      onAddDpr(generated);
      setSelectedDpr(generated);

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Project Sanction Action
  const handleSanctionProject = (dprId: string) => {
    onUpdateDprStatus(dprId, 'Cabinet Sanctioned');
    setSelectedDpr((prev) => (prev.id === dprId ? { ...prev, status: 'Cabinet Sanctioned' } : prev));
    try {
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 }
      });
    } catch (e) {}
  };

  // Copilot send message
  const handleSendCopilot = async (overridePrompt?: string) => {
    const textToSend = overridePrompt || copilotInput;
    if (!textToSend.trim()) return;

    const newHistory = [...chatMessages, { role: 'user' as const, content: textToSend }];
    setChatMessages(newHistory);
    if (!overridePrompt) setCopilotInput('');
    setIsCopilotThinking(true);

    try {
      const reply = await askPolicyCopilot(newHistory, textToSend);
      setChatMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCopilotThinking(false);
    }
  };

  const handlePrintDpr = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 text-white rounded-2xl p-6 sm:p-8 border border-indigo-800/40 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Autonomous Detailed Project Report (DPR) Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              AI Project Allocation & DPR Studio
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
              Transforms thousands of raw citizen voice complaints into legally compliant, CPWD & Ministry-grade Detailed Project Reports in seconds — aligning budget allocation with actual on-ground human need.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="bg-indigo-900/60 p-4 rounded-xl border border-indigo-700/50 text-center">
              <span className="text-[10px] uppercase font-bold text-indigo-300 block">
                Total Sanctioned DPRs
              </span>
              <span className="text-2xl font-black text-amber-300">₹1,845.8 Cr</span>
            </div>
            <div className="bg-indigo-900/60 p-4 rounded-xl border border-indigo-700/50 text-center">
              <span className="text-[10px] uppercase font-bold text-indigo-300 block">
                Average Prep Time
              </span>
              <span className="text-2xl font-black text-emerald-400">&lt; 48 Hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Generator Section + Active DPR List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Autonomous DPR Formulator (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>Autonomously Formulate New DPR</span>
            </h3>
            <p className="text-xs text-slate-500">
              Uses Gemini 3.8 Flash to synthesize citizen pings with Gati Shakti GIS layers
            </p>
          </div>

          <form onSubmit={handleGenerateDpr} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">State:</label>
                <select
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white focus:border-indigo-500"
                >
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Odisha">Odisha</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Assam">Assam</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">District:</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Bahraich"
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Infrastructure Sector:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as IssueCategory)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white focus:border-indigo-500"
              >
                <option value="Piped Water / Jal Jeevan Mission">Piped Water / Jal Jeevan Mission</option>
                <option value="Rural & State Roads / PMGSY">Rural & State Roads / PMGSY</option>
                <option value="Primary Healthcare / Ayushman Bharat">Primary Healthcare / Ayushman Bharat</option>
                <option value="School Infrastructure / Samagra Shiksha">School Infrastructure / Samagra Shiksha</option>
                <option value="Power & Solar / PM Surya Ghar">Power & Solar / PM Surya Ghar</option>
                <option value="Sanitation & Solid Waste / Swachh Bharat">Sanitation & Solid Waste / Swachh Bharat</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Hotspot / Habitations:</label>
              <input
                type="text"
                value={hotspotLocation}
                onChange={(e) => setHotspotLocation(e.target.value)}
                placeholder="e.g. Nanpara and Jarwal Block clusters"
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Citizen Records Aggregated:
                </label>
                <input
                  type="number"
                  value={citizenPingsCount}
                  onChange={(e) => setCitizenPingsCount(Number(e.target.value))}
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Target Beneficiaries (Citizens):
                </label>
                <input
                  type="number"
                  value={beneficiariesEstimate}
                  onChange={(e) => setBeneficiariesEstimate(Number(e.target.value))}
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Synthesizing Engineering Specifications with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Formulate Detailed Project Report (1-Click)</span>
                </>
              )}
            </button>
          </form>

          {/* List of Available DPRs */}
          <div className="border-t border-slate-100 pt-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase block mb-3">
              Available Sanctionable Proposals ({dprs.length}):
            </span>
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {dprs.map((d) => (
                <div
                  key={d.id}
                  onClick={() => setSelectedDpr(d)}
                  className={`p-3 rounded-xl border transition cursor-pointer text-xs ${
                    selectedDpr.id === d.id
                      ? 'border-indigo-500 bg-indigo-50/70 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-indigo-900 text-[10px]">
                      {d.dprNumber}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        d.status === 'Cabinet Sanctioned'
                          ? 'bg-emerald-100 text-emerald-800'
                          : d.status === 'Tender Floating'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {d.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 line-clamp-1">{d.title}</h4>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
                    <span>
                      {d.district}, {d.state}
                    </span>
                    <strong className="text-slate-800 font-mono font-bold">
                      ₹{d.estimatedBudgetINR_Cr} Cr
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Full Official DPR Document Viewer (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-300 shadow-xl overflow-hidden print:border-none">
          {/* Government Letterhead Header */}
          <div className="bg-slate-900 text-white p-6 border-b-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-amber-400 text-lg">
                  🏛️
                </div>
                <div>
                  <span className="text-[10px] text-orange-400 uppercase font-bold tracking-widest block">
                    GOVERNMENT OF INDIA • NITI AAYOG / GATI SHAKTI
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    Official Detailed Project Report (DPR)
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintDpr}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 border border-slate-700 transition cursor-pointer"
                  title="Print or Save PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Print / PDF</span>
                </button>
              </div>
            </div>
          </div>

          {/* Document Content */}
          <div className="p-6 sm:p-8 space-y-6 text-slate-800 text-xs sm:text-sm">
            {/* Meta Table */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">DPR Reference:</span>
                <span className="font-mono font-bold text-slate-800">{selectedDpr.dprNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Location:</span>
                <span className="font-semibold text-slate-800">{selectedDpr.district}, {selectedDpr.state}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Estimated Cost:</span>
                <span className="font-mono font-extrabold text-emerald-700">₹{selectedDpr.estimatedBudgetINR_Cr} Crore</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Beneficiaries:</span>
                <span className="font-semibold text-slate-800">{selectedDpr.targetBeneficiaries.toLocaleString()} Citizens</span>
              </div>
            </div>

            {/* Document Title */}
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 border-b pb-2">
                {selectedDpr.title}
              </h3>
            </div>

            {/* Executive Summary */}
            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider flex items-center gap-1.5 text-indigo-900">
                <FileText className="w-3.5 h-3.5" />
                1. Executive Summary & Demand Rationale
              </h4>
              <p className="text-slate-600 leading-relaxed text-xs sm:text-sm bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                {selectedDpr.executiveSummary}
              </p>
            </div>

            {/* Engineering Scope */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider flex items-center gap-1.5 text-indigo-900">
                <Building className="w-3.5 h-3.5" />
                2. Civil & Infrastructure Engineering Scope
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm">
                {selectedDpr.civicEngineeringScope.map((scope, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 shrink-0"></span>
                    <span className="text-slate-700">{scope}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Budget Breakdown Table */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider flex items-center gap-1.5 text-indigo-900">
                <DollarSign className="w-3.5 h-3.5" />
                3. Financial Bill of Quantities (BOQ) Breakdown
              </h4>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200 text-xs">
                  <thead className="bg-slate-100 font-bold text-slate-700">
                    <tr>
                      <th className="py-2 px-3 text-left">Expenditure Head</th>
                      <th className="py-2 px-3 text-right">Cost (₹ Lakhs)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedDpr.budgetBreakdown.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2 px-3 text-slate-700">{item.item}</td>
                        <td className="py-2 px-3 text-right font-mono font-semibold text-slate-900">
                          ₹{item.costINR_Lakhs.toLocaleString()} L
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50 font-bold text-slate-900">
                      <td className="py-2 px-3">Total Estimated Outlay:</td>
                      <td className="py-2 px-3 text-right text-emerald-700 font-mono text-sm">
                        ₹{selectedDpr.estimatedBudgetINR_Cr} Crore
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-slate-500">
                Central Share: {selectedDpr.centralSharePercentage}% (₹
                {((selectedDpr.estimatedBudgetINR_Cr * selectedDpr.centralSharePercentage) / 100).toFixed(2)} Cr) | State Share: {selectedDpr.stateSharePercentage}% (₹
                {((selectedDpr.estimatedBudgetINR_Cr * selectedDpr.stateSharePercentage) / 100).toFixed(2)} Cr)
              </p>
            </div>

            {/* Gati Shakti Alignment & Milestones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-1">
                <span className="font-bold text-indigo-950 uppercase text-[10px] block">
                  PM Gati Shakti Master Plan Alignment:
                </span>
                <p className="text-indigo-900 text-xs leading-relaxed">
                  {selectedDpr.gatiShaktiIntegration}
                </p>
              </div>

              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 space-y-1">
                <span className="font-bold text-amber-950 uppercase text-[10px] block">
                  AI Policy Recommendation:
                </span>
                <p className="text-amber-900 text-xs leading-relaxed font-semibold">
                  {selectedDpr.aiPolicyRecommendation}
                </p>
              </div>
            </div>

            {/* Sanction CTA Bar */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Current Status:</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    selectedDpr.status === 'Cabinet Sanctioned'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {selectedDpr.status}
                </span>
              </div>

              {selectedDpr.status !== 'Cabinet Sanctioned' && (
                <button
                  type="button"
                  onClick={() => handleSanctionProject(selectedDpr.id)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Sanction Budget & Issue Administrative Approval</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Shasan-Mitra AI Policy Copilot Chat Drawer */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Shasan-Mitra (शासन-मित्र) • AI Policy Copilot
              </h3>
              <p className="text-xs text-slate-500">
                Ask policy questions, simulate budget transfers, and analyze district deficit correlations
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
            Gemini 3.8 Reasoning
          </span>
        </div>

        {/* Suggested Prompts */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="text-slate-400 font-semibold self-center mr-1">Suggestions:</span>
          <button
            type="button"
            onClick={() =>
              handleSendCopilot(
                'Which districts in Uttar Pradesh have critical drinking water deficits exceeding 40% with high citizen distress?'
              )
            }
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition cursor-pointer"
          >
            💧 UP Water Deficits
          </button>
          <button
            type="button"
            onClick={() =>
              handleSendCopilot(
                'Simulate a ₹100 Crore reallocation under PM Gati Shakti for eastern tribal districts.'
              )
            }
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition cursor-pointer"
          >
            💰 ₹100 Cr Budget Simulation
          </button>
          <button
            type="button"
            onClick={() =>
              handleSendCopilot(
                'Draft a Cabinet briefing note for the Bahraich drinking water project.'
              )
            }
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition cursor-pointer"
          >
            📝 Draft Cabinet Note
          </button>
        </div>

        {/* Chat History Box */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 max-h-80 overflow-y-auto space-y-3 text-xs sm:text-sm">
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`p-3.5 rounded-xl ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white ml-8 shadow-xs'
                  : 'bg-white text-slate-800 mr-8 border border-slate-200 shadow-xs'
              }`}
            >
              <div className="font-bold text-[10px] mb-1 opacity-70">
                {msg.role === 'user' ? 'Policy Officer' : 'Shasan-Mitra AI'}
              </div>
              <div className="whitespace-pre-line leading-relaxed">{msg.content}</div>
            </div>
          ))}
          {isCopilotThinking && (
            <div className="p-3 bg-white text-slate-600 rounded-xl border border-slate-200 flex items-center gap-2 text-xs">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
              <span>Shasan-Mitra is consulting Gati Shakti layers and NITI Aayog indicators...</span>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={copilotInput}
            onChange={(e) => setCopilotInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendCopilot()}
            placeholder="Type a policy query or scenario (e.g. 'How does Dumka compare to Bahraich in healthcare access?')..."
            className="flex-1 text-xs sm:text-sm rounded-xl border border-slate-300 px-3.5 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
          <button
            type="button"
            onClick={() => handleSendCopilot()}
            disabled={isCopilotThinking || !copilotInput.trim()}
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Consult</span>
          </button>
        </div>
      </div>
    </div>
  );
};
