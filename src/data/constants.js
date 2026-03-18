export const MOOD_ENGINE = {
  Happy: {
    emoji: '😄',
    intro: 'You are radiating bright energy today!',
    flavours: ['Sunshine Mango', 'Birthday Cake Ripple', 'Strawberry Pop'],
    toppings: ['Rainbow Sprinkles', 'Marshmallow Stars', 'Caramel Confetti'],
    colors: ['#ff6f91', '#ffd166', '#70e000'],
    music: ['Funk Pop Mix', 'Retro Disco', 'Dance Groove'],
    vibe: 'Keep the celebration going with playful textures and color.',
    gradient: 'linear-gradient(135deg, #ff6f91, #ffd166)',
  },
  Sad: {
    emoji: '😢',
    intro: 'You deserve comfort and a gentle reset.',
    flavours: ['Salted Caramel Hug', 'Vanilla Cloud', 'Blueberry Cheesecake'],
    toppings: ['Warm Cookie Crumbs', 'Honey Drizzle', 'Cinnamon Dust'],
    colors: ['#7f7fd5', '#b4b8ff', '#ffd6a5'],
    music: ['Soft Lo-Fi Piano', 'Acoustic Calm', 'Rainy Evening Jazz'],
    vibe: 'Creamy and cozy combinations can help lift your mood.',
    gradient: 'linear-gradient(135deg, #7f7fd5, #b4b8ff)',
  },
  Chill: {
    emoji: '😎',
    intro: 'You are in your cool and balanced era.',
    flavours: ['Mint Breeze', 'Coconut Lagoon', 'Pistachio Silk'],
    toppings: ['Toasted Coconut', 'White Choco Curl', 'Sea Salt Pearls'],
    colors: ['#56cfe1', '#64dfdf', '#72efdd'],
    music: ['Beach Chill House', 'Sunset Beats', 'Ambient Drift'],
    vibe: 'Fresh layers and light crunch keep things smooth and calm.',
    gradient: 'linear-gradient(135deg, #56cfe1, #72efdd)',
  },
  Stressed: {
    emoji: '😤',
    intro: 'Time to exhale and slow down your thoughts.',
    flavours: ['Dark Chocolate Therapy', 'Hazelnut Tranquility', 'Espresso Velvet'],
    toppings: ['Almond Crunch', 'Cocoa Nibs', 'Silk Ganache'],
    colors: ['#2b2d42', '#8d99ae', '#f4a261'],
    music: ['Deep Focus Waves', 'Binaural Calm', 'Night Study Ambient'],
    vibe: 'Rich chocolate with grounded textures helps you feel centered.',
    gradient: 'linear-gradient(135deg, #8d99ae, #f4a261)',
  },
}

export const SCOOPS = [
  { name: 'Vanilla Nova', color: 'linear-gradient(145deg, #fff6dc, #f2dc9f)', emoji: '🍦' },
  { name: 'Dark Chocolate Therapy', color: 'linear-gradient(145deg, #5a3d2b, #2f1f16)', emoji: '🍫' },
  { name: 'Strawberry Pop', color: 'linear-gradient(145deg, #ffa3c4, #f06491)', emoji: '🍓' },
  { name: 'Mint Breeze', color: 'linear-gradient(145deg, #b7f7dd, #65d6ad)', emoji: '🌿' },
  { name: 'Pistachio Silk', color: 'linear-gradient(145deg, #d8f3b2, #99c57a)', emoji: '🌰' },
  { name: 'Mango Sunrise', color: 'linear-gradient(145deg, #ffe39d, #ff9f1c)', emoji: '🥭' },
]

export const SAUCES = [
  { name: 'Caramel River', emoji: '🍯' },
  { name: 'Berry Swirl', emoji: '🫐' },
  { name: 'Chocolate Lava', emoji: '🍫' },
  { name: 'Honey Ribbon', emoji: '🍯' },
  { name: 'Matcha Drip', emoji: '🍵' },
]

export const TOPPINGS = [
  { name: 'Rainbow Sprinkles', emoji: '🌈' },
  { name: 'Almond Crunch', emoji: '🥜' },
  { name: 'Cookie Crumbs', emoji: '🍪' },
  { name: 'Mini Marshmallows', emoji: '☁️' },
  { name: 'Chocolate Chips', emoji: '🍫' },
  { name: 'Coconut Flakes', emoji: '🥥' },
]

export const SCOOP_PALETTE = Object.fromEntries(
  SCOOPS.map((s) => [s.name, s.color])
)

export const COMMUNITY_STARTER = [
  {
    id: 1,
    name: 'Midnight Reset',
    mood: 'Stressed',
    scoops: ['Dark Chocolate Therapy', 'Vanilla Nova'],
    sauces: ['Chocolate Lava'],
    toppings: ['Almond Crunch', 'Coconut Flakes'],
    likes: 124,
    author: 'ChocLover',
  },
  {
    id: 2,
    name: 'Festival Float',
    mood: 'Happy',
    scoops: ['Strawberry Pop', 'Mango Sunrise'],
    sauces: ['Berry Swirl'],
    toppings: ['Rainbow Sprinkles', 'Mini Marshmallows'],
    likes: 89,
    author: 'SunnyScoop',
  },
  {
    id: 3,
    name: 'Ocean Drift',
    mood: 'Chill',
    scoops: ['Mint Breeze', 'Pistachio Silk'],
    sauces: ['Matcha Drip'],
    toppings: ['Toasted Coconut', 'Sea Salt Pearls'],
    likes: 67,
    author: 'ChillVibes',
  },
]

export function randomPick(list) {
  return list[Math.floor(Math.random() * list.length)]
}
