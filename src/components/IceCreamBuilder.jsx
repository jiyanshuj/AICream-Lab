import { useState, useEffect, useRef } from 'react'
import { SCOOPS, SAUCES, TOPPINGS } from '../data/constants'
import { SCOOP_IMAGES } from '../data/imageConstants'

const SAUCE_COLORS = {
  'Hot Fudge':'#3d1a00','Caramel':'#c8860a','Strawberry':'#e0405a','Blueberry':'#4a3b8c','Mango':'#f5a623',
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
.bld-root{font-family:'Nunito',sans-serif;background:linear-gradient(135deg,#fff8f0,#fff0f5 50%,#f0f4ff);}

.bld-scene{perspective:900px;perspective-origin:50% 15%;}
.bld-stage{position:relative;width:240px;height:460px;margin:0 auto;transform-style:preserve-3d;animation:stageFloat 5s ease-in-out infinite;}
@keyframes stageFloat{0%,100%{transform:translateY(0) rotateY(0deg);}30%{transform:translateY(-12px) rotateY(3deg);}70%{transform:translateY(-6px) rotateY(-3deg);}}

.rscoop{position:absolute;left:50%;border-radius:50%;overflow:hidden;cursor:pointer;animation:scoopDrop .7s cubic-bezier(.22,1.35,.36,1) both;transition:filter .2s,transform .2s;z-index:15;}
.rscoop img{width:100%;height:100%;object-fit:cover;display:block;pointer-events:none;transition:transform .4s ease;}
.rscoop:hover{filter:brightness(1.08) saturate(1.1);}
.rscoop:hover img{transform:scale(1.07);}
.rscoop::before{content:'';position:absolute;top:8%;left:14%;width:36%;height:26%;background:radial-gradient(ellipse,rgba(255,255,255,.62) 0%,rgba(255,255,255,0) 100%);border-radius:50%;transform:rotate(-30deg);pointer-events:none;z-index:20;}
.rscoop::after{content:'';position:absolute;top:11%;left:17%;width:10%;height:7%;background:rgba(255,255,255,.88);border-radius:50%;pointer-events:none;z-index:20;}
.scoop-pill{position:absolute;bottom:11%;left:50%;transform:translateX(-50%);background:rgba(255,255,255,.72);backdrop-filter:blur(8px);border-radius:50px;padding:3px 10px;font-size:10px;font-weight:800;color:#2d1b4e;white-space:nowrap;pointer-events:none;z-index:22;}
@keyframes scoopDrop{
  0%{transform:translateX(-50%) translateY(-220px) scale(.35) rotate(-20deg);opacity:0;}
  55%{transform:translateX(-50%) translateY(18px) scale(1.1) rotate(5deg);opacity:1;}
  72%{transform:translateX(-50%) translateY(-9px) scale(.97) rotate(-2deg);}
  86%{transform:translateX(-50%) translateY(5px) scale(1.02) rotate(1deg);}
  100%{transform:translateX(-50%) translateY(0) scale(1) rotate(0deg);}
}

.cone-svg{position:absolute;bottom:0;left:50%;transform:translateX(-50%);z-index:5;filter:drop-shadow(0 14px 32px rgba(0,0,0,.22));}

.sauce-svg{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:20;overflow:visible;}
@keyframes dripDraw{0%{stroke-dashoffset:280;opacity:0;}12%{opacity:1;}100%{stroke-dashoffset:0;opacity:1;}}
.drip-path{stroke-dasharray:280;stroke-dashoffset:280;animation:dripDraw 1.2s ease-out forwards;fill:none;stroke-width:5.5;stroke-linecap:round;}

.t-cloud{position:absolute;top:2%;left:50%;transform:translateX(-50%);z-index:30;display:flex;flex-wrap:wrap;justify-content:center;gap:3px;width:190px;pointer-events:none;}
@keyframes tPop{0%{transform:scale(0) rotate(-60deg) translateY(8px);opacity:0;}65%{transform:scale(1.25) rotate(8deg);opacity:1;}100%{transform:scale(1) rotate(0);opacity:1;}}
.t-item{font-size:15px;animation:tPop .45s cubic-bezier(.34,1.56,.64,1) both;filter:drop-shadow(0 2px 4px rgba(0,0,0,.18));}

/* ── Improved empty state ── */
.stage-empty {
  position:absolute;top:50%;left:50%;transform:translate(-50%,-65%);
  text-align:center;pointer-events:none;z-index:5;width:200px;
}
.stage-empty-img {
  width:80px;height:80px;border-radius:50%;overflow:hidden;margin:0 auto 10px;
  border:3px solid rgba(255,255,255,.8);box-shadow:0 6px 20px rgba(120,60,180,.15);
  animation:emptyBob 3s ease-in-out infinite;
}
.stage-empty-img img{width:100%;height:100%;object-fit:cover;display:block;}
@keyframes emptyBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
.stage-empty-txt{font-size:12px;font-weight:700;color:#c0b0d0;line-height:1.5;}

.dzone{border:2px dashed #e2d4f0;border-radius:18px;padding:13px 16px;display:flex;align-items:center;gap:12px;transition:all .25s cubic-bezier(.34,1.2,.64,1);background:rgba(255,255,255,.7);backdrop-filter:blur(6px);}
.dzone.dz-on{border-color:#ff6f91;background:rgba(255,111,145,.1);transform:scale(1.04) translateY(-2px);box-shadow:0 8px 28px rgba(255,111,145,.25);}
.dz-prog{height:4px;border-radius:99px;background:#f0e4ff;overflow:hidden;flex:1;}
.dz-fill{height:100%;border-radius:99px;transition:width .4s cubic-bezier(.34,1.2,.64,1);}

.ing-chip{display:flex;align-items:center;gap:7px;padding:8px 14px;border-radius:50px;font-size:12.5px;font-weight:700;cursor:grab;user-select:none;transition:all .2s;border:1.5px solid transparent;box-shadow:0 2px 8px rgba(0,0,0,.07);}
.ing-chip:hover{transform:translateY(-3px) scale(1.04);box-shadow:0 8px 20px rgba(0,0,0,.13);}
.ing-chip:active{cursor:grabbing;transform:scale(.97);}
.scoop-thumb{width:30px;height:30px;border-radius:50%;overflow:hidden;flex-shrink:0;border:2px solid rgba(255,255,255,.85);box-shadow:0 2px 7px rgba(0,0,0,.16);}
.scoop-thumb img{width:100%;height:100%;object-fit:cover;display:block;}
.chip-scoop{background:#fff4f7;border-color:#ffd6e3;color:#9b2461;}
.chip-sauce{background:#fffbf0;border-color:#ffd980;color:#7a4f00;}
.chip-topping{background:#f0f8ff;border-color:#b8deff;color:#124080;}

.glass-card{background:rgba(255,255,255,.84);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.95);border-radius:28px;box-shadow:0 8px 40px rgba(120,60,140,.08),0 2px 8px rgba(0,0,0,.04);}
.tag3{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:50px;font-size:12px;font-weight:700;animation:tagIn .3s cubic-bezier(.34,1.4,.64,1) both;}
@keyframes tagIn{from{transform:scale(.6) translateX(-10px);opacity:0}to{transform:scale(1);opacity:1}}
.tag-sc{background:#ffdde8;color:#9b2461;} .tag-sa{background:#ffeec0;color:#7a4f00;} .tag-tp{background:#ddf0ff;color:#124080;}
.tag-rm{background:none;border:none;cursor:pointer;color:inherit;opacity:.5;font-size:14px;padding:0;transition:opacity .15s;}
.tag-rm:hover{opacity:1;}
.status3{background:linear-gradient(135deg,#fff0f5,#f5f0ff);border:1px solid #f0deff;border-radius:14px;padding:10px 18px;font-size:13px;font-weight:600;color:#6b3fa0;animation:stPop .3s ease-out;}
@keyframes stPop{0%{transform:scale(.98)}60%{transform:scale(1.01)}100%{transform:scale(1)}}
.bld-section{padding:64px 24px;max-width:1200px;margin:0 auto;}
.bld-layout{display:grid;grid-template-columns:300px 1fr;gap:28px;align-items:start;}
@media(max-width:768px){.bld-layout{grid-template-columns:1fr;}}
.bld-badge{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#ff6f91,#ffd166);color:white;font-size:12px;font-weight:800;padding:5px 14px;border-radius:50px;letter-spacing:.04em;text-transform:uppercase;margin-bottom:12px;}
.bld-title{font-size:clamp(26px,4vw,38px);font-weight:900;color:#2d1b4e;margin:0 0 8px;line-height:1.1;}
.bld-sub{font-size:15px;color:#8a7a9b;font-weight:600;margin:0 0 32px;}
.btn-p{background:linear-gradient(135deg,#ff6f91,#ff4d7a);color:white;border:none;border-radius:50px;padding:13px 28px;font-size:15px;font-weight:800;cursor:pointer;transition:all .2s;box-shadow:0 6px 20px rgba(255,111,145,.4);font-family:'Nunito',sans-serif;}
.btn-p:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(255,111,145,.5);}
.btn-s{background:white;color:#ff6f91;border:2px solid #ff6f91;border-radius:50px;padding:11px 24px;font-size:14px;font-weight:800;cursor:pointer;transition:all .2s;font-family:'Nunito',sans-serif;}
.btn-s:hover{background:#fff0f4;transform:translateY(-2px);}
.btn-g{background:transparent;color:#8a7a9b;border:2px solid #e8dff5;border-radius:50px;padding:11px 22px;font-size:14px;font-weight:700;cursor:pointer;transition:all .2s;font-family:'Nunito',sans-serif;}
.btn-g:hover{background:#f8f4ff;color:#6b3fa0;border-color:#c9b3e8;}
.name-in{border:2px solid #e8dff5;border-radius:50px;padding:11px 20px;font-size:14px;font-weight:700;font-family:'Nunito',sans-serif;color:#2d1b4e;outline:none;background:white;transition:border .2s;flex:1;}
.name-in:focus{border-color:#c89ef5;box-shadow:0 0 0 3px rgba(200,158,245,.15);}
.mood-sel{border:2px solid #e8dff5;border-radius:50px;padding:11px 20px;font-size:14px;font-weight:700;font-family:'Nunito',sans-serif;color:#2d1b4e;outline:none;background:white;cursor:pointer;}
.summ-sec{border-top:1.5px solid #f0e8ff;padding-top:16px;margin-top:4px;}
.summ-row{display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;font-size:12px;font-weight:700;color:#8a7a9b;}
.tlist{display:flex;flex-wrap:wrap;gap:5px;}
.pal-lbl{font-size:11px;font-weight:800;color:#a090b5;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;margin-top:18px;display:flex;align-items:center;gap:6px;}
.pal-lbl:first-child{margin-top:0;}
.ing-grid{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:4px;}
`

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=300&fit=crop&q=80'

function WaffleCone() {
  return (
    <svg className="cone-svg" width="150" height="178" viewBox="0 0 150 178">
      <defs>
        <linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f4b86e"/><stop offset="45%" stopColor="#e0862a"/><stop offset="100%" stopColor="#a04f0a"/>
        </linearGradient>
        <linearGradient id="cs" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,.28)"/><stop offset="35%" stopColor="rgba(255,255,255,0)"/><stop offset="100%" stopColor="rgba(0,0,0,.14)"/>
        </linearGradient>
        <clipPath id="cc"><polygon points="75,172 4,0 146,0"/></clipPath>
      </defs>
      <polygon points="75,172 4,0 146,0" fill="url(#cg)"/>
      {[18,36,54,72,90,110,132].map((y,i)=>{const w=5+(y/172)*134;const x0=75-w/2;return <line key={i} x1={x0} y1={y} x2={x0+w} y2={y} stroke="rgba(120,60,0,.24)" strokeWidth="1.2"/>})}
      {[-5,-4,-3,-2,-1,0,1,2,3,4,5,6].map((k,i)=><line key={i} x1={75+k*24-115} y1={0} x2={75+k*24+22} y2={172} stroke="rgba(120,60,0,.17)" strokeWidth="1.2" clipPath="url(#cc)"/>)}
      <polygon points="75,172 4,0 146,0" fill="url(#cs)" opacity=".7"/>
      <line x1="4" y1="1" x2="146" y2="1" stroke="rgba(255,220,160,.55)" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
}

function PhotoScoop({ scoop, index, onRemove }) {
  const size   = 140 - index * 10
  const bottom = 154 + index * 66
  const imgSrc = (SCOOP_IMAGES && SCOOP_IMAGES[scoop]) ? SCOOP_IMAGES[scoop] : FALLBACK_IMG
  return (
    <div className="rscoop"
      style={{ width:size, height:size, bottom:bottom,
        boxShadow:`0 ${8+index*3}px ${20+index*5}px rgba(0,0,0,.22),inset 0 -6px 18px rgba(0,0,0,.14),inset 0 4px 10px rgba(255,255,255,.22)` }}
      onClick={onRemove} title={`Click to remove ${scoop}`}
    >
      <img src={imgSrc} alt={scoop} loading="lazy"/>
      <span className="scoop-pill">{scoop}</span>
    </div>
  )
}

function SauceDrip({ sauce, index }) {
  const color = SAUCE_COLORS[sauce] || '#8b4513'
  const x = 38 + index * 58
  return (
    <path className="drip-path"
      d={`M ${x} 0 C ${x-9} 45, ${x+13} 88, ${x-5} 140`}
      stroke={color} style={{ animationDelay:`${index*210}ms` }}/>
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
  const styleRef = useRef(false)

  useEffect(() => {
    if (styleRef.current) return; styleRef.current = true
    const el = document.createElement('style'); el.textContent = CSS; document.head.appendChild(el)
  }, [])

  const msg = (m) => setStatus(m)

  function addItem(type, item) {
    if (type === 'scoop') setScoops(c => {
      if (c.length >= 3)    { msg('🚫 Max 3 scoops.'); return c }
      if (c.includes(item)) { msg(`${item} already added.`); return c }
      msg(`✅ ${item} added!`); return [...c, item]
    })
    if (type === 'sauce') setSauces(c => {
      if (c.length >= 2)    { msg('🚫 Max 2 sauces.'); return c }
      if (c.includes(item)) { msg(`Already drizzled.`); return c }
      msg(`✅ ${item} drizzled!`); return [...c, item]
    })
    if (type === 'topping') setToppings(c => {
      if (c.length >= 5)    { msg('🚫 Max 5 toppings.'); return c }
      if (c.includes(item)) { msg(`Already sprinkled.`); return c }
      msg(`✅ ${item} on top!`); return [...c, item]
    })
  }

  function onDragStart(e, type, item) {
    e.dataTransfer.setData('ice-item', JSON.stringify({ type, item })); e.dataTransfer.effectAllowed = 'copy'
  }
  function onDrop(e, zone) {
    e.preventDefault(); setDragOver(null)
    const raw = e.dataTransfer.getData('ice-item'); if (!raw) return
    const { type, item } = JSON.parse(raw)
    if (type !== zone) { msg(`⚠️ That belongs in the ${type} zone.`); return }
    addItem(zone, item)
  }

  // ✅ FIXED: was "removItem" (typo) — now correctly "removeItem" in all 3 cases
  function removeItem(type, idx) {
    if (type === 'scoop')   setScoops(c   => c.filter((_, i) => i !== idx))
    if (type === 'sauce')   setSauces(c   => c.filter((_, i) => i !== idx))
    if (type === 'topping') setToppings(c => c.filter((_, i) => i !== idx))
  }

  function handleSave() {
    if (!scoops.length) { msg('⚠️ Add at least one scoop.'); return }
    onSave?.({ id:Date.now(), name:creationName.trim()||'Untitled Creation', mood:activeMood, scoops, sauces, toppings, likes:Math.floor(Math.random()*40)+10, author:'You' })
    msg('🎉 Saved & published!')
  }
  async function handleShare() {
    const text = `🍦 ${creationName||'My Creation'} | Mood: ${activeMood} | ${scoops.join(', ')}`
    try { await navigator.clipboard.writeText(text); msg('📋 Copied!') } catch { msg('Copy: '+text) }
  }
  function handleReset() {
    setScoops(['Vanilla Nova']); setSauces([]); setToppings([]); setCreationName(''); msg('🔄 Reset!')
  }

  const layers = [...scoops].reverse()

  return (
    <section className="bld-section bld-root" id="builder">
      <span className="bld-badge">🎨 Interactive</span>
      <h2 className="bld-title">Design Your Ice Cream</h2>
      <p className="bld-sub">Drag or click ingredients to stack your perfect creation.</p>

      <div className="bld-layout">
        {/* LEFT: 3D stage */}
        <div>
          <div className="glass-card" style={{ padding:'28px 20px 22px', marginBottom:20 }}>
            <div className="bld-scene">
              <div className="bld-stage">
                {toppings.length > 0 && (
                  <div className="t-cloud">
                    {toppings.map((t,i) => (
                      <span key={t} className="t-item" style={{ animationDelay:`${i*60}ms` }}>
                        {(TOPPINGS||[]).find(x=>x.name===t)?.emoji||'🌟'} {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Improved empty state with real photo */}
                {layers.length === 0 && (
                  <div className="stage-empty">
                    <div className="stage-empty-img">
                      <img src="https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=160&h=160&fit=crop&q=80" alt=""/>
                    </div>
                    <p className="stage-empty-txt">Click a scoop<br/>to get started!</p>
                  </div>
                )}

                {layers.map((scoop,i) => (
                  <PhotoScoop key={`${scoop}-${i}-${scoops.length}`} scoop={scoop} index={i}
                    onRemove={() => removeItem('scoop', scoops.length-1-i)}/>
                ))}

                {sauces.length > 0 && (
                  <svg className="sauce-svg" viewBox="0 0 150 200">
                    {sauces.map((s,i) => <SauceDrip key={s} sauce={s} index={i}/>)}
                  </svg>
                )}

                <WaffleCone/>
              </div>
            </div>

            {/* summary */}
            <div className="summ-sec">
              <div className="summ-row"><span>🍨</span>
                <div className="tlist">{scoops.map((s,i) => <span key={i} className="tag3 tag-sc">{s}<button className="tag-rm" onClick={()=>removeItem('scoop',i)}>×</button></span>)}</div>
              </div>
              {sauces.length>0 && <div className="summ-row"><span>🍯</span>
                <div className="tlist">{sauces.map((s,i) => <span key={i} className="tag3 tag-sa">{s}<button className="tag-rm" onClick={()=>removeItem('sauce',i)}>×</button></span>)}</div>
              </div>}
              {toppings.length>0 && <div className="summ-row"><span>🎉</span>
                <div className="tlist">{toppings.map((t,i) => <span key={i} className="tag3 tag-tp">{t}<button className="tag-rm" onClick={()=>removeItem('topping',i)}>×</button></span>)}</div>
              </div>}
            </div>
          </div>

          {/* drop zones */}
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {[
              { zone:'scoop',   label:'Scoops Zone',   count:scoops.length,   max:3, emoji:'🍨', color:'#ff6f91' },
              { zone:'sauce',   label:'Sauces Zone',   count:sauces.length,   max:2, emoji:'🍯', color:'#f4a261' },
              { zone:'topping', label:'Toppings Zone', count:toppings.length, max:5, emoji:'🎉', color:'#4cc9f0' },
            ].map(({ zone, label, count, max, emoji, color }) => (
              <div key={zone} className={`dzone ${dragOver===zone?'dz-on':''}`}
                onDragOver={e=>{e.preventDefault();setDragOver(zone)}}
                onDragLeave={()=>setDragOver(null)} onDrop={e=>onDrop(e,zone)}>
                <span style={{fontSize:20}}>{emoji}</span>
                <span style={{fontSize:13,fontWeight:700,color:'#2d1b4e',flex:1}}>{label}</span>
                <div className="dz-prog"><div className="dz-fill" style={{width:`${(count/max)*100}%`,background:`linear-gradient(90deg,${color},${color}bb)`}}/></div>
                <span style={{fontSize:12,fontWeight:800,color,minWidth:32,textAlign:'right'}}>{count}/{max}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Palette */}
        <div className="glass-card" style={{ padding:24 }}>
          <p style={{fontSize:15,fontWeight:800,color:'#2d1b4e',margin:'0 0 4px'}}>🧪 Ingredient Palette</p>
          <p style={{fontSize:12,color:'#a090b5',marginBottom:16,fontWeight:600}}>Click to add · Drag to zone</p>

          <div className="pal-lbl">🍨 Scoops (max 3)</div>
          <div className="ing-grid">
            {(SCOOPS||[]).map(s => (
              <div key={s.name} className="ing-chip chip-scoop"
                draggable onDragStart={e=>onDragStart(e,'scoop',s.name)}
                onClick={()=>addItem('scoop',s.name)} title="Click or drag">
                <div className="scoop-thumb">
                  <img src={(SCOOP_IMAGES&&SCOOP_IMAGES[s.name])||FALLBACK_IMG} alt={s.name} loading="lazy"/>
                </div>
                {s.name}
              </div>
            ))}
          </div>

          <div className="pal-lbl">🍯 Sauces (max 2)</div>
          <div className="ing-grid">
            {(SAUCES||[]).map(s => (
              <div key={s.name} className="ing-chip chip-sauce"
                draggable onDragStart={e=>onDragStart(e,'sauce',s.name)}
                onClick={()=>addItem('sauce',s.name)}>
                <span>{s.emoji}</span>{s.name}
              </div>
            ))}
          </div>

          <div className="pal-lbl">🎉 Toppings (max 5)</div>
          <div className="ing-grid">
            {(TOPPINGS||[]).map(t => (
              <div key={t.name} className="ing-chip chip-topping"
                draggable onDragStart={e=>onDragStart(e,'topping',t.name)}
                onClick={()=>addItem('topping',t.name)}>
                <span>{t.emoji}</span>{t.name}
              </div>
            ))}
          </div>

          <div style={{borderTop:'1.5px solid #f0e8ff',marginTop:24,paddingTop:20}}>
            <div className="status3" style={{marginBottom:16}}>{status}</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:10,marginBottom:14}}>
              <input className="name-in" value={creationName} onChange={e=>setCreationName(e.target.value)} placeholder="Name your creation..."/>
              <select className="mood-sel" value={activeMood} onChange={e=>setActiveMood(e.target.value)}>
                {['Happy','Sad','Chill','Stressed'].map(m=><option key={m}>{m}</option>)}
              </select>
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:10}}>
              <button className="btn-p" onClick={handleSave}>💾 Save & Publish</button>
              <button className="btn-s" onClick={handleShare}>🔗 Share</button>
              <button className="btn-g" onClick={handleReset}>🔄 Reset</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}