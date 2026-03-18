import { useState, useEffect, useRef } from 'react'

// Real Unsplash ice cream photos for community cards
const U = (id, w=200, h=220) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&crop=top&q=80`

const COMMUNITY_PHOTOS = [
  U('1563805042-7684c019e1cb'),
  U('1588195538326-c7e0f8f4ab44'),
  U('1551024506-0bccd828d307'),
  U('1576506295286-5cda18df43e7'),
  U('1488900128323-21503983a07e'),
  U('1501443762994-82bd5dace89a'),
  U('1497034825429-c343d7c6a68f'),
  U('1567206563064-6f60f40a2b57'),
  U('1560008581-09826d1de69e'),
  U('1579954115545-a95591f28bfc'),
  U('1555939594-58d7cb561bb5'),
  U('1612929633738-8fe44f7ec841'),
]

const MOOD_GRADIENTS = {
  Happy:    'linear-gradient(120deg,#ff6f91,#ffd166)',
  Sad:      'linear-gradient(120deg,#7f7fd5,#b4b8ff)',
  Chill:    'linear-gradient(120deg,#56cfe1,#72efdd)',
  Stressed: 'linear-gradient(120deg,#8d99ae,#f4a261)',
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
  .comm3d{font-family:'Nunito',sans-serif;padding:80px 32px;max-width:1200px;margin:0 auto;}

  .comm-head{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:40px;flex-wrap:wrap;gap:20px;}
  .comm-badge{display:inline-flex;align-items:center;gap:7px;background:linear-gradient(135deg,#0ea5e922,#7c3aed22);border:1.5px solid rgba(14,165,233,.2);border-radius:50px;padding:6px 18px;font-size:12px;font-weight:800;color:#0369a1;letter-spacing:.04em;text-transform:uppercase;margin-bottom:12px;}
  .comm-title{font-size:clamp(26px,4vw,42px);font-weight:900;color:#1a0d2e;margin:0 0 8px;}
  .comm-sub{font-size:15px;color:#8a7a9b;font-weight:600;margin:0;}

  .fp-row{display:flex;gap:8px;flex-wrap:wrap;align-self:flex-end;}
  .fp{padding:8px 18px;border-radius:50px;font-size:13px;font-weight:800;cursor:pointer;transition:all .25s cubic-bezier(.34,1.2,.64,1);border:2px solid #f0e8ff;background:white;color:#6b3fa0;font-family:'Nunito',sans-serif;}
  .fp:hover{transform:translateY(-2px);box-shadow:0 6px 16px rgba(107,63,160,.15);}
  .fp.active{background:linear-gradient(135deg,#7c3aed,#ec4899);color:white;border-color:transparent;box-shadow:0 6px 20px rgba(124,58,237,.35);transform:translateY(-2px);}

  .comm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px;}

  /* card */
  .dc3{background:white;border-radius:24px;border:1.5px solid #f0e8ff;overflow:hidden;
    transition:all .35s cubic-bezier(.34,1.1,.64,1);animation:cIn .5s ease-out both;position:relative;}
  .dc3:hover{transform:translateY(-7px) scale(1.012);box-shadow:0 22px 50px rgba(120,60,180,.16);border-color:#d4b8f5;}
  @keyframes cIn{from{opacity:0;transform:translateY(20px) scale(.96);}to{opacity:1;transform:translateY(0) scale(1);}}

  .top-badge3{position:absolute;top:12px;right:12px;z-index:5;background:linear-gradient(135deg,#ffd166,#f4a261);color:white;font-size:11px;font-weight:800;padding:4px 12px;border-radius:50px;box-shadow:0 4px 12px rgba(244,162,97,.4);}

  /* real photo section */
  .dc-photo{position:relative;width:100%;height:180px;overflow:hidden;background:#f9f5ff;}
  .dc-photo img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s cubic-bezier(.34,1,.64,1);}
  .dc3:hover .dc-photo img{transform:scale(1.1);}
  .dc-photo-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,transparent 40%,rgba(26,13,46,.5) 100%);}
  
  /* mood tag overlay on photo */
  .dc-mood-tag{position:absolute;bottom:12px;left:12px;z-index:3;padding:4px 13px;border-radius:50px;font-size:11px;font-weight:800;color:white;text-shadow:0 1px 3px rgba(0,0,0,.2);box-shadow:0 3px 10px rgba(0,0,0,.18);}
  .dc-author{position:absolute;bottom:12px;right:12px;z-index:3;font-size:11px;font-weight:700;color:rgba(255,255,255,.85);}

  .dc-body{padding:16px 20px 0;}
  .dc-name{font-size:16px;font-weight:900;color:#1a0d2e;margin:0 0 10px;}

  .dc-details{display:flex;flex-direction:column;gap:5px;}
  .dc-row{display:flex;align-items:flex-start;gap:7px;font-size:12px;color:#6a5280;font-weight:600;line-height:1.5;}
  .dc-ico{flex-shrink:0;font-size:14px;}

  .dc-foot{padding:14px 20px 18px;display:flex;align-items:center;justify-content:space-between;border-top:1.5px solid #f8f3ff;margin-top:14px;}
  .like-btn3{display:flex;align-items:center;gap:6px;background:none;border:2px solid #f0e8ff;border-radius:50px;padding:7px 16px;font-size:14px;font-weight:800;cursor:pointer;color:#8a7a9b;transition:all .2s;font-family:'Nunito',sans-serif;}
  .like-btn3:hover{border-color:#ff6f91;color:#ff6f91;transform:scale(1.05);}
  .like-btn3.liked{background:#fff0f5;border-color:#ff6f91;color:#ff6f91;animation:hb .35s cubic-bezier(.34,1.5,.64,1);}
  @keyframes hb{0%{transform:scale(1)}50%{transform:scale(1.2)}100%{transform:scale(1)}}
  .share-btn3{background:none;border:2px solid #f0e8ff;border-radius:50px;padding:7px 16px;font-size:13px;font-weight:800;cursor:pointer;color:#7c3aed;transition:all .2s;font-family:'Nunito',sans-serif;}
  .share-btn3:hover{background:#f8f4ff;border-color:#c4a0e8;transform:translateY(-1px);}

  @media(max-width:600px){.comm3d{padding:60px 16px;}}
`

