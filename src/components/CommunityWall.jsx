import { useState, useEffect, useRef } from 'react'

const U = (id, w=200, h=220) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&crop=top&q=80`

const COMMUNITY_PHOTOS = [
  U('1563805042-7684c019e1cb'), U('1588195538326-c7e0f8f4ab44'), U('1551024506-0bccd828d307'),
  U('1576506295286-5cda18df43e7'), U('1488900128323-21503983a07e'), U('1501443762994-82bd5dace89a'),
  U('1497034825429-c343d7c6a68f'), U('1567206563064-6f60f40a2b57'),
  U('1560008581-09826d1de69e'), U('1579954115545-a95591f28bfc'),
]

const MOOD_GRADIENTS = {
  Happy:'linear-gradient(120deg,#ff6f91,#ffd166)', Sad:'linear-gradient(120deg,#7f7fd5,#b4b8ff)',
  Chill:'linear-gradient(120deg,#56cfe1,#72efdd)', Stressed:'linear-gradient(120deg,#8d99ae,#f4a261)',
}

// Preview designs to show when no real community data exists
const DEMO_DESIGNS = [
  { id:'d1', name:'Strawberry Cloud',    mood:'Happy',    author:'Priya S', likes:84, scoops:['Strawberry Pop','Vanilla Nova'], sauces:['Strawberry'], toppings:['Sprinkles','Whipped Cream'] },
  { id:'d2', name:'Midnight Choco',      mood:'Stressed', author:'Rohan K', likes:72, scoops:['Choco Lava'], sauces:['Hot Fudge'], toppings:['Brownie Bits','Almonds'] },
  { id:'d3', name:'Mint Glacier',        mood:'Chill',    author:'Aisha T', likes:61, scoops:['Mint Breeze','Coconut Dream'], sauces:[], toppings:['Oreo Crumble'] },
  { id:'d4', name:'Mango Rain',          mood:'Happy',    author:'Dev P',   likes:58, scoops:['Mango Tango'], sauces:['Caramel'], toppings:['Mango Chunks','Sprinkles'] },
  { id:'d5', name:'Blue Storm Parfait',  mood:'Sad',      author:'Nisha R', likes:49, scoops:['Blueberry Storm','Vanilla Nova'], sauces:['Blueberry'], toppings:['Granola','Honey'] },
  { id:'d6', name:'Choco Mint Swirl',    mood:'Chill',    author:'Amit V',  likes:44, scoops:['Choco Lava','Mint Breeze'], sauces:['Hot Fudge'], toppings:['Mint Chips'] },
]

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
.cw-section { font-family:'Nunito',sans-serif; padding:80px 32px; max-width:1200px; margin:0 auto; }

.cw-head { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:40px; flex-wrap:wrap; gap:20px; }
.cw-badge { display:inline-flex;align-items:center;gap:7px;background:linear-gradient(135deg,#0ea5e922,#7c3aed22);border:1.5px solid rgba(14,165,233,.2);border-radius:50px;padding:6px 18px;font-size:12px;font-weight:800;color:#0369a1;letter-spacing:.04em;text-transform:uppercase;margin-bottom:12px; }
.cw-title { font-size:clamp(26px,4vw,42px);font-weight:900;color:#1a0d2e;margin:0 0 8px; }
.cw-sub   { font-size:15px;color:#8a7a9b;font-weight:600;margin:0; }
.cw-create-btn { display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,#ff6f91,#ff4d7a);color:white;border:none;border-radius:50px;padding:12px 24px;font-size:14px;font-weight:800;cursor:pointer;box-shadow:0 6px 20px rgba(255,111,145,.35);transition:all .2s;font-family:'Nunito',sans-serif;text-decoration:none;align-self:flex-end; }
.cw-create-btn:hover { transform:translateY(-2px);box-shadow:0 10px 28px rgba(255,111,145,.45); }

.fp-row  { display:flex;gap:8px;flex-wrap:wrap;align-self:flex-end; }
.fp      { padding:8px 18px;border-radius:50px;font-size:13px;font-weight:800;cursor:pointer;transition:all .25s cubic-bezier(.34,1.2,.64,1);border:2px solid #f0e8ff;background:white;color:#6b3fa0;font-family:'Nunito',sans-serif; }
.fp:hover{ transform:translateY(-2px);box-shadow:0 6px 16px rgba(107,63,160,.15); }
.fp.active{ background:linear-gradient(135deg,#7c3aed,#ec4899);color:white;border-color:transparent;box-shadow:0 6px 20px rgba(124,58,237,.35);transform:translateY(-2px); }

/* ── Demo notice banner ── */
.demo-banner {
  display:flex;align-items:center;gap:14px;
  background:linear-gradient(135deg,rgba(255,111,145,.08),rgba(124,58,237,.06));
  border:1.5px solid rgba(255,111,145,.2);
  border-radius:18px;padding:14px 20px;margin-bottom:28px;
}
.demo-banner p { font-size:13px;font-weight:700;color:#6b3fa0;margin:0; }
.demo-banner a { color:#ff4d7a;font-weight:800;text-decoration:none; }
.demo-banner a:hover { text-decoration:underline; }

.cw-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px; }

/* ── card ── */
.dc { background:white;border-radius:24px;border:1.5px solid #f0e8ff;overflow:hidden;
  transition:all .35s cubic-bezier(.34,1.1,.64,1);animation:cIn .5s ease-out both;position:relative; }
.dc:hover { transform:translateY(-7px) scale(1.012);box-shadow:0 22px 50px rgba(120,60,180,.16);border-color:#d4b8f5; }
@keyframes cIn { from{opacity:0;transform:translateY(20px) scale(.96);}to{opacity:1;transform:translateY(0) scale(1);} }
.dc-top-badge { position:absolute;top:12px;right:12px;z-index:5;background:linear-gradient(135deg,#ffd166,#f4a261);color:white;font-size:11px;font-weight:800;padding:4px 12px;border-radius:50px;box-shadow:0 4px 12px rgba(244,162,97,.4); }

.dc-photo { position:relative;width:100%;height:180px;overflow:hidden;background:#f9f5ff; }
.dc-photo img { width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s cubic-bezier(.34,1,.64,1); }
.dc:hover .dc-photo img { transform:scale(1.1); }
.dc-overlay { position:absolute;inset:0;background:linear-gradient(to bottom,transparent 40%,rgba(26,13,46,.55) 100%); }
.dc-mood-tag { position:absolute;bottom:12px;left:12px;z-index:3;padding:4px 13px;border-radius:50px;font-size:11px;font-weight:800;color:white;text-shadow:0 1px 3px rgba(0,0,0,.2);box-shadow:0 3px 10px rgba(0,0,0,.18); }
.dc-author   { position:absolute;bottom:12px;right:12px;z-index:3;font-size:11px;font-weight:700;color:rgba(255,255,255,.85); }

.dc-body { padding:16px 20px 0; }
.dc-name { font-size:16px;font-weight:900;color:#1a0d2e;margin:0 0 10px; }
.dc-details { display:flex;flex-direction:column;gap:5px; }
.dc-row { display:flex;align-items:flex-start;gap:7px;font-size:12px;color:#6a5280;font-weight:600;line-height:1.5; }
.dc-ico { flex-shrink:0;font-size:14px; }

.dc-foot { padding:14px 20px 18px;display:flex;align-items:center;justify-content:space-between;border-top:1.5px solid #f8f3ff;margin-top:14px; }
.like-btn { display:flex;align-items:center;gap:6px;background:none;border:2px solid #f0e8ff;border-radius:50px;padding:7px 16px;font-size:14px;font-weight:800;cursor:pointer;color:#8a7a9b;transition:all .2s;font-family:'Nunito',sans-serif; }
.like-btn:hover { border-color:#ff6f91;color:#ff6f91;transform:scale(1.05); }
.like-btn.liked { background:#fff0f5;border-color:#ff6f91;color:#ff6f91;animation:hb .35s cubic-bezier(.34,1.5,.64,1); }
@keyframes hb { 0%{transform:scale(1)}50%{transform:scale(1.2)}100%{transform:scale(1)} }
.share-btn { background:none;border:2px solid #f0e8ff;border-radius:50px;padding:7px 16px;font-size:13px;font-weight:800;cursor:pointer;color:#7c3aed;transition:all .2s;font-family:'Nunito',sans-serif; }
.share-btn:hover { background:#f8f4ff;border-color:#c4a0e8;transform:translateY(-1px); }

/* ── Empty state ── */
.cw-empty {
  text-align:center;padding:60px 24px;
  background:white;border-radius:28px;border:1.5px dashed #e0d4f5;
}
.cw-empty-photos {
  display:flex;justify-content:center;gap:-12px;margin-bottom:24px;position:relative;width:fit-content;margin:0 auto 24px;
}
.cw-empty-photo {
  width:70px;height:70px;border-radius:50%;overflow:hidden;
  border:3px solid white;box-shadow:0 4px 16px rgba(120,60,180,.15);
  margin-left:-12px;
}
.cw-empty-photo:first-child { margin-left:0; }
.cw-empty-photo img { width:100%;height:100%;object-fit:cover;display:block; }
.cw-empty-h { font-size:22px;font-weight:900;color:#1a0d2e;margin:0 0 8px; }
.cw-empty-p { font-size:14px;color:#8a7a9b;font-weight:600;margin:0 0 24px;max-width:360px;margin-left:auto;margin-right:auto; }
.cw-empty-btn { display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,#ff6f91,#7c3aed);color:white;border:none;border-radius:50px;padding:14px 32px;font-size:15px;font-weight:800;cursor:pointer;box-shadow:0 8px 24px rgba(124,58,237,.3);transition:all .2s;font-family:'Nunito',sans-serif;text-decoration:none; }
.cw-empty-btn:hover { transform:translateY(-3px);box-shadow:0 14px 36px rgba(124,58,237,.4); }

@media(max-width:600px){ .cw-section{padding:60px 16px;} }
`

