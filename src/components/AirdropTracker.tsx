import React, { useEffect, useRef, useState } from "react";

/**
 * Egyszerű Airdrop tracker komponens
 * - LocalStorage-szal perzisztál (kis "adatbázis" kezdetnek)
 * - Manuális hozzáadás / törlés / státuszváltás
 * - Szimulált AI/network watcher, ami időnként hozzáad új itemeket
 *
 * Tipp: valós AI integrációhoz (pl. genAI) javasolt backend proxy, ahol a kulcs nem a kliensben van.
 */

type AirdropStatus = "new" | "active" | "expired";
type Airdrop = {
  id: string;
  name: string;
  network: string;
  link?: string;
  status: AirdropStatus;
  createdAt: string;
  source?: string; // pl. "manual" | "ai-scan"
};

const STORAGE_KEY = "airdrops_v1";

// Néhány példa, amit a szimulátor hozzáadhat
const SIMULATED_DISCOVERIES: Omit<Airdrop, "id" | "createdAt" | "source">[] = [
  { name: "TestNet Alpha", network: "eth-goerli", status: "new" },
  { name: "ZetaDrop", network: "solana-devnet", status: "new" },
  { name: "BetaTest Airdrop", network: "polygon-mumbai", status: "new" },
  { name: "Gamma Project", network: "optimism-goerli", status: "new" },
];

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function AirdropTracker() {
  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [name, setName] = useState("");
  const [network, setNetwork] = useState("");
  const [link, setLink] = useState("");
  const [monitoring, setMonitoring] = useState(false);
  const monitorRef = useRef<number | null>(null);

  // Betöltés localStorage-ból
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setAirdrops(JSON.parse(raw));
      }
    } catch (e) {
      console.error("Nem sikerült beolvasni airdrops-t:", e);
    }
  }, []);

  // Mentés minden változásnál
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(airdrops));
    } catch (e) {
      console.error("Nem sikerült menteni airdrops-t:", e);
    }
  }, [airdrops]);

  function addAirdropManual() {
    if (!name || !network) return;
    const newItem: Airdrop = {
      id: generateId(),
      name,
      network,
      link: link || undefined,
      status: "new",
      createdAt: new Date().toISOString(),
      source: "manual",
    };
    setAirdrops((s) => [newItem, ...s]);
    setName("");
    setNetwork("");
    setLink("");
  }

  function removeAirdrop(id: string) {
    setAirdrops((s) => s.filter((a) => a.id !== id));
  }

  function toggleStatus(id: string) {
    setAirdrops((s) =>
      s.map((a) =>
        a.id === id
          ? {
              ...a,
              status: a.status === "active" ? "expired" : "active",
            }
          : a,
      ),
    );
  }

  // Szimulált hálózati / AI scan: időnként hozzáad egy új projectet, ha még nincs.
  function simulateNetworkScan() {
    // Válassz egy véletlen példát, amit még nem tartalmaz a lista (név alapján)
    const candidates = SIMULATED_DISCOVERIES.filter(
      (d) => !airdrops.some((a) => a.name === d.name),
    );
    if (candidates.length === 0) return;
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    const discovered: Airdrop = {
      id: generateId(),
      name: pick.name,
      network: pick.network,
      status: "new",
      createdAt: new Date().toISOString(),
      source: "ai-scan",
    };
    setAirdrops((s) => [discovered, ...s]);
    console.info("Agent: új airdrop hozzáadva:", discovered.name);
  }

  // Indítás / leállítás monitorozáshoz
  function startMonitoring() {
    if (monitorRef.current) return;
    // azonnal fusson egy scan, majd időzítve (pl. 30s)
    simulateNetworkScan();
    const id = window.setInterval(simulateNetworkScan, 30000); // 30s
    monitorRef.current = id;
    setMonitoring(true);
  }

  function stopMonitoring() {
    if (monitorRef.current) {
      clearInterval(monitorRef.current);
      monitorRef.current = null;
    }
    setMonitoring(false);
  }

  // Tisztítás komponens unmount-nál
  useEffect(() => {
    return () => {
      if (monitorRef.current) clearInterval(monitorRef.current);
    };
  }, []);

  return (
    <div className="p-4 bg-slate-900 rounded-lg">
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-lg text-sky-300">Airdrop Tracker</h2>
        <div className="text-sm text-slate-300">
          Eligible Airdrops: <span className="font-bold text-white">{airdrops.length}</span>
        </div>
      </header>

      <section className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <input
            className="p-2 rounded bg-slate-800 border border-slate-700 text-white"
            placeholder="Projekt neve"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="p-2 rounded bg-slate-800 border border-slate-700 text-white"
            placeholder="Hálózat (pl. polygon-mumbai)"
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
          />
          <input
            className="p-2 rounded bg-slate-800 border border-slate-700 text-white"
            placeholder="Link (opcionális)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>
        <div className="mt-2 flex gap-2">
          <button
            onClick={addAirdropManual}
            className="px-4 py-2 bg-sky-400 text-slate-900 rounded font-semibold"
          >
            Hozzáadás
          </button>

          <button
            onClick={() => (monitoring ? stopMonitoring() : startMonitoring())}
            className={`px-4 py-2 rounded font-semibold ${
              monitoring ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
            }`}
          >
            {monitoring ? "Monitor leállítása" : "AI Monitor indítása"}
          </button>

          <button
            onClick={() => {
              // egyszeri kézi scan
              simulateNetworkScan();
            }}
            className="px-4 py-2 bg-slate-700 text-white rounded"
          >
            Kézi hálózat-scan
          </button>
        </div>
      </section>

      <section>
        {airdrops.length === 0 ? (
          <div className="text-slate-400">Nincsenek airdropok a listában.</div>
        ) : (
          <ul className="space-y-2">
            {airdrops.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between p-3 bg-slate-800 rounded border border-slate-700"
              >
                <div>
                  <div className="text-white font-medium">{a.name}</div>
                  <div className="text-sm text-slate-300">
                    {a.network} • <span className="capitalize">{a.status}</span> • {
                    " "
                    }<span className="italic text-slate-400">{a.source}</span>
                  </div>
                  {a.link && (
                    <a
                      className="text-xs text-sky-300"
                      href={a.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Link
                    </a>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleStatus(a.id)}
                    className="px-3 py-1 bg-slate-700 rounded text-white text-sm"
                  >
                    {a.status === "active" ? "Lejárat" : "Aktivál"}
                  </button>
                  <button
                    onClick={() => removeAirdrop(a.id)}
                    className="px-3 py-1 bg-red-600 rounded text-white text-sm"
                  >
                    Törlés
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}