// ─── Real ice cream photo URLs (Unsplash, free to use) ─────────────────────
// All images use fit=crop for consistent framing

const U = (id, w = 400, h = 400) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&crop=center&q=80`

// ── Hero & Banner images ────────────────────────────────────────────────────
export const HERO_IMAGES = {
  mainCone:    U('1563805042-7684c019e1cb', 600, 700),   // triple scoop waffle cone
  heroBg:      U('1587314168-abe4b34c4578', 1400, 900),  // ice cream spread overhead
  coneClose:   U('1576506295286-5cda18df43e7', 500, 600), // soft-serve close up
  scoopBowl:   U('1560008581-09826d1de69e', 500, 500),   // colorful scoops bowl
}

// ── Per-scoop real photos (cropped circles) ─────────────────────────────────
export const SCOOP_IMAGES = {
  'Vanilla Nova':      U('1576506295286-5cda18df43e7', 300, 300),  // creamy vanilla
  'Strawberry Pop':    U('1488900128323-21503983a07e', 300, 300),  // pink strawberry
  'Choco Lava':        U('1579954115545-a95591f28bfc', 300, 300),  // dark chocolate
  'Mint Breeze':       U('1497034825429-c343d7c6a68f', 300, 300),  // mint chip
  'Blueberry Storm':   U('1560008581-09826d1de69e',    300, 300),  // purple berry
  'Mango Tango':       U('1567206563064-6f60f40a2b57', 300, 300),  // mango yellow
  'Caramel Swirl':     U('1612929633738-8fe44f7ec841', 300, 300),  // caramel gold
  'Bubblegum Bliss':   U('1633933537262-8f62c47e03f4', 300, 300),  // pink bubblegum
  'Coconut Dream':     U('1551024506-0bccd828d307',    300, 300),  // creamy white
  // fallback for unmapped scoops
  default:             U('1563805042-7684c019e1cb',    300, 300),
}

// ── Menu item photos ─────────────────────────────────────────────────────────
export const MENU_IMAGES = {
  // Signature scoops
  vanilla:        U('1576506295286-5cda18df43e7', 400, 300),
  strawberry:     U('1488900128323-21503983a07e', 400, 300),
  chocolate:      U('1579954115545-a95591f28bfc', 400, 300),
  mint:           U('1497034825429-c343d7c6a68f', 400, 300),
  blueberry:      U('1560008581-09826d1de69e',    400, 300),
  mango:          U('1567206563064-6f60f40a2b57', 400, 300),

  // Sundaes
  tripleSundae:   U('1563805042-7684c019e1cb',    400, 300),
  berryParfait:   U('1551024506-0bccd828d307',    400, 300),
  brownieSplit:   U('1612929633738-8fe44f7ec841', 400, 300),
  tropical:       U('1589275034853-0e48c9e8b3a7', 400, 300),

  // Shakes & floats
  classicShake:   U('1514190051997-0f6f39ca5cde', 400, 300),
  galaxyFloat:    U('1624454002302-36b824d7bd0a', 400, 300),
  mangoLassi:     U('1604328698692-f76ea9498e76', 400, 300),
  affogato:       U('1517256064527-09be4edf5f08', 400, 300),

  // Waffles
  belgianWaffle:  U('1501443762994-82bd5dace89a', 400, 300),
  bubbleWaffle:   U('1558961363-fa8fdf82db35',    400, 300),
  chocoCone:      U('1551615593-ef5fe247e8f7',    400, 300),
  waffleBoat:     U('1587314168-abe4b34c4578',    400, 300),
}

// ── Community wall thumbnails ─────────────────────────────────────────────────
export const COMMUNITY_IMAGES = [
  U('1563805042-7684c019e1cb', 200, 220),   // colorful triple cone
  U('1588195538326-c7e0f8f4ab44', 200, 220),// soft serve swirl
  U('1551024506-0bccd828d307',   200, 220), // tall sundae
  U('1576506295286-5cda18df43e7',200, 220), // vanilla cone
  U('1488900128323-21503983a07e',200, 220), // strawberry
  U('1501443762994-82bd5dace89a',200, 220), // waffle
  U('1497034825429-c343d7c6a68f',200, 220), // mint cone
  U('1567206563064-6f60f40a2b57',200, 220), // mango
]

// ── Floating accent chips (hero area) ───────────────────────────────────────
export const CHIP_IMAGES = {
  strawberry: U('1488900128323-21503983a07e', 60, 60),
  mint:       U('1497034825429-c343d7c6a68f', 60, 60),
  chocolate:  U('1579954115545-a95591f28bfc', 60, 60),
}