const EMPTY_PHOTOS = [
  U('1563805042-7684c019e1cb',80,80), U('1488900128323-21503983a07e',80,80),
  U('1497034825429-c343d7c6a68f',80,80), U('1579954115545-a95591f28bfc',80,80),
]

export default function CommunityWall({ designs }) {
  // use passed designs or fall back to demo data
  const allDesigns = (designs && designs.length > 0) ? designs : DEMO_DESIGNS
  const isDemo     = !designs || designs.length === 0

  const [likes,  setLikes]  = useState(() => Object.fromEntries(allDesigns.map(d => [d.id, d.likes || 0])))
  const [liked,  setLiked]  = useState({})
  const [filter, setFilter] = useState('All')
  const styleRef = useRef(false)

  useEffect(() => {
    if (styleRef.current) return
    styleRef.current = true
    const el = document.createElement('style')
    el.textContent = CSS
    document.head.appendChild(el)
  }, [])

  // sync likes when designs prop changes
  useEffect(() => {
    setLikes(Object.fromEntries(allDesigns.map(d => [d.id, d.likes || 0])))
  }, [designs])

  function toggleLike(id) {
    setLiked(prev => {
      const wasLiked = prev[id]
      setLikes(l => ({ ...l, [id]: (l[id] || 0) + (wasLiked ? -1 : 1) }))
      return { ...prev, [id]: !wasLiked }
    })
  }

  const moods    = ['All','Happy','Sad','Chill','Stressed']
  const filtered = filter === 'All' ? allDesigns : allDesigns.filter(d => d.mood === filter)
  const sorted   = [...filtered].sort((a, b) => (likes[b.id] || 0) - (likes[a.id] || 0))

  return (
    <section className="cw-section" id="community">
      <div className="cw-head">
        <div>
          <span className="cw-badge">🌍 Community</span>
          <h2 className="cw-title">Top Creations</h2>
          <p className="cw-sub">Discover what the Ice Cream Hub community is building.</p>
        </div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:10 }}>
          <a href="#builder" className="cw-create-btn">🍦 Create Yours ↗</a>
          <div className="fp-row">
            {moods.map(m => (
              <button key={m} className={`fp ${filter===m?'active':''}`} onClick={() => setFilter(m)}>{m}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Demo notice */}
      {isDemo && (
        <div className="demo-banner">
          <span style={{ fontSize:20 }}>✨</span>
          <p>These are featured community picks. <a href="#builder">Build your own creation</a> to appear here!</p>
        </div>
      )}

      {sorted.length === 0 ? (
        /* Empty state when filter has 0 results */
        <div className="cw-empty">
          <div className="cw-empty-photos">
            {EMPTY_PHOTOS.map((src, i) => (
              <div key={i} className="cw-empty-photo"><img src={src} alt="" loading="lazy"/></div>
            ))}
          </div>
          <h3 className="cw-empty-h">No {filter} creations yet</h3>
          <p className="cw-empty-p">
            Be the first to build and share a {filter.toLowerCase()} mood ice cream with the community!
          </p>
          <a href="#builder" className="cw-empty-btn">🍦 Be The First</a>
        </div>
      ) : (
        <div className="cw-grid">
          {sorted.map((design, idx) => {
            const photo = COMMUNITY_PHOTOS[idx % COMMUNITY_PHOTOS.length]
            return (
              <article key={design.id} className="dc" style={{ animationDelay:`${idx*60}ms` }}>
                {idx === 0 && <div className="dc-top-badge">🏆 Top Pick</div>}

                <div className="dc-photo">
                  <img src={photo} alt={design.name} loading="lazy"/>
                  <div className="dc-overlay"/>
                  <span className="dc-mood-tag" style={{ background: MOOD_GRADIENTS[design.mood]||'#ddd' }}>
                    {design.mood}
                  </span>
                  <span className="dc-author">by {design.author||'Anonymous'}</span>
                </div>

                <div className="dc-body">
                  <h3 className="dc-name">{design.name}</h3>
                  <div className="dc-details">
                    <div className="dc-row"><span className="dc-ico">🍨</span><span>{(design.scoops||[]).join(' · ')||'—'}</span></div>
                    {(design.sauces||[]).length > 0 && <div className="dc-row"><span className="dc-ico">🍯</span><span>{design.sauces.join(' · ')}</span></div>}
                    {(design.toppings||[]).length > 0 && <div className="dc-row"><span className="dc-ico">🎉</span><span>{design.toppings.join(' · ')}</span></div>}
                  </div>
                </div>

                <div className="dc-foot">
                  <button className={`like-btn ${liked[design.id]?'liked':''}`} onClick={() => toggleLike(design.id)}>
                    {liked[design.id]?'❤️':'🤍'} {likes[design.id]||0}
                  </button>
                  <button className="share-btn">↗ Share</button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}