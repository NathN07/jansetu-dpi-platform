import React, { useState } from 'react';
import { LanguageCode } from '../types';
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
  RefreshCw
} from 'lucide-react';
import { processCitizenVoiceOrText } from '../services/gemini';

export const WhatsAppSimulator: React.FC = () => {
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
      text: '🙏 नमस्ते! JanSetu AI नागरिक सेवा केंद्र में आपका स्वागत है। आप अपनी स्थानीय भाषा में सड़क, पानी, बिजली, स्कूल या स्वास्थ्य संबंधी समस्या लिख सकते हैं या बोलकर ऑडियो भेज सकते हैं।',
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

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputText('');
    setIsBotTyping(true);

    // Process with Gemini
    try {
      const result = await processCitizenVoiceOrText(textToSend);
      const trackingNumber = `JS-WA-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      setTimeout(() => {
        setIsBotTyping(false);
        const botReply = {
          id: `bot-${Date.now()}`,
          sender: 'bot' as const,
          text: `✅ आपकी शिकायत दर्ज कर ली गई है!\n\n📌 श्रेणी: ${result.category}\n📍 क्षेत्र: ${result.extractedLocation?.district || 'Bahraich'}, ${result.extractedLocation?.state || 'UP'}\n⚡ गंभीरता: ${result.severity} (आपातकालीन स्कोर: ${result.urgencyScore}/100)\n\nGoogle AI द्वारा इस मांग को राष्ट्रीय हॉटस्पॉट मैप में जोड़ दिया गया है और DPR निर्माण हेतु अग्रेषित किया गया है।`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          ticketCard: {
            trackingNumber,
            category: result.category,
            district: result.extractedLocation?.district || 'Bahraich',
            state: result.extractedLocation?.state || 'Uttar Pradesh',
            status: 'AI_Verified'
          }
        };
        setMessages((prev) => [...prev, botReply]);
      }, 1400);
    } catch (e) {
      setIsBotTyping(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Info */}
      <div className="bg-emerald-950 text-white p-6 sm:p-8 rounded-2xl border border-emerald-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Omnichannel DPI Ingestion</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            WhatsApp & IVR Voice Assistant Simulation
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-1 max-w-2xl">
            Test how a rural citizen with a low-cost mobile phone interacts in Hindi, Bengali, Tamil, or voice notes via WhatsApp or IVR hotline.
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
                  'हमारे गाँव में मुख्य पेयजल पाइपलाइन पिछले 10 दिनों से टूटी हुई है, कृपया तुरंत नया पाइप लगायें।',
                  {}
                )
              }
              className="px-3 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 text-xs font-semibold border border-emerald-700/50 transition cursor-pointer"
            >
              💧 Hindi Voice/Text (Water)
            </button>
            <button
              onClick={() =>
                sendMessage(
                  'झरीगाँव कल्वर्ट पोल भारी बारिश में ढह गया है, 6 गाँव का सम्पर्क टूट गया है।',
                  {}
                )
              }
              className="px-3 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 text-xs font-semibold border border-emerald-700/50 transition cursor-pointer"
            >
              🌉 Flood Culvert Collapse
            </button>
            <button
              onClick={() =>
                sendMessage('மருத்துவமனை மேற்கூரை இடிந்து விழுந்தது (Hospital roof damaged)', {})
              }
              className="px-3 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 text-xs font-semibold border border-emerald-700/50 transition cursor-pointer"
            >
              🏥 Tamil Health Grievance
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
                  {isBotTyping ? 'typing...' : 'Official DPI Citizen Line'}
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
                      <div className="text-slate-600">
                        {m.ticketCard.district}, {m.ticketCard.state}
                      </div>
                      <div className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCheck className="w-3 h-3" /> Clustered in National DPI
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
              <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-lg w-28 text-slate-500 text-xs shadow-xs">
                <RefreshCw className="w-3 h-3 animate-spin text-emerald-600" />
                <span className="text-[11px]">Processing...</span>
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
              placeholder="Type message in your language..."
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
                  sendMessage('गाँव में बिजली का ट्रांसफार्मर जल गया है (Voice Note)', {
                    isVoice: true
                  })
                }
                className="w-8 h-8 rounded-full bg-[#00A884] text-white flex items-center justify-center cursor-pointer shadow-xs hover:bg-[#008f6f]"
                title="Simulate Voice Recording"
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
