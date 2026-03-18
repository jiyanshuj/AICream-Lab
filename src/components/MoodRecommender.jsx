import { useMemo, useState, useEffect, useRef } from 'react'

// ── Inline mood data — no external import needed ────────────────────────────
const MOOD_ENGINE = {
  Happy: {
    emoji: '😄',
    gradient: 'linear-gradient(135deg,#ff6f91,#ffd166)',
    intro: "You're glowing today! 🌟",
    vibe: "Bright flavors match your bright energy!",
    flavours: ['Strawberry Pop', 'Mango Tango', 'Bubblegum Bliss', 'Vanilla Nova'],
    toppings: ['Rainbow Sprinkles', 'Fresh Strawberries', 'Whipped Cream', 'Caramel Drizzle'],
    colors: ['#ff6f91', '#ffd166', '#ff9a3c'],
    music: ['Happy - Pharrell Williams', 'Good as Hell - Lizzo', 'Can\'t Stop the Feeling - Timberlake'],
  },
  Sad: {
    emoji: '😢',
    gradient: 'linear-gradient(135deg,#7f7fd5,#b4b8ff)',
    intro: "Hey, it'll get better 💙",
    vibe: "Rich, comforting flavors to lift your spirits.",
    flavours: ['Blueberry Storm', 'Dark Choco Fudge', 'Cookies & Cream', 'Choco Lava'],
    toppings: ['Hot Fudge', 'Brownie Bites', 'Oreo Crumble', 'Chocolate Sauce'],
    colors: ['#7f7fd5', '#b4b8ff', '#4a3b8c'],
    music: ['Fix You - Coldplay', 'Someone Like You - Adele', 'The Night We Met - Lord Huron'],
  },
  Chill: {
    emoji: '😌',
    gradient: 'linear-gradient(135deg,#56cfe1,#72efdd)',
    intro: "Peaceful vibes only ✌️",
    vibe: "Cool and refreshing, just like your mood.",
    flavours: ['Mint Breeze', 'Coconut Dream', 'Lemon Sorbet', 'Pistachio Soft'],
    toppings: ['Mint Chips', 'Toasted Coconut', 'Fresh Mint Leaves', 'Granola'],
    colors: ['#56cfe1', '#72efdd', '#0ea5e9'],
    music: ['Sunset Lover - Petit Biscuit', 'Breathe - Télépopmusik', 'Holocene - Bon Iver'],
  },
  Stressed: {
    emoji: '😤',
    gradient: 'linear-gradient(135deg,#f4a261,#e76f51)',
    intro: "Take a deep breath 🍫",
    vibe: "Dark chocolate releases endorphins — science says so!",
    flavours: ['Choco Lava', 'Salted Caramel', 'Dark Almond Crunch', 'Hazelnut Espresso'],
    toppings: ['Almond Crunch', 'Sea Salt Flakes', 'Dark Choco Shavings', 'Caramel Drizzle'],
    colors: ['#f4a261', '#e76f51', '#854f0b'],
    music: ['Stressed Out - Twenty One Pilots', 'Breathe (2AM) - Anna Nalick', 'The Less I Know - Tame Impala'],
  },
}

function rnd(arr) {
  if (!arr || !arr.length) return ''
  return arr[Math.floor(Math.random() * arr.length)]
}

// ── Real photos ─────────────────────────────────────────────────────────────
const FLAVOUR_PHOTOS = {
  Happy: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=500&h=500&fit=crop&q=85',
  Sad: 'https://images.unsplash.com/photo-1560008581-09826d1de69e?w=500&h=500&fit=crop&q=85',
  Chill: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500&h=500&fit=crop&q=85',
  Stressed: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500&h=500&fit=crop&q=85',
}
const TOPPING_PHOTOS = {
  Happy: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=300&fit=crop&q=80',
  Sad: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=300&fit=crop&q=80',
  Chill: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=300&h=300&fit=crop&q=80',
  Stressed: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=300&h=300&fit=crop&q=80',
}

// ── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
.mr-wrap{font-family:'Nunito',sans-serif;padding:80px 32px;max-width:1200px;margin:0 auto;}
.mr-badge{display:inline-flex;align-items:center;gap:7px;background:linear-gradient(135deg,#7c3aed22,#ec489922);border:1.5px solid rgba(124,58,237,.2);border-radius:50px;padding:6px 18px;font-size:12px;font-weight:800;color:#7c3aed;letter-spacing:.04em;text-transform:uppercase;margin-bottom:12px;}
.mr-h2{font-size:clamp(26px,4vw,42px);font-weight:900;color:#1a0d2e;margin:0 0 8px;line-height:1.1;}
.mr-sub{font-size:16px;color:#8a7a9b;font-weight:600;margin:0 0 40px;}

.mr-pills{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:32px;}
.mrp{display:flex;align-items:center;gap:8px;padding:12px 22px;border-radius:50px;font-size:15px;font-weight:800;cursor:pointer;border:2px solid #f0e8ff;background:white;color:#2d1b4e;transition:all .3s cubic-bezier(.34,1.2,.64,1);box-shadow:0 2px 12px rgba(0,0,0,.06);font-family:'Nunito',sans-serif;}
.mrp:hover{transform:translateY(-3px) scale(1.04);box-shadow:0 8px 24px rgba(0,0,0,.12);}
.mrp.active{color:white;border-color:transparent;transform:translateY(-3px) scale(1.06);box-shadow:0 10px 30px rgba(0,0,0,.18);}

.mr-grid{display:grid;grid-template-columns:1fr 1.1fr 1fr;gap:20px;align-items:start;}
@media(max-width:900px){.mr-grid{grid-template-columns:1fr;}}

/* vibe card */
.vibe-card{border-radius:28px;padding:28px;overflow:hidden;box-shadow:0 16px 48px rgba(0,0,0,.12);animation:vibeIn .4s ease-out both;}
@keyframes vibeIn{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
.vai-pill{display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,.25);border-radius:50px;padding:4px 12px;font-size:11px;font-weight:800;color:rgba(255,255,255,.95);margin-bottom:16px;backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.3);}
.vibe-h{font-size:22px;font-weight:900;color:white;margin:0 0 10px;text-shadow:0 2px 8px rgba(0,0,0,.18);}
.vibe-p{font-size:14.5px;font-weight:600;color:rgba(255,255,255,.92);margin:0 0 20px;line-height:1.65;}
.build-btn{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.22);backdrop-filter:blur(8px);border:1.5px solid rgba(255,255,255,.45);border-radius:50px;padding:11px 22px;font-size:14px;font-weight:800;color:white;cursor:pointer;transition:all .2s;font-family:'Nunito',sans-serif;text-decoration:none;}
.build-btn:hover{background:rgba(255,255,255,.32);transform:translateY(-2px);}

/* photo */
.flavour-photo{border-radius:28px;overflow:hidden;position:relative;aspect-ratio:1;box-shadow:0 20px 56px rgba(120,60,180,.2);animation:photoIn .5s .05s ease-out both;}
@keyframes photoIn{from{opacity:0;transform:scale(.94);}to{opacity:1;transform:scale(1);}}
.flavour-photo img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s cubic-bezier(.34,1,.64,1);}
.flavour-photo:hover img{transform:scale(1.06);}
.fp-label{position:absolute;bottom:0;left:0;right:0;padding:40px 24px 22px;background:linear-gradient(to top,rgba(26,13,46,.75) 0%,transparent 100%);}
.fp-tag{font-size:11px;font-weight:800;color:rgba(255,255,255,.7);text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;}
.fp-name{font-size:22px;font-weight:900;color:white;text-shadow:0 2px 8px rgba(0,0,0,.3);}
.shuffle-btn{position:absolute;top:14px;right:14px;background:rgba(255,255,255,.22);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.35);border-radius:50px;padding:6px 14px;font-size:12px;font-weight:800;color:white;cursor:pointer;transition:all .2s;font-family:'Nunito',sans-serif;}
.shuffle-btn:hover{background:rgba(255,255,255,.34);transform:scale(1.05);}

/* tiles */
.mr-tiles{display:flex;flex-direction:column;gap:14px;}
.mr-tile{background:white;border-radius:20px;border:1.5px solid #f0e8ff;overflow:hidden;transition:all .3s;animation:tileIn .4s ease-out both;}
@keyframes tileIn{from{opacity:0;transform:scale(.92) translateY(8px);}to{opacity:1;transform:scale(1) translateY(0);}}
.mr-tile:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(120,60,180,.12);border-color:#d4b8f5;}
.tile-ph{display:flex;align-items:stretch;}
.tile-ph-img{width:72px;flex-shrink:0;overflow:hidden;}
.tile-ph-img img{width:100%;height:100%;object-fit:cover;display:block;}
.tile-body{padding:16px;}
.tile-plain{padding:16px 18px;}
.tlbl{font-size:11px;font-weight:800;color:#a090b5;text-transform:uppercase;letter-spacing:.06em;margin:0 0 5px;}
.tval{font-size:15px;font-weight:800;color:#2d1b4e;margin:0;}
.cdot{display:inline-block;width:24px;height:24px;border-radius:50%;border:2.5px solid white;box-shadow:0 2px 8px rgba(0,0,0,.14);margin-right:4px;transition:transform .2s;cursor:default;}
.cdot:hover{transform:scale(1.2);}
.music-a{font-size:14px;font-weight:800;color:#7c3aed;text-decoration:none;display:inline-flex;align-items:center;gap:4px;}
.music-a:hover{color:#5b21b6;}
.mr-actions{display:flex;gap:12px;margin-top:18px;flex-wrap:wrap;}
.btn-mrp{background:linear-gradient(135deg,#7c3aed,#ec4899);color:white;border:none;border-radius:50px;padding:13px 28px;font-size:15px;font-weight:800;cursor:pointer;transition:all .2s;box-shadow:0 6px 20px rgba(124,58,237,.35);font-family:'Nunito',sans-serif;}
.btn-mrp:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(124,58,237,.45);}
.btn-mrg{background:white;color:#7c3aed;border:2px solid #d4b8f5;border-radius:50px;padding:11px 24px;font-size:14px;font-weight:800;cursor:pointer;transition:all .2s;font-family:'Nunito',sans-serif;}
.btn-mrg:hover{background:#f8f4ff;border-color:#7c3aed;transform:translateY(-2px);}
.btn-mrg.liked{background:#fff0f5;color:#ec4899;border-color:#f9a8d4;}
`

export default function MoodRecommender() {
  const [mood, setMood] = useState('Happy')
  const [shuffleKey, setShuffleKey] = useState(0)
  const [liked, setLiked] = useState(false)
  const [animKey, setAnimKey] = useState(0)
  const styleRef = useRef(false)

  useEffect(() => {
    if (styleRef.current) return
    styleRef.current = true
    const el = document.createElement('style')
    el.textContent = CSS
    document.head.appendChild(el)
  }, [])

  const rec = useMemo(() => {
    const p = MOOD_ENGINE[mood]
    if (!p) return null
    const flavour = rnd(p.flavours)
    const topping = rnd(p.toppings)
    const playlist = rnd(p.music)
    return {
      ...p, flavour, topping, playlist,
      message: `You seem ${mood.toLowerCase()} — try ${flavour} with ${topping}. ${p.vibe}`,
    }
  }, [mood, shuffleKey])

  function switchMood(m) { setMood(m); setLiked(false); setAnimKey(k => k + 1) }
  function remix() { setShuffleKey(v => v + 1); setAnimKey(k => k + 1) }

  if (!rec) return null

  return (
    <section className="mr-wrap" id="mood">
      <span className="mr-badge">✨ Flavor Match</span>
      <h2 className="mr-h2">Mood Recommender</h2>
      <p className="mr-sub">Tell us how you feel — we'll find your perfect scoop.</p>

      {/* Mood pills */}
      <div className="mr-pills">
        {Object.entries(MOOD_ENGINE).map(([m, d]) => (
          <button key={m}
            className={`mrp ${mood === m ? 'active' : ''}`}
            onClick={() => switchMood(m)}
            style={mood === m ? { background: d.gradient, borderColor: 'transparent' } : {}}
          >
            <span style={{ fontSize: 20 }}>{d.emoji}</span>{m}
          </button>
        ))}
      </div>

      {/* 3-col layout */}
      <div className="mr-grid" key={animKey}>

        {/* LEFT — vibe card */}
        <div className="vibe-card" style={{ background: rec.gradient }}>
          <div className="vai-pill">✨ Vibe Check</div>
          <h3 className="vibe-h">{rec.intro}</h3>
          <p className="vibe-p">{rec.message}</p>
          <a href="#builder" className="build-btn">🍦 Build This Combo ↗</a>
        </div>

        {/* CENTRE — real photo */}
        <div className="flavour-photo">
          <img src={FLAVOUR_PHOTOS[mood]} alt={rec.flavour} loading="lazy" />
          <div className="fp-label">
            <p className="fp-tag">Recommended Flavor</p>
            <p className="fp-name">{rec.flavour}</p>
          </div>
          <button className="shuffle-btn" onClick={remix}>🔀 Remix</button>
        </div>

        {/* RIGHT — tiles */}
        <div className="mr-tiles">

          {/* topping + photo */}
          <div className="mr-tile tile-ph">
            <div className="tile-ph-img">
              <img src={TOPPING_PHOTOS[mood]} alt={rec.topping} loading="lazy" />
            </div>
            <div className="tile-body">
              <p className="tlbl">🎉 Topping Match</p>
              <p className="tval">{rec.topping}</p>
            </div>
          </div>

          {/* colors */}
          <div className="mr-tile">
            <div className="tile-plain">
              <p className="tlbl">🎨 Color Mood</p>
              <div style={{ marginTop: 6 }}>
                {rec.colors.map(c => (
                  <span key={c} className="cdot" style={{ background: c }} title={c} />
                ))}
              </div>
            </div>
          </div>

          {/* music */}
          <div className="mr-tile">
            <div className="tile-plain">
              <p className="tlbl">🎵 Music Pairing</p>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(rec.playlist)}`}
                target="_blank" rel="noreferrer" className="music-a"
              >
                {rec.playlist} ↗
              </a>
            </div>
          </div>

          {/* actions */}
          <div className="mr-actions">
            <button className="btn-mrp" onClick={remix}>🔀 Remix</button>
            <button className={`btn-mrg ${liked ? 'liked' : ''}`} onClick={() => setLiked(v => !v)}>
              {liked ? '❤️ Saved' : '🤍 Save Vibe'}
            </button>
          </div>

        </div>
      </div>
    </section>
  )
}