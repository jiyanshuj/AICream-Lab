import { useEffect, useRef } from 'react'

const HERO_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

  .hero3d {
    font-family: 'Nunito', sans-serif;
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    overflow: hidden;
    background: linear-gradient(145deg, #fff8f0 0%, #fff0f5 40%, #f5f0ff 70%, #eff8ff 100%);
  }

  /* animated blobs */
  .hero-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(70px);
    animation: blobDrift var(--dur) ease-in-out infinite alternate;
    pointer-events: none;
    z-index: 0;
  }

  @keyframes blobDrift {
    from { transform: translate(0, 0) scale(1); }
    to   { transform: translate(var(--dx), var(--dy)) scale(1.1); }
  }

  .hero-inner {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: 1fr 420px;
    gap: 48px;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 80px 32px;
    width: 100%;
  }

  @media (max-width: 900px) {
    .hero-inner { grid-template-columns: 1fr; text-align: center; }
    .hero-visual-col { display: flex; justify-content: center; }
  }

  .hero-badge-3d {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(255,111,145,0.12);
    border: 1.5px solid rgba(255,111,145,0.3);
    border-radius: 50px;
    padding: 6px 18px;
    font-size: 13px;
    font-weight: 800;
    color: #e03060;
    margin-bottom: 20px;
    animation: fadeUp 0.6s ease-out both;
  }

  .hero-title-3d {
    font-size: clamp(38px, 6vw, 68px);
    font-weight: 900;
    color: #1a0d2e;
    line-height: 1.05;
    margin: 0 0 20px;
    animation: fadeUp 0.7s 0.1s ease-out both;
  }

  .hero-highlight-3d {
    background: linear-gradient(135deg, #ff6f91, #ffd166, #ff9a3c);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: inline-block;
  }

  .hero-subtitle-3d {
    font-size: 18px;
    color: #6a5280;
    font-weight: 600;
    line-height: 1.65;
    margin: 0 0 36px;
    max-width: 520px;
    animation: fadeUp 0.7s 0.2s ease-out both;
  }

  .hero-actions-3d {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
    animation: fadeUp 0.7s 0.3s ease-out both;
  }

  .hero-btn-primary {
    background: linear-gradient(135deg, #ff6f91, #ff4d7a);
    color: white; border: none; border-radius: 50px;
    padding: 15px 32px; font-size: 16px; font-weight: 800;
    cursor: pointer; text-decoration: none;
    display: inline-flex; align-items: center; gap: 8px;
    box-shadow: 0 8px 28px rgba(255,111,145,0.45);
    transition: all 0.25s;
    font-family: 'Nunito', sans-serif;
  }
  .hero-btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 14px 36px rgba(255,111,145,0.55);
  }

  .hero-btn-secondary {
    background: white; color: #6b3fa0;
    border: 2px solid rgba(107,63,160,0.25); border-radius: 50px;
    padding: 13px 28px; font-size: 16px; font-weight: 800;
    cursor: pointer; text-decoration: none;
    display: inline-flex; align-items: center; gap: 8px;
    transition: all 0.25s;
    font-family: 'Nunito', sans-serif;
  }
  .hero-btn-secondary:hover {
    background: #f8f4ff;
    border-color: #6b3fa0;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(107,63,160,0.15);
  }

  .hero-stats-3d {
    display: flex;
    gap: 32px;
    margin-top: 48px;
    animation: fadeUp 0.7s 0.4s ease-out both;
    flex-wrap: wrap;
  }

  .hero-stat-item { text-align: left; }
  .hero-stat-num {
    font-size: 28px; font-weight: 900; color: #1a0d2e;
    display: block; line-height: 1;
  }
  .hero-stat-lbl {
    font-size: 13px; color: #9480b0; font-weight: 600;
  }
  .stat-sep {
    width: 1.5px; background: #e8d8f5; border-radius: 2px;
    align-self: stretch;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── 3D Ice Cream Visual ── */
  .hero-visual-col {
    animation: fadeUp 0.8s 0.15s ease-out both;
  }

  .hero-cone-scene {
    position: relative;
    width: 320px;
    height: 480px;
  }

  .hero-cone-float {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    animation: heroFloat 5s ease-in-out infinite;
    filter: drop-shadow(0 28px 40px rgba(120,60,180,0.2));
  }

  @keyframes heroFloat {
    0%, 100% { transform: translateX(-50%) translateY(0) rotate(0deg); }
    25%       { transform: translateX(-50%) translateY(-16px) rotate(1.5deg); }
    75%       { transform: translateX(-50%) translateY(-8px) rotate(-1.5deg); }
  }

  .hero-scoop {
    position: absolute;
    left: 50%;
    border-radius: 50%;
    animation: heroScoopIn 0.7s cubic-bezier(0.22,1.35,0.36,1) both;
  }

  .hero-scoop::before {
    content: '';
    position: absolute;
    top: 12%; left: 18%;
    width: 30%; height: 22%;
    background: rgba(255,255,255,0.58);
    border-radius: 50%;
    transform: rotate(-30deg);
    filter: blur(3px);
  }
  .hero-scoop::after {
    content: '';
    position: absolute;
    top: 10%; left: 20%;
    width: 12%; height: 8%;
    background: rgba(255,255,255,0.9);
    border-radius: 50%;
  }

  @keyframes heroScoopIn {
    from { transform: translateX(-50%) scale(0.3) rotate(-20deg); opacity: 0; }
    to   { transform: translateX(-50%) scale(1) rotate(0deg); opacity: 1; }
  }

  /* floating flavor chips */
  .hero-chip-3d {
    position: absolute;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(12px);
    border: 1.5px solid rgba(255,255,255,0.8);
    border-radius: 50px;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 800;
    color: #2d1b4e;
    box-shadow: 0 6px 24px rgba(120,60,180,0.14);
    animation: chipFloat var(--cdur, 4s) var(--cdel, 0s) ease-in-out infinite alternate;
    white-space: nowrap;
  }

  @keyframes chipFloat {
    from { transform: translateY(0) rotate(var(--rot, -3deg)); }
    to   { transform: translateY(-12px) rotate(calc(var(--rot, -3deg) * -1)); }
  }

  /* sprinkle dots */
  .sprinkle {
    position: absolute;
    border-radius: 50px;
    animation: sprinkleFloat var(--sdur) ease-in-out infinite alternate;
    opacity: 0.6;
  }

  @keyframes sprinkleFloat {
    from { transform: translateY(0) rotate(0deg); }
    to   { transform: translateY(-8px) rotate(180deg); }
  }
`

const SCOOPS_DATA = [
  { color: 'linear-gradient(145deg,#f8b4c8,#f06090)', size: 120, bottom: 230, shadow: 'rgba(240,96,144,0.35)' },
  { color: 'linear-gradient(145deg,#a8d8ea,#5bb8d4)', size: 130, bottom: 170, shadow: 'rgba(91,184,212,0.3)' },
  { color: 'linear-gradient(145deg,#fce38a,#f5a623)', size: 140, bottom: 104, shadow: 'rgba(245,166,35,0.3)' },
]

const CHIPS = [
  { label: '🍓 Strawberry Pop', style: { top: '6%',  left: '-12%', '--cdur': '4.2s', '--cdel': '0s',    '--rot': '-4deg' } },
  { label: '🌿 Mint Breeze',    style: { top: '32%', right: '-8%', '--cdur': '3.8s', '--cdel': '0.6s',  '--rot': '3deg'  } },
  { label: '🍫 Choco Lava',     style: { top: '60%', left: '-8%',  '--cdur': '5s',   '--cdel': '1.2s',  '--rot': '-2deg' } },
]

const SPRINKLES = [
  { w: 24, h: 8,  top: '18%', left: '78%', bg: '#ff6f91', '--sdur': '3.1s' },
  { w: 20, h: 7,  top: '42%', left: '6%',  bg: '#4cc9f0', '--sdur': '4.2s' },
  { w: 18, h: 6,  top: '70%', right: '5%', bg: '#ffd166', '--sdur': '2.8s' },
  { w: 14, h: 5,  top: '8%',  right: '20%',bg: '#7c3aed', '--sdur': '5s'   },
]

export default function Hero() {
  const styleRef = useRef(false)
  useEffect(() => {
    if (styleRef.current) return
    styleRef.current = true
    const el = document.createElement('style')
    el.textContent = HERO_CSS
    document.head.appendChild(el)
  }, [])

  return (
    <header className="hero3d" id="home">
      {/* Background blobs */}
      <div className="hero-blob" style={{ width: 500, height: 500, top: '-10%', left: '-5%', background: 'rgba(255,200,220,0.35)', '--dur': '9s', '--dx': '30px', '--dy': '20px' }} />
      <div className="hero-blob" style={{ width: 400, height: 400, bottom: '5%', right: '-8%',  background: 'rgba(180,200,255,0.3)',  '--dur': '11s','--dx': '-20px','--dy': '-30px' }} />
      <div className="hero-blob" style={{ width: 300, height: 300, top: '40%', left: '40%',    background: 'rgba(255,220,150,0.25)', '--dur': '7s', '--dx': '25px', '--dy': '-15px' }} />

      <div className="hero-inner">
        {/* Text */}
        <div>
          <span className="hero-badge-3d">✨ AI-Powered Experience</span>
          <h1 className="hero-title-3d">
            Build Your<br />
            <span className="hero-highlight-3d">Mood</span> Ice Cream
          </h1>
          <p className="hero-subtitle-3d">
            Where emotions become flavors. Discover AI-curated scoops, design your
            dream creation, and share it with the world.
          </p>
          <div className="hero-actions-3d">
            <a href="#mood"    className="hero-btn-primary">Explore Moods 🎭</a>
            <a href="#builder" className="hero-btn-secondary">Start Building 🍦</a>
          </div>
          <div className="hero-stats-3d">
            <div className="hero-stat-item">
              <span className="hero-stat-num">10K+</span>
              <span className="hero-stat-lbl">Creations Shared</span>
            </div>
            <div className="stat-sep" />
            <div className="hero-stat-item">
              <span className="hero-stat-num">4</span>
              <span className="hero-stat-lbl">Mood Profiles</span>
            </div>
            <div className="stat-sep" />
            <div className="hero-stat-item">
              <span className="hero-stat-num">50+</span>
              <span className="hero-stat-lbl">Flavor Combos</span>
            </div>
          </div>
        </div>

        {/* 3D Visual */}
        <div className="hero-visual-col" aria-hidden="true">
          <div className="hero-cone-scene">
            {/* Floating chips */}
            {CHIPS.map((c, i) => (
              <div key={i} className="hero-chip-3d" style={c.style}>{c.label}</div>
            ))}

            {/* Sprinkles */}
            {SPRINKLES.map((s, i) => (
              <div key={i} className="sprinkle"
                style={{ width: s.w, height: s.h, top: s.top, left: s.left, right: s.right, background: s.bg, '--sdur': s['--sdur'], animationDelay: `${i * 0.4}s` }}
              />
            ))}

            {/* Floating cone with 3D scoops */}
            <div className="hero-cone-float">
              <div style={{ position: 'relative', width: 180, height: 360 }}>
                {SCOOPS_DATA.map((scoop, i) => (
                  <div
                    key={i}
                    className="hero-scoop"
                    style={{
                      width:  scoop.size,
                      height: scoop.size,
                      bottom: scoop.bottom,
                      background: scoop.color,
                      boxShadow: `inset -10px -10px 24px rgba(0,0,0,0.2), inset 4px 4px 10px rgba(255,255,255,0.3), 0 10px 30px ${scoop.shadow}`,
                      animationDelay: `${i * 180}ms`,
                    }}
                  />
                ))}

                {/* SVG Cone */}
                <svg
                  style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)' }}
                  width="140" height="170" viewBox="0 0 140 170"
                >
                  <defs>
                    <linearGradient id="hcg" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%"   stopColor="#f4b86e" />
                      <stop offset="45%"  stopColor="#e0862a" />
                      <stop offset="100%" stopColor="#a04f0a" />
                    </linearGradient>
                    <clipPath id="hcc">
                      <polygon points="70,164 5,0 135,0" />
                    </clipPath>
                  </defs>
                  <polygon points="70,164 5,0 135,0" fill="url(#hcg)" />
                  {[18,36,54,72,90,108,126].map((y, i) => {
                    const w = 5 + (y / 164) * 120
                    return <line key={i} x1={70-w/2} y1={y} x2={70+w/2} y2={y} stroke="rgba(120,60,0,0.22)" strokeWidth="1.2" />
                  })}
                  {[-3,-2,-1,0,1,2,3,4,5].map((k, i) => (
                    <line key={i} x1={70+k*22-100} y1={0} x2={70+k*22+20} y2={164}
                      stroke="rgba(120,60,0,0.16)" strokeWidth="1.2" clipPath="url(#hcc)" />
                  ))}
                  <polygon points="70,164 5,0 135,0" fill="rgba(255,255,255,0.08)" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}