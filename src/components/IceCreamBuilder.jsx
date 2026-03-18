import { useState, useEffect, useRef } from 'react'
import { SCOOPS, SAUCES, TOPPINGS, SCOOP_PALETTE } from '../data/constants'

const SAUCE_COLORS = {
  'Hot Fudge': '#3d1a00',
  'Caramel': '#c8860a',
  'Strawberry': '#e0405a',
  'Blueberry': '#4a3b8c',
  'Mango': '#f5a623',
}

const BUILDER_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

  .builder3d-root {
    font-family: 'Nunito', sans-serif;
    background: linear-gradient(135deg, #fff8f0 0%, #fff0f5 50%, #f0f4ff 100%);
    min-height: 100vh;
  }

  /* ── Scene ── */
  .scene-wrap {
    perspective: 1000px;
    perspective-origin: 50% 20%;
  }

  .ice-stage {
    position: relative;
    width: 220px;
    height: 440px;
    margin: 0 auto;
    transform-style: preserve-3d;
    animation: floatStage 5s ease-in-out infinite;
  }

  @keyframes floatStage {
    0%, 100% { transform: translateY(0px) rotateY(0deg); }
    25%       { transform: translateY(-10px) rotateY(2deg); }
    75%       { transform: translateY(-5px) rotateY(-2deg); }
  }

  /* ── Scoops ── */
  .scoop-ball {
    position: absolute;
    left: 50%;
    border-radius: 50%;
    animation: scoopDrop 0.65s cubic-bezier(0.22, 1.35, 0.36, 1) both;
    cursor: pointer;
    transition: filter 0.2s;
    z-index: 15;
  }

  .scoop-ball:hover { filter: brightness(1.12) saturate(1.1); }

  /* glossy highlight dot */
  .scoop-ball::before {
    content: '';
    position: absolute;
    top: 13%;
    left: 20%;
    width: 30%;
    height: 22%;
    background: rgba(255,255,255,0.6);
    border-radius: 50%;
    transform: rotate(-35deg);
    filter: blur(2px);
    pointer-events: none;
  }

  /* secondary small highlight */
  .scoop-ball::after {
    content: '';
    position: absolute;
    top: 10%;
    left: 22%;
    width: 12%;
    height: 9%;
    background: rgba(255,255,255,0.9);
    border-radius: 50%;
    pointer-events: none;
  }

  @keyframes scoopDrop {
    0%   { transform: translateX(-50%) translateY(-200px) scale(0.4) rotate(-20deg); opacity: 0; }
    55%  { transform: translateX(-50%) translateY(16px) scale(1.12) rotate(5deg);  opacity: 1; }
    72%  { transform: translateX(-50%) translateY(-8px) scale(0.97) rotate(-2deg); }
    85%  { transform: translateX(-50%) translateY(5px)  scale(1.03) rotate(1deg);  }
    100% { transform: translateX(-50%) translateY(0)    scale(1)    rotate(0deg);  }
  }

  @keyframes scoopRemove {
    0%   { transform: translateX(-50%) scale(1) rotate(0deg); opacity: 1; }
    40%  { transform: translateX(-50%) scale(1.15) rotate(10deg); opacity: 0.8; }
    100% { transform: translateX(-50%) scale(0.1) rotate(40deg) translateY(-60px); opacity: 0; }
  }

  .scoop-removing { animation: scoopRemove 0.35s ease-in forwards; }

  .scoop-label {
    position: absolute;
    bottom: 22%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10px;
    font-weight: 800;
    color: rgba(255,255,255,0.92);
    text-shadow: 0 1px 4px rgba(0,0,0,0.45);
    white-space: nowrap;
    pointer-events: none;
    letter-spacing: 0.02em;
  }

  /* ── Cone SVG ── */
  .cone-wrap {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 5;
    filter: drop-shadow(0 12px 28px rgba(0,0,0,0.22));
  }

  /* ── Sauce drips ── */
  .sauce-overlay {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none;
    z-index: 20;
  }

  @keyframes dripSlide {
    0%   { stroke-dashoffset: 260; opacity: 0; }
    15%  { opacity: 1; }
    100% { stroke-dashoffset: 0;   opacity: 1; }
  }

  .drip-path {
    stroke-dasharray: 260;
    stroke-dashoffset: 260;
    animation: dripSlide 1.1s ease-out forwards;
    fill: none;
    stroke-width: 6;
    stroke-linecap: round;
  }

  /* ── Toppings ── */
  .topping-cloud {
    position: absolute;
    top: 4%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 30;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 3px;
    width: 180px;
    pointer-events: none;
  }

  @keyframes toppingPop {
    0%   { transform: scale(0) rotate(-60deg) translateY(10px); opacity: 0; }
    65%  { transform: scale(1.3) rotate(10deg) translateY(-4px); opacity: 1; }
    100% { transform: scale(1) rotate(0deg) translateY(0); opacity: 1; }
  }

  .topping-item {
    font-size: 15px;
    display: inline-block;
    animation: toppingPop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
  }

  /* ── Drop zones ── */
  .dz-3d {
    border: 2px dashed #e2d4f0;
    border-radius: 18px;
    padding: 14px 18px;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: all 0.25s cubic-bezier(0.34, 1.2, 0.64, 1);
    cursor: default;
    background: rgba(255,255,255,0.7);
    backdrop-filter: blur(6px);
  }

  .dz-3d.active {
    border-color: #ff6f91;
    background: rgba(255, 111, 145, 0.1);
    transform: scale(1.04) translateY(-2px);
    box-shadow: 0 8px 28px rgba(255, 111, 145, 0.25);
  }

  /* ── Ingredient chips ── */
  .chip-3d {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 8px 14px;
    border-radius: 50px;
    font-size: 13px;
    font-weight: 700;
    cursor: grab;
    transition: all 0.2s;
    border: 1.5px solid transparent;
    user-select: none;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }

  .chip-3d:active { cursor: grabbing; }

  .chip-3d:hover {
    transform: translateY(-3px) scale(1.04);
    box-shadow: 0 8px 20px rgba(0,0,0,0.14);
  }

  .chip-3d:active {
    transform: scale(0.97);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .chip-scoop   { background: #fff4f7; border-color: #ffd6e3; color: #9b2461; }
  .chip-sauce   { background: #fffbf0; border-color: #ffd980; color: #7a4f00; }
  .chip-topping { background: #f0f8ff; border-color: #b8deff; color: #124080; }

  /* ── Cards ── */
  .glass-card {
    background: rgba(255,255,255,0.82);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.95);
    border-radius: 28px;
    box-shadow: 0 8px 40px rgba(120,60,140,0.08), 0 2px 8px rgba(0,0,0,0.04);
  }

  /* ── Tags ── */
  .tag-3d {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: 50px;
    font-size: 12px;
    font-weight: 700;
    animation: tagSlideIn 0.3s cubic-bezier(0.34, 1.4, 0.64, 1) both;
  }

  @keyframes tagSlideIn {
    from { transform: scale(0.6) translateX(-10px); opacity: 0; }
    to   { transform: scale(1) translateX(0);       opacity: 1; }
  }

  .tag-scoop   { background: #ffdde8; color: #9b2461; }
  .tag-sauce   { background: #ffeec0; color: #7a4f00; }
  .tag-topping { background: #ddf0ff; color: #124080; }

  .tag-rm {
    background: none; border: none; cursor: pointer;
    color: inherit; opacity: 0.5; font-size: 14px;
    padding: 0; line-height: 1; transition: opacity 0.15s;
  }
  .tag-rm:hover { opacity: 1; }

  /* ── Status bar ── */
  .status-3d {
    background: linear-gradient(135deg, #fff0f5, #f5f0ff);
    border: 1px solid #f0deff;
    border-radius: 14px;
    padding: 10px 18px;
    font-size: 13px;
    font-weight: 600;
    color: #6b3fa0;
    transition: all 0.3s;
    animation: statusPop 0.3s ease-out;
  }

  @keyframes statusPop {
    0% { transform: scale(0.98); }
    60% { transform: scale(1.01); }
    100% { transform: scale(1); }
  }

  /* ── Progress bars in drop zones ── */
  .dz-progress {
    height: 4px;
    border-radius: 99px;
    background: #f0e4ff;
    overflow: hidden;
    flex: 1;
  }
  .dz-progress-fill {
    height: 100%;
    border-radius: 99px;
    transition: width 0.4s cubic-bezier(0.34, 1.2, 0.64, 1);
    background: linear-gradient(90deg, #ff6f91, #ffd166);
  }

  /* ── Section ── */
  .b3d-section {
    padding: 64px 24px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .b3d-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: linear-gradient(135deg, #ff6f91, #ffd166);
    color: white; font-size: 12px; font-weight: 800;
    padding: 5px 14px; border-radius: 50px;
    letter-spacing: 0.04em; text-transform: uppercase;
    margin-bottom: 12px;
  }

  .b3d-title {
    font-size: clamp(26px, 4vw, 38px);
    font-weight: 900;
    color: #2d1b4e;
    margin: 0 0 8px;
    line-height: 1.1;
  }

  .b3d-sub {
    font-size: 15px;
    color: #8a7a9b;
    margin: 0 0 32px;
    font-weight: 600;
  }

  .b3d-layout {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 28px;
    align-items: start;
  }

  @media (max-width: 768px) {
    .b3d-layout { grid-template-columns: 1fr; }
  }

  /* Action buttons */
  .btn-3d-primary {
    background: linear-gradient(135deg, #ff6f91, #ff4d7a);
    color: white; border: none; border-radius: 50px;
    padding: 13px 28px; font-size: 15px; font-weight: 800;
    cursor: pointer; transition: all 0.2s;
    box-shadow: 0 6px 20px rgba(255,111,145,0.4);
    font-family: 'Nunito', sans-serif;
  }
  .btn-3d-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(255,111,145,0.5);
  }
  .btn-3d-primary:active { transform: scale(0.97); }

  .btn-3d-secondary {
    background: white; color: #ff6f91;
    border: 2px solid #ff6f91;
    border-radius: 50px; padding: 11px 24px;
    font-size: 14px; font-weight: 800; cursor: pointer;
    transition: all 0.2s; font-family: 'Nunito', sans-serif;
  }
  .btn-3d-secondary:hover {
    background: #fff0f4;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(255,111,145,0.2);
  }

  .btn-3d-ghost {
    background: transparent; color: #8a7a9b;
    border: 2px solid #e8dff5; border-radius: 50px;
    padding: 11px 22px; font-size: 14px; font-weight: 700;
    cursor: pointer; transition: all 0.2s;
    font-family: 'Nunito', sans-serif;
  }
  .btn-3d-ghost:hover { background: #f8f4ff; color: #6b3fa0; border-color: #c9b3e8; }

  .name-input-3d {
    border: 2px solid #e8dff5; border-radius: 50px;
    padding: 11px 20px; font-size: 14px; font-weight: 700;
    font-family: 'Nunito', sans-serif; color: #2d1b4e;
    outline: none; background: white; transition: border 0.2s;
    flex: 1;
  }
  .name-input-3d:focus { border-color: #c89ef5; box-shadow: 0 0 0 3px rgba(200,158,245,0.15); }

  .mood-select-3d {
    border: 2px solid #e8dff5; border-radius: 50px;
    padding: 11px 20px; font-size: 14px; font-weight: 700;
    font-family: 'Nunito', sans-serif; color: #2d1b4e;
    outline: none; background: white; cursor: pointer;
    transition: border 0.2s;
  }
  .mood-select-3d:focus { border-color: #c89ef5; }

  .empty-cone {
    text-align: center;
    padding: 60px 0 40px;
    color: #c0b0d0;
    font-size: 13px; font-weight: 600;
    pointer-events: none;
  }

  .palette-title-3d {
    font-size: 15px; font-weight: 800; color: #2d1b4e;
    margin-bottom: 4px;
  }
  .palette-hint-3d {
    font-size: 12px; color: #a090b5; margin-bottom: 16px; font-weight: 600;
  }
  .palette-section-label {
    font-size: 11px; font-weight: 800; color: #a090b5;
    text-transform: uppercase; letter-spacing: 0.08em;
    margin-bottom: 10px; margin-top: 18px;
    display: flex; align-items: center; gap: 6px;
  }
  .palette-section-label:first-child { margin-top: 0; }

  .ingredient-grid {
    display: flex; flex-wrap: wrap; gap: 7px;
    margin-bottom: 4px;
  }

  .summary-section {
    border-top: 1.5px solid #f0e8ff;
    padding-top: 18px; margin-top: 4px;
  }
  .summary-row-3d {
    display: flex; align-items: flex-start; gap: 10px;
    margin-bottom: 10px; font-size: 12px; font-weight: 700;
    color: #8a7a9b;
  }
  .summary-row-3d .tag-list { display: flex; flex-wrap: wrap; gap: 5px; }
`

function ConeShape({ height = 170 }) {
  return (
    <svg className="cone-wrap" width="140" height={height} viewBox="0 0 140 170">
      <defs>
        <linearGradient id="coneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#f4b86e" />
          <stop offset="45%"  stopColor="#e0862a" />
          <stop offset="100%" stopColor="#a04f0a" />
        </linearGradient>
        <linearGradient id="coneShine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.3)" />
          <stop offset="30%"  stopColor="rgba(255,255,255,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.15)" />
        </linearGradient>
        <clipPath id="coneClip">
          <polygon points="70,164 5,0 135,0" />
        </clipPath>
      </defs>
      {/* main cone shape */}
      <polygon points="70,164 5,0 135,0" fill="url(#coneGrad)" />
      {/* waffle grid lines horizontal */}
      {[18,36,54,72,90,108,126].map((y, i) => {
        const w = 5 + (y / 164) * 120
        const x0 = 70 - w / 2
        return <line key={i} x1={x0} y1={y} x2={x0 + w} y2={y}
          stroke="rgba(120,60,0,0.25)" strokeWidth="1.2" />
      })}
      {/* waffle diagonal lines left */}
      {[-4,-3,-2,-1,0,1,2,3,4,5,6].map((k, i) => (
        <line key={i}
          x1={70 + k * 22 - 110} y1={0}
          x2={70 + k * 22 + 20}  y2={164}
          stroke="rgba(120,60,0,0.18)" strokeWidth="1.2"
          clipPath="url(#coneClip)"
        />
      ))}
      {/* shine overlay */}
      <polygon points="70,164 5,0 135,0" fill="url(#coneShine)" opacity="0.7" />
      {/* rim highlight */}
      <line x1="5" y1="1" x2="135" y2="1" stroke="rgba(255,220,160,0.6)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function ScoopBall({ scoop, index, totalScoops, onRemove }) {
  const size = 130 - index * 8
  const bottom = 148 + index * 62
  const color = SCOOP_PALETTE?.[scoop] || 'linear-gradient(145deg,#f5d7e3,#e8b4c8)'

  return (
    <div
      className="scoop-ball"
      style={{
        width:  size + 'px',
        height: size + 'px',
        bottom: bottom + 'px',
        background: color,
        boxShadow: `inset -10px -10px 28px rgba(0,0,0,0.22), inset 4px 4px 12px rgba(255,255,255,0.28), 0 ${8 + index * 2}px ${20 + index * 4}px rgba(0,0,0,0.14)`,
        animationDelay: '0ms',
      }}
      onClick={onRemove}
      title={`Click to remove ${scoop}`}
    >
      <span className="scoop-label">{scoop}</span>
    </div>
  )
}

function SauceDrip({ sauce, index }) {
  const color = SAUCE_COLORS[sauce] || '#8b4513'
  const offset = 30 + index * 55
  const pathD = `M ${offset} 0 C ${offset - 8} 40, ${offset + 12} 80, ${offset - 4} 130`
  return (
    <path
      className="drip-path"
      d={pathD}
      stroke={color}
      style={{ animationDelay: `${index * 200}ms` }}
    />
  )
}

export default function IceCreamBuilder({ onSave }) {
  const [scoops,       setScoops]       = useState(['Vanilla Nova'])
  const [sauces,       setSauces]       = useState([])
  const [toppings,     setToppings]     = useState([])
  const [creationName, setCreationName] = useState('')
  const [status,       setStatus]       = useState('💡 Drag or click ingredients to build your creation.')
  const [activeMood,   setActiveMood]   = useState('Happy')
  const [dragOver,     setDragOver]     = useState(null)
  const [removing,     setRemoving]     = useState({})
  const styleRef = useRef(false)

  useEffect(() => {
    if (styleRef.current) return
    styleRef.current = true
    const el = document.createElement('style')
    el.textContent = BUILDER_CSS
    document.head.appendChild(el)
  }, [])

  function setMsg(msg) { setStatus(msg) }

  function onDragStart(e, type, item) {
    e.dataTransfer.setData('ice-item', JSON.stringify({ type, item }))
    e.dataTransfer.effectAllowed = 'copy'
  }

  function onDrop(e, zone) {
    e.preventDefault()
    setDragOver(null)
    const raw = e.dataTransfer.getData('ice-item')
    if (!raw) return
    const { type, item } = JSON.parse(raw)

    if (type !== zone) { setMsg(`⚠️ That belongs in the ${type} zone.`); return }

    if (zone === 'scoop') {
      setScoops(cur => {
        if (cur.length >= 3) { setMsg('🚫 Max 3 scoops reached.'); return cur }
        if (cur.includes(item)) { setMsg(`${item} is already in your stack.`); return cur }
        setMsg(`✅ ${item} added!`)
        return [...cur, item]
      })
    }
    if (zone === 'sauce') {
      setSauces(cur => {
        if (cur.length >= 2) { setMsg('🚫 Max 2 sauces reached.'); return cur }
        if (cur.includes(item)) { setMsg(`Already drizzled ${item}.`); return cur }
        setMsg(`✅ ${item} drizzled!`)
        return [...cur, item]
      })
    }
    if (zone === 'topping') {
      setToppings(cur => {
        if (cur.length >= 5) { setMsg('🚫 Max 5 toppings reached.'); return cur }
        if (cur.includes(item)) { setMsg(`${item} already sprinkled.`); return cur }
        setMsg(`✅ ${item} sprinkled!`)
        return [...cur, item]
      })
    }
  }

  function quickAdd(type, item) {
    if (type === 'scoop') {
      setScoops(cur => {
        if (cur.length >= 3) { setMsg('🚫 Max 3 scoops reached.'); return cur }
        if (cur.includes(item)) { setMsg(`${item} already in stack.`); return cur }
        setMsg(`✅ ${item} added!`)
        return [...cur, item]
      })
    }
    if (type === 'sauce') {
      setSauces(cur => {
        if (cur.length >= 2) { setMsg('🚫 Max 2 sauces reached.'); return cur }
        if (cur.includes(item)) { setMsg(`Already drizzled.`); return cur }
        setMsg(`✅ ${item} drizzled!`)
        return [...cur, item]
      })
    }
    if (type === 'topping') {
      setToppings(cur => {
        if (cur.length >= 5) { setMsg('🚫 Max 5 toppings reached.'); return cur }
        if (cur.includes(item)) { setMsg(`Already sprinkled.`); return cur }
        setMsg(`✅ ${item} sprinkled!`)
        return [...cur, item]
      })
    }
  }

  function removeItem(type, index) {
    const key = `${type}-${index}`
    setRemoving(r => ({ ...r, [key]: true }))
    setTimeout(() => {
      if (type === 'scoop')   setScoops(c => c.filter((_, i) => i !== index))
      if (type === 'sauce')   setSauces(c => c.filter((_, i) => i !== index))
      if (type === 'topping') setToppings(c => c.filter((_, i) => i !== index))
      setRemoving(r => { const n = { ...r }; delete n[key]; return n })
    }, 320)
  }

  function handleSave() {
    if (!scoops.length) { setMsg('⚠️ Add at least one scoop first.'); return }
    onSave?.({
      id: Date.now(),
      name: creationName.trim() || 'Untitled Creation',
      mood: activeMood,
      scoops, sauces, toppings,
      likes: Math.floor(Math.random() * 40) + 10,
      author: 'You',
    })
    setMsg('🎉 Saved & published to community wall!')
  }

  async function handleShare() {
    const text = `🍦 ${creationName || 'My Creation'} | Mood: ${activeMood} | Scoops: ${scoops.join(', ')} | Sauces: ${sauces.join(', ') || 'None'} | Toppings: ${toppings.join(', ') || 'None'}`
    try { await navigator.clipboard.writeText(text); setMsg('📋 Copied to clipboard!') }
    catch { setMsg('📋 Copy: ' + text) }
  }

  function handleReset() {
    setScoops(['Vanilla Nova']); setSauces([]); setToppings([])
    setCreationName(''); setMsg('🔄 Builder reset. Start fresh!')
  }

  const layers = [...scoops].reverse()

  return (
    <section className="b3d-section builder3d-root" id="builder">
      <span className="b3d-badge">🎨 Interactive</span>
      <h2 className="b3d-title">Design Your Ice Cream</h2>
      <p className="b3d-sub">Drag or click ingredients to build your perfect creation.</p>

      <div className="b3d-layout">
        {/* LEFT: 3D visual + summary */}
        <div>
          <div className="glass-card" style={{ padding: '28px 20px 24px', marginBottom: '20px' }}>
            <div className="scene-wrap">
              <div className="ice-stage">
                {/* Toppings cloud */}
                {toppings.length > 0 && (
                  <div className="topping-cloud">
                    {toppings.map((t, i) => (
                      <span key={t} className="topping-item"
                        style={{ animationDelay: `${i * 60}ms` }}>
                        {TOPPINGS.find(x => x.name === t)?.emoji || '🌟'} {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Scoops */}
                {layers.length === 0 && (
                  <div className="empty-cone">✨ Add your first scoop!</div>
                )}
                {layers.map((scoop, i) => (
                  <ScoopBall
                    key={`${scoop}-${i}-${scoops.length}`}
                    scoop={scoop}
                    index={i}
                    totalScoops={layers.length}
                    onRemove={() => removeItem('scoop', scoops.length - 1 - i)}
                  />
                ))}

                {/* Sauce drip overlay */}
                {sauces.length > 0 && (
                  <svg className="sauce-overlay" viewBox="0 0 140 200">
                    {sauces.map((s, i) => (
                      <SauceDrip key={s} sauce={s} index={i} />
                    ))}
                  </svg>
                )}

                {/* Cone */}
                <ConeShape />
              </div>
            </div>

            {/* Summary tags */}
            <div className="summary-section">
              <div className="summary-row-3d">
                <span>🍨</span>
                <div className="tag-list">
                  {scoops.map((s, i) => (
                    <span key={i} className="tag-3d tag-scoop">
                      {s}
                      <button className="tag-rm" onClick={() => removeItem('scoop', i)}>×</button>
                    </span>
                  ))}
                </div>
              </div>
              {sauces.length > 0 && (
                <div className="summary-row-3d">
                  <span>🍯</span>
                  <div className="tag-list">
                    {sauces.map((s, i) => (
                      <span key={i} className="tag-3d tag-sauce">
                        {s}
                        <button className="tag-rm" onClick={() => removeItem('sauce', i)}>×</button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {toppings.length > 0 && (
                <div className="summary-row-3d">
                  <span>🎉</span>
                  <div className="tag-list">
                    {toppings.map((t, i) => (
                      <span key={i} className="tag-3d tag-topping">
                        {t}
                        <button className="tag-rm" onClick={() => removeItem('topping', i)}>×</button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Drop zones */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { zone: 'scoop',   label: 'Scoops Zone',   count: scoops.length,   max: 3, emoji: '🍨', color: '#ff6f91' },
              { zone: 'sauce',   label: 'Sauces Zone',   count: sauces.length,   max: 2, emoji: '🍯', color: '#f4a261' },
              { zone: 'topping', label: 'Toppings Zone', count: toppings.length, max: 5, emoji: '🎉', color: '#4cc9f0' },
            ].map(({ zone, label, count, max, emoji, color }) => (
              <div
                key={zone}
                className={`dz-3d ${dragOver === zone ? 'active' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOver(zone) }}
                onDragLeave={() => setDragOver(null)}
                onDrop={e => onDrop(e, zone)}
              >
                <span style={{ fontSize: 20 }}>{emoji}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#2d1b4e', flex: 1 }}>{label}</span>
                <div className="dz-progress">
                  <div className="dz-progress-fill" style={{ width: `${(count / max) * 100}%`, background: `linear-gradient(90deg, ${color}, ${color}cc)` }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 800, color, minWidth: 32, textAlign: 'right' }}>{count}/{max}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Palette */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <p className="palette-title-3d">🧪 Ingredient Palette</p>
          <p className="palette-hint-3d">Drag into zones or click to add instantly</p>

          <div className="palette-section-label">🍨 Scoops (max 3)</div>
          <div className="ingredient-grid">
            {(SCOOPS || []).map(s => (
              <div
                key={s.name}
                className="chip-3d chip-scoop"
                draggable
                onDragStart={e => onDragStart(e, 'scoop', s.name)}
                onClick={() => quickAdd('scoop', s.name)}
                title="Click to add · Drag to zone"
              >
                <span>{s.emoji}</span> {s.name}
              </div>
            ))}
          </div>

          <div className="palette-section-label">🍯 Sauces (max 2)</div>
          <div className="ingredient-grid">
            {(SAUCES || []).map(s => (
              <div
                key={s.name}
                className="chip-3d chip-sauce"
                draggable
                onDragStart={e => onDragStart(e, 'sauce', s.name)}
                onClick={() => quickAdd('sauce', s.name)}
                title="Click to add · Drag to zone"
              >
                <span>{s.emoji}</span> {s.name}
              </div>
            ))}
          </div>

          <div className="palette-section-label">🎉 Toppings (max 5)</div>
          <div className="ingredient-grid">
            {(TOPPINGS || []).map(t => (
              <div
                key={t.name}
                className="chip-3d chip-topping"
                draggable
                onDragStart={e => onDragStart(e, 'topping', t.name)}
                onClick={() => quickAdd('topping', t.name)}
                title="Click to add · Drag to zone"
              >
                <span>{t.emoji}</span> {t.name}
              </div>
            ))}
          </div>

          {/* Footer actions */}
          <div style={{ borderTop: '1.5px solid #f0e8ff', marginTop: 24, paddingTop: 20 }}>
            <div className="status-3d" style={{ marginBottom: 16 }}>{status}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
              <input
                className="name-input-3d"
                value={creationName}
                onChange={e => setCreationName(e.target.value)}
                placeholder="Name your creation..."
              />
              <select
                className="mood-select-3d"
                value={activeMood}
                onChange={e => setActiveMood(e.target.value)}
              >
                {['Happy', 'Sad', 'Chill', 'Stressed'].map(m => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <button className="btn-3d-primary"    onClick={handleSave}>💾 Save & Publish</button>
              <button className="btn-3d-secondary"  onClick={handleShare}>🔗 Share</button>
              <button className="btn-3d-ghost"      onClick={handleReset}>🔄 Reset</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}