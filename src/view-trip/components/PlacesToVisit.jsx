import { Clock3, MapPin, Route, Sparkles } from 'lucide-react'
import PlaceCardItem from './PlaceCardItem'

export default function PlacesToVisit({ trip }) {
  const itinerary = Array.isArray(trip.TripData?.itinerary) ? trip.TripData.itinerary.filter(Boolean) : []
  const destination = trip.userSelection?.location?.label || trip.TripData?.destination || ''
  return <section className="vt-section vt-itinerary" id="trip-itinerary" aria-labelledby="itinerary-title"><div className="vt-section-heading"><div><span className="vt-eyebrow">MAKE ROOM FOR MEMORIES</span><h2 id="itinerary-title">A little more <em>every day.</em></h2><p>Your day-by-day guide to getting out and exploring.</p></div><span className="vt-count"><Route size={16} /> {itinerary.length} {itinerary.length === 1 ? 'day' : 'days'}</span></div>
    {itinerary.length ? <div className="vt-itinerary-layout"><aside className="vt-day-guide"><span className="vt-eyebrow">YOUR JOURNEY</span><nav aria-label="Jump to itinerary day">{itinerary.map((day, index) => <a key={index} href={`#itinerary-day-${index}`}><span>{String(index + 1).padStart(2, '0')}</span> Day {day.day || index + 1}<Route size={14} /></a>)}</nav><div className="vt-guide-tip"><Sparkles size={18} /><p>Leave a little room<br />for the <em>unexpected.</em></p><small>This is your starting point. Explore at your own pace.</small></div></aside>
      <div className="vt-days">{itinerary.map((day, index) => {
        const activities = Array.isArray(day.plan) ? day.plan.filter(Boolean) : []
        return <section className="vt-day" id={`itinerary-day-${index}`} key={index} aria-labelledby={`day-title-${index}`}><div className="vt-day-heading"><span className="vt-day-number">{String(index + 1).padStart(2, '0')}</span><h3 id={`day-title-${index}`}>Day {day.day || index + 1}</h3><span><MapPin size={12} /> {activities.length} {activities.length === 1 ? 'stop' : 'stops'}</span></div>
          {activities.length ? <ol className="vt-activities">{activities.map((activity, activityIndex) => <li key={`${activity.placeName}-${activityIndex}`}><div className="vt-activity-time"><span className="vt-timeline-dot" /><Clock3 size={12} /><span>{activity.bestTimeToVisit || 'Explore at your own pace'}</span></div><PlaceCardItem activity={activity} destination={destination} /></li>)}</ol> : <p className="vt-empty">This day is yours to explore. No activities were included.</p>}
        </section>
      })}</div>
    </div> : <p className="vt-empty">No daily activities were included in this trip.</p>}
  </section>
}
