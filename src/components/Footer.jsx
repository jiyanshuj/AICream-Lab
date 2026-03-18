import { useEffect, useRef } from 'react'

const FOOTER_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

  .footer3d {
    font-family: 'Nunito', sans-serif;
    background: linear-gradient(180deg, #fff8f0 0%, #1a0d2e 40%);
    position: relative;
    overflow: hidden;
    margin-top: 40px;
  }

  .footer3d::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1.5px;
    background: linear-gradient(90deg, transparent, #ff6f91, #ffd166, #7c3aed, transparent);
  }

  .footer3d-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 64px 32px 40px;
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr 1fr;
    gap: 48px;
  }

  @media (max-width: 900px) {
    .footer3d-inner { grid-template-columns: 1fr 1fr; gap: 32px; }
  }
  @media (max-width: 500px) {
    .footer3d-inner { grid-template-columns: 1fr; }
  }

  .footer-brand-3d {
    display: flex; flex-direction: column; gap: 12px;
  }

  .footer-brand-logo {
    display: flex; align-items: center; gap: 10px;
  }

  .footer-icon-3d {
    font-size: 32px;
    animation: footerFloat 4s ease-in-out infinite;
    display: inline-block;
  }
  @keyframes footerFloat {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50%       { transform: translateY(-6px) rotate(8deg); }
  }

  .footer-brand-name-3d {
    font-size: 22px; font-weight: 900;
    background: linear-gradient(135deg, #ff6f91, #ffd166);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .footer-tagline-3d {
    font-size: 14px; color: rgba(255,255,255,0.5);
    font-weight: 600; line-height: 1.6; max-width: 220px;
    margin: 0;
  }

  .footer-social {
    display: flex; gap: 10px; margin-top: 4px;
  }

  .social-btn {
    width: 36px; height: 36px; border-radius: 50%;
    background: rgba(255,255,255,0.08);
    border: 1.5px solid rgba(255,255,255,0.12);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; cursor: pointer;
    transition: all 0.2s; text-decoration: none;
    color: white;
  }
  .social-btn:hover {
    background: rgba(255,111,145,0.25);
    border-color: rgba(255,111,145,0.4);
    transform: translateY(-3px) scale(1.1);
    box-shadow: 0 6px 16px rgba(255,111,145,0.25);
  }

  /* Footer columns */
  .footer-col-3d h4 {
    font-size: 12px; font-weight: 800; color: rgba(255,255,255,0.4);
    text-transform: uppercase; letter-spacing: 0.08em;
    margin: 0 0 16px;
  }

  .footer-col-3d a {
    display: block;
    font-size: 14px; font-weight: 600;
    color: rgba(255,255,255,0.7);
    text-decoration: none;
    margin-bottom: 10px;
    transition: all 0.2s;
    width: fit-content;
  }
  .footer-col-3d a:hover {
    color: #ff6f91;
    transform: translateX(4px);
  }

  /* Bottom bar */
  .footer3d-bottom {
    border-top: 1px solid rgba(255,255,255,0.08);
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
  }

  .footer3d-bottom p {
    font-size: 13px; color: rgba(255,255,255,0.4);
    font-weight: 600; margin: 0;
  }

  .footer-bottom-links {
    display: flex; gap: 20px;
  }
  .footer-bottom-links a {
    font-size: 12px; color: rgba(255,255,255,0.35);
    text-decoration: none; font-weight: 600;
    transition: color 0.2s;
  }
  .footer-bottom-links a:hover { color: rgba(255,255,255,0.7); }
`

const LINKS = [
  { title: 'Explore', items: [['Mood Match', '#mood'], ['Builder', '#builder'], ['Community', '#community'], ['Menu', '#menu']] },
  { title: 'Company', items: [['About Us', '#'], ['Careers', '#'], ['Blog', '#'], ['Press', '#']] },
  { title: 'Support', items: [['FAQ', '#'], ['Contact', '#'], ['Privacy', '#'], ['Terms', '#']] },
]

export default function Footer() {
  const styleRef = useRef(false)
  useEffect(() => {
    if (styleRef.current) return
    styleRef.current = true
    const el = document.createElement('style')
    el.textContent = FOOTER_CSS
    document.head.appendChild(el)
  }, [])

  return (
    <footer className="footer3d">
      <div className="footer3d-inner">
        <div className="footer-brand-3d">
          <div className="footer-brand-logo">
            <span className="footer-icon-3d">🍦</span>
            <span className="footer-brand-name-3d">ICE cream hub</span>
          </div>
          <p className="footer-tagline-3d">
            Where emotions become flavors. Curated with care, community-powered.
          </p>
          <div className="footer-social">
            {['🐦', '📸', '💼', '▶️'].map((icon, i) => (
              <a key={i} href="#" className="social-btn">{icon}</a>
            ))}
          </div>
        </div>

        {LINKS.map(col => (
          <div key={col.title} className="footer-col-3d">
            <h4>{col.title}</h4>
            {col.items.map(([label, href]) => (
              <a key={label} href={href}>{label}</a>
            ))}
          </div>
        ))}
      </div>

      <div className="footer3d-bottom">
        <p>© {new Date().getFullYear()} ICE cream hub. Made with ❤️ and lots of scoops.</p>
        <div className="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookies</a>
        </div>
      </div>
    </footer>
  )
}