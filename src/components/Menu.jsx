import { useState, useEffect, useRef } from 'react'

// ─── Data ───────────────────────────────────────────────────────────────────

const MENU_DATA = {
    'Signature Scoops': [
        { id: 1, name: 'Vanilla Nova', emoji: '🌟', desc: 'Madagascar vanilla bean with golden flecks and a silky-smooth finish.', price: 120, tag: 'Classic', color: 'linear-gradient(145deg,#fefce8,#fde68a)', tcolor: '#92400e' },
        { id: 2, name: 'Strawberry Pop', emoji: '🍓', desc: 'Sun-ripened strawberries churned into a vibrant, fruity explosion.', price: 130, tag: 'Popular', color: 'linear-gradient(145deg,#ffe4e6,#fda4af)', tcolor: '#9f1239' },
        { id: 3, name: 'Choco Lava', emoji: '🍫', desc: 'Belgian dark chocolate with a molten core of ganache ribbons.', price: 140, tag: 'Hot', color: 'linear-gradient(145deg,#f5d0a9,#c8763a)', tcolor: '#7c2d12' },
        { id: 4, name: 'Mint Breeze', emoji: '🌿', desc: 'Cool peppermint swirled with crispy chocolate flakes and fresh herb notes.', price: 135, tag: 'Refresh', color: 'linear-gradient(145deg,#d1fae5,#6ee7b7)', tcolor: '#065f46' },
        { id: 5, name: 'Blueberry Storm', emoji: '🫐', desc: 'Wild blueberries with a jammy swirl and hints of lavender cream.', price: 145, tag: 'New', color: 'linear-gradient(145deg,#ede9fe,#a78bfa)', tcolor: '#4c1d95' },
        { id: 6, name: 'Mango Tango', emoji: '🥭', desc: 'Alphonso mango sorbet base with a tangy tamarind twist and chilli edge.', price: 130, tag: 'Spicy', color: 'linear-gradient(145deg,#fef3c7,#fbbf24)', tcolor: '#78350f' },
    ],
    'Sundaes': [
        { id: 7, name: 'Triple Crown Sundae', emoji: '👑', desc: '3 scoops of your choice, hot fudge, caramel drizzle & whipped cream tower.', price: 280, tag: 'Bestseller', color: 'linear-gradient(145deg,#fdf4ff,#e9d5ff)', tcolor: '#581c87' },
        { id: 8, name: 'Berry Bliss Parfait', emoji: '🍒', desc: 'Layered strawberry & blueberry scoops with granola, fresh berries, honey.', price: 240, tag: 'Healthy', color: 'linear-gradient(145deg,#fce7f3,#fbcfe8)', tcolor: '#9d174d' },
        { id: 9, name: 'Lava Brownie Split', emoji: '🍮', desc: 'Warm fudge brownie, 2 scoops Choco Lava, salted caramel and roasted nuts.', price: 320, tag: 'Indulge', color: 'linear-gradient(145deg,#fef3c7,#d97706)', tcolor: '#78350f' },
        { id: 10, name: 'Tropical Paradise', emoji: '🌴', desc: 'Mango + coconut scoops, pineapple chunks, toasted coconut flakes.', price: 260, tag: 'New', color: 'linear-gradient(145deg,#ecfdf5,#6ee7b7)', tcolor: '#064e3b' },
    ],
    'Shakes & Floats': [
        { id: 11, name: 'Classic Shake', emoji: '🥤', desc: 'Thick blended shake in Vanilla, Choco or Strawberry — your pick.', price: 180, tag: 'Classic', color: 'linear-gradient(145deg,#f0f9ff,#bae6fd)', tcolor: '#0c4a6e' },
        { id: 12, name: 'Galaxy Float', emoji: '🔮', desc: 'Blueberry vanilla float with bubbly cola and starry popping candy dust.', price: 220, tag: 'Viral', color: 'linear-gradient(145deg,#f5f3ff,#c4b5fd)', tcolor: '#3730a3' },
        { id: 13, name: 'Mango Lassi Float', emoji: '🧡', desc: 'Creamy mango lassi base with a Mango Tango scoop floating on top.', price: 200, tag: 'Desi Hit', color: 'linear-gradient(145deg,#fffbeb,#fcd34d)', tcolor: '#78350f' },
        { id: 14, name: 'Cold Brew Affogato', emoji: '☕', desc: 'Single espresso shot poured over Vanilla Nova, served with a biscotti.', price: 190, tag: 'Caffeine', color: 'linear-gradient(145deg,#fef9ee,#d4a96a)', tcolor: '#3d1a00' },
    ],
    'Waffles & Cones': [
        { id: 15, name: 'Belgian Waffle Stack', emoji: '🧇', desc: 'Crispy waffle, 2 scoops, Nutella drizzle, fresh strawberries & cream.', price: 290, tag: 'Fan Fave', color: 'linear-gradient(145deg,#fef3c7,#fbbf24)', tcolor: '#78350f' },
        { id: 16, name: 'Bubble Waffle Cone', emoji: '🫧', desc: 'Hong Kong-style egg waffle cone stuffed with 2 scoops & sprinkle burst.', price: 260, tag: 'Trendy', color: 'linear-gradient(145deg,#fff1f2,#fda4af)', tcolor: '#9f1239' },
        { id: 17, name: 'Choco Dipped Cone', emoji: '🍦', desc: 'Soft-serve twist dipped in dark Belgian chocolate with rainbow sprinkles.', price: 150, tag: 'Quick', color: 'linear-gradient(145deg,#f5f5f4,#d6d3d1)', tcolor: '#1c1917' },
        { id: 18, name: 'Loaded Waffle Boat', emoji: '⛵', desc: 'Giant waffle boat, 4 scoops, all toppings, sauces – the full experience.', price: 380, tag: '🔥 Epic', color: 'linear-gradient(145deg,#fdf4ff,#f0abfc)', tcolor: '#701a75' },
    ],
}

