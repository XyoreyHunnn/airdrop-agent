import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// A GitHub Secrets-ből érkező kulcsot használja
const API_KEY = import.meta.env.VITE_AI_API_KEY;

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function askAI() {
    if (!API_KEY) {
      setResponse("Hiba: Az API kulcs nincs beállítva!");
      return;
    }
    if (!prompt) return;
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const text = await result.response.text();
      setResponse(text);
    } catch (error: any) {
      setResponse("Hiba történt: " + error.message);
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#38bdf8' }}>🤖 Airdrop AI Agent v2</h1>
      <div style={{ marginBottom: '20px' }}>
        <textarea 
          value={prompt} 
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Mizu? Kérdezz az airdropokról..."
          style={{ width: '100%', height: '100px', borderRadius: '8px', padding: '10px', color: 'black' }}
        />
        <button 
          onClick={askAI} 
          disabled={loading}
          style={{ width: '100%', padding: '12px', backgroundColor: '#38bdf8', border: 'none', borderRadius: '8px', marginTop: '10px', fontWeight: 'bold' }}
        >
          {loading ? "Gondolkodom..." : "Küldés az AI-nak"}
        </button>
      </div>
      {response && (
        <div style={{ padding: '15px', backgroundColor: '#1e293b', borderRadius: '8px', borderLeft: '4px solid #38bdf8' }}>
          <strong>Agent válasza:</strong><br/>
          {response}
        </div>
      )}
    </div>
  );
}

export default App;

