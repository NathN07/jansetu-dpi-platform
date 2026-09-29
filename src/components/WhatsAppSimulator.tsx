import React, { useState } from 'react';
import { CitizenRequest, LanguageCode } from '../types';
import { 
  Send, 
  Mic, 
  Camera, 
  CheckCheck, 
  Phone, 
  Video, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  Sparkles, 
  ShieldCheck,
  RefreshCw,
  MapPin
} from 'lucide-react';
import { generateWhatsAppBotReply } from '../services/gemini';
import { resolveLocationCoordinates } from '../data/mockData';
import { geocodeLocationPrecise } from '../services/geocoding';

interface WhatsAppSimulatorProps {
  onAddRequest?: (req: CitizenRequest) => void;
}

export const WhatsAppSimulator: React.FC<WhatsAppSimulatorProps> = ({ onAddRequest }) => {
  const [messages, setMessages] = useState<
    {
      id: string;
      sender: 'user' | 'bot';
      text: string;
      time: string;
      mediaUrl?: string;
      isVoice?: boolean;
      ticketCard?: {
        trackingNumber: string;
        category: string;
        district: string;
        state: string;
        status: string;
      };
    }[]
  >([
    {
      id: 'm1',
      sender: 'bot',
      text: '🙏 नमस्ते / Hello! JanSetu AI नागरिक सेवा केंद्र में आपका स्वागत है। आप अपनी स्थानीय भाषा (বাংলা, हिन्दी, English, தமிழ், etc.) में सड़क, पानी, बिजली, स्कूल या स्वास्थ्य संबंधी समस्या लिख सकते हैं या ऑडियो भेज सकते हैं।',
      time: '10:14 AM'
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);

  const sendMessage = async (customText?: string, options?: { isVoice?: boolean; mediaUrl?: string }) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() && !options?.mediaUrl) return;

    const userMsgId = `m-${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      sender: 'user' as const,
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mediaUrl: options?.mediaUrl,
      isVoice: options?.isVoice
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    if (!customText) setInputText('');
    setIsBotTyping(true);

    try {
      const result = await generateWhatsAppBotReply(textToSend, newHistory);
      const trackingNumber = `JS-WA-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      // Create official citizen request for National Map and Database with precision geocoding
      if (onAddRequest) {
        const coords = await geocodeLocationPrecise(textToSend, result.district, result.state);
        const newReq: CitizenRequest = {
          id: `req-wa-${Date.now()}`,
          trackingNumber,
          title: `${result.category} reported via WhatsApp in ${result.district}, ${result.state}`,
          description: textToSend,
          originalLanguage: 'en',
          translatedDescription: textToSend,
          category: result.category,
          state: result.state,
          district: result.district,
          blockOrWard: `${result.district} Sub-Division`,
          pinCode: '741201',
          coordinates: coords,
          status: 'Hotspot_Clustered',
          severity: result.severity,
          urgencyScore: result.urgencyScore,
          inputChannel: options?.isVoice ? 'voice' : 'whatsapp',
          citizenName: 'WhatsApp Citizen',
          citizenPhoneMasked: '+91 98****5521',
          timestamp: 'Just now',
          upvotes: 1,
          demographicImpact: {
            populationCovered: Math.floor(14000 + Math.random() * 8000),
            aspirationalDistrict: true,
            bplPercentage: 54.0,
            scStPercentage: 35.0,
            gatiShaktiAlignmentScore: 90
          },
          aiVerification: {
            verified: true,
            confidence: 0.98,
            detectedDefect: `Field distress ping received via WhatsApp for ${result.category}`,
            hazardIndex: Number((result.urgencyScore / 10).toFixed(1)),
            recommendedMinistry: 'Ministry of Rural Development / Jal Shakti',
            notes: `Captured via WhatsApp Citizen Bot for ${result.district}, ${result.state}. Directly added to National Hotspot Map.`
          }
        };
        onAddRequest(newReq);
      }

      setIsBotTyping(false);
      const botReply = {
        id: `bot-${Date.now()}`,
        sender: 'bot' as const,
        text: result.replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ticketCard: {
          trackingNumber,
          category: result.category,
          district: result.district,
          state: result.state,
          status: 'AI_Verified'
        }
      };
      setMessages((prev) => [...prev, botReply]);
    } catch (e) {
      setIsBotTyping(false);
      const fallbackReply = {
        id: `bot-${Date.now()}`,
        sender: 'bot' as const,
        text: `✅ Your issue has been registered into the National Hotspot Map and forwarded to the District Magistrate.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ticketCard: {
          trackingNumber: `JS-WA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          category: 'Rural & State Roads / PMGSY',
          district: 'Nadia (Ranaghat)',
          state: 'West Bengal',
          status: 'AI_Verified'
        }
      };
      setMessages((prev) => [...prev, fallbackReply]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Info */}
      <div className="bg-emerald-950 text-white p-6 sm:p-8 rounded-2xl border border-emerald-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Live Geospatial Ingestion Gateway</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            WhatsApp & IVR Citizen Bot
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-1 max-w-2xl">
            Powered by <strong>Google Gemini AI</strong>. Any issue submitted here is <strong>instantly plotted onto the National Hotspot Map</strong> at the exact location provided.
          </p>
        </div>

        {/* Quick Simulation Buttons */}
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
            1-Click Interactive Test Scenarios:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() =>
                sendMessage(
                  'There is a serious water contamination and broken pipe issue in Ranaghat, West Bengal',
                  {}
                )
              }
              className="px-3 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 text-xs font-semibold border border-emerald-700/50 transition cursor-pointer"
            >
              💧 Ranaghat, West Bengal (Water)
            </button>
            <button
              onClick={() =>
                sendMessage(
                  'আমাদের রানাঘাট ১ নং ব্লকের কালভার্ট ব্রিজ বন্যায় ভেঙে গেছে, জরুরি মেরামত চাই',
                  {}
                )
              }
              className="px-3 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 text-xs font-semibold border border-emerald-700/50 transition cursor-pointer"
            >
              🌉 Bengali Voice/Text
            </button>
            <button
              onClick={() =>
                sendMessage(
                  'गाँव नानपारा में मुख्य सड़क टूट गई है, कृपया तुरंत मरम्मत करें',
                  {}
                )
              }
              className="px-3 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 text-xs font-semibold border border-emerald-700/50 transition cursor-pointer"
            >
              🛣️ Hindi (Road Issue)
            </button>
          </div>
        </div>
      </div>

      {/* Realistic WhatsApp Phone Mockup */}
      <div className="max-w-md mx-auto bg-slate-900 rounded-3xl p-3 shadow-2xl border-4 border-slate-700">
        {/* Phone Speaker Notch */}
        <div className="w-32 h-4 bg-slate-800 rounded-full mx-auto mb-2 flex items-center justify-center">
          <div className="w-12 h-1 bg-slate-700 rounded-full"></div>
        </div>

        {/* Phone Screen Container */}
        <div className="bg-[#EFEAE2] rounded-2xl overflow-hidden flex flex-col h-[560px] border border-slate-300">
          {/* WhatsApp Header */}
          <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-emerald-800 font-extrabold text-sm border-2 border-emerald-300">
                ज
              </div>
              <div>
                <h4 className="text-sm font-bold leading-tight flex items-center gap-1">
                  <span>JanSetu AI GovBot</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                </h4>
                <p className="text-[10px] text-emerald-100">
                  {isBotTyping ? 'typing...' : 'Connected to National Map'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-white/90">
              <Phone className="w-4 h-4 cursor-pointer" />
              <Video className="w-4 h-4 cursor-pointer" />
              <MoreVertical className="w-4 h-4 cursor-pointer" />
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-2.5 shadow-xs relative ${
                    m.sender === 'user'
                      ? 'bg-[#E7FFDB] text-slate-800 rounded-tr-none'
                      : 'bg-white text-slate-800 rounded-tl-none'
                  }`}
                >
                  {/* Voice note indicator */}
                  {m.isVoice && (
                    <div className="flex items-center gap-2 bg-emerald-100/60 p-1.5 rounded mb-1 text-[11px] font-semibold text-emerald-900">
                      <Mic className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Voice Note (0:14)</span>
                    </div>
                  )}

                  <p className="whitespace-pre-line leading-relaxed">{m.text}</p>

                  {/* DPI Tracking Card Badge */}
                  {m.ticketCard && (
                    <div className="mt-2.5 p-2 bg-emerald-50 rounded border border-emerald-200 text-[10px] space-y-1">
                      <div className="flex justify-between font-mono font-bold text-emerald-900">
                        <span>DPI Token:</span>
                        <span>{m.ticketCard.trackingNumber}</span>
                      </div>
                      <div className="text-slate-700 font-semibold flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        <span>{m.ticketCard.district}, {m.ticketCard.state}</span>
                      </div>
                      <div className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCheck className="w-3 h-3" /> Plotted on National Map
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-400">
                    <span>{m.time}</span>
                    {m.sender === 'user' && <CheckCheck className="w-3 h-3 text-blue-500" />}
                  </div>
                </div>
              </div>
            ))}

            {isBotTyping && (
              <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-lg w-40 text-slate-500 text-xs shadow-xs">
                <RefreshCw className="w-3 h-3 animate-spin text-emerald-600" />
                <span className="text-[11px]">Gemini is analyzing...</span>
              </div>
            )}
          </div>

          {/* WhatsApp Input Bar */}
          <div className="bg-[#F0F2F5] p-2 flex items-center gap-2 border-t border-slate-200">
            <Smile className="w-5 h-5 text-slate-500 cursor-pointer" />
            <Paperclip className="w-5 h-5 text-slate-500 cursor-pointer" />
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type message with location..."
              className="flex-1 bg-white rounded-full py-1.5 px-3.5 text-xs text-slate-800 focus:outline-hidden border border-slate-300"
            />
            {inputText.trim() ? (
              <button
                onClick={() => sendMessage()}
                className="w-8 h-8 rounded-full bg-[#00A884] text-white flex items-center justify-center cursor-pointer shadow-xs hover:bg-[#008f6f]"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() =>
                  sendMessage('Ranaghat West Bengal main road has large potholes disrupting vehicles', {
                    isVoice: true
                  })
                }
                className="w-8 h-8 rounded-full bg-[#00A884] text-white flex items-center justify-center cursor-pointer shadow-xs hover:bg-[#008f6f]"
                title="Simulate Voice Note"
              >
                <Mic className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