export default function CommunityWall({ designs = [] }) {
  const [likes,  setLikes]  = useState(() => Object.fromEntries(designs.map(d=>[d.id,d.likes])))
  const [liked,  setLiked]  = useState({})
  const [filter, setFilter] = useState('All')
  const styleRef = useRef(false)

  useEffect(() => {
    if (styleRef.current) return; styleRef.current = true
    const el = document.createElement('style'); el.textContent = CSS; document.head.appendChild(el)
  }, [])

  function toggleLike(id) {
    setLiked(prev => {
      const isLiked = prev[id]
      setLikes(l => ({ ...l, [id]: l[id] + (isLiked?-1:1) }))
      return { ...prev, [id]: !isLiked }
    })
  }

  const moods    = ['All','Happy','Sad','Chill','Stressed']
  const filtered = filter==='All' ? designs : designs.filter(d=>d.mood===filter)
  const sorted   = [...filtered].sort((a,b)=>(likes[b.id]||0)-(likes[a.id]||0))

  return (
    <section className="comm3d" id="community">
      <div className="comm-head">
        <div>
          <span className="comm-badge">🌍 Community</span>
          <h2 className="comm-title">Top Creations</h2>
          <p className="comm-sub">Discover what the Ice Cream Hub community is building.</p>
        </div>
        <div className="fp-row">
          {moods.map(m=>(
            <button key={m} className={`fp ${filter===m?'active':''}`} onClick={()=>setFilter(m)}>{m}</button>
          ))}
        </div>
      </div>

      <div className="comm-grid">
        {sorted.map((design, idx) => {
          // each design gets a real photo based on its index cycling through the pool
          const photo = COMMUNITY_PHOTOS[idx % COMMUNITY_PHOTOS.length]
          return (
            <article key={design.id} className="dc3" style={{ animationDelay:`${idx*60}ms` }}>
              {idx === 0 && <div className="top-badge3">🏆 Top Pick</div>}

              {/* real photo */}
              <div className="dc-photo">
                <img src={photo} alt={design.name} loading="lazy"/>
                <div className="dc-photo-overlay"/>
                <span className="dc-mood-tag" style={{ background: MOOD_GRADIENTS[design.mood]||'#ddd' }}>
                  {design.mood}
                </span>
                <span className="dc-author">by {design.author||'Anonymous'}</span>
              </div>

              <div className="dc-body">
                <h3 className="dc-name">{design.name}</h3>
                <div className="dc-details">
                  <div className="dc-row"><span className="dc-ico">🍨</span><span>{(design.scoops||[]).join(' · ')}</span></div>
                  {(design.sauces||[]).length>0 && <div className="dc-row"><span className="dc-ico">🍯</span><span>{design.sauces.join(' · ')}</span></div>}
                  {(design.toppings||[]).length>0 && <div className="dc-row"><span className="dc-ico">🎉</span><span>{design.toppings.join(' · ')}</span></div>}
                </div>
              </div>

              <div className="dc-foot">
                <button className={`like-btn3 ${liked[design.id]?'liked':''}`} onClick={()=>toggleLike(design.id)}>
                  {liked[design.id]?'❤️':'🤍'} {likes[design.id]||0}
                </button>
                <button className="share-btn3">↗ Share</button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}