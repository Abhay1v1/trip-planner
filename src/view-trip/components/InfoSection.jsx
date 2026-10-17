import { CalendarDays, Users, Wallet, Link as LinkIcon, MapPin, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import TripPhoto from './TripPhoto'

export default function InfoSection({ trip }) {
  const selection = trip.userSelection || {}
  const destination = selection.location?.label || trip.TripData?.destination || 'Your next adventure'
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(window.location.href); toast.success('Trip link copied!') }
    catch { toast.error('Unable to copy. You can copy the address from your browser.') }
  }
  const days = selection.noOfDays
  return <section className="vt-overview" aria-labelledby="trip-title">
    <div className="vt-banner"><TripPhoto query={destination} alt={`A view of ${destination}`} priority /><div className="vt-banner-shade" /><div className="vt-banner-label"><MapPin size={14} /> YOUR NEXT CHAPTER</div><div className="vt-banner-copy"><span>THE WORLD IS WAITING</span><h1 id="trip-title">{destination}</h1><p>A little discovery. A little adventure. All yours.</p></div><span className="vt-ai-badge"><Sparkles size={13} /> AI-crafted itinerary</span></div>
    <div className="vt-details"><div className="vt-stat"><CalendarDays size={21} strokeWidth={1.4} /><div><span>DURATION</span><strong>{days ? `${days} ${Number(days) === 1 ? 'day' : 'days'}` : trip.TripData?.duration || 'Your getaway'}</strong></div></div><div className="vt-stat"><Users size={21} strokeWidth={1.4} /><div><span>TRAVEL CREW</span><strong>{selection.traveler === '1' ? 'Solo adventure' : selection.traveler || 'Your favorite company'}</strong></div></div><div className="vt-stat"><Wallet size={21} strokeWidth={1.4} /><div><span>TRAVEL STYLE</span><strong>{selection.budget === 'Cheap' ? 'Budget-friendly' : selection.budget || 'Your own pace'}</strong></div></div><button className="vt-copy-button" onClick={copyLink}><LinkIcon size={15} /> Copy trip link</button></div>
    <nav className="vt-section-nav" aria-label="Trip sections"><a href="#trip-hotels">Places to stay</a><a href="#trip-itinerary">Your itinerary</a><span>Your plans, all in one place.</span></nav>
  </section>
}