const TAG_STYLES = {
    'Classic': { bg: '#fef3c7', color: '#92400e' },
    'Popular': { bg: '#ffe4e6', color: '#9f1239' },
    'Hot': { bg: '#ffedd5', color: '#9a3412' },
    'Refresh': { bg: '#d1fae5', color: '#065f46' },
    'New': { bg: '#dbeafe', color: '#1e40af' },
    'Spicy': { bg: '#fee2e2', color: '#991b1b' },
    'Bestseller': { bg: '#fdf4ff', color: '#7e22ce' },
    'Healthy': { bg: '#ecfdf5', color: '#14532d' },
    'Indulge': { bg: '#fef3c7', color: '#92400e' },
    'Viral': { bg: '#f5f3ff', color: '#4338ca' },
    'Desi Hit': { bg: '#fff7ed', color: '#c2410c' },
    'Caffeine': { bg: '#fef9ee', color: '#854d0e' },
    'Fan Fave': { bg: '#fefce8', color: '#713f12' },
    'Trendy': { bg: '#fce7f3', color: '#9d174d' },
    'Quick': { bg: '#f8fafc', color: '#334155' },
    '🔥 Epic': { bg: '#fdf4ff', color: '#7e22ce' },
}

function generateOrderId() {
    const now = new Date()
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, '0')
    const d = String(now.getDate()).padStart(2, '0')
    const token = Math.random().toString(36).slice(2, 7).toUpperCase()
    return `ICH-${y}${m}${d}-${token}`
}

