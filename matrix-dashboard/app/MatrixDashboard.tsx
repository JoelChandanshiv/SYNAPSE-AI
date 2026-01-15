'use client';

import React, { useEffect, useState } from 'react';
import { MessageSquare, Brain, AlertCircle } from 'lucide-react';
import { matrixClient } from './lib/matrixClient';

interface Room {
  id: string;
  name: string;
  unread: number;
}

interface Message {
  id: string;
  roomId: string;
  sender: string;
  text: string;
  timestamp: string;
}

const MatrixDashboard = () => {
  const [connected, setConnected] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [messagesByRoom, setMessagesByRoom] = useState<Record<string, Message[]>>({});
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'messages' | 'ai'>('messages');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  /* ---------- LOGIN ---------- */

  const handleLogin = async () => {
    setError('');

    if (!username || !password) {
      setError('Username and password required');
      return;
    }

    const mxid = username.startsWith('@')
      ? username
      : `@${username}:joeldc.duckdns.org`;

    setLoading(true);
    const result = await matrixClient.login(mxid, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Login failed');
      return;
    }

    setConnected(true);
    await loadRooms();
  };

  /* ---------- LOAD ROOMS ---------- */

  const loadRooms = async () => {
    const r = await matrixClient.getRooms();
    setRooms(r);

    if (r.length > 0) {
      selectRoom(r[0].id);
    }
  };

  /* ---------- SELECT ROOM ---------- */

  const selectRoom = async (roomId: string) => {
    setSelectedRoom(roomId);
    setLoading(true);

    const msgs = await matrixClient.getMessages(roomId);

    setMessagesByRoom((prev) => ({
      ...prev,
      [roomId]: msgs,
    }));

    setLoading(false);

    if (msgs.length > 0) {
    runAllAI(roomId, msgs);
    }
  };

  /* ---------- REALTIME ---------- */

  useEffect(() => {
    if (!connected) return;

    matrixClient.onNewMessage((msg) => {
      setMessagesByRoom((prev) => ({
        ...prev,
        [msg.roomId]: [...(prev[msg.roomId] || []), msg],
      }));
    });
  }, [connected]);

  /* ---------- AI ---------- */
  
  const runAI = async (endpoint: string, msgs: Message[]) => {
  const res = await fetch(`/api/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: msgs.map(m => ({ text: m.text, sender: m.sender }))
    }),
  });

  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { error: "Invalid AI response" };
  }
};

const runAllAI = async (roomId: string, msgs: Message[]) => {
  const [summary, sentiment, emotion] = await Promise.all([
    runAI("summarize", msgs),
    runAI("sentiment", msgs),
    runAI("emotion", msgs),
  ]);

  setAiAnalysis({
    roomId,
    summary: summary.summary,
    sentiment: sentiment.sentiment,
    emotion: emotion.emotion,
  });
};

  /* ---------- LOGIN UI ---------- */

  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-2">
            Matrix AI Dashboard
          </h1>

          <input
            placeholder="Username (admin)"
            className="w-full border p-3 rounded mb-3"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
            disabled={loading}
          >
            {loading ? 'Connecting…' : 'Login'}
          </button>

          <div className="mt-4 text-sm text-blue-700 flex items-center gap-2 bg-blue-50 p-3 rounded">
            <AlertCircle size={16} />
            Matrix + Mautrix + AI
          </div>
        </div>
      </div>
    );
  }

  const activeMessages = selectedRoom ? messagesByRoom[selectedRoom] || [] : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm px-6 py-4 flex justify-between">
        <h1 className="font-bold text-xl">Matrix AI Dashboard</h1>
        <button
          onClick={() => {
            matrixClient.logout();
            setConnected(false);
            setRooms([]);
            setMessagesByRoom({});
            setSelectedRoom(null);
            setAiAnalysis(null);
          }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 rounded ${
              activeTab === 'messages'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100'
            }`}
          >
            <MessageSquare size={16} className="inline mr-2" />
            Messages
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-2 rounded ${
              activeTab === 'ai'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100'
            }`}
          >
            <Brain size={16} className="inline mr-2" />
            AI Analysis
          </button>
        </div>

        {activeTab === 'messages' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded shadow">
              {rooms.map((r) => (
                <div
                  key={r.id}
                  className={`p-3 mb-2 rounded cursor-pointer ${
                    selectedRoom === r.id
                      ? 'bg-blue-100'
                      : 'bg-gray-50'
                  }`}
                  onClick={() => selectRoom(r.id)}
                >
                  {r.name}
                </div>
              ))}
            </div>

            <div className="lg:col-span-2 bg-white p-4 rounded shadow">
              {activeMessages.map((m) => (
                <div key={m.id} className="mb-3 p-3 bg-gray-50 rounded">
                  <p className="font-medium">{m.sender}</p>
                  <p>{m.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ai' && aiAnalysis?.roomId === selectedRoom && (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="font-bold mb-4">Summary</h2>
            <p className="mb-4">{aiAnalysis.summary}</p>
            <p className="text-sm text-gray-500">
              Analyzed {aiAnalysis.count} messages
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MatrixDashboard;

