import { ArrowUpRight, Clock3, Star, Ticket } from 'lucide-react'
import TripPhoto from './TripPhoto'

export default function PlaceCardItem({ activity, destination }) {
  const coordinates = activity.geoCoordinates
  const location = Number.isFinite(coordinates?.latitude) && Number.isFinite(coordinates?.longitude)
    ? `${coordinates.latitude},${coordinates.longitude}` : [activity.placeName, destination].filter(Boolean).join(', ')
  return <article className="vt-activity"><TripPhoto query={[activity.placeName, destination].filter(Boolean).join(', ')} alt={activity.placeName || 'Suggested place to visit'} className="vt-activity-photo" /><div className="vt-activity-body"><div className="vt-activity-title"><h4>{activity.placeName || 'A place to discover'}</h4>{activity.rating != null && <span><Star size={12} /> {activity.rating}</span>}</div><p>{activity.placeDetails}</p><div className="vt-activity-meta">{activity.ticketPricing && <span><Ticket size={13} /> {activity.ticketPricing}</span>}{activity.travelTime && <span><Clock3 size={13} /> {activity.travelTime}</span>}</div><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`} target="_blank" rel="noopener noreferrer">View on Maps <ArrowUpRight size={14} /><span className="sr-only"> (opens in a new tab)</span></a></div></article>
}
