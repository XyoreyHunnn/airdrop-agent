import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// CSERÉLD KI A SAJÁT KULCSODRA: AIzaSy... (ne a Gen-lang-osat, hanem a hosszú kódot)
const API_KEY = "AIzaSyCjIv6TKPLnQVSVrlNwRBkp58mGm47MqSs";
const genAI = new GoogleGenerativeAI(API_KEY);

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function askAI() {
    if (!prompt) return;
    setLoading(true);
    try {
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
    <div style={{ padding: '20px', backgroundColor: '#0f172a', color: 'white', minHeight: '100vh' }}>
      <h1 style={{ color: '#38bdf8' }}>🤖 Airdrop AI Agent v2</h1>
      <div style={{ marginBottom: '20px' }}>
        <textarea 
          value={prompt} 
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Miben segíthetek?"
          style={{ width: '100%', height: '100px', borderRadius: '8px', padding: '10px', color: 'black' }}
        />
        <button 
          onClick={askAI} 
          disabled={loading}
          style={{ width: '100%', padding: '10px', backgroundColor: '#38bdf8', border: 'none', borderRadius: '8px', marginTop: '10px' }}
        >
          {loading ? "Gondolkodom..." : "Küldés"}
        </button>
      </div>
      {response && (
        <div style={{ padding: '15px', backgroundColor: '#1e293b', borderRadius: '8px' }}>
          {response}
        </div>
      )}
    </div>
  );
}

export default App;

