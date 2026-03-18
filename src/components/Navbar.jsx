import { useState, useEffect, useRef } from 'react'

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

.nav3d {
  font-family: 'Nunito', sans-serif;
  position: sticky; top: 0; z-index: 999;
  background: rgba(255,248,240,.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1.5px solid rgba(240,216,255,.6);
  box-shadow: 0 4px 24px rgba(120,60,180,.06);
  transition: all .3s;
}
.nav3d.scrolled {
  background: rgba(255,248,240,.97);
  box-shadow: 0 4px 32px rgba(120,60,180,.11);
}

.nav3d-inner {
  max-width: 1200px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 24px; height: 64px;
}

/* brand with real cone image */
.nav-brand {
  display: flex; align-items: center; gap: 10px;
  text-decoration: none; transition: transform .2s;
}
.nav-brand:hover { transform: scale(1.03); }
.nav-brand-img {
  width: 36px; height: 36px; border-radius: 50%; overflow: hidden;
  border: 2px solid rgba(255,111,145,.3);
  box-shadow: 0 3px 10px rgba(255,111,145,.2);
  flex-shrink: 0; animation: brandBob 3.5s ease-in-out infinite;
}
.nav-brand-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
@keyframes brandBob { 0%,100%{transform:translateY(0) rotate(0deg);}50%{transform:translateY(-4px) rotate(5deg);} }
.nav-brand-name {
  font-size: 18px; font-weight: 900;
  background: linear-gradient(135deg,#ff6f91,#7c3aed);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}

/* nav links */
.nav-links { display: flex; align-items: center; gap: 2px; }

.nav-link {
  text-decoration: none; font-size: 14px; font-weight: 800; color: #4a3a6a;
  padding: 8px 14px; border-radius: 50px; transition: all .2s; position: relative;
}
.nav-link:hover { background: rgba(124,58,237,.08); color: #7c3aed; }

/* animated underline */
.nav-link::after {
  content: ''; position: absolute; bottom: 4px; left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 60%; height: 2px;
  background: linear-gradient(135deg,#ff6f91,#7c3aed); border-radius: 2px;
  transition: transform .25s cubic-bezier(.34,1.2,.64,1);
}
.nav-link:hover::after,
.nav-link.is-active::after { transform: translateX(-50%) scaleX(1); }
.nav-link.is-active { color: #7c3aed; background: rgba(124,58,237,.06); }

/* actions */
.nav-actions { display: flex; align-items: center; gap: 10px; }

/* cart button */
.nav-cart-btn {
  position: relative; background: rgba(124,58,237,.08);
  border: none; border-radius: 50%; width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; cursor: pointer; transition: all .2s;
}
.nav-cart-btn:hover { background: rgba(124,58,237,.16); transform: scale(1.1); }
.nav-cart-badge {
  position: absolute; top: -3px; right: -3px;
  background: linear-gradient(135deg,#ff6f91,#ff4d7a); color: white;
  font-size: 10px; font-weight: 900; width: 18px; height: 18px;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  border: 2px solid white;
  animation: badgePop .3s cubic-bezier(.34,1.5,.64,1) both;
}
@keyframes badgePop { from{transform:scale(0)}to{transform:scale(1)} }

/* cart mini tooltip */
.nav-cart-wrap { position: relative; }
.nav-cart-tooltip {
  position: absolute; top: calc(100% + 12px); right: 0;
  background: white; border-radius: 18px; border: 1.5px solid #f0e8ff;
  box-shadow: 0 16px 48px rgba(26,13,46,.18); padding: 14px 16px;
  min-width: 220px; z-index: 99;
  animation: tooltipIn .25s cubic-bezier(.34,1.2,.64,1) both;
  pointer-events: all;
}
@keyframes tooltipIn { from{opacity:0;transform:translateY(-8px) scale(.96);}to{opacity:1;transform:translateY(0) scale(1);} }
.nct-head { font-size: 13px; font-weight: 800; color: #1a0d2e; margin-bottom: 10px; }
.nct-item { display: flex; align-items: center; gap: 8px; padding: 7px 0; border-bottom: 1px solid #f8f3ff; }
.nct-item:last-child { border-bottom: none; }
.nct-img  { width: 36px; height: 36px; border-radius: 10px; overflow: hidden; flex-shrink: 0; }
.nct-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
.nct-name { font-size: 12px; font-weight: 700; color: #2d1b4e; flex: 1; }
.nct-price{ font-size: 12px; font-weight: 800; color: #7c3aed; }
.nct-empty { font-size: 12px; color: #a090b5; font-weight: 600; text-align: center; padding: 8px 0; }
.nct-total { display: flex; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 1.5px solid #f0e8ff; }
.nct-total span:first-child { font-size: 13px; font-weight: 700; color: #8a7a9b; }
.nct-total span:last-child  { font-size: 14px; font-weight: 900; color: #1a0d2e; }
.nct-cta { display: block; width: 100%; margin-top: 10px; background: linear-gradient(135deg,#ff6f91,#ff4d7a); color: white; border: none; border-radius: 50px; padding: 10px; font-size: 13px; font-weight: 800; cursor: pointer; transition: all .2s; font-family: 'Nunito', sans-serif; text-align: center; }
.nct-cta:hover { box-shadow: 0 6px 18px rgba(255,111,145,.4); transform: translateY(-1px); }

.nav-cta-btn {
  background: linear-gradient(135deg,#ff6f91,#ff4d7a); color: white; border: none;
  border-radius: 50px; padding: 10px 22px; font-size: 14px; font-weight: 800;
  cursor: pointer; transition: all .2s; box-shadow: 0 4px 16px rgba(255,111,145,.4);
  font-family: 'Nunito', sans-serif;
}
.nav-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,111,145,.5); }
.nav-cta-btn:active { transform: scale(.97); }

/* hamburger */
.nav-hamburger {
  display: none; background: none; border: 2px solid #f0e8ff; border-radius: 12px;
  padding: 8px 10px; font-size: 18px; cursor: pointer; transition: all .2s;
  color: #4a3a6a; font-family: 'Nunito', sans-serif;
}
.nav-hamburger:hover { background: #f8f4ff; border-color: #c4a0e8; }

/* ── scrolling flavour ticker ── */
.nav-ticker {
  border-top: 1px solid rgba(240,216,255,.5);
  background: rgba(255,248,255,.7);
  overflow: hidden; height: 28px; display: flex; align-items: center;
}
.ticker-track {
  display: flex; gap: 0;
  animation: tickerScroll 28s linear infinite;
  white-space: nowrap;
}
.ticker-track:hover { animation-play-state: paused; }
@keyframes tickerScroll { from{transform:translateX(0);}to{transform:translateX(-50%);} }
.ticker-item {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 0 28px; font-size: 11px; font-weight: 800; color: #a090b5;
  flex-shrink: 0;
}
.ticker-item span { font-size: 13px; }
.ticker-dot { width: 3px; height: 3px; border-radius: 50%; background: #e0d4f5; flex-shrink: 0; }

/* mobile */
@media (max-width: 768px) {
  .nav-hamburger { display: block; }
  .nav-links {
    position: absolute; top: 64px; left: 0; right: 0;
    flex-direction: column;
    background: rgba(255,248,240,.98); backdrop-filter: blur(20px);
    padding: 16px 24px 24px; border-bottom: 1.5px solid #f0e8ff;
    box-shadow: 0 16px 40px rgba(120,60,180,.12); gap: 4px;
    transform: scaleY(0); transform-origin: top; opacity: 0;
    transition: all .3s cubic-bezier(.34,1.2,.64,1); pointer-events: none;
    z-index: 99;
  }
  .nav-links.open { transform: scaleY(1); opacity: 1; pointer-events: all; }
  .nav-link { width: 100%; text-align: center; padding: 12px; }
  .nav-cta-btn { display: none; }
}
`

const TICKER_FLAVOURS = [
  { emoji:'🍓', name:'Strawberry Pop' }, { emoji:'🍫', name:'Choco Lava' },
  { emoji:'🌿', name:'Mint Breeze'    }, { emoji:'🥭', name:'Mango Tango' },
  { emoji:'🫐', name:'Blueberry Storm'}, { emoji:'🌟', name:'Vanilla Nova' },
  { emoji:'🍦', name:'Coconut Dream'  }, { emoji:'🍮', name:'Caramel Swirl'},
  { emoji:'🔮', name:'Galaxy Float'   }, { emoji:'🧇', name:'Waffle Stack' },
]

const NAV_ITEMS = [
  { href:'#mood',      label:'Mood Match' },
  { href:'#builder',   label:'Builder'    },
  { href:'#community', label:'Community'  },
  { href:'#menu',      label:'Menu'       },
]

export default function Navbar({ cartCount = 0, cartItems = [], onCartClick }) {
  const [menuOpen,   setMenuOpen]   = useState(false)
  const [scrolled,   setScrolled]   = useState(false)
  const [activeHref, setActiveHref] = useState('#mood')
  const [cartHover,  setCartHover]  = useState(false)
  const hoverTimer = useRef(null)
  const styleRef   = useRef(false)

  // inject CSS once
  useEffect(() => {
    if (styleRef.current) return
    styleRef.current = true
    const el = document.createElement('style')
    el.textContent = CSS
    document.head.appendChild(el)
  }, [])

  // scroll detection
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // active section tracking via IntersectionObserver
  useEffect(() => {
    const sections = ['mood','builder','community','menu']
    const map = {}
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => { map[e.target.id] = e.isIntersecting })
        const visible = sections.find(id => map[id])
        if (visible) setActiveHref(`#${visible}`)
      },
      { threshold: 0.25 }
    )
    sections.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  function handleCartEnter() {
    clearTimeout(hoverTimer.current)
    setCartHover(true)
  }
  function handleCartLeave() {
    hoverTimer.current = setTimeout(() => setCartHover(false), 280)
  }

  const cartTotal = (cartItems || []).reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0)

  // doubled ticker for seamless loop
  const tickerItems = [...TICKER_FLAVOURS, ...TICKER_FLAVOURS]

  return (
    <nav className={`nav3d ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav3d-inner">

        {/* Brand */}
        <a href="#" className="nav-brand">
          <div className="nav-brand-img">
            <img
              src="https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=80&h=80&fit=crop&q=80"
              alt="Ice Cream Hub"
            />
          </div>
          <span className="nav-brand-name">Ice Cream Hub</span>
        </a>

        {/* Links */}
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {NAV_ITEMS.map(({ href, label }) => (
            <a key={href} href={href}
              className={`nav-link ${activeHref === href ? 'is-active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="nav-actions">
          {/* Cart with hover tooltip */}
          <div
            className="nav-cart-wrap"
            onMouseEnter={handleCartEnter}
            onMouseLeave={handleCartLeave}
          >
            <button
              className="nav-cart-btn"
              aria-label="Cart"
              onClick={onCartClick}
            >
              🛒
              {cartCount > 0 && (
                <span className="nav-cart-badge" key={cartCount}>{cartCount}</span>
              )}
            </button>

            {cartHover && (
              <div className="nav-cart-tooltip">
                <p className="nct-head">🛒 Your Order</p>
                {(cartItems || []).length === 0 ? (
                  <p className="nct-empty">No items yet. Add from the menu!</p>
                ) : (
                  <>
                    {(cartItems || []).slice(0, 4).map((item, i) => (
                      <div key={i} className="nct-item">
                        <div className="nct-img">
                          <img src={item.img || 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=80&h=80&fit=crop&q=80'} alt={item.name}/>
                        </div>
                        <span className="nct-name">{item.name} ×{item.qty||1}</span>
                        <span className="nct-price">₹{(item.price||0)*(item.qty||1)}</span>
                      </div>
                    ))}
                    {(cartItems||[]).length > 4 && (
                      <p style={{fontSize:11,color:'#a090b5',fontWeight:600,margin:'6px 0 0',textAlign:'center'}}>
                        +{(cartItems||[]).length - 4} more items
                      </p>
                    )}
                    <div className="nct-total">
                      <span>Total</span><span>₹{cartTotal}</span>
                    </div>
                    <button className="nct-cta" onClick={onCartClick}>View Order →</button>
                  </>
                )}
              </div>
            )}
          </div>

          <a href="#menu" className="nav-cta-btn">Order Now</a>

          <button className="nav-hamburger" aria-label="Toggle menu" onClick={() => setMenuOpen(v => !v)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Scrolling flavour ticker */}
      <div className="nav-ticker">
        <div className="ticker-track">
          {tickerItems.map((item, i) => (
            <>
              <span key={i} className="ticker-item">
                <span>{item.emoji}</span>{item.name}
              </span>
              <span className="ticker-dot" key={`dot-${i}`}/>
            </>
          ))}
        </div>
      </div>
    </nav>
  )
}