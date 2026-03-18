import { useState, useEffect, useRef } from 'react'

const NAVBAR_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

  .nav3d {
    font-family: 'Nunito', sans-serif;
    position: sticky;
    top: 0;
    z-index: 999;
    background: rgba(255,248,240,0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1.5px solid rgba(240,216,255,0.6);
    box-shadow: 0 4px 24px rgba(120,60,180,0.06);
    transition: all 0.3s;
  }

  .nav3d.scrolled {
    background: rgba(255,248,240,0.95);
    box-shadow: 0 4px 32px rgba(120,60,180,0.1);
  }

  .nav3d-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    height: 64px;
  }

  /* Brand */
  .nav3d-brand {
    display: flex; align-items: center; gap: 8px;
    text-decoration: none;
    transition: transform 0.2s;
  }
  .nav3d-brand:hover { transform: scale(1.03); }

  .brand-icon-3d {
    font-size: 26px;
    animation: brandFloat 3.5s ease-in-out infinite;
    display: inline-block;
  }
  @keyframes brandFloat {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50%       { transform: translateY(-4px) rotate(5deg); }
  }

  .brand-name-3d {
    font-size: 18px;
    font-weight: 900;
    background: linear-gradient(135deg, #ff6f91, #7c3aed);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Links */
  .nav3d-links {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .nav3d-link {
    text-decoration: none;
    font-size: 14px;
    font-weight: 800;
    color: #4a3a6a;
    padding: 8px 14px;
    border-radius: 50px;
    transition: all 0.2s;
    position: relative;
  }
  .nav3d-link:hover {
    background: rgba(124,58,237,0.08);
    color: #7c3aed;
  }
  .nav3d-link::after {
    content: '';
    position: absolute;
    bottom: 4px; left: 50%;
    transform: translateX(-50%) scaleX(0);
    width: 60%; height: 2px;
    background: linear-gradient(135deg, #ff6f91, #7c3aed);
    border-radius: 2px;
    transition: transform 0.25s cubic-bezier(0.34,1.2,0.64,1);
  }
  .nav3d-link:hover::after { transform: translateX(-50%) scaleX(1); }

  /* Actions */
  .nav3d-actions {
    display: flex; align-items: center; gap: 10px;
  }

  .cart-btn-3d {
    position: relative;
    background: rgba(124,58,237,0.08);
    border: none; border-radius: 50%;
    width: 40px; height: 40px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; cursor: pointer;
    transition: all 0.2s;
  }
  .cart-btn-3d:hover {
    background: rgba(124,58,237,0.15);
    transform: scale(1.1);
  }

  .cart-badge-3d {
    position: absolute; top: -2px; right: -2px;
    background: linear-gradient(135deg, #ff6f91, #ff4d7a);
    color: white; font-size: 10px; font-weight: 900;
    width: 18px; height: 18px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    border: 2px solid white;
    animation: cartBadgePop 0.3s cubic-bezier(0.34,1.5,0.64,1) both;
  }

  @keyframes cartBadgePop {
    from { transform: scale(0); }
    to   { transform: scale(1); }
  }

  .nav-cta-3d {
    background: linear-gradient(135deg, #ff6f91, #ff4d7a);
    color: white; border: none; border-radius: 50px;
    padding: 10px 22px; font-size: 14px; font-weight: 800;
    cursor: pointer; transition: all 0.2s;
    box-shadow: 0 4px 16px rgba(255,111,145,0.4);
    font-family: 'Nunito', sans-serif;
  }
  .nav-cta-3d:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(255,111,145,0.5);
  }
  .nav-cta-3d:active { transform: scale(0.97); }

  /* Hamburger */
  .hamburger-3d {
    display: none;
    background: none; border: 2px solid #f0e8ff;
    border-radius: 12px; padding: 8px 10px;
    font-size: 18px; cursor: pointer;
    transition: all 0.2s;
    color: #4a3a6a;
    font-family: 'Nunito', sans-serif;
  }
  .hamburger-3d:hover { background: #f8f4ff; border-color: #c4a0e8; }

  /* Mobile */
  @media (max-width: 768px) {
    .hamburger-3d { display: block; }
    .nav3d-links {
      position: absolute;
      top: 64px; left: 0; right: 0;
      flex-direction: column;
      background: rgba(255,248,240,0.98);
      backdrop-filter: blur(20px);
      padding: 16px 24px 24px;
      border-bottom: 1.5px solid #f0e8ff;
      box-shadow: 0 16px 40px rgba(120,60,180,0.12);
      gap: 4px;
      transform: scaleY(0);
      transform-origin: top;
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.34,1.2,0.64,1);
      pointer-events: none;
    }
    .nav3d-links.open {
      transform: scaleY(1); opacity: 1; pointer-events: all;
    }
    .nav3d-link { width: 100%; text-align: center; padding: 12px; }
    .nav-cta-3d { display: none; }
  }
`

export default function Navbar({ cartCount = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const styleRef = useRef(false)

  useEffect(() => {
    if (styleRef.current) return
    styleRef.current = true
    const el = document.createElement('style')
    el.textContent = NAVBAR_CSS
    document.head.appendChild(el)
  }, [])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav className={`nav3d ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav3d-inner">
        <a href="#" className="nav3d-brand">
          <span className="brand-icon-3d">🍦</span>
          <span className="brand-name-3d">AICream Lab</span>
        </a>

        <div className={`nav3d-links ${menuOpen ? 'open' : ''}`}>
          {['#mood', '#builder', '#community', '#menu'].map((href, i) => (
            <a key={href} href={href} className="nav3d-link"
              onClick={() => setMenuOpen(false)}>
              {['Mood Match', 'Builder', 'Community', 'Menu'][i]}
            </a>
          ))}
        </div>

        <div className="nav3d-actions">
          <button className="cart-btn-3d" aria-label="Cart">
            🛒
            {cartCount > 0 && (
              <span className="cart-badge-3d" key={cartCount}>{cartCount}</span>
            )}
          </button>
          <button className="nav-cta-3d">Order Now</button>
          <button
            className="hamburger-3d"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(v => !v)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </nav>
  )
}