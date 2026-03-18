import { useState, useEffect, useRef } from 'react'

// ── Real Unsplash photo per item ─────────────────────────────────────────────
const U = (id, w=400, h=280) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&crop=center&q=82`

const MENU_DATA = {
  'Signature Scoops': [
    { id:1,  name:'Vanilla Nova',        emoji:'🌟', desc:'Madagascar vanilla bean with golden flecks and a silky-smooth finish.', price:120, tag:'Classic',
      img: U('1576506295286-5cda18df43e7') },
    { id:2,  name:'Strawberry Pop',      emoji:'🍓', desc:'Sun-ripened strawberries churned into a vibrant, fruity explosion.',   price:130, tag:'Popular',
      img: U('1488900128323-21503983a07e') },
    { id:3,  name:'Choco Lava',          emoji:'🍫', desc:'Belgian dark chocolate with a molten core of ganache ribbons.',         price:140, tag:'Hot',
      img: U('1579954115545-a95591f28bfc') },
    { id:4,  name:'Mint Breeze',         emoji:'🌿', desc:'Cool peppermint swirled with crispy chocolate flakes and fresh herb notes.', price:135, tag:'Refresh',
      img: U('1497034825429-c343d7c6a68f') },
    { id:5,  name:'Blueberry Storm',     emoji:'🫐', desc:'Wild blueberries with a jammy swirl and hints of lavender cream.',     price:145, tag:'New',
      img: U('1560008581-09826d1de69e') },
    { id:6,  name:'Mango Tango',         emoji:'🥭', desc:'Alphonso mango sorbet with a tangy tamarind twist and chilli edge.',   price:130, tag:'Spicy',
      img: U('1567206563064-6f60f40a2b57') },
  ],
  'Sundaes': [
    { id:7,  name:'Triple Crown Sundae', emoji:'👑', desc:'3 scoops of your choice, hot fudge, caramel drizzle & whipped cream.', price:280, tag:'Bestseller',
      img: U('1563805042-7684c019e1cb') },
    { id:8,  name:'Berry Bliss Parfait', emoji:'🍒', desc:'Layered strawberry & blueberry scoops with granola, fresh berries, honey.', price:240, tag:'Healthy',
      img: U('1551024506-0bccd828d307') },
    { id:9,  name:'Lava Brownie Split',  emoji:'🍮', desc:'Warm fudge brownie, 2 Choco Lava scoops, salted caramel & roasted nuts.', price:320, tag:'Indulge',
      img: U('1612929633738-8fe44f7ec841') },
    { id:10, name:'Tropical Paradise',   emoji:'🌴', desc:'Mango + coconut scoops, pineapple chunks, toasted coconut flakes.',    price:260, tag:'New',
      img: U('1555939594-58d7cb561bb5') },
  ],
  'Shakes & Floats': [
    { id:11, name:'Classic Shake',       emoji:'🥤', desc:'Thick blended shake in Vanilla, Choco or Strawberry — your pick.',    price:180, tag:'Classic',
      img: U('1514190051997-0f6f39ca5cde') },
    { id:12, name:'Galaxy Float',        emoji:'🔮', desc:'Blueberry vanilla float with bubbly cola and starry popping candy.',   price:220, tag:'Viral',
      img: U('1624454002302-36b824d7bd0a') },
    { id:13, name:'Mango Lassi Float',   emoji:'🧡', desc:'Creamy mango lassi base with a Mango Tango scoop floating on top.',   price:200, tag:'Desi Hit',
      img: U('1604328698692-f76ea9498e76') },
    { id:14, name:'Cold Brew Affogato',  emoji:'☕', desc:'Single espresso shot poured over Vanilla Nova, with a biscotti.',     price:190, tag:'Caffeine',
      img: U('1517256064527-09be4edf5f08') },
  ],
  'Waffles & Cones': [
    { id:15, name:'Belgian Waffle Stack',emoji:'🧇', desc:'Crispy waffle, 2 scoops, Nutella drizzle, fresh strawberries & cream.', price:290, tag:'Fan Fave',
      img: U('1501443762994-82bd5dace89a') },
    { id:16, name:'Bubble Waffle Cone',  emoji:'🫧', desc:'Hong Kong-style egg waffle cone stuffed with 2 scoops & sprinkle burst.', price:260, tag:'Trendy',
      img: U('1558961363-fa8fdf82db35') },
    { id:17, name:'Choco Dipped Cone',   emoji:'🍦', desc:'Soft-serve twist dipped in dark Belgian chocolate with rainbow sprinkles.', price:150, tag:'Quick',
      img: U('1551615593-ef5fe247e8f7') },
    { id:18, name:'Loaded Waffle Boat',  emoji:'⛵', desc:'Giant waffle boat, 4 scoops, all toppings, sauces — the full experience.', price:380, tag:'🔥 Epic',
      img: U('1587314168-abe4b34c4578') },
  ],
}

const TAG_COLORS = {
  Classic:{bg:'#fef3c7',c:'#92400e'}, Popular:{bg:'#ffe4e6',c:'#9f1239'}, Hot:{bg:'#ffedd5',c:'#9a3412'},
  Refresh:{bg:'#d1fae5',c:'#065f46'}, New:{bg:'#dbeafe',c:'#1e40af'},    Spicy:{bg:'#fee2e2',c:'#991b1b'},
  Bestseller:{bg:'#fdf4ff',c:'#7e22ce'}, Healthy:{bg:'#ecfdf5',c:'#14532d'}, Indulge:{bg:'#fef3c7',c:'#92400e'},
  Viral:{bg:'#f5f3ff',c:'#4338ca'}, 'Desi Hit':{bg:'#fff7ed',c:'#c2410c'}, Caffeine:{bg:'#fef9ee',c:'#854d0e'},
  'Fan Fave':{bg:'#fefce8',c:'#713f12'}, Trendy:{bg:'#fce7f3',c:'#9d174d'}, Quick:{bg:'#f8fafc',c:'#334155'},
  '🔥 Epic':{bg:'#fdf4ff',c:'#7e22ce'},
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
  .menu3d{font-family:'Nunito',sans-serif;background:linear-gradient(160deg,#fff8f0,#fff0f8 50%,#f4f0ff);}

  .menu-head{max-width:1200px;margin:0 auto;padding:72px 32px 0;}
  .menu-badge{display:inline-flex;align-items:center;gap:7px;background:linear-gradient(135deg,#ff6f9122,#ffd16622);border:1.5px solid rgba(255,111,145,.25);border-radius:50px;padding:6px 18px;font-size:12px;font-weight:800;color:#e0306a;letter-spacing:.06em;text-transform:uppercase;margin-bottom:12px;}
  .menu-title{font-size:clamp(28px,4vw,46px);font-weight:900;color:#1a0d2e;margin:0 0 10px;line-height:1.05;}
  .menu-sub{font-size:16px;color:#8a7a9b;font-weight:600;margin:0 0 32px;}

  .cat-tabs{display:flex;gap:0;border-bottom:2.5px solid #f0e8ff;margin-bottom:36px;overflow-x:auto;scrollbar-width:none;}
  .cat-tabs::-webkit-scrollbar{display:none;}
  .cat-tab{padding:14px 26px;font-size:14px;font-weight:800;cursor:pointer;border:none;background:none;color:#a090b5;transition:all .25s;white-space:nowrap;position:relative;border-bottom:3px solid transparent;margin-bottom:-2.5px;font-family:'Nunito',sans-serif;}
  .cat-tab::after{content:'';position:absolute;bottom:-2.5px;left:0;right:0;height:3px;border-radius:3px 3px 0 0;background:linear-gradient(90deg,#ff6f91,#7c3aed);transform:scaleX(0);transform-origin:left;transition:transform .3s cubic-bezier(.34,1.2,.64,1);}
  .cat-tab:hover{color:#4a3a6a;} .cat-tab.active{color:#2d1b4e;} .cat-tab.active::after{transform:scaleX(1);}
  .cat-ct{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;background:#f0e8ff;color:#7c3aed;border-radius:50%;font-size:10px;font-weight:900;margin-left:6px;}
  .cat-tab.active .cat-ct{background:linear-gradient(135deg,#ff6f91,#7c3aed);color:white;}

  .menu-main{max-width:1200px;margin:0 auto;padding:0 32px 80px;}
  .menu-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:22px;}

  /* ── card ── */
  .item-card{background:white;border-radius:24px;border:1.5px solid #f0e8ff;overflow:hidden;
    transition:all .35s cubic-bezier(.34,1.1,.64,1);animation:cardReveal .45s ease-out both;
    display:flex;flex-direction:column;cursor:pointer;}
  .item-card:hover{transform:translateY(-8px) scale(1.015);box-shadow:0 24px 56px rgba(120,60,180,.16);border-color:#dab8f8;}
  @keyframes cardReveal{from{opacity:0;transform:translateY(22px) scale(.95);}to{opacity:1;transform:translateY(0) scale(1);}}

  /* ── real photo top ── */
  .card-photo{position:relative;width:100%;height:188px;overflow:hidden;background:#f9f5ff;}
  .card-photo img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .55s cubic-bezier(.34,1,.64,1);}
  .item-card:hover .card-photo img{transform:scale(1.08);}
  .card-photo-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,transparent 50%,rgba(26,13,46,.28) 100%);}
  .card-tag-abs{position:absolute;top:12px;left:12px;padding:4px 12px;border-radius:50px;font-size:11px;font-weight:800;box-shadow:0 3px 10px rgba(0,0,0,.1);backdrop-filter:blur(4px);}
  .card-emoji-abs{position:absolute;bottom:12px;right:14px;font-size:24px;filter:drop-shadow(0 3px 8px rgba(0,0,0,.22));animation:emojiPulse 3s ease-in-out infinite;}
  @keyframes emojiPulse{0%,100%{transform:scale(1) rotate(-6deg);}50%{transform:scale(1.15) rotate(5deg);}}

  .card-body{padding:16px 20px 12px;flex:1;display:flex;flex-direction:column;}
  .card-name{font-size:17px;font-weight:900;color:#1a0d2e;margin:0 0 6px;line-height:1.2;}
  .card-desc{font-size:12.5px;font-weight:600;color:#8a7a9b;line-height:1.65;margin:0;flex:1;}

  .card-foot{padding:12px 20px 18px;display:flex;align-items:center;justify-content:space-between;border-top:1.5px solid #f8f3ff;margin-top:12px;}
  .card-price{font-size:20px;font-weight:900;color:#1a0d2e;}
  .card-price sup{font-size:12px;font-weight:800;color:#7c3aed;vertical-align:super;margin-right:1px;}
  .add-btn{display:flex;align-items:center;gap:7px;background:linear-gradient(135deg,#ff6f91,#ff4d7a);color:white;border:none;border-radius:50px;padding:10px 18px;font-size:13px;font-weight:800;cursor:pointer;transition:all .2s;box-shadow:0 6px 18px rgba(255,111,145,.35);font-family:'Nunito',sans-serif;}
  .add-btn:hover{transform:translateY(-2px);box-shadow:0 10px 26px rgba(255,111,145,.45);}
  .add-btn:active{transform:scale(.96);}
  .add-btn.added{background:linear-gradient(135deg,#10b981,#059669);box-shadow:0 6px 18px rgba(16,185,129,.35);animation:addedPop .35s cubic-bezier(.34,1.5,.64,1);}
  @keyframes addedPop{0%{transform:scale(1)}50%{transform:scale(1.15)}100%{transform:scale(1)}}

  /* search */
  .menu-search{position:relative;max-width:360px;margin-bottom:28px;}
  .search-in{width:100%;border:2px solid #f0e8ff;border-radius:50px;padding:12px 20px 12px 46px;font-size:14px;font-weight:700;font-family:'Nunito',sans-serif;color:#2d1b4e;outline:none;background:white;transition:border .2s;box-sizing:border-box;}
  .search-in:focus{border-color:#c4a0e8;box-shadow:0 0 0 4px rgba(196,160,232,.12);}
  .search-ico{position:absolute;left:16px;top:50%;transform:translateY(-50%);font-size:16px;pointer-events:none;}

  /* cart ribbon */
  .cart-ribbon{position:sticky;bottom:24px;z-index:100;display:flex;justify-content:center;pointer-events:none;margin-top:32px;}
  .cart-pill{pointer-events:all;background:linear-gradient(135deg,#1a0d2e,#2d1b4e);color:white;border:none;border-radius:50px;padding:16px 32px;font-size:15px;font-weight:800;cursor:pointer;transition:all .3s cubic-bezier(.34,1.2,.64,1);display:flex;align-items:center;gap:14px;box-shadow:0 16px 48px rgba(26,13,46,.45);font-family:'Nunito',sans-serif;animation:pillUp .4s cubic-bezier(.34,1.2,.64,1) both;}
  @keyframes pillUp{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}
  .cart-pill:hover{transform:translateY(-4px) scale(1.03);box-shadow:0 24px 56px rgba(26,13,46,.55);}
  .cart-bubble{background:linear-gradient(135deg,#ff6f91,#ff4d7a);border-radius:50px;min-width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:900;padding:0 8px;}
  .cart-total{font-size:13px;color:rgba(255,255,255,.6);font-weight:600;}
  .cart-div{width:1.5px;height:22px;background:rgba(255,255,255,.15);border-radius:2px;}

  /* drawer */
  .cart-bd{position:fixed;inset:0;background:rgba(26,13,46,.45);z-index:200;animation:bdfade .25s ease;}
  @keyframes bdfade{from{opacity:0}to{opacity:1}}
  .cart-drawer{position:fixed;right:0;top:0;bottom:0;z-index:201;width:min(420px,100vw);background:white;display:flex;flex-direction:column;box-shadow:-24px 0 64px rgba(26,13,46,.2);animation:drSlide .35s cubic-bezier(.34,1.1,.64,1);}
  @keyframes drSlide{from{transform:translateX(100%)}to{transform:translateX(0)}}
  .dr-head{padding:24px 28px 18px;border-bottom:1.5px solid #f0e8ff;display:flex;align-items:center;justify-content:space-between;}
  .dr-title{font-size:20px;font-weight:900;color:#1a0d2e;margin:0;}
  .dr-close{background:rgba(240,232,255,.6);border:none;border-radius:50%;width:36px;height:36px;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;font-family:'Nunito',sans-serif;}
  .dr-close:hover{background:#f0e8ff;transform:scale(1.1);}
  .dr-items{flex:1;overflow-y:auto;padding:18px 28px;display:flex;flex-direction:column;gap:14px;}
  .dr-items::-webkit-scrollbar{width:4px;} .dr-items::-webkit-scrollbar-thumb{background:#e8daf8;border-radius:4px;}

  /* cart item with photo */
  .ci{display:flex;align-items:center;gap:12px;padding:12px;background:#fdf9ff;border-radius:18px;border:1.5px solid #f0e8ff;}
  .ci-photo{width:52px;height:52px;border-radius:12px;overflow:hidden;flex-shrink:0;border:1.5px solid #f0e8ff;}
  .ci-photo img{width:100%;height:100%;object-fit:cover;display:block;}
  .ci-info{flex:1;min-width:0;}
  .ci-name{font-size:14px;font-weight:800;color:#1a0d2e;margin:0 0 2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .ci-price{font-size:13px;color:#7c3aed;font-weight:800;margin:0;}
  .ci-qty{display:flex;align-items:center;gap:8px;}
  .ci-btn{background:#f0e8ff;border:none;border-radius:50%;width:28px;height:28px;font-size:16px;font-weight:900;cursor:pointer;color:#7c3aed;transition:all .15s;display:flex;align-items:center;justify-content:center;font-family:'Nunito',sans-serif;}
  .ci-btn:hover{background:#e0d0ff;transform:scale(1.1);}
  .ci-num{font-size:15px;font-weight:900;color:#1a0d2e;min-width:20px;text-align:center;}

  .dr-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#c0b0d0;gap:10px;}
  .dr-empty-ico{font-size:48px;animation:emBob 3s ease-in-out infinite;}
  @keyframes emBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}

  .dr-foot{padding:20px 28px;border-top:1.5px solid #f0e8ff;}
  .dr-total{display:flex;justify-content:space-between;margin-bottom:16px;font-size:15px;}
  .dr-total span:first-child{color:#8a7a9b;font-weight:600;} .dr-total span:last-child{color:#1a0d2e;font-weight:900;font-size:20px;}
  .checkout-btn{width:100%;background:linear-gradient(135deg,#ff6f91,#7c3aed);color:white;border:none;border-radius:50px;padding:16px;font-size:16px;font-weight:800;cursor:pointer;transition:all .25s;box-shadow:0 8px 24px rgba(124,58,237,.35);font-family:'Nunito',sans-serif;}
  .checkout-btn:hover{transform:translateY(-2px);box-shadow:0 14px 36px rgba(124,58,237,.45);}
  .dr-note{font-size:11px;color:#b0a0c5;text-align:center;margin-top:10px;font-weight:600;}

  @media(max-width:600px){.menu-head,.menu-main{padding-left:16px;padding-right:16px;}.cat-tab{padding:12px 16px;}}
`

