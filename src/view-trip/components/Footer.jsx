import { Compass, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return <footer className="vt-footer"><div className="vt-footer-invite"><Compass size={31} strokeWidth={1.2} /><div><h2>There’s always another adventure.</h2><p>Keep a little space in your calendar for wonder.</p></div><Link to="/create-trip">Plan another trip <ArrowUpRight size={17} /></Link></div><p className="vt-disclaimer">AI-generated suggestions are a starting point. Confirm prices, opening hours, and availability before you travel.</p><div className="vt-footer-bottom"><span>TRIP PLANNER <i>✳</i></span><span>Made for the joy of getting away.</span><span>Created by Abhay</span></div></footer>
}
