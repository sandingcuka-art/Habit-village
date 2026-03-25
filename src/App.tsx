/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';

// --- CONSTANTS & THEME ---
const P = {
  cream: '#f8f0d8',
  grass: '#7ec850',
  wood: '#a06830',
  gold: '#f0c020',
  sky: '#87ceeb',
  skySoft: '#c8e8c0',
  dark: '#1a1008',
  green: '#b8e890',
  border: '#5c4033',
  panel: '#fdf6e3',
  mint: '#a8d5ba',
  red: '#e74c3c',
  white: '#ffffff',
  shadow: 'rgba(0,0,0,0.15)',
};

const CATEGORIES = {
  study: { emoji: '📚', label: 'Study' },
  health: { emoji: '💪', label: 'Health' },
  creative: { emoji: '🎨', label: 'Creative' },
  social: { emoji: '💬', label: 'Social' },
  other: { emoji: '⭐', label: 'Other' },
};

const DEFAULT_HABITS = [
  { id: 1, name: 'Study Java for 30 min', category: 'study', xp: 20, done: false },
  { id: 2, name: 'Exercise or walk', category: 'health', xp: 15, done: false },
  { id: 3, name: 'Read for 20 min', category: 'creative', xp: 10, done: false },
];

// --- STYLES INJECTION ---
const injectStyles = () => {
  const style = document.createElement('style');
  style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');

    @keyframes float {
      0% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
      100% { transform: translateY(0); }
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }

    @keyframes fadein {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes pop {
      0% { transform: scale(1); }
      50% { transform: scale(1.25); }
      100% { transform: scale(1); }
    }

    .float { animation: float 3s infinite ease-in-out; }
    .blink { animation: blink 1s step-end infinite; }
    .fadein { animation: fadein 0.4s ease-out forwards; }
    .pop { animation: pop 0.3s ease-in-out; }

    body {
      margin: 0;
      padding: 0;
      background: linear-gradient(to bottom, #87ceeb, #e0f6ff);
      font-family: 'VT323', monospace;
      color: ${P.dark};
      overflow-x: hidden;
    }

    * { box-sizing: border-box; }
  `;
  document.head.appendChild(style);
};

// --- PIXEL ART COMPONENTS ---

const PixelChar = ({ mood = 'happy', size = 1 }) => {
  const scale = size;
  const isExcited = mood === 'excited';

  return (
    <div className="float" style={{ position: 'relative', width: 40 * scale, height: 50 * scale }}>
      {/* Head */}
      <div style={{
        position: 'absolute', top: 0, left: 5 * scale, width: 30 * scale, height: 30 * scale,
        backgroundColor: '#ffdbac', border: `${2 * scale}px solid ${P.border}`, borderRadius: 4 * scale
      }}>
        {/* Eyes */}
        <div style={{ position: 'absolute', top: 10 * scale, left: 6 * scale, width: 4 * scale, height: 4 * scale, backgroundColor: P.dark }} />
        <div style={{ position: 'absolute', top: 10 * scale, right: 6 * scale, width: 4 * scale, height: 4 * scale, backgroundColor: P.dark }} />
        {/* Blush */}
        <div style={{ position: 'absolute', top: 16 * scale, left: 3 * scale, width: 6 * scale, height: 3 * scale, backgroundColor: isExcited ? '#ff6b6b' : '#ffb7b7', opacity: 0.7 }} />
        <div style={{ position: 'absolute', top: 16 * scale, right: 3 * scale, width: 6 * scale, height: 3 * scale, backgroundColor: isExcited ? '#ff6b6b' : '#ffb7b7', opacity: 0.7 }} />
        {/* Mouth */}
        <div style={{
          position: 'absolute', bottom: 4 * scale, left: '50%', transform: 'translateX(-50%)',
          width: isExcited ? 10 * scale : 6 * scale, height: isExcited ? 6 * scale : 2 * scale,
          backgroundColor: isExcited ? '#800000' : P.border, borderRadius: isExcited ? '0 0 10px 10px' : 0
        }} />
      </div>
      {/* Body */}
      <div style={{
        position: 'absolute', top: 28 * scale, left: 10 * scale, width: 20 * scale, height: 15 * scale,
        backgroundColor: '#4a90e2', border: `${2 * scale}px solid ${P.border}`, borderRadius: '0 0 4px 4px'
      }} />
      {/* Legs */}
      <div style={{ position: 'absolute', bottom: 0, left: 12 * scale, width: 6 * scale, height: 8 * scale, backgroundColor: P.dark, border: `${1 * scale}px solid ${P.border}` }} />
      <div style={{ position: 'absolute', bottom: 0, right: 12 * scale, width: 6 * scale, height: 8 * scale, backgroundColor: P.dark, border: `${1 * scale}px solid ${P.border}` }} />
    </div>
  );
};

const PixelTree = ({ x, y }) => (
  <div style={{ position: 'absolute', left: x, bottom: y, width: 40, height: 60 }}>
    {/* Trunk */}
    <div style={{ position: 'absolute', bottom: 0, left: 16, width: 8, height: 20, backgroundColor: P.wood }} />
    {/* Leaves */}
    <div style={{ position: 'absolute', bottom: 15, left: 0, width: 40, height: 20, backgroundColor: P.grass, border: `2px solid ${P.border}`, borderRadius: '20px 20px 0 0' }} />
    <div style={{ position: 'absolute', bottom: 30, left: 5, width: 30, height: 15, backgroundColor: P.grass, border: `2px solid ${P.border}`, borderRadius: '15px 15px 0 0' }} />
    <div style={{ position: 'absolute', bottom: 40, left: 10, width: 20, height: 10, backgroundColor: P.grass, border: `2px solid ${P.border}`, borderRadius: '10px 10px 0 0' }} />
  </div>
);

const PixelHouse = ({ x, y }) => (
  <div style={{ position: 'absolute', left: x, bottom: y, width: 60, height: 60 }}>
    {/* Wall */}
    <div style={{ position: 'absolute', bottom: 0, left: 5, width: 50, height: 40, backgroundColor: P.cream, border: `3px solid ${P.border}` }}>
      {/* Door */}
      <div style={{ position: 'absolute', bottom: 0, left: 18, width: 14, height: 20, backgroundColor: P.wood, border: `2px solid ${P.border}` }} />
      {/* Window */}
      <div style={{ position: 'absolute', top: 8, right: 8, width: 12, height: 12, backgroundColor: '#87ceeb', border: `2px solid ${P.border}` }} />
    </div>
    {/* Roof */}
    <div style={{
      position: 'absolute', bottom: 35, left: 0, width: 60, height: 25,
      backgroundColor: P.red, border: `3px solid ${P.border}`, clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
    }} />
  </div>
);

const SceneBackground = ({ xp }) => {
  const level = Math.floor(xp / 100) + 1;
  const mood = xp % 100 > 50 ? 'excited' : 'happy';

  return (
    <div style={{
      width: '100%', height: 120, position: 'relative', overflow: 'hidden',
      background: `linear-gradient(to bottom, ${P.sky}, ${P.skySoft})`,
      borderBottom: `4px solid ${P.grass}`, marginBottom: 10
    }}>
      {/* Sun */}
      <div style={{ position: 'absolute', top: 10, right: 20, width: 30, height: 30, backgroundColor: P.gold, borderRadius: '50%', boxShadow: `0 0 10px ${P.gold}` }} />

      {/* Clouds */}
      <div style={{ position: 'absolute', top: 20, left: 40, width: 40, height: 15, backgroundColor: P.white, borderRadius: 20, opacity: 0.8 }} />
      <div style={{ position: 'absolute', top: 40, left: 150, width: 50, height: 20, backgroundColor: P.white, borderRadius: 20, opacity: 0.8 }} />

      {/* Ground */}
      <div style={{ position: 'absolute', bottom: 0, width: '100%', height: 10, backgroundColor: '#8b4513' }} />

      {/* Dynamic Elements based on Level */}
      <PixelTree x={20} y={10} />
      {level >= 2 && <PixelTree x={380} y={10} />}
      {level >= 3 && <PixelHouse x={300} y={10} />}
      {level >= 4 && <PixelTree x={80} y={10} />}
      {level >= 5 && <PixelHouse x={120} y={10} />}

      {/* Character */}
      <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)' }}>
        <PixelChar mood={mood} size={0.8} />
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

export default function HabitVillage() {
  const [habits, setHabits] = useState(DEFAULT_HABITS);
  const [xp, setXp] = useState(0);
  const [story, setStory] = useState(['Welcome to Habit Village! Complete quests to write your story.']);
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState({});
  const [tab, setTab] = useState('quests');
  const [toast, setToast] = useState(null);

  // Form state
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('study');

  useEffect(() => {
    injectStyles();
  }, []);

  const level = Math.floor(xp / 100) + 1;
  const questsDoneToday = habits.filter(h => h.done).length;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const generateStory = async (habitName, category) => {
    setLoading(true);
    setTab('story');
    try {
      const prompt = `You are a cozy Stardew Valley-style narrator for a habit RPG. The player just completed: '${habitName}' (category: ${category}). They have completed ${questsDoneToday + 1} of ${habits.length} quests today. Write ONE short, warm, encouraging story sentence (max 25 words) about their hero doing this in a cozy pixel-art village world. Be creative and specific to the habit. No quotes, no emojis.`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20240620',
          max_tokens: 100,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      const data = await response.json();
      const text = data.content[0].text.trim();
      setStory(prev => [...prev, text]);
    } catch (err) {
      setStory(prev => [...prev, "The village cheers as another quest is complete!"]);
    } finally {
      setLoading(false);
    }
  };

  const toggleHabit = (id) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const newDone = !habit.done;
    setHabits(prev => prev.map(h => h.id === id ? { ...h, done: newDone } : h));

    if (newDone) {
      setXp(prev => prev + habit.xp);
      showToast(`+${habit.xp} XP ✨`);
      generateStory(habit.name, habit.category);

      // Update streak log
      const today = new Date().toISOString().split('T')[0];
      setLog(prev => ({ ...prev, [today]: (prev[today] || 0) + 1 }));
    } else {
      setXp(prev => Math.max(0, prev - habit.xp));
    }
  };

  const addHabit = () => {
    if (!newHabitName.trim()) return;
    const newId = Date.now();
    const xpReward = 10 + Math.floor(Math.random() * 15);
    setHabits(prev => [...prev, {
      id: newId,
      name: newHabitName,
      category: newHabitCategory,
      xp: xpReward,
      done: false
    }]);
    setNewHabitName('');
    showToast("New quest added! 📜");
  };

  const deleteHabit = (id) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  // --- RENDER HELPERS ---

  const renderQuests = () => (
    <div className="fadein" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {habits.map(h => (
        <div key={h.id} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: 10,
          backgroundColor: h.done ? P.mint : P.panel,
          border: `2px solid ${P.border}`, borderRadius: 6,
          transition: 'all 0.2s'
        }}>
          <div
            onClick={() => toggleHabit(h.id)}
            className={h.done ? "pop" : ""}
            style={{
              width: 24, height: 24, border: `2px solid ${P.border}`,
              backgroundColor: h.done ? P.gold : P.white,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14
            }}
          >
            {h.done && '✓'}
          </div>
          <span style={{ fontSize: 20 }}>{CATEGORIES[h.category].emoji}</span>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <span style={{
              fontSize: 18, fontWeight: 'bold',
              textDecoration: h.done ? 'line-through' : 'none',
              color: h.done ? '#555' : P.dark
            }}>{h.name}</span>
            <span style={{ fontSize: 14, color: P.wood }}>+{h.xp} XP</span>
          </div>
          <button
            onClick={() => deleteHabit(h.id)}
            style={{
              background: 'none', border: 'none', color: P.red, cursor: 'pointer',
              fontSize: 18, padding: 5
            }}
          >
            ✕
          </button>
        </div>
      ))}

      {/* Add Form */}
      <div style={{
        marginTop: 10, padding: 12, border: `2px dashed ${P.border}`, borderRadius: 6,
        display: 'flex', flexDirection: 'column', gap: 10
      }}>
        <div style={{ fontFamily: '"Press Start 2P"', fontSize: 10, color: P.wood }}>New Quest</div>
        <input
          type="text"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          placeholder="What will you do?"
          style={{
            width: '100%', padding: 8, border: `2px solid ${P.border}`, borderRadius: 4,
            fontFamily: 'VT323', fontSize: 18, backgroundColor: P.white
          }}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <select
            value={newHabitCategory}
            onChange={(e) => setNewHabitCategory(e.target.value)}
            style={{
              flex: 1, padding: 8, border: `2px solid ${P.border}`, borderRadius: 4,
              fontFamily: 'VT323', fontSize: 18, backgroundColor: P.white
            }}
          >
            {Object.entries(CATEGORIES).map(([key, val]) => (
              <option key={key} value={key}>{val.emoji} {val.label}</option>
            ))}
          </select>
          <button
            onClick={addHabit}
            style={{
              padding: '8px 16px', backgroundColor: P.gold, border: `2px solid ${P.border}`,
              borderRadius: 4, cursor: 'pointer', fontFamily: '"Press Start 2P"', fontSize: 10,
              boxShadow: `2px 2px 0 ${P.border}`
            }}
          >
            ADD
          </button>
        </div>
      </div>
    </div>
  );

  const renderStory = () => (
    <div className="fadein" style={{
      backgroundColor: P.dark, color: P.green, padding: 15, borderRadius: 6,
      minHeight: 300, maxHeight: 400, overflowY: 'auto', fontFamily: 'monospace',
      border: `3px solid ${P.border}`, display: 'flex', flexDirection: 'column', gap: 10
    }}>
      {story.map((line, i) => (
        <div key={i} style={{ fontSize: 16, lineHeight: 1.4 }}>
          {`> ${line}`}
        </div>
      ))}
      {loading && (
        <div style={{ fontSize: 16 }}>
          {`> Writing story...`}
          <span className="blink" style={{ marginLeft: 4 }}>_</span>
        </div>
      )}
      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => setStory(['The log is cleared. Your journey continues.'])}
          style={{
            background: 'none', border: `1px solid ${P.green}`, color: P.green,
            padding: '4px 8px', cursor: 'pointer', fontSize: 12, fontFamily: 'monospace'
          }}
        >
          CLEAR LOG
        </button>
      </div>
    </div>
  );

  const renderStats = () => {
    const last14Days = Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      return d.toISOString().split('T')[0];
    });

    return (
      <div className="fadein" style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { label: 'Level', val: level },
            { label: 'Total XP', val: xp },
            { label: 'Quests', val: habits.length },
            { label: 'Done', val: questsDoneToday },
          ].map(s => (
            <div key={s.label} style={{
              padding: 10, backgroundColor: P.panel, border: `2px solid ${P.border}`,
              borderRadius: 6, textAlign: 'center'
            }}>
              <div style={{ fontFamily: '"Press Start 2P"', fontSize: 8, color: P.wood, marginBottom: 5 }}>{s.label}</div>
              <div style={{ fontSize: 24, fontWeight: 'bold' }}>{s.val}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: 12, backgroundColor: P.panel, border: `2px solid ${P.border}`, borderRadius: 6 }}>
          <div style={{ fontFamily: '"Press Start 2P"', fontSize: 10, color: P.wood, marginBottom: 10 }}>14-Day Streak</div>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
            {last14Days.map(date => (
              <div key={date} title={date} style={{
                width: 16, height: 16, borderRadius: '50%',
                backgroundColor: log[date] ? P.mint : '#ddd',
                border: `1px solid ${P.border}`
              }} />
            ))}
          </div>
        </div>

        <div style={{ padding: 12, backgroundColor: P.panel, border: `2px solid ${P.border}`, borderRadius: 6 }}>
          <div style={{ fontFamily: '"Press Start 2P"', fontSize: 10, color: P.wood, marginBottom: 10 }}>Categories</div>
          {Object.entries(CATEGORIES).map(([key, val]) => {
            const catHabits = habits.filter(h => h.category === key);
            const done = catHabits.filter(h => h.done).length;
            const pct = catHabits.length > 0 ? (done / catHabits.length) * 100 : 0;
            return (
              <div key={key} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 2 }}>
                  <span>{val.emoji} {val.label}</span>
                  <span>{done}/{catHabits.length}</span>
                </div>
                <div style={{ width: '100%', height: 8, backgroundColor: '#ddd', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', backgroundColor: P.gold, transition: 'width 0.3s' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // --- MAIN RENDER ---

  return (
    <div style={{
      maxWidth: 480, margin: '0 auto', minHeight: '100vh',
      backgroundColor: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(5px)',
      display: 'flex', flexDirection: 'column'
    }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
          backgroundColor: P.gold, border: `3px solid ${P.border}`, padding: '10px 20px',
          zIndex: 1000, fontFamily: '"Press Start 2P"', fontSize: 12,
          boxShadow: `4px 4px 0 ${P.border}`, animation: 'fadein 0.3s ease-out'
        }}>
          {toast}
        </div>
      )}

      <SceneBackground xp={xp} />

      {/* Hero Stats Bar */}
      <div style={{
        padding: '10px 15px', display: 'flex', alignItems: 'center', gap: 15,
        backgroundColor: P.panel, borderBottom: `3px solid ${P.border}`
      }}>
        <PixelChar size={0.6} mood={xp % 100 > 50 ? 'excited' : 'happy'} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontFamily: '"Press Start 2P"', fontSize: 10 }}>LVL {level}</span>
            <span style={{ fontFamily: '"Press Start 2P"', fontSize: 10 }}>{xp % 100} / 100 XP</span>
          </div>
          <div style={{
            width: '100%', height: 12, backgroundColor: '#ddd', border: `2px solid ${P.border}`,
            borderRadius: 6, overflow: 'hidden'
          }}>
            <div style={{
              width: `${xp % 100}%`, height: '100%',
              background: `linear-gradient(to right, ${P.gold}, ${P.red})`,
              transition: 'width 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', padding: 10, gap: 8 }}>
        {['quests', 'story', 'stats'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, padding: '10px 5px', cursor: 'pointer',
              backgroundColor: tab === t ? P.gold : P.cream,
              border: `3px solid ${P.border}`, borderRadius: 6,
              fontFamily: '"Press Start 2P"', fontSize: 10,
              boxShadow: tab === t ? 'none' : `3px 3px 0 ${P.border}`,
              transform: tab === t ? 'translate(2px, 2px)' : 'none',
              transition: 'all 0.1s'
            }}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div style={{ padding: 15, flex: 1 }}>
        {tab === 'quests' && renderQuests()}
        {tab === 'story' && renderStory()}
        {tab === 'stats' && renderStats()}
      </div>

      {/* Footer */}
      <div style={{
        padding: 15, textAlign: 'center', color: P.wood,
        fontFamily: '"Press Start 2P"', fontSize: 8
      }}>
        HABIT VILLAGE v1.0 • COZY RPG TRACKER
      </div>
    </div>
  );
}
