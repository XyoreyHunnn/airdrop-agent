import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_AI_API_KEY;

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [rules, setRules] = useState("");

  // Betöltjük a szabályokat a rules.json-ből
  useEffect(() => {
    fetch('/rules.json')
      .then(res => res.json())
      .then(data => setRules(JSON.stringify(data)))
      .catch(err => console.log("Rules betöltési hiba:", err));
  }, []);

  async function askAI() {
    if (!API_KEY) {
      setResponse("Hiba: API kulcs hiányzik!");
      return;
    }
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Itt adjuk oda az AI-nak a rules.json tartalmát utasításként
      const fullPrompt = `A következő szabályok alapján válaszolj: ${rules}\n\nKérdés: ${prompt}`;
      
      const result = await model.generateContent(fullPrompt);
      setResponse(await result.response.text());
    } catch (error: any) {
      setResponse("Hiba: " + error.message);
    }
    setLoading(false);
  }

  return (
    <div style={{ backgroundColor: '#020617', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif', padding: '15px' }}>
      {/* Dashboard fejléc */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', padding: '10px', backgroundColor: '#1e293b', borderRadius: '12px' }}>
        <div>
          <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>Eligible Airdrops</p>
          <h2 style={{ margin: 0, color: '#38bdf8' }}>4</h2>
        </div>
        <div>
          <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>Gas Savings</p>
          <h2 style={{ margin: 0, color: '#4ade80' }}>$12.50</h2>
        </div>
      </div>

      {/* AI Agent szekció */}
      <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '15px', marginBottom: '20px' }}>
        <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center' }}>🤖 Airdrop Agent</h3>
        <textarea 
          value={prompt} 
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Miben segítsek ma?"
          style={{ width: '100%', height: '80px', backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: 'white', padding: '10px', boxSizing: 'border-box' }}
        />
        <button 
          onClick={askAI} 
          disabled={loading}
          style={{ width: '100%', padding: '12px', backgroundColor: '#38bdf8', border: 'none', borderRadius: '8px', color: '#020617', fontWeight: 'bold', marginTop: '10px' }}
        >
          {loading ? "Elemzés..." : "Agent futtatása"}
        </button>
        {response && (
          <div style={{ marginTop: '15px', padding: '12px', backgroundColor: '#1e293b', borderRadius: '8px', borderLeft: '4px solid #38bdf8', fontSize: '14px' }}>
            {response}
          </div>
        )}
      </div>

      {/* Tracker szekció */}
      <div style={{ padding: '10px' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Active Tasks</h4>
        <div style={{ padding: '12px', backgroundColor: '#1e293b', borderRadius: '10px', marginBottom: '10px' }}>
          <p style={{ margin: 0, fontSize: '14px' }}>• Monad Testnet Daily Swap</p>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>Status: Pending</span>
        </div>
      </div>
    </div>
  );
}

export default App;

