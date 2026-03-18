import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import MoodRecommender from './components/MoodRecommender'
import IceCreamBuilder from './components/IceCreamBuilder'
import CommunityWall from './components/CommunityWall'
import Menu from './components/Menu'
import Footer from './components/Footer'
import { COMMUNITY_STARTER } from './data/constants'
import './index.css'

export default function App() {
  const [designs, setDesigns] = useState(COMMUNITY_STARTER)
  const [cartCount, setCartCount] = useState(0)

  function handleSave(design) {
    setDesigns((prev) => [design, ...prev])
    setCartCount((c) => c + 1)
  }

  return (
    <>
      <Navbar cartCount={cartCount} />
      <main className="page-shell">
        <Hero />
        <MoodRecommender />
        <IceCreamBuilder onSave={handleSave} />
        <CommunityWall designs={designs} />
        <Menu />
      </main>
      <Footer />
    </>
  )
}
