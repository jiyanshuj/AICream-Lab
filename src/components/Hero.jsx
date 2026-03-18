import { useEffect, useRef } from 'react'

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

  .hero3d{font-family:'Nunito',sans-serif;position:relative;min-height:100vh;display:flex;align-items:center;overflow:hidden;background:#fff8f0;}

  /* full-bleed background photo */
  .hero-bg-photo{position:absolute;inset:0;z-index:0;}
  .hero-bg-photo img{width:100%;height:100%;object-fit:cover;object-position:center;opacity:.12;filter:blur(2px) saturate(1.4);}
  .hero-bg-overlay{position:absolute;inset:0;background:linear-gradient(145deg,rgba(255,248,240,.94) 0%,rgba(255,240,245,.9) 40%,rgba(244,240,255,.85) 100%);z-index:1;}

  /* floating blobs */
  .h-blob{position:absolute;border-radius:50%;filter:blur(70px);animation:blobDrift var(--dur) ease-in-out infinite alternate;pointer-events:none;z-index:1;}
  @keyframes blobDrift{from{transform:translate(0,0) scale(1);}to{transform:translate(var(--dx),var(--dy)) scale(1.1);}}

  .hero-inner{position:relative;z-index:2;display:grid;grid-template-columns:1fr 440px;gap:48px;align-items:center;max-width:1200px;margin:0 auto;padding:80px 32px;width:100%;}
  @media(max-width:900px){.hero-inner{grid-template-columns:1fr;text-align:center;}.hero-vis{display:flex;justify-content:center;}}

  .hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(255,111,145,.12);border:1.5px solid rgba(255,111,145,.3);border-radius:50px;padding:6px 18px;font-size:13px;font-weight:800;color:#e03060;margin-bottom:20px;animation:fadeUp .6s ease-out both;}
  .hero-title{font-size:clamp(38px,6vw,68px);font-weight:900;color:#1a0d2e;line-height:1.05;margin:0 0 20px;animation:fadeUp .7s .1s ease-out both;}
  .hero-hl{background:linear-gradient(135deg,#ff6f91,#ffd166,#ff9a3c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;display:inline-block;}
  .hero-sub{font-size:18px;color:#6a5280;font-weight:600;line-height:1.65;margin:0 0 36px;max-width:520px;animation:fadeUp .7s .2s ease-out both;}
  .hero-actions{display:flex;gap:14px;flex-wrap:wrap;animation:fadeUp .7s .3s ease-out both;}
  .h-btn-p{background:linear-gradient(135deg,#ff6f91,#ff4d7a);color:white;border:none;border-radius:50px;padding:15px 32px;font-size:16px;font-weight:800;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:8px;box-shadow:0 8px 28px rgba(255,111,145,.45);transition:all .25s;font-family:'Nunito',sans-serif;}
  .h-btn-p:hover{transform:translateY(-3px);box-shadow:0 14px 36px rgba(255,111,145,.55);}
  .h-btn-s{background:white;color:#6b3fa0;border:2px solid rgba(107,63,160,.25);border-radius:50px;padding:13px 28px;font-size:16px;font-weight:800;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:8px;transition:all .25s;font-family:'Nunito',sans-serif;}
  .h-btn-s:hover{background:#f8f4ff;border-color:#6b3fa0;transform:translateY(-2px);box-shadow:0 8px 20px rgba(107,63,160,.15);}
  .hero-stats{display:flex;gap:32px;margin-top:48px;animation:fadeUp .7s .4s ease-out both;flex-wrap:wrap;}
  .hstat-num{font-size:28px;font-weight:900;color:#1a0d2e;display:block;line-height:1;}
  .hstat-lbl{font-size:13px;color:#9480b0;font-weight:600;}
  .stat-sep{width:1.5px;background:#e8d8f5;border-radius:2px;align-self:stretch;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}

  /* ── Real ice cream visual ── */
  .hero-vis{animation:fadeUp .8s .15s ease-out both;}

  .hero-photo-scene{position:relative;width:360px;height:500px;}

  /* main hero cone photo */
  .hero-cone-img{
    position:absolute;bottom:20px;left:50%;transform:translateX(-50%);
    width:260px;height:380px;
    object-fit:cover;object-position:center top;
    border-radius:30px;
    animation:heroFloat 5s ease-in-out infinite;
    filter:drop-shadow(0 28px 48px rgba(120,60,180,.28));
  }
  @keyframes heroFloat{
    0%,100%{transform:translateX(-50%) translateY(0) rotate(0deg);}
    30%{transform:translateX(-50%) translateY(-16px) rotate(1.5deg);}
    70%{transform:translateX(-50%) translateY(-8px) rotate(-1.5deg);}
  }

  /* secondary accent scoops */
  .hero-scoop-accent{
    position:absolute;
    border-radius:50%;overflow:hidden;
    box-shadow:0 12px 36px rgba(0,0,0,.18),inset 0 -4px 14px rgba(0,0,0,.14),inset 0 4px 8px rgba(255,255,255,.22);
    animation:accentFloat var(--af,4s) var(--ad,0s) ease-in-out infinite alternate;
  }
  .hero-scoop-accent img{width:100%;height:100%;object-fit:cover;display:block;}
  /* gloss */
  .hero-scoop-accent::before{content:'';position:absolute;top:10%;left:16%;width:32%;height:24%;
    background:radial-gradient(ellipse,rgba(255,255,255,.6) 0%,rgba(255,255,255,0) 100%);
    border-radius:50%;transform:rotate(-25deg);pointer-events:none;z-index:10;}
  @keyframes accentFloat{from{transform:translateY(0) rotate(var(--ar,-3deg));}to{transform:translateY(-14px) rotate(calc(var(--ar,-3deg)*-1));}}

  /* floating flavor chips with tiny scoop thumbs */
  .h-chip{
    position:absolute;background:rgba(255,255,255,.92);backdrop-filter:blur(14px);
    border:1.5px solid rgba(255,255,255,.85);border-radius:50px;
    padding:8px 14px 8px 8px;font-size:12.5px;font-weight:800;color:#2d1b4e;
    box-shadow:0 6px 24px rgba(120,60,180,.14);
    animation:chipFloat var(--cd,4s) var(--ce,0s) ease-in-out infinite alternate;
    white-space:nowrap;display:flex;align-items:center;gap:8px;
  }
  .h-chip-img{width:28px;height:28px;border-radius:50%;overflow:hidden;flex-shrink:0;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.14);}
  .h-chip-img img{width:100%;height:100%;object-fit:cover;display:block;}
  @keyframes chipFloat{from{transform:translateY(0) rotate(var(--cr,-3deg));}to{transform:translateY(-12px) rotate(calc(var(--cr,-3deg)*-1));}}

  /* sprinkle dots */
  .sprk{position:absolute;border-radius:50px;animation:sprkFloat var(--sd) ease-in-out infinite alternate;opacity:.65;}
  @keyframes sprkFloat{from{transform:translateY(0) rotate(0deg);}to{transform:translateY(-8px) rotate(180deg);}}
`

const CHIPS = [
  {
    label: '🍓 Strawberry Pop',
    img: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=60&h=60&fit=crop&q=80',
    style: { top:'6%', left:'-8%', '--cd':'4.2s','--ce':'0s','--cr':'-4deg' }
  },
  {
    label: '🌿 Mint Breeze',
    img: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=60&h=60&fit=crop&q=80',
    style: { top:'34%', right:'-6%', '--cd':'3.8s','--ce':'0.6s','--cr':'3deg' }
  },
  {
    label: '🍫 Choco Lava',
    img: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=60&h=60&fit=crop&q=80',
    style: { top:'62%', left:'-10%', '--cd':'5s','--ce':'1.2s','--cr':'-2deg' }
  },
]

const SPRINKLES = [
  { w:24,h:8,  top:'18%',left:'80%', bg:'#ff6f91','--sd':'3.1s' },
  { w:20,h:7,  top:'44%',left:'4%',  bg:'#4cc9f0','--sd':'4.2s' },
  { w:18,h:6,  top:'72%',right:'4%', bg:'#ffd166','--sd':'2.8s' },
  { w:14,h:5,  top:'8%', right:'18%',bg:'#7c3aed','--sd':'5s'   },
]

// accent mini-scoops around the hero photo
const ACCENTS = [
  {
    size:72, top:'8%', right:'6%',
    img:'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=144&h=144&fit=crop&q=80',
    style:{'--af':'3.6s','--ad':'0s','--ar':'-5deg'},
  },
  {
    size:58, top:'52%', left:'4%',
    img:'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=116&h=116&fit=crop&q=80',
    style:{'--af':'4.8s','--ad':'0.8s','--ar':'4deg'},
  },
  {
    size:50, bottom:'14%', right:'2%',
    img:'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=100&h=100&fit=crop&q=80',
    style:{'--af':'4.1s','--ad':'1.4s','--ar':'-3deg'},
  },
]

export default function Hero() {
  const styleRef = useRef(false)
  useEffect(() => {
    if (styleRef.current) return; styleRef.current = true
    const el = document.createElement('style'); el.textContent = CSS; document.head.appendChild(el)
  }, [])

  return (
    <header className="hero3d" id="home">
      {/* full-bleed background photo */}
      <div className="hero-bg-photo">
        <img src="https://images.unsplash.com/photo-1587314168-abe4b34c4578?w=1400&h=900&fit=crop&q=60" alt="" aria-hidden="true"/>
      </div>
      <div className="hero-bg-overlay"/>

      {/* blobs */}
      <div className="h-blob" style={{width:500,height:500,top:'-10%',left:'-5%',background:'rgba(255,200,220,.35)','--dur':'9s','--dx':'30px','--dy':'20px'}}/>
      <div className="h-blob" style={{width:400,height:400,bottom:'5%',right:'-8%',background:'rgba(180,200,255,.3)','--dur':'11s','--dx':'-20px','--dy':'-30px'}}/>
      <div className="h-blob" style={{width:300,height:300,top:'40%',left:'40%',background:'rgba(255,220,150,.25)','--dur':'7s','--dx':'25px','--dy':'-15px'}}/>

      <div className="hero-inner">
        {/* Text */}
        <div>
          <span className="hero-badge">✨ AI-Powered Experience</span>
          <h1 className="hero-title">
            Build Your<br/>
            <span className="hero-hl">Mood</span> Ice Cream
          </h1>
          <p className="hero-sub">
            Where emotions become flavors. Discover AI-curated scoops, design your
            dream creation, and share it with the world.
          </p>
          <div className="hero-actions">
            <a href="#mood"    className="h-btn-p">Explore Moods 🎭</a>
            <a href="#builder" className="h-btn-s">Start Building 🍦</a>
          </div>
          <div className="hero-stats">
            <div><span className="hstat-num">10K+</span><span className="hstat-lbl">Creations Shared</span></div>
            <div className="stat-sep"/>
            <div><span className="hstat-num">4</span><span className="hstat-lbl">Mood Profiles</span></div>
            <div className="stat-sep"/>
            <div><span className="hstat-num">50+</span><span className="hstat-lbl">Flavor Combos</span></div>
          </div>
        </div>

        {/* Visual */}
        <div className="hero-vis" aria-hidden="true">
          <div className="hero-photo-scene">
            {/* Floating flavor chips */}
            {CHIPS.map((c,i) => (
              <div key={i} className="h-chip" style={c.style}>
                <div className="h-chip-img"><img src={c.img} alt=""/></div>
                {c.label}
              </div>
            ))}

            {/* Sprinkle dots */}
            {SPRINKLES.map((s,i) => (
              <div key={i} className="sprk"
                style={{width:s.w,height:s.h,top:s.top,left:s.left,right:s.right,bottom:s.bottom,background:s.bg,'--sd':s['--sd'],animationDelay:`${i*.4}s`}}
              />
            ))}

            {/* Small accent scoops */}
            {ACCENTS.map((a,i) => (
              <div key={i} className="hero-scoop-accent"
                style={{width:a.size,height:a.size,top:a.top,left:a.left,right:a.right,bottom:a.bottom,...a.style}}>
                <img src={a.img} alt=""/>
              </div>
            ))}

            {/* MAIN hero ice cream photo */}
            <img
              className="hero-cone-img"
              src="https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=520&h=760&fit=crop&crop=top&q=85"
              alt="Beautiful triple scoop ice cream cone"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </header>
  )
}