function ItemCard({ item, onAdd, addedIds }) {
  const tc = TAG_COLORS[item.tag] || { bg:'#f0e8ff', c:'#7c3aed' }
  const isAdded = addedIds.has(item.id)
  return (
    <div className="item-card">
      {/* real photo */}
      <div className="card-photo">
        <img src={item.img} alt={item.name} loading="lazy"/>
        <div className="card-photo-overlay"/>
        <span className="card-tag-abs" style={{ background:tc.bg, color:tc.c }}>{item.tag}</span>
        <span className="card-emoji-abs">{item.emoji}</span>
      </div>
      <div className="card-body">
        <h3 className="card-name">{item.name}</h3>
        <p className="card-desc">{item.desc}</p>
      </div>
      <div className="card-foot">
        <div className="card-price"><sup>₹</sup>{item.price}</div>
        <button className={`add-btn ${isAdded?'added':''}`} onClick={()=>onAdd(item)}>
          {isAdded ? '✓ Added' : '+ Add'}
        </button>
      </div>
    </div>
  )
}

function CartDrawer({ cart, onClose, onQty }) {
  const total = cart.reduce((s,i) => s + i.price*i.qty, 0)
  return (
    <>
      <div className="cart-bd" onClick={onClose}/>
      <div className="cart-drawer">
        <div className="dr-head">
          <h2 className="dr-title">🛒 Your Order</h2>
          <button className="dr-close" onClick={onClose}>✕</button>
        </div>
        <div className="dr-items">
          {cart.length === 0
            ? <div className="dr-empty"><span className="dr-empty-ico">🍦</span><p style={{fontWeight:700,fontSize:14}}>Your cart is empty</p><p style={{fontSize:12}}>Add some scoops!</p></div>
            : cart.map(item => (
              <div key={item.id} className="ci">
                <div className="ci-photo"><img src={item.img} alt={item.name} loading="lazy"/></div>
                <div className="ci-info">
                  <p className="ci-name">{item.name}</p>
                  <p className="ci-price">₹{item.price} each</p>
                </div>
                <div className="ci-qty">
                  <button className="ci-btn" onClick={()=>onQty(item.id,-1)}>−</button>
                  <span className="ci-num">{item.qty}</span>
                  <button className="ci-btn" onClick={()=>onQty(item.id,+1)}>+</button>
                </div>
              </div>
            ))
          }
        </div>
        {cart.length > 0 && (
          <div className="dr-foot">
            <div className="dr-total">
              <span>Total ({cart.reduce((s,i)=>s+i.qty,0)} items)</span>
              <span>₹{total}</span>
            </div>
            <button className="checkout-btn">🎉 Place Order · ₹{total}</button>
            <p className="dr-note">Free delivery on orders above ₹499 · Est. 30 min</p>
          </div>
        )}
      </div>
    </>
  )
}

