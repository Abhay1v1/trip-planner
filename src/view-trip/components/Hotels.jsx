import { BedDouble } from 'lucide-react'
import HotelCardItem from './HotelCardItem'

export default function Hotels({ trip }) {
  const hotels = Array.isArray(trip.TripData?.hotels) ? trip.TripData.hotels.filter(Boolean) : []
  return <section className="vt-section" id="trip-hotels" aria-labelledby="hotels-title"><div className="vt-section-heading"><div><span className="vt-eyebrow">REST, RECHARGE, REPEAT</span><h2 id="hotels-title">Somewhere to <em>settle in.</em></h2><p>A few stays to consider for your adventure.</p></div><span className="vt-count"><BedDouble size={16} /> {hotels.length} {hotels.length === 1 ? 'stay' : 'stays'}</span></div>
    {hotels.length ? <div className="vt-hotels-grid">{hotels.map((hotel, index) => <HotelCardItem key={`${hotel.hotelName}-${index}`} hotel={hotel} />)}</div> : <p className="vt-empty">No hotel suggestions were included in this itinerary.</p>}
  </section>
}
