import { Link } from 'react-router-dom'
import { ArrowUpRight, CalendarDays, MapPin, Users, Wallet } from 'lucide-react'
import TripPhoto from '@/view-trip/components/TripPhoto'
import { getTripCreatedTime } from '../tripOrder'

export default function UserTripCardItem({ trip, newest }) {
  const selection = trip.userSelection || {}
  const destination = selection.location?.label || trip.TripData?.destination || 'Your next adventure'
  const createdTime = getTripCreatedTime(trip)
  const date = new Date(createdTime)
  const hasDate = createdTime > 0 && !Number.isNaN(date.getTime())
  const duration = selection.noOfDays
  return <article className="mt-trip-card"><Link to={`/view-trip/${encodeURIComponent(trip.id)}`} aria-label={`View your trip to ${destination}`}>
    <div className="mt-card-photo"><TripPhoto query={destination} alt={`A view of ${destination}`} />{newest && hasDate && <span className="mt-recent-badge"><span /> LATEST ADVENTURE</span>}<span className="mt-photo-arrow"><ArrowUpRight size={19} /></span></div>
    <div className="mt-card-body"><span className="mt-card-eyebrow"><MapPin size={11} /> YOUR NEXT CHAPTER</span><h2>{destination}</h2><div className="mt-card-details"><span><CalendarDays size={13} /> {duration ? `${duration} ${Number(duration) === 1 ? 'day' : 'days'}` : 'Your getaway'}</span>{selection.budget && <span><Wallet size={13} /> {selection.budget === 'Cheap' ? 'Budget-friendly' : selection.budget}</span>}</div>{selection.traveler && <p className="mt-travelers"><Users size={13} /> {selection.traveler === '1' ? 'Solo adventure' : selection.traveler}</p>}<div className="mt-card-bottom">{hasDate ? <time dateTime={date.toISOString()}>Created {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</time> : <span>Saved adventure</span>}<span>View trip <ArrowUpRight size={13} /></span></div></div>
  </Link></article>
}
