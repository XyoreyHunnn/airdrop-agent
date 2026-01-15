import React, { useState, useEffect, useRef } from 'react';
import { Brain, Search, Play, Plus, ShieldCheck, ZapOff, Globe, Bell, Mail, Shield, ToggleLeft, ToggleRight, Send } from 'lucide-react';

interface Airdrop {
  id: number;
  project: string;
  task: string;
  confidence: number;
  status: 'new' | 'executing' | 'completed';
  network: string;
  tvl: number; 
  requiresCapital: boolean;
  requiresGas: boolean;
  twitterFollowers: number;
}

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

export default function AirdropAgent() {
  const [stats] = useState({ eligible: 4, testnet: 12, savings: '23%', risk: 'Low' });
  const [modules, setModules] = useState({ taskAutomation: true, surveyAssistance: true, web3Tracker: true, anomalyDetection: false });
  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'ai', text: 'Optimize strategy for testnet airdrops.' },
    { role: 'user', text: 'Strategy adjusted to prioritize testnet airdrop tasks.' },
    { role: 'ai', text: 'Analyze performance of last 5 tasks.' },
    { role: 'user', text: 'Analysis complete. Success rate: 80%. Gas used: 0.12 ETH. Recommendation: Slightly increase reward for speed.' }
  ]);
  const [inputText, setInputText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(() => { scrollToBottom(); }, [chatHistory]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    setChatHistory([...chatHistory, { role: 'ai', text: inputText }]);
    setInputText("");
    setTimeout(() => {
      setChatHistory(prev => [...prev, { role: 'user', text: 'Command processed. System standing by.' }]);
    }, 1000);
  };

  const startSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      const now = Date.now();
      const candidates: Airdrop[] = [
        { id: now, project: "Berachain", task: "Daily Faucet & Social Quests", confidence: 98, status: 'new', network: 'Berachain', tvl: 450000000, requiresCapital: false, requiresGas: false, twitterFollowers: 850000 },
        { id: now + 1, project: "Grass", task: "Bandwidth Sharing", confidence: 95, status: 'new', network: 'Solana', tvl: 2000000, requiresCapital: false, requiresGas: false, twitterFollowers: 400000 }
      ];
      setAirdrops([...candidates, ...airdrops]);
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f111a] text-slate-300 font-sans max-w-md mx-auto border-x border-slate-800 shadow-2xl overflow-hidden">
      <div className="p-4 flex justify-between items-center border-b border-slate-800 bg-[#161b22]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-600/20 rounded-lg">
            <Brain className="text-blue-500" size={20} />
          </div>
          <h1 className="font-bold text-white tracking-tight">AI Console</h1>
        </div>
        <Bell size={20} className="text-slate-500 hover:text-white cursor-pointer" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-[#1c2128] border border-slate-700 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded">
              <Mail className="text-yellow-500" size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">New Survey Task:</p>
              <p className="text-[10px] text-slate-400">Complete the latest DeFi feedback form.</p>
            </div>
          </div>
          <button className="text-[10px] font-bold bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500 transition">VIEW</button>
        </div>

        <div className="bg-[#161b22] border border-slate-800 rounded-xl p-4 space-y-4 shadow-inner">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-tighter">Airdrop Status</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-slate-500 uppercase">Eligible Airdrops</p>
              <p className="text-lg font-bold text-white">{stats.eligible}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase">Testnet Activities</p>
              <p className="text-lg font-bold text-white">{stats.testnet}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase">Gas Savings</p>
              <p className="text-lg font-bold text-green-400">{stats.savings}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Risk Level</p>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-green-400">{stats.risk}</span>
                <Shield size={16} className="text-green-500 fill-green-500/20" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#161b22] border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(modules).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between bg-[#1c2128] p-2 rounded-lg border border-slate-700/50">
                <span className="text-[9px] uppercase font-bold text-slate-400">{key.replace(/([A-Z])/g, ' $1')}</span>
                <button onClick={() => setModules(prev => ({...prev, [key]: !val}))}>
                  {val ? <ToggleRight className="text-green-500" size={24} /> : <ToggleLeft className="text-slate-600" size={24} />}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === 'ai' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed ${
                msg.role === 'ai' ? 'bg-[#233044] text-blue-100 rounded-tr-none border border-blue-500/20' : 'bg-[#1c2128] text-slate-300 rounded-tl-none border border-slate-700'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {airdrops.length > 0 && (
          <div className="pt-4 space-y-2">
            <h2 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Live Discoveries</h2>
            {airdrops.map(drop => (
              <div key={drop.id} className="bg-[#1c2128] border border-blue-500/30 p-3 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-white">{drop.project}</p>
                  <p className="text-[9px] text-slate-500">{drop.network}</p>
                </div>
                <button className="bg-blue-600 text-white p-1.5 rounded-full shadow-lg shadow-blue-900/40"><Play size={12} fill="white" /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 bg-[#161b22] border-t border-slate-800">
        <div className="relative flex items-center">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Enter command..."
            className="w-full bg-[#0f111a] border border-slate-700 rounded-lg py-3 pl-4 pr-12 text-sm text-white focus:border-blue-500 outline-none"
          />
          <div className="absolute right-2 flex gap-1">
             <button onClick={startSearch} className="p-2 text-slate-500 hover:text-blue-400"><Search size={18} /></button>
             <button onClick={handleSend} className="p-2 bg-blue-600 text-white rounded-md"><Send size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

