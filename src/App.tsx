
import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// CSERÉLD KI A SAJÁT KULCSODRA!
const API_KEY = import.meta.env.VITE_AI_API_KEY; // Legyen ez a név!

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Ez a változó tárolja a kódunkat, amit elküldünk az AI-nak
  const sourceCode = `Current App.tsx structure: React, Gemini API, Dark UI.`;

  async function askAI() {
    if (!prompt) return;
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Megadjuk neki a kontextust: ki ő, és mi a kódja
      const fullPrompt = `Te egy Airdrop Agent AI vagy. Ez a forráskódod: ${sourceCode}. 
      Segíts a felhasználónak fejleszteni az appot vagy válaszolj a kérdésére: ${prompt}`;
      
      const result = await model.generateContent(fullPrompt);
      setResponse(result.response.text());
    } catch (error) {
      setResponse("Hiba történt a kapcsolódáskor.");
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ borderBottom: '1px solid #1e293b', marginBottom: '20px', paddingBottom: '10px' }}>
        <h1 style={{ fontSize: '1.5rem', color: '#38bdf8' }}>🤖 Airdrop AI Agent v2</h1>
      </header>

      <div style={{ backgroundColor: '#1e293b', padding: '15px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <textarea 
          value={prompt} 
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Miben segíthetek a fejlesztésben?"
          style={{ width: '100%', height: '80px', backgroundColor: '#0f172a', color: 'white', border: '1px solid #334155', borderRadius: '8px', padding: '10px', marginBottom: '10px' }}
        />
        <button 
          onClick={askAI} 
          disabled={loading}
          style={{ width: '100%', padding: '12px', backgroundColor: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {loading ? "Gondolkodom..." : "Küldés az AI-nak"}
        </button>
      </div>

      {response && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#1e293b', borderRadius: '12px', borderLeft: '4px solid #38bdf8', lineHeight: '1.6' }}>
          <h3 style={{ marginTop: 0, fontSize: '0.9rem', color: '#94a3b8' }}>Agent válasza:</h3>
          {response}
        </div>
      )}
    </div>
  );
}

export default App;

