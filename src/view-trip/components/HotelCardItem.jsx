import { ArrowUpRight, MapPin, Star } from 'lucide-react'
import TripPhoto from './TripPhoto'

export default function HotelCardItem({ hotel }) {
  const query = [hotel.hotelName, hotel.hotelAddress].filter(Boolean).join(', ')
  return <article className="vt-hotel"><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`} target="_blank" rel="noopener noreferrer" aria-label={`View ${hotel.hotelName || 'hotel'} on Google Maps (opens in a new tab)`}>
    <div className="vt-hotel-image"><TripPhoto query={query} alt={hotel.hotelName || 'Hotel'} />{hotel.rating != null && <span className="vt-rating"><Star size={12} /> {hotel.rating}</span>}<span className="vt-image-arrow"><ArrowUpRight size={18} /></span></div>
    <div className="vt-hotel-body"><h3>{hotel.hotelName || 'Suggested stay'}</h3><p className="vt-address"><MapPin size={13} /><span>{hotel.hotelAddress || 'See location on Maps'}</span></p>{hotel.description && <p className="vt-hotel-description">{hotel.description}</p>}<div className="vt-hotel-bottom"><div><span>ESTIMATED PRICE</span><strong>{hotel.price || 'Check with the hotel'}</strong></div><span className="vt-hotel-link">View stay <ArrowUpRight size={13} /></span></div></div>
  </a></article>
}
