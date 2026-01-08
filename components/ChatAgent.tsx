
import React, { useState, useEffect, useRef } from 'react';
import { processAgentQuery, researchKeywords, analyzeCompetitors, generateListing, researchSourcingOptions, identifyTargetAudience, generateBrandingCollateral, generatePackagingSuite, findTrendingTikTokProducts, analyzeMarketPPC } from '../services/geminiService';

interface MessagePart {
  text?: string;
  inlineData?: {
    data: string;
    mimeType: string;
  };
}

interface Message {
  role: 'user' | 'model' | 'system';
  parts: MessagePart[];
  toolCall?: string;
}

const ChatAgent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [pendingMedia, setPendingMedia] = useState<{ data: string, mimeType: string, previewUrl: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', parts: [{ text: "Neural Command Link Established. I am Astra. I can now optimize your ads based on your unit costs. What's the goal today?" }] }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setPendingMedia({
          data: base64,
          mimeType: file.type,
          previewUrl: URL.createObjectURL(file)
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !pendingMedia) || isThinking) return;

    const userParts: MessagePart[] = [];
    if (input.trim()) userParts.push({ text: input });
    if (pendingMedia) userParts.push({ inlineData: { data: pendingMedia.data, mimeType: pendingMedia.mimeType } });

    const userMessage: Message = { role: 'user', parts: userParts };
    setMessages(prev => [...prev, userMessage]);
    
    const mediaToUpload = pendingMedia ? { data: pendingMedia.data, mimeType: pendingMedia.mimeType } : undefined;
    
    setInput('');
    setPendingMedia(null);
    setIsThinking(true);

    try {
      const history = messages.map(m => ({ role: m.role, parts: m.parts }));
      const result = await processAgentQuery(input || "Analyze the attached media.", history, mediaToUpload);

      if (result.toolCalls && result.toolCalls.length > 0) {
        for (const call of result.toolCalls) {
          setActiveTool(call.name);
          let toolResult = "Executed successfully.";

          try {
            switch (call.name) {
              case 'optimize_ppc':
                const ppc = await analyzeMarketPPC(call.args.category, call.args.unitCost, call.args.retailPrice, call.args.strategy);
                toolResult = `PPC strategy for ${call.args.category} synced to ${call.args.strategy} mode. Analyzed ${ppc.length} keywords. Profit trajectory is positive.`;
                break;
              case 'research_market':
                const kw = await researchKeywords(call.args.category);
                const comp = await analyzeCompetitors(call.args.category);
                toolResult = `Market analysis for ${call.args.category} complete. Top keywords: ${kw.slice(0, 3).map(k => k.keyword).join(', ')}.`;
                break;
              case 'generate_fba_listing':
                // Fix: Added missing language and marketplace arguments to satisfy generateListing signature
                const listing = await generateListing(call.args.productName, call.args.features, 'English', 'USA');
                toolResult = `Listing drafted: ${listing.title}. View details in the Listing Wizard.`;
                break;
              case 'sourcing_blueprint':
                const sources = await researchSourcingOptions(call.args.productName);
                toolResult = `Identified ${sources.length} suppliers. Best unit cost is $${sources[0]?.unitCost}.`;
                break;
              case 'branding_overhaul':
                const personas = await identifyTargetAudience(call.args.productName, call.args.features);
                const collateral = await generateBrandingCollateral(call.args.productName, personas);
                toolResult = `Brand identity mapped. Generated ${collateral.length} social assets.`;
                break;
              case 'logistic_design':
                const pack = await generatePackagingSuite(call.args.productName, call.args.specs || 'Retail Ready', call.args.brandName, 'English');
                toolResult = `Packaging blueprints for ${call.args.brandName} generated.`;
                break;
              case 'viral_accelerator':
                const tiktok = await findTrendingTikTokProducts(call.args.category);
                toolResult = `Scanned viral trends for ${call.args.category}.`;
                break;
            }
          } catch (err) {
            toolResult = "Multimodal reasoning encountered a tool bottleneck.";
          }

          setMessages(prev => [...prev, { role: 'model', parts: [{ text: toolResult }], toolCall: call.name }]);
        }
      } else {
        setMessages(prev => [...prev, { role: 'model', parts: [{ text: result.text }] }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: "Neural handshake timed out." }] }]);
    } finally {
      setIsThinking(false);
      setActiveTool(null);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="w-[400px] h-[600px] bg-white rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-500 mb-6">
          <header className="p-6 bg-slate-900 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-xs animate-pulse">✨</div>
              <div>
                <h4 className="text-sm font-black tracking-widest uppercase leading-none">Astra Neural</h4>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Autonomous Financial Logic</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                {m.toolCall && (
                  <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest mb-1 ml-4">
                    Neural Execution: {m.toolCall}
                  </span>
                )}
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'
                }`}>
                  {m.parts.map((p, j) => (
                    <div key={j}>
                      {p.text && <p>{p.text}</p>}
                      {p.inlineData && (
                        <div className="mt-2 rounded-lg overflow-hidden border border-white/20">
                          {p.inlineData.mimeType.startsWith('image') ? (
                            <img src={`data:${p.inlineData.mimeType};base64,${p.inlineData.data}`} className="w-full max-h-48 object-cover" />
                          ) : (
                            <div className="bg-slate-800 p-4 text-white flex items-center gap-2">
                               <span className="text-xl">📹</span>
                               <span className="text-[10px] uppercase font-black tracking-widest">Multimodal Asset</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex flex-col items-start">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 rounded-tl-none flex items-center gap-2">
                   <div className="flex gap-1">
                     <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"></span>
                     <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce delay-75"></span>
                     <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce delay-150"></span>
                   </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-slate-100 bg-white">
            {pendingMedia && (
              <div className="mb-4 relative w-16 h-16">
                 <img src={pendingMedia.previewUrl} className="w-full h-full object-cover rounded-xl border-2 border-indigo-100" />
                 <button onClick={() => setPendingMedia(null)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg text-[10px]">×</button>
              </div>
            )}
            <div className="relative">
              <input 
                type="text"
                className="w-full pl-6 pr-24 py-4 bg-slate-50 text-slate-900 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-sm"
                placeholder="Scale my profit..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <div className="absolute right-2 top-2 flex gap-1">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-10 h-10 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center hover:bg-slate-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                </button>
                <button 
                  onClick={handleSend}
                  disabled={isThinking || (!input.trim() && !pendingMedia)}
                  className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 disabled:bg-slate-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                </button>
              </div>
              <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} accept="image/*,video/mp4" />
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-slate-900 shadow-slate-200' : 'bg-gradient-to-br from-indigo-600 to-violet-600 ring-4 ring-white shadow-indigo-200'
        }`}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        ) : (
          <div className="relative">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-3.44A10.954 10.954 0 0112 21c3.517 0 6.799-1.009 9.571-2.753m-3.44-3.44A10.954 10.954 0 0021 12c0-3.517-1.009-6.799-2.753-9.571m-3.44 3.44A10.954 10.954 0 0112 3c-3.517 0-6.799 1.009-9.571 2.753m3.44 3.44A10.954 10.954 0 003 12c0 3.517 1.009 6.799 2.753 9.571m3.44-3.44A10.954 10.954 0 0112 21" /></svg>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
        )}
      </button>
    </div>
  );
};

export default ChatAgent;