const MENU_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

  .menu3d { font-family: 'Nunito', sans-serif; background: linear-gradient(160deg,#fff8f0 0%,#fff0f8 50%,#f4f0ff 100%); min-height: 100vh; }

  /* ── Section header ── */
  .menu3d-head { max-width: 1200px; margin: 0 auto; padding: 72px 32px 0; }
  .menu3d-badge { display:inline-flex;align-items:center;gap:7px;background:linear-gradient(135deg,#ff6f9122,#ffd16622);border:1.5px solid rgba(255,111,145,0.25);border-radius:50px;padding:6px 18px;font-size:12px;font-weight:800;color:#e0306a;letter-spacing:.06em;text-transform:uppercase;margin-bottom:12px; }
  .menu3d-title { font-size:clamp(28px,4vw,46px);font-weight:900;color:#1a0d2e;margin:0 0 10px;line-height:1.05; }
  .menu3d-sub { font-size:16px;color:#8a7a9b;font-weight:600;margin:0 0 36px; }

  /* ── Category tabs ── */
  .cat-tabs { display:flex;gap:0;border-bottom:2.5px solid #f0e8ff;margin-bottom:40px;overflow-x:auto;padding-bottom:0;scrollbar-width:none; }
  .cat-tabs::-webkit-scrollbar { display:none; }
  .cat-tab { padding:14px 26px;font-size:14px;font-weight:800;cursor:pointer;border:none;background:none;color:#a090b5;transition:all .25s;white-space:nowrap;position:relative;border-bottom:3px solid transparent;margin-bottom:-2.5px;font-family:'Nunito',sans-serif; }
  .cat-tab::after { content:'';position:absolute;bottom:-2.5px;left:0;right:0;height:3px;border-radius:3px 3px 0 0;background:linear-gradient(90deg,#ff6f91,#7c3aed);transform:scaleX(0);transform-origin:left;transition:transform .3s cubic-bezier(.34,1.2,.64,1); }
  .cat-tab:hover { color:#4a3a6a; }
  .cat-tab.active { color:#2d1b4e; }
  .cat-tab.active::after { transform:scaleX(1); }
  .cat-tab .cat-count { display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;background:#f0e8ff;color:#7c3aed;border-radius:50%;font-size:10px;font-weight:900;margin-left:6px; }
  .cat-tab.active .cat-count { background:linear-gradient(135deg,#ff6f91,#7c3aed);color:white; }

  /* ── Item grid ── */
  .menu3d-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:22px; }

  /* ── Item card ── */
  .item-card {
    background:white;border-radius:24px;border:1.5px solid #f0e8ff;
    overflow:hidden;transition:all .35s cubic-bezier(.34,1.1,.64,1);
    animation:cardReveal .45s ease-out both;
    display:flex;flex-direction:column;
    cursor:pointer;
  }
  .item-card:hover { transform:translateY(-8px) scale(1.015);box-shadow:0 24px 56px rgba(120,60,180,.16);border-color:#dab8f8; }

  @keyframes cardReveal {
    from { opacity:0;transform:translateY(22px) scale(.95); }
    to   { opacity:1;transform:translateY(0) scale(1); }
  }

  /* ── Card visual top ── */
  .card-visual { position:relative;padding:28px 24px 20px;display:flex;align-items:center;justify-content:center;min-height:140px; }
  .card-visual-bg { position:absolute;inset:0;transition:transform .5s ease;border-radius:22px 22px 0 0; }
  .item-card:hover .card-visual-bg { transform:scale(1.04); }

  /* 3D scoop illustration */
  .card-scoop-wrap { position:relative;z-index:2;animation:scoopBob 4s ease-in-out infinite; }
  @keyframes scoopBob { 0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-8px) rotate(2deg)} }

  .card-scoop { width:80px;height:80px;border-radius:50%;position:relative;transition:transform .3s; }
  .item-card:hover .card-scoop { transform:scale(1.1); }
  .card-scoop::before { content:'';position:absolute;top:13%;left:18%;width:30%;height:22%;background:rgba(255,255,255,.55);border-radius:50%;transform:rotate(-30deg);filter:blur(2px); }
  .card-scoop::after  { content:'';position:absolute;top:11%;left:20%;width:11%;height:8%;background:rgba(255,255,255,.9);border-radius:50%; }

  .card-emoji-badge { position:absolute;bottom:-6px;right:-6px;font-size:22px;filter:drop-shadow(0 4px 8px rgba(0,0,0,.14));z-index:3;animation:badgePulse 3s ease-in-out infinite; }
  @keyframes badgePulse { 0%,100%{transform:scale(1) rotate(-6deg)}50%{transform:scale(1.15) rotate(6deg)} }

  .card-tag { position:absolute;top:14px;left:14px;z-index:5;padding:4px 12px;border-radius:50px;font-size:11px;font-weight:800;box-shadow:0 3px 10px rgba(0,0,0,.1); }

  /* ── Card body ── */
  .card-body { padding:18px 20px 14px;flex:1;display:flex;flex-direction:column; }
  .card-name { font-size:17px;font-weight:900;color:#1a0d2e;margin:0 0 6px;line-height:1.2; }
  .card-desc { font-size:12.5px;font-weight:600;color:#8a7a9b;line-height:1.65;margin:0 0 auto;flex:1; }

  /* ── Card footer ── */
  .card-foot { padding:14px 20px 18px;display:flex;align-items:center;justify-content:space-between;border-top:1.5px solid #f8f3ff;margin-top:14px; }
  .card-price { font-size:20px;font-weight:900;color:#1a0d2e; }
  .card-price sup { font-size:12px;font-weight:800;color:#7c3aed;vertical-align:super;margin-right:1px; }

  .add-btn {
    display:flex;align-items:center;gap:7px;
    background:linear-gradient(135deg,#ff6f91,#ff4d7a);color:white;
    border:none;border-radius:50px;padding:10px 18px;font-size:13px;font-weight:800;
    cursor:pointer;transition:all .2s;box-shadow:0 6px 18px rgba(255,111,145,.35);
    font-family:'Nunito',sans-serif;
  }
  .add-btn:hover { transform:translateY(-2px);box-shadow:0 10px 26px rgba(255,111,145,.45); }
  .add-btn:active { transform:scale(.96); }
  .add-btn.added { background:linear-gradient(135deg,#10b981,#059669);box-shadow:0 6px 18px rgba(16,185,129,.35);animation:addedPop .35s cubic-bezier(.34,1.5,.64,1); }
  @keyframes addedPop { 0%{transform:scale(1)}50%{transform:scale(1.15)}100%{transform:scale(1)} }

  /* ── Cart ribbon ── */
  .cart-ribbon {
    position:sticky;bottom:24px;z-index:100;
    display:flex;justify-content:center;
    pointer-events:none;
    margin-top:32px;
  }
  .cart-pill {
    pointer-events:all;
    background:linear-gradient(135deg,#1a0d2e,#2d1b4e);
    color:white;border:none;border-radius:50px;
    padding:16px 32px;font-size:15px;font-weight:800;
    cursor:pointer;transition:all .3s cubic-bezier(.34,1.2,.64,1);
    display:flex;align-items:center;gap:14px;
    box-shadow:0 16px 48px rgba(26,13,46,.45);
    font-family:'Nunito',sans-serif;
    animation:pillSlideUp .4s cubic-bezier(.34,1.2,.64,1) both;
  }
  @keyframes pillSlideUp { from{transform:translateY(40px);opacity:0} to{transform:translateY(0);opacity:1} }
  .cart-pill:hover { transform:translateY(-4px) scale(1.03);box-shadow:0 24px 56px rgba(26,13,46,.55); }
  .cart-count-bubble { background:linear-gradient(135deg,#ff6f91,#ff4d7a);border-radius:50px;min-width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:900;padding:0 8px;animation:bubblePop .3s cubic-bezier(.34,1.6,.64,1) both; }
  @keyframes bubblePop { from{transform:scale(0)}to{transform:scale(1)} }
  .cart-total { font-size:13px;color:rgba(255,255,255,.6);font-weight:600; }
  .cart-divider { width:1.5px;height:22px;background:rgba(255,255,255,.15);border-radius:2px; }

  /* ── Cart drawer ── */
  .cart-backdrop { position:fixed;inset:0;background:rgba(26,13,46,.45);z-index:200;animation:fadeIn .25s ease; }
  @keyframes fadeIn { from{opacity:0}to{opacity:1} }
  .cart-drawer {
    position:fixed;right:0;top:0;bottom:0;z-index:201;
    width:min(420px,100vw);background:white;
    display:flex;flex-direction:column;
    box-shadow:-24px 0 64px rgba(26,13,46,.2);
    animation:drawerSlide .35s cubic-bezier(.34,1.1,.64,1);
  }
  @keyframes drawerSlide { from{transform:translateX(100%)} to{transform:translateX(0)} }

  .drawer-head { padding:24px 28px 18px;border-bottom:1.5px solid #f0e8ff;display:flex;align-items:center;justify-content:space-between; }
  .drawer-title { font-size:20px;font-weight:900;color:#1a0d2e;margin:0; }
  .drawer-close { background:rgba(240,232,255,.6);border:none;border-radius:50%;width:36px;height:36px;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;font-family:'Nunito',sans-serif; }
  .drawer-close:hover { background:#f0e8ff;transform:scale(1.1); }

  .drawer-items { flex:1;overflow-y:auto;padding:18px 28px;display:flex;flex-direction:column;gap:14px; }
  .drawer-items::-webkit-scrollbar { width:4px; }
  .drawer-items::-webkit-scrollbar-thumb { background:#e8daf8;border-radius:4px; }

  .cart-item { display:flex;align-items:center;gap:14px;padding:14px;background:#fdf9ff;border-radius:18px;border:1.5px solid #f0e8ff; }
  .ci-emoji { font-size:26px;flex-shrink:0; }
  .ci-info { flex:1;min-width:0; }
  .ci-name { font-size:14px;font-weight:800;color:#1a0d2e;margin:0 0 2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
  .ci-price { font-size:13px;color:#7c3aed;font-weight:800;margin:0; }
  .ci-qty { display:flex;align-items:center;gap:8px; }
  .ci-btn { background:#f0e8ff;border:none;border-radius:50%;width:28px;height:28px;font-size:16px;font-weight:900;cursor:pointer;color:#7c3aed;transition:all .15s;display:flex;align-items:center;justify-content:center;font-family:'Nunito',sans-serif; }
  .ci-btn:hover { background:#e0d0ff;transform:scale(1.1); }
  .ci-qty-num { font-size:15px;font-weight:900;color:#1a0d2e;min-width:20px;text-align:center; }

  .drawer-empty { flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#c0b0d0;gap:10px; }
  .drawer-empty-icon { font-size:48px;animation:emptyBob 3s ease-in-out infinite; }
  @keyframes emptyBob { 0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)} }

  .drawer-foot { padding:20px 28px;border-top:1.5px solid #f0e8ff; }
  .drawer-subtotal { display:flex;justify-content:space-between;margin-bottom:16px;font-size:15px; }
  .drawer-subtotal span:first-child { color:#8a7a9b;font-weight:600; }
  .drawer-subtotal span:last-child  { color:#1a0d2e;font-weight:900;font-size:20px; }
  .checkout-btn { width:100%;background:linear-gradient(135deg,#ff6f91,#7c3aed);color:white;border:none;border-radius:50px;padding:16px;font-size:16px;font-weight:800;cursor:pointer;transition:all .25s;box-shadow:0 8px 24px rgba(124,58,237,.35);font-family:'Nunito',sans-serif; }
  .checkout-btn:hover { transform:translateY(-2px);box-shadow:0 14px 36px rgba(124,58,237,.45); }
  .checkout-btn:active { transform:scale(.98); }
  .drawer-note { font-size:11px;color:#b0a0c5;text-align:center;margin-top:10px;font-weight:600; }

  /* ── Search bar ── */
  .menu3d-search { position:relative;max-width:360px;margin-bottom:28px; }
  .search-input { width:100%;border:2px solid #f0e8ff;border-radius:50px;padding:12px 20px 12px 46px;font-size:14px;font-weight:700;font-family:'Nunito',sans-serif;color:#2d1b4e;outline:none;background:white;transition:border .2s;box-sizing:border-box; }
  .search-input:focus { border-color:#c4a0e8;box-shadow:0 0 0 4px rgba(196,160,232,.12); }
  .search-icon { position:absolute;left:16px;top:50%;transform:translateY(-50%);font-size:16px;pointer-events:none; }

  /* ── Section main ── */
  .menu3d-main { max-width:1200px;margin:0 auto;padding:0 32px 80px; }

  /* ── Receipt page ── */
  .receipt-page {
    max-width: 920px;
    margin: 0 auto;
    padding: 72px 32px 80px;
  }

  .receipt-card {
    background: white;
    border-radius: 26px;
    border: 1.5px solid #f0e8ff;
    box-shadow: 0 24px 64px rgba(120,60,180,.14);
    overflow: hidden;
  }

  .receipt-head {
    padding: 26px 28px;
    background: linear-gradient(135deg,#1a0d2e,#2d1b4e);
    color: white;
  }

  .receipt-head h2 {
    margin: 0;
    font-size: clamp(24px, 3vw, 34px);
    font-weight: 900;
    line-height: 1.1;
  }

  .receipt-head p {
    margin: 8px 0 0;
    opacity: .82;
    font-size: 13px;
    font-weight: 700;
  }

  .receipt-meta {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    padding: 18px 28px;
    border-bottom: 1.5px solid #f0e8ff;
    background: #fcf9ff;
  }

  .receipt-meta div {
    padding: 10px 12px;
    border-radius: 14px;
    border: 1.5px solid #f0e8ff;
    background: white;
  }

  .receipt-meta label {
    display: block;
    font-size: 11px;
    font-weight: 800;
    color: #8a7a9b;
    margin-bottom: 4px;
    letter-spacing: .05em;
    text-transform: uppercase;
  }

  .receipt-meta strong {
    color: #1a0d2e;
    font-size: 15px;
    font-weight: 900;
  }

  .receipt-items {
    padding: 14px 28px 8px;
    display: grid;
    gap: 10px;
  }

  .receipt-row {
    display: grid;
    grid-template-columns: auto 1fr auto auto;
    gap: 10px;
    align-items: center;
    padding: 12px 14px;
    border-radius: 14px;
    border: 1.5px solid #f6f0ff;
    background: #fff;
  }

  .receipt-row .emoji { font-size: 20px; }
  .receipt-row .name { font-size: 14px; font-weight: 800; color: #1a0d2e; }
  .receipt-row .qty  { font-size: 12px; font-weight: 800; color: #8a7a9b; }
  .receipt-row .amt  { font-size: 14px; font-weight: 900; color: #7c3aed; }

  .receipt-foot {
    margin-top: 8px;
    padding: 18px 28px 26px;
    border-top: 1.5px solid #f0e8ff;
    background: #fcf9ff;
  }

  .receipt-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
    color: #1a0d2e;
  }

  .receipt-total span:first-child { font-size: 14px; font-weight: 800; }
  .receipt-total span:last-child  { font-size: 24px; font-weight: 900; }

  .receipt-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .receipt-btn {
    border: none;
    border-radius: 50px;
    padding: 12px 20px;
    font-size: 14px;
    font-weight: 800;
    cursor: pointer;
    font-family: 'Nunito', sans-serif;
    transition: all .2s;
  }

  .receipt-btn.primary {
    color: white;
    background: linear-gradient(135deg,#10b981,#059669);
    box-shadow: 0 8px 24px rgba(16,185,129,.28);
  }

  .receipt-btn.secondary {
    color: #4a3a6a;
    background: #f4ecff;
  }

  .receipt-btn:hover {
    transform: translateY(-2px);
  }

  @media (max-width:600px) {
    .menu3d-head,.menu3d-main { padding-left:16px;padding-right:16px; }
    .cat-tab { padding:12px 16px; }
    .receipt-page { padding-left: 16px; padding-right: 16px; }
    .receipt-meta { grid-template-columns: 1fr; }
    .receipt-row { grid-template-columns: auto 1fr auto; }
    .receipt-row .amt { grid-column: 2 / 4; justify-self: end; }
    .receipt-actions { flex-direction: column; }
  }
`

// ─── Sub-components ──────────────────────────────────────────────────────────

function ScoopVisual({ item }) {
    // derive a solid color from the gradient for the box-shadow
    const solidColor = item.tcolor || '#7c3aed'
    return (
        <div className="card-scoop-wrap">
            <div
                className="card-scoop"
                style={{
                    background: item.color,
                    boxShadow: `inset -10px -10px 24px rgba(0,0,0,.18), inset 4px 4px 10px rgba(255,255,255,.3), 0 12px 32px ${solidColor}33`,
                }}
            />
            <span className="card-emoji-badge">{item.emoji}</span>
        </div>
    )
}

function ItemCard({ item, onAdd, addedIds }) {
    const tagStyle = TAG_STYLES[item.tag] || { bg: '#f0e8ff', color: '#7c3aed' }
    const isAdded = addedIds.has(item.id)

    return (
        <div className="item-card" style={{ animationDelay: '0ms' }}>
            <div className="card-visual">
                <div className="card-visual-bg" style={{ background: item.color }} />
                <span
                    className="card-tag"
                    style={{ background: tagStyle.bg, color: tagStyle.color }}
                >
                    {item.tag}
                </span>
                <ScoopVisual item={item} />
            </div>

            <div className="card-body">
                <h3 className="card-name">{item.name}</h3>
                <p className="card-desc">{item.desc}</p>
            </div>

            <div className="card-foot">
                <div className="card-price">
                    <sup>₹</sup>{item.price}
                </div>
                <button
                    className={`add-btn ${isAdded ? 'added' : ''}`}
                    onClick={() => onAdd(item)}
                >
                    {isAdded ? '✓ Added' : '+ Add'}
                </button>
            </div>
        </div>
    )
}

function CartDrawer({ cart, onClose, onQty, onPlaceOrder }) {
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0)

    return (
        <>
            <div className="cart-backdrop" onClick={onClose} />
            <div className="cart-drawer">
                <div className="drawer-head">
                    <h2 className="drawer-title">🛒 Your Order</h2>
                    <button className="drawer-close" onClick={onClose}>✕</button>
                </div>

                <div className="drawer-items">
                    {cart.length === 0 ? (
                        <div className="drawer-empty">
                            <span className="drawer-empty-icon">🍦</span>
                            <p style={{ fontWeight: 700, fontSize: 14 }}>Your cart is empty</p>
                            <p style={{ fontSize: 12 }}>Add some scoops to get started!</p>
                        </div>
                    ) : cart.map(item => (
                        <div key={item.id} className="cart-item">
                            <span className="ci-emoji">{item.emoji}</span>
                            <div className="ci-info">
                                <p className="ci-name">{item.name}</p>
                                <p className="ci-price">₹{item.price} each</p>
                            </div>
                            <div className="ci-qty">
                                <button className="ci-btn" onClick={() => onQty(item.id, -1)}>−</button>
                                <span className="ci-qty-num" key={item.qty}>{item.qty}</span>
                                <button className="ci-btn" onClick={() => onQty(item.id, +1)}>+</button>
                            </div>
                        </div>
                    ))}
                </div>

                {cart.length > 0 && (
                    <div className="drawer-foot">
                        <div className="drawer-subtotal">
                            <span>Total ({cart.reduce((s, i) => s + i.qty, 0)} items)</span>
                            <span>₹{total}</span>
                        </div>
                        <button className="checkout-btn" onClick={onPlaceOrder}>
                            🎉 Place Order · ₹{total}
                        </button>
                        <p className="drawer-note">Free delivery on orders above ₹499 · Est. 30 min</p>
                    </div>
                )}
            </div>
        </>
    )
}

function ReceiptPage({ receipt, onNewOrder }) {
    return (
        <div className="menu3d" id="menu">
            <div className="receipt-page">
                <div className="receipt-card">
                    <div className="receipt-head">
                        <h2>🎉 Order Confirmed!</h2>
                        <p>Your scoops are in progress. Keep this receipt for tracking.</p>
                    </div>

                    <div className="receipt-meta">
                        <div>
                            <label>Order ID</label>
                            <strong>{receipt.orderId}</strong>
                        </div>
                        <div>
                            <label>Placed At</label>
                            <strong>{receipt.placedAt}</strong>
                        </div>
                        <div>
                            <label>Items</label>
                            <strong>{receipt.totalItems}</strong>
                        </div>
                    </div>

                    <div className="receipt-items">
                        {receipt.items.map((item) => (
                            <div className="receipt-row" key={item.id}>
                                <span className="emoji">{item.emoji}</span>
                                <span className="name">{item.name}</span>
                                <span className="qty">x{item.qty}</span>
                                <span className="amt">₹{item.price * item.qty}</span>
                            </div>
                        ))}
                    </div>

                    <div className="receipt-foot">
                        <div className="receipt-total">
                            <span>Total Paid</span>
                            <span>₹{receipt.totalPrice}</span>
                        </div>
                        <div className="receipt-actions">
                            <button className="receipt-btn primary" onClick={onNewOrder}>✨ Start New Order</button>
                            <button className="receipt-btn secondary" onClick={() => window.print()}>🧾 Print Receipt</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ─── Main export ─────────────────────────────────────────────────────────────

export default function Menu() {
    const [activeTab, setActiveTab] = useState(Object.keys(MENU_DATA)[0])
    const [cart, setCart] = useState([])          // [{...item, qty}]
    const [addedIds, setAddedIds] = useState(new Set())
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [gridKey, setGridKey] = useState(0)
    const [receipt, setReceipt] = useState(null)
    const styleRef = useRef(false)

    useEffect(() => {
        if (styleRef.current) return
        styleRef.current = true
        const el = document.createElement('style')
        el.textContent = MENU_CSS
        document.head.appendChild(el)
    }, [])

    function switchTab(tab) {
        setActiveTab(tab)
        setGridKey(k => k + 1)
        setSearch('')
    }

    function handleAdd(item) {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id)
            if (existing) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
            return [...prev, { ...item, qty: 1 }]
        })
        setAddedIds(s => new Set([...s, item.id]))
        setTimeout(() => setAddedIds(s => { const n = new Set(s); n.delete(item.id); return n }), 1400)
    }

    function handleQty(id, delta) {
        setCart(prev => {
            const updated = prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i)
            return updated.filter(i => i.qty > 0)
        })
    }

    function handlePlaceOrder() {
        if (cart.length === 0) return
        const now = new Date()
        const placedAt = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        const totalItems = cart.reduce((s, i) => s + i.qty, 0)
        const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0)

        setReceipt({
            orderId: generateOrderId(),
            placedAt,
            totalItems,
            totalPrice,
            items: cart,
        })
        setCart([])
        setDrawerOpen(false)
    }

    function handleNewOrder() {
        setReceipt(null)
        setSearch('')
        setActiveTab(Object.keys(MENU_DATA)[0])
        setGridKey(k => k + 1)
    }

    const totalItems = cart.reduce((s, i) => s + i.qty, 0)
    const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0)

    const allItems = Object.values(MENU_DATA).flat()
    const searchMode = search.trim().length > 0
    const baseItems = searchMode ? allItems : (MENU_DATA[activeTab] || [])
    const filtered = searchMode
        ? baseItems.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.desc.toLowerCase().includes(search.toLowerCase()))
        : baseItems

    if (receipt) {
        return <ReceiptPage receipt={receipt} onNewOrder={handleNewOrder} />
    }

    return (
        <div className="menu3d" id="menu">
            <div className="menu3d-head">
                <span className="menu3d-badge">🍨 Full Menu</span>
                <h2 className="menu3d-title">What Are You Craving?</h2>
                <p className="menu3d-sub">Handcrafted flavors, made fresh daily. Pick your perfect scoop.</p>

                {/* Search */}
                <div className="menu3d-search">
                    <span className="search-icon">🔍</span>
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search flavors, sundaes, shakes..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                {/* Category tabs */}
                {!searchMode && (
                    <div className="cat-tabs">
                        {Object.entries(MENU_DATA).map(([cat, items]) => (
                            <button
                                key={cat}
                                className={`cat-tab ${activeTab === cat ? 'active' : ''}`}
                                onClick={() => switchTab(cat)}
                            >
                                {cat}
                                <span className="cat-count">{items.length}</span>
                            </button>
                        ))}
                    </div>
                )}

                {searchMode && (
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#8a7a9b', marginBottom: 24 }}>
                        {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
                    </p>
                )}
            </div>

            <div className="menu3d-main">
                <div className="menu3d-grid" key={gridKey}>
                    {filtered.map((item, idx) => (
                        <div key={item.id} style={{ animationDelay: `${idx * 55}ms` }}>
                            <ItemCard item={item} onAdd={handleAdd} addedIds={addedIds} />
                        </div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: '#c0b0d0' }}>
                        <div style={{ fontSize: 48, marginBottom: 12 }}>🍦</div>
                        <p style={{ fontSize: 16, fontWeight: 700 }}>No items found</p>
                        <p style={{ fontSize: 13, fontWeight: 600 }}>Try a different search term</p>
                    </div>
                )}

                {/* Sticky cart pill */}
                {totalItems > 0 && !drawerOpen && (
                    <div className="cart-ribbon">
                        <button className="cart-pill" onClick={() => setDrawerOpen(true)}>
                            <span>View Order</span>
                            <span className="cart-count-bubble" key={totalItems}>{totalItems}</span>
                            <div className="cart-divider" />
                            <span className="cart-total">₹{totalPrice}</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Cart drawer */}
            {drawerOpen && (
                <CartDrawer
                    cart={cart}
                    onClose={() => setDrawerOpen(false)}
                    onQty={handleQty}
                    onPlaceOrder={handlePlaceOrder}
                />
            )}
        </div>
    )
}