import { Link } from 'react-router-dom'
import { ArrowUpRight, ArrowRight, Sparkles, MapPin, Compass, Route, Wallet, Check, MoveDown } from 'lucide-react'
import './Hero.css'

const steps = [
  { number: '01', icon: Compass, title: 'Pick your somewhere.', text: 'A city you’ve bookmarked. A place you’ve always wondered about. Start with a destination.' },
  { number: '02', icon: Wallet, title: 'Make it your kind of trip.', text: 'Choose your budget, your travel crew, and how many days you have to explore.' },
  { number: '03', icon: Route, title: 'Let the adventure unfold.', text: 'Get an AI-crafted day-by-day itinerary with places to visit and hotels to consider.' },
]

export default function Hero() {
  return (
    <main className="travel-home">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="hero-copy">
          <span className="home-eyebrow"><span /> LESS PLANNING. MORE LIVING.</span>
          <h1 id="home-title">Your next<br />great <span className="adventure-word">adventure<svg viewBox="0 0 440 18" aria-hidden="true"><path d="M4 12Q205-5 435 10M38 17Q230 4 399 15" /></svg></span><br />starts here<span className="coral-dot">.</span></h1>
          <p className="hero-description">Skip the endless tabs. Find your kind of escape.<br className="desktop-break" /> Turn a little wanderlust into a trip made just for you.</p>
          <div className="hero-actions">
            <Link className="home-primary" to="/create-trip">Plan my adventure <ArrowUpRight size={20} /></Link>
            <a className="home-secondary" href="#how-it-works">How it works <ArrowRight size={17} /></a>
          </div>
          <div className="hero-note"><Sparkles size={15} /><span>Powered by AI. Inspired by you.</span></div>
          <div className="hero-bottom"><span>FOR THE CURIOUS. THE SPONTANEOUS. THE EXPLORERS.</span><a href="#how-it-works" aria-label="Explore how trip planning works"><MoveDown size={19} /></a></div>
        </div>
        <div className="hero-visual">
          <img className="hero-landscape" src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85" alt="Sunlit mountain peaks rising above a green alpine valley" fetchPriority="high" />
          <div className="photo-shade" />
          <div className="photo-top"><span><MapPin size={13} /> SOMEWHERE WORTH GOING</span><Compass size={26} strokeWidth={1.2} /></div>
          <div className="adventure-stamp"><Sparkles size={18} /><span>A little less ordinary.<br /><strong>A lot more you.</strong></span></div>
          <div className="photo-caption"><span>TAKE THE SCENIC ROUTE</span><h2>Go where you<br />feel most alive.</h2><div className="photo-caption-bottom"><span>Your next chapter is out there.</span><ArrowUpRight size={28} strokeWidth={1.3} /></div></div>
          <div className="plan-note"><span className="plan-check"><Check size={19} /></span><div><strong>A plan that feels like you</strong><span>Your pace. Your budget. Your adventure.</span></div></div>
        </div>
      </section>
      <div className="home-value-strip" aria-label="Trip planner features"><span><Compass size={18} /> Your destination</span><i /><span><Wallet size={18} /> Your budget</span><i /><span><Route size={18} /> Your own itinerary</span><span className="strip-signoff">A world of possibilities. One simple plan.</span></div>
      <section className="home-how" id="how-it-works" aria-labelledby="how-title">
        <div className="how-heading"><div><span className="home-eyebrow">FROM “WHAT IF” TO “LET’S GO”</span><h2 id="how-title">Big adventures.<br /><span>Small amount of effort.</span></h2></div><p>The best part of a trip should be the trip.<br />We’ll help you get to that part.</p></div>
        <div className="home-steps">{steps.map(({ number, icon: Icon, title, text }) => <article className="home-step" key={number}><div className="step-top"><Icon size={26} strokeWidth={1.4} /><span>{number}</span></div><h3>{title}</h3><p>{text}</p></article>)}</div>
        <div className="home-closing"><p>A little curiosity can take you a long way.</p><Link to="/create-trip">Let’s see where <ArrowUpRight size={20} /></Link></div>
      </section>
      <footer className="home-footer"><span>TRIP PLANNER<span className="coral-dot"> ✳</span></span><p>Made for the joy of getting away.</p><span>Created by Abhay</span></footer>
    </main>
  )
}
