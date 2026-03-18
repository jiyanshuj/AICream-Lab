import { useState, useEffect, useRef } from 'react'
import { SCOOP_PALETTE } from '../data/constants'

const COMMUNITY_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

  .comm3d-section {
    font-family: 'Nunito', sans-serif;
    padding: 80px 32px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .comm3d-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 40px;
    flex-wrap: wrap;
    gap: 20px;
  }

  .comm3d-badge {
    display: inline-flex; align-items: center; gap: 7px;
    background: linear-gradient(135deg, #0ea5e922, #7c3aed22);
    border: 1.5px solid rgba(14,165,233,0.2);
    border-radius: 50px; padding: 6px 18px;
    font-size: 12px; font-weight: 800; color: #0369a1;
    letter-spacing: 0.04em; text-transform: uppercase;
    margin-bottom: 12px;
  }

  .comm3d-title {
    font-size: clamp(26px,4vw,42px); font-weight: 900;
    color: #1a0d2e; margin: 0 0 8px;
  }

  .comm3d-sub {
    font-size: 15px; color: #8a7a9b; font-weight: 600; margin: 0;
  }

  .filter-row-3d {
    display: flex; gap: 8px; flex-wrap: wrap;
    align-self: flex-end;
  }

  .fp3d {
    padding: 8px 18px; border-radius: 50px;
    font-size: 13px; font-weight: 800;
    cursor: pointer; transition: all 0.25s cubic-bezier(0.34,1.2,0.64,1);
    border: 2px solid #f0e8ff; background: white; color: #6b3fa0;
    font-family: 'Nunito', sans-serif;
  }
  .fp3d:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(107,63,160,0.15); }
  .fp3d.active {
    background: linear-gradient(135deg, #7c3aed, #ec4899);
    color: white; border-color: transparent;
    box-shadow: 0 6px 20px rgba(124,58,237,0.35);
    transform: translateY(-2px);
  }

  /* Grid */
  .comm3d-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }

  /* Card */
  .design-card-3d {
    background: white;
    border-radius: 24px;
    border: 1.5px solid #f0e8ff;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.34,1.1,0.64,1);
    animation: cardIn 0.5s ease-out both;
    position: relative;
  }

  .design-card-3d:hover {
    transform: translateY(-6px) scale(1.01);
    box-shadow: 0 20px 48px rgba(120,60,180,0.15);
    border-color: #d4b8f5;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(20px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .top-badge-3d {
    position: absolute; top: 12px; right: 12px;
    background: linear-gradient(135deg, #ffd166, #f4a261);
    color: white; font-size: 11px; font-weight: 800;
    padding: 4px 12px; border-radius: 50px;
    box-shadow: 0 4px 12px rgba(244,162,97,0.4);
    z-index: 5;
  }

  /* Mini cone 3D */
  .mini-cone-3d {
    position: relative;
    width: 80px;
    height: 120px;
    margin: 0 auto;
    flex-shrink: 0;
  }

  .mini-scoop-3d {
    position: absolute;
    left: 50%;
    border-radius: 50%;
    transition: transform 0.3s;
  }

  .mini-scoop-3d::before {
    content: '';
    position: absolute;
    top: 15%; left: 20%;
    width: 28%; height: 20%;
    background: rgba(255,255,255,0.55);
    border-radius: 50%;
    transform: rotate(-30deg);
    filter: blur(1.5px);
  }

  .design-card-3d:hover .mini-scoop-3d {
    transform: translateX(-50%) translateY(-4px) !important;
  }

  /* Card internals */
  .card-top-3d {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 24px 20px 18px;
    background: linear-gradient(180deg, #fdf8ff, white);
  }

  .card-meta-3d { flex: 1; min-width: 0; }

  .mood-tag-3d {
    display: inline-block;
    padding: 3px 12px; border-radius: 50px;
    font-size: 11px; font-weight: 800; color: white;
    margin-bottom: 7px;
    text-shadow: 0 1px 3px rgba(0,0,0,0.2);
    box-shadow: 0 3px 10px rgba(0,0,0,0.12);
  }

  .design-name-3d {
    font-size: 16px; font-weight: 900; color: #1a0d2e;
    margin: 0 0 4px; white-space: nowrap; overflow: hidden;
    text-overflow: ellipsis;
  }

  .design-author-3d {
    font-size: 12px; color: #a090b5; font-weight: 600; margin: 0;
  }

  .card-details-3d {
    padding: 14px 20px;
    border-top: 1.5px solid #f8f3ff;
    display: flex; flex-direction: column; gap: 6px;
  }

  .detail-row-3d {
    display: flex; align-items: flex-start; gap: 8px;
    font-size: 12px; color: #6a5280; font-weight: 600;
    line-height: 1.5;
  }
  .detail-icon-3d { flex-shrink: 0; font-size: 14px; }

  .card-footer-3d {
    padding: 14px 20px;
    border-top: 1.5px solid #f8f3ff;
    display: flex; align-items: center; justify-content: space-between;
  }

  .like-btn-3d {
    display: flex; align-items: center; gap: 6px;
    background: none; border: 2px solid #f0e8ff; border-radius: 50px;
    padding: 7px 16px; font-size: 14px; font-weight: 800;
    cursor: pointer; color: #8a7a9b; transition: all 0.2s;
    font-family: 'Nunito', sans-serif;
  }
  .like-btn-3d:hover { border-color: #ff6f91; color: #ff6f91; transform: scale(1.05); }
  .like-btn-3d.liked {
    background: #fff0f5; border-color: #ff6f91; color: #ff6f91;
    animation: likeHeartbeat 0.35s cubic-bezier(0.34,1.5,0.64,1);
  }

  @keyframes likeHeartbeat {
    0%   { transform: scale(1); }
    50%  { transform: scale(1.2); }
    100% { transform: scale(1); }
  }

  .share-btn-3d {
    background: none; border: 2px solid #f0e8ff; border-radius: 50px;
    padding: 7px 16px; font-size: 13px; font-weight: 800;
    cursor: pointer; color: #7c3aed; transition: all 0.2s;
    font-family: 'Nunito', sans-serif;
  }
  .share-btn-3d:hover { background: #f8f4ff; border-color: #c4a0e8; transform: translateY(-1px); }
`

const MOOD_GRADIENTS = {
  Happy: 'linear-gradient(120deg,#ff6f91,#ffd166)',
  Sad: 'linear-gradient(120deg,#7f7fd5,#b4b8ff)',
  Chill: 'linear-gradient(120deg,#56cfe1,#72efdd)',
  Stressed: 'linear-gradient(120deg,#8d99ae,#f4a261)',
}

function MiniCone3D({ scoops }) {
  const layers = [...scoops].slice(0, 3).reverse()
  const sizes = [44, 50, 54]

  return (
    <div className="mini-cone-3d">
      {layers.map((scoop, i) => {
        const size = sizes[i] || 40
        const bottom = 28 + i * 30
        const color = SCOOP_PALETTE?.[scoop] || 'linear-gradient(145deg,#eee,#ccc)'
        return (
          <div
            key={i}
            className="mini-scoop-3d"
            style={{
              width: size,
              height: size,
              bottom: bottom,
              transform: 'translateX(-50%)',
              background: color,
              boxShadow: `inset -5px -5px 14px rgba(0,0,0,0.2), inset 2px 2px 6px rgba(255,255,255,0.25), 0 4px 12px rgba(0,0,0,0.12)`,
              zIndex: 10 + i,
            }}
          />
        )
      })}
      {/* mini SVG cone */}
      <svg style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)' }}
        width="54" height="34" viewBox="0 0 54 34">
        <defs>
          <linearGradient id="mcg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f4b86e" />
            <stop offset="100%" stopColor="#a04f0a" />
          </linearGradient>
        </defs>
        <polygon points="27,33 0,0 54,0" fill="url(#mcg)" />
        {[8, 16, 24].map((y, i) => {
          const w = (y / 33) * 50 + 4
          return <line key={i} x1={27 - w / 2} y1={y} x2={27 + w / 2} y2={y} stroke="rgba(100,40,0,0.2)" strokeWidth="1" />
        })}
      </svg>
    </div>
  )
}

export default function CommunityWall({ designs = [] }) {
  const [likes, setLikes] = useState(() => Object.fromEntries(designs.map(d => [d.id, d.likes])))
  const [liked, setLiked] = useState({})
  const [filter, setFilter] = useState('All')
  const styleRef = useRef(false)

  useEffect(() => {
    if (styleRef.current) return
    styleRef.current = true
    const el = document.createElement('style')
    el.textContent = COMMUNITY_CSS
    document.head.appendChild(el)
  }, [])

  function toggleLike(id) {
    setLiked(prev => {
      const isLiked = prev[id]
      setLikes(l => ({ ...l, [id]: l[id] + (isLiked ? -1 : 1) }))
      return { ...prev, [id]: !isLiked }
    })
  }

  const moods = ['All', 'Happy', 'Sad', 'Chill', 'Stressed']
  const filtered = filter === 'All' ? designs : designs.filter(d => d.mood === filter)
  const sorted = [...filtered].sort((a, b) => (likes[b.id] || 0) - (likes[a.id] || 0))

  return (
    <section className="comm3d-section" id="community">
      <div className="comm3d-header">
        <div>
          <span className="comm3d-badge">🌍 Community</span>
          <h2 className="comm3d-title">Top Creations</h2>
          <p className="comm3d-sub">Discover what the AICream Lab community is building.</p>
        </div>
        <div className="filter-row-3d">
          {moods.map(m => (
            <button key={m} className={`fp3d ${filter === m ? 'active' : ''}`} onClick={() => setFilter(m)}>
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="comm3d-grid">
        {sorted.map((design, idx) => (
          <article key={design.id} className="design-card-3d" style={{ animationDelay: `${idx * 60}ms` }}>
            {idx === 0 && <div className="top-badge-3d">🏆 Top Pick</div>}

            <div className="card-top-3d">
              <MiniCone3D scoops={design.scoops || []} />
              <div className="card-meta-3d">
                <span
                  className="mood-tag-3d"
                  style={{ background: MOOD_GRADIENTS[design.mood] || '#ddd' }}
                >
                  {design.mood}
                </span>
                <h3 className="design-name-3d">{design.name}</h3>
                <p className="design-author-3d">by {design.author || 'Anonymous'}</p>
              </div>
            </div>

            <div className="card-details-3d">
              <div className="detail-row-3d">
                <span className="detail-icon-3d">🍨</span>
                <span>{(design.scoops || []).join(' · ')}</span>
              </div>
              {(design.sauces || []).length > 0 && (
                <div className="detail-row-3d">
                  <span className="detail-icon-3d">🍯</span>
                  <span>{design.sauces.join(' · ')}</span>
                </div>
              )}
              {(design.toppings || []).length > 0 && (
                <div className="detail-row-3d">
                  <span className="detail-icon-3d">🎉</span>
                  <span>{design.toppings.join(' · ')}</span>
                </div>
              )}
            </div>

            <div className="card-footer-3d">
              <button className={`like-btn-3d ${liked[design.id] ? 'liked' : ''}`} onClick={() => toggleLike(design.id)}>
                {liked[design.id] ? '❤️' : '🤍'} {likes[design.id] || 0}
              </button>
              <button className="share-btn-3d">↗ Share</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}