import React, { useEffect, useState } from 'react';

interface Airdrop {
  id: number;
  name: string;
  isActive: boolean;
}

const AirdropTracker: React.FC = () => {
  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const LOCAL_STORAGE_KEY = 'airdrops';

  useEffect(() => {
    const storedAirdrops = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedAirdrops) {
      setAirdrops(JSON.parse(storedAirdrops));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(airdrops));
  }, [airdrops]);

  const addAirdrop = () => {
    const newAirdrop: Airdrop = {
      id: Date.now(),
      name: inputValue,
      isActive: true,
    };
    setAirdrops([...airdrops, newAirdrop]);
    setInputValue('');
  };

  const toggleAirdrop = (id: number) => {
    setAirdrops(
      airdrops.map((airdrop) =>
        airdrop.id === id ? { ...airdrop, isActive: !airdrop.isActive } : airdrop
      )
    );
  };

  const removeAirdrop = (id: number) => {
    setAirdrops(airdrops.filter((airdrop) => airdrop.id !== id));
  };

  const simulateAIscan = () => {
    // Simulated AI/network scan logic here
    console.log('Simulated AI/network scan initiated.');
  };

  return (
    <div>
      <h1>Airdrop Tracker</h1>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Add new airdrop"
      />
      <button onClick={addAirdrop}>Add Airdrop</button>
      <button onClick={simulateAIscan}>Simulate AI Scan</button>
      <ul>
        {airdrops.map((airdrop) => (
          <li key={airdrop.id} style={{ textDecoration: airdrop.isActive ? 'none' : 'line-through' }}>
            {airdrop.name}
            <button onClick={() => toggleAirdrop(airdrop.id)}>Toggle</button>
            <button onClick={() => removeAirdrop(airdrop.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AirdropTracker;