export default function Menu() {
  const [activeTab,  setActiveTab]  = useState(Object.keys(MENU_DATA)[0])
  const [cart,       setCart]       = useState([])
  const [addedIds,   setAddedIds]   = useState(new Set())
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [search,     setSearch]     = useState('')
  const [gridKey,    setGridKey]    = useState(0)
  const styleRef = useRef(false)

  useEffect(() => {
    if (styleRef.current) return; styleRef.current = true
    const el = document.createElement('style'); el.textContent = CSS; document.head.appendChild(el)
  }, [])

  function switchTab(tab) { setActiveTab(tab); setGridKey(k=>k+1); setSearch('') }

  function handleAdd(item) {
    setCart(prev => {
      const ex = prev.find(i=>i.id===item.id)
      return ex ? prev.map(i=>i.id===item.id?{...i,qty:i.qty+1}:i) : [...prev,{...item,qty:1}]
    })
    setAddedIds(s=>new Set([...s,item.id]))
    setTimeout(()=>setAddedIds(s=>{const n=new Set(s);n.delete(item.id);return n}),1400)
  }
  function handleQty(id, delta) {
    setCart(prev=>prev.map(i=>i.id===id?{...i,qty:Math.max(0,i.qty+delta)}:i).filter(i=>i.qty>0))
  }

  const totalItems = cart.reduce((s,i)=>s+i.qty,0)
  const totalPrice = cart.reduce((s,i)=>s+i.price*i.qty,0)
  const allItems   = Object.values(MENU_DATA).flat()
  const searchMode = search.trim().length > 0
  const baseItems  = searchMode ? allItems : (MENU_DATA[activeTab]||[])
  const filtered   = searchMode ? baseItems.filter(i=>i.name.toLowerCase().includes(search.toLowerCase())||i.desc.toLowerCase().includes(search.toLowerCase())) : baseItems

  return (
    <div className="menu3d" id="menu">
      <div className="menu-head">
        <span className="menu-badge">🍨 Full Menu</span>
        <h2 className="menu-title">What Are You Craving?</h2>
        <p className="menu-sub">Handcrafted flavors, made fresh daily.</p>

        <div className="menu-search">
          <span className="search-ico">🔍</span>
          <input className="search-in" type="text" placeholder="Search flavors, sundaes, shakes..."
            value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>

        {!searchMode && (
          <div className="cat-tabs">
            {Object.entries(MENU_DATA).map(([cat,items])=>(
              <button key={cat} className={`cat-tab ${activeTab===cat?'active':''}`} onClick={()=>switchTab(cat)}>
                {cat}<span className="cat-ct">{items.length}</span>
              </button>
            ))}
          </div>
        )}
        {searchMode && <p style={{fontSize:14,fontWeight:700,color:'#8a7a9b',marginBottom:24}}>{filtered.length} result{filtered.length!==1?'s':''} for "{search}"</p>}
      </div>

      <div className="menu-main">
        <div className="menu-grid" key={gridKey}>
          {filtered.map((item,idx)=>(
            <div key={item.id} style={{animationDelay:`${idx*55}ms`}}>
              <ItemCard item={item} onAdd={handleAdd} addedIds={addedIds}/>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{textAlign:'center',padding:'60px 0',color:'#c0b0d0'}}>
            <div style={{fontSize:48,marginBottom:12}}>🍦</div>
            <p style={{fontSize:16,fontWeight:700}}>No items found</p>
          </div>
        )}

        {totalItems > 0 && !drawerOpen && (
          <div className="cart-ribbon">
            <button className="cart-pill" onClick={()=>setDrawerOpen(true)}>
              <span>View Order</span>
              <span className="cart-bubble" key={totalItems}>{totalItems}</span>
              <div className="cart-div"/>
              <span className="cart-total">₹{totalPrice}</span>
            </button>
          </div>
        )}
      </div>

      {drawerOpen && <CartDrawer cart={cart} onClose={()=>setDrawerOpen(false)} onQty={handleQty}/>}
    </div>
  )
}