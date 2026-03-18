import { useMemo, useState, useEffect, useRef } from 'react'
import { MOOD_ENGINE, randomPick } from '../data/constants'

const MOOD_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

  .mood3d-section {
    font-family: 'Nunito', sans-serif;
    padding: 80px 32px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .mood3d-badge {
    display: inline-flex; align-items: center; gap: 7px;
    background: linear-gradient(135deg, #7c3aed22, #ec489922);
    border: 1.5px solid rgba(124,58,237,0.2);
    border-radius: 50px; padding: 6px 18px;
    font-size: 12px; font-weight: 800; color: #7c3aed;
    letter-spacing: 0.04em; text-transform: uppercase;
    margin-bottom: 12px;
  }

  .mood3d-title {
    font-size: clamp(26px,4vw,42px); font-weight: 900;
    color: #1a0d2e; margin: 0 0 8px; line-height: 1.1;
  }

  .mood3d-sub {
    font-size: 16px; color: #8a7a9b; font-weight: 600;
    margin: 0 0 40px;
  }

  /* Mood pills */
  .mood-pill-row {
    display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 28px;
  }

  .mp3d {
    display: flex; align-items: center; gap: 8px;
    padding: 12px 22px; border-radius: 50px;
    font-size: 15px; font-weight: 800;
    cursor: pointer; border: 2px solid transparent;
    transition: all 0.3s cubic-bezier(0.34,1.2,0.64,1);
    background: white;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    font-family: 'Nunito', sans-serif;
  }

  .mp3d:hover {
    transform: translateY(-3px) scale(1.04);
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  }

  .mp3d.active {
    color: white;
    transform: translateY(-3px) scale(1.06);
    box-shadow: 0 10px 30px rgba(0,0,0,0.18);
  }

  .pill-emoji-3d { font-size: 20px; }

  /* Vibe card */
  .vibe-card-3d {
    border-radius: 28px;
    padding: 32px;
    position: relative;
    overflow: hidden;
    transition: all 0.4s ease;
    box-shadow: 0 16px 48px rgba(0,0,0,0.1);
    min-height: 200px;
  }

  .vibe-bar {
    position: absolute;
    top: 0; left: 0;
    height: 5px; width: 100%;
    border-radius: 28px 28px 0 0;
    transition: background 0.5s;
  }

  .vibe-ai-badge {
    display: inline-flex; align-items: center; gap: 5px;
    background: rgba(255,255,255,0.25);
    border-radius: 50px; padding: 4px 12px;
    font-size: 11px; font-weight: 800;
    color: rgba(255,255,255,0.9);
    margin-bottom: 14px; backdrop-filter: blur(6px);
    border: 1px solid rgba(255,255,255,0.3);
  }

  .vibe-intro-3d {
    font-size: 22px; font-weight: 900;
    color: white; margin: 0 0 12px;
    text-shadow: 0 2px 8px rgba(0,0,0,0.15);
    animation: vibeIn 0.4s ease-out both;
  }

  .vibe-msg-3d {
    font-size: 15px; font-weight: 600;
    color: rgba(255,255,255,0.9); margin: 0;
    line-height: 1.65;
    text-shadow: 0 1px 4px rgba(0,0,0,0.1);
    animation: vibeIn 0.4s 0.05s ease-out both;
  }

  @keyframes vibeIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Rec tiles */
  .rec-grid-3d {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .rec-tile-3d {
    background: white;
    border-radius: 20px;
    padding: 20px 18px;
    border: 1.5px solid #f0e8ff;
    transition: all 0.3s;
    animation: tileIn 0.4s ease-out both;
  }

  .rec-tile-3d:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(120,60,180,0.12);
    border-color: #d4b8f5;
  }

  @keyframes tileIn {
    from { opacity: 0; transform: scale(0.92) translateY(8px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  .rec-icon-3d { font-size: 28px; display: block; margin-bottom: 8px; }
  .rec-tile-3d h4 { font-size: 12px; font-weight: 800; color: #a090b5; text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 6px; }
  .rec-tile-3d p  { font-size: 15px; font-weight: 800; color: #2d1b4e; margin: 0; }

  .color-chip-3d {
    display: inline-block;
    width: 26px; height: 26px;
    border-radius: 50%;
    border: 2.5px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    margin-right: 4px;
    transition: transform 0.2s;
  }
  .color-chip-3d:hover { transform: scale(1.2); }

  .music-link-3d {
    font-size: 14px; font-weight: 800;
    color: #7c3aed; text-decoration: none;
    display: inline-flex; align-items: center; gap: 4px;
    transition: color 0.2s;
  }
  .music-link-3d:hover { color: #5b21b6; }

  /* Layout */
  .mood3d-layout {
    display: grid;
    grid-template-columns: 380px 1fr;
    gap: 28px;
    align-items: start;
  }

  @media (max-width: 800px) {
    .mood3d-layout { grid-template-columns: 1fr; }
  }

  .rec-actions-3d {
    display: flex; gap: 12px; margin-top: 20px; flex-wrap: wrap;
  }

  .btn-mood-primary {
    background: linear-gradient(135deg, #7c3aed, #ec4899);
    color: white; border: none; border-radius: 50px;
    padding: 13px 28px; font-size: 15px; font-weight: 800;
    cursor: pointer; transition: all 0.2s;
    box-shadow: 0 6px 20px rgba(124,58,237,0.35);
    font-family: 'Nunito', sans-serif;
  }
  .btn-mood-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(124,58,237,0.45); }

  .btn-mood-ghost {
    background: white; color: #7c3aed;
    border: 2px solid #d4b8f5; border-radius: 50px;
    padding: 11px 24px; font-size: 14px; font-weight: 800;
    cursor: pointer; transition: all 0.2s;
    font-family: 'Nunito', sans-serif;
  }
  .btn-mood-ghost:hover { background: #f8f4ff; border-color: #7c3aed; transform: translateY(-2px); }
  .btn-mood-ghost.liked { background: #fff0f5; color: #ec4899; border-color: #f9a8d4; }
`

export default function MoodRecommender() {
  const [activeMood,  setActiveMood]  = useState('Happy')
  const [shuffleKey,  setShuffleKey]  = useState(0)
  const [liked,       setLiked]       = useState(false)
  const [animKey,     setAnimKey]     = useState(0)
  const styleRef = useRef(false)

  useEffect(() => {
    if (styleRef.current) return
    styleRef.current = true
    const el = document.createElement('style')
    el.textContent = MOOD_CSS
    document.head.appendChild(el)
  }, [])

  const rec = useMemo(() => {
    const profile = MOOD_ENGINE[activeMood]
    if (!profile) return null
    const flavour     = randomPick(profile.flavours)
    const topping     = randomPick(profile.toppings)
    const accentColor = randomPick(profile.colors)
    const playlist    = randomPick(profile.music)
    return {
      ...profile, flavour, topping, accentColor, playlist,
      message: `You seem ${activeMood.toLowerCase()} — try ${flavour} with ${topping}. ${profile.vibe}`,
    }
  }, [activeMood, shuffleKey])

  function switchMood(mood) {
    setActiveMood(mood)
    setLiked(false)
    setAnimKey(k => k + 1)
  }

  if (!rec) return null

  return (
    <section className="mood3d-section" id="mood">
      <span className="mood3d-badge">🤖 AI Powered</span>
      <h2 className="mood3d-title">Mood Recommender</h2>
      <p className="mood3d-sub">Tell us how you feel — we'll find your perfect scoop.</p>

      <div className="mood3d-layout">
        {/* Left col */}
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#a090b5', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            How are you feeling?
          </p>
          <div className="mood-pill-row">
            {Object.entries(MOOD_ENGINE).map(([mood, data]) => (
              <button
                key={mood}
                className={`mp3d ${activeMood === mood ? 'active' : ''}`}
                onClick={() => switchMood(mood)}
                style={activeMood === mood ? { background: data.gradient, borderColor: 'transparent' } : { color: '#2d1b4e', borderColor: '#f0e8ff' }}
              >
                <span className="pill-emoji-3d">{data.emoji}</span>
                {mood}
              </button>
            ))}
          </div>

          <div
            className="vibe-card-3d"
            key={animKey}
            style={{ background: rec.gradient || 'linear-gradient(135deg,#7c3aed,#ec4899)' }}
          >
            <div className="vibe-bar" style={{ background: 'rgba(255,255,255,0.25)' }} />
            <div className="vibe-ai-badge">✨ AI Vibe Check</div>
            <h3 className="vibe-intro-3d">{rec.intro}</h3>
            <p className="vibe-msg-3d">{rec.message}</p>
          </div>
        </div>

        {/* Right col */}
        <div>
          <div className="rec-grid-3d" key={animKey}>
            <div className="rec-tile-3d" style={{ animationDelay: '0ms' }}>
              <span className="rec-icon-3d">🍨</span>
              <h4>Flavor Match</h4>
              <p>{rec.flavour}</p>
            </div>
            <div className="rec-tile-3d" style={{ animationDelay: '60ms' }}>
              <span className="rec-icon-3d">🎉</span>
              <h4>Topping Match</h4>
              <p>{rec.topping}</p>
            </div>
            <div className="rec-tile-3d" style={{ animationDelay: '120ms' }}>
              <span className="rec-icon-3d">🎨</span>
              <h4>Color Mood</h4>
              <div style={{ marginTop: 4 }}>
                {(rec.colors || []).map(c => (
                  <span key={c} className="color-chip-3d" style={{ background: c }} title={c} />
                ))}
              </div>
            </div>
            <div className="rec-tile-3d" style={{ animationDelay: '180ms' }}>
              <span className="rec-icon-3d">🎵</span>
              <h4>Music Pairing</h4>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(rec.playlist)}`}
                target="_blank" rel="noreferrer"
                className="music-link-3d"
              >
                {rec.playlist} ↗
              </a>
            </div>
          </div>

          <div className="rec-actions-3d">
            <button className="btn-mood-primary" onClick={() => { setShuffleKey(v => v + 1); setAnimKey(k => k + 1) }}>
              🔀 Remix Suggestion
            </button>
            <button className={`btn-mood-ghost ${liked ? 'liked' : ''}`} onClick={() => setLiked(v => !v)}>
              {liked ? '❤️ Saved' : '🤍 Save Vibe'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}