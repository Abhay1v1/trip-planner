import { db } from '@/service/firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Compass, LoaderCircle } from 'lucide-react'
import InfoSection from '../components/InfoSection'
import Hotels from '../components/Hotels'
import PlacesToVisit from '../components/PlacesToVisit'
import Footer from '../components/Footer'
import '../ViewTrip.css'

export default function ViewTrip() {
  const { tripId } = useParams()
  const [state, setState] = useState({ status: 'loading', trip: null })
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    let active = true
    setState({ status: 'loading', trip: null })
    getDoc(doc(db, 'AITrips', tripId)).then(snapshot => {
      if (active) setState(snapshot.exists() ? { status: 'ready', trip: snapshot.data() } : { status: 'missing', trip: null })
    }).catch(() => { if (active) setState({ status: 'error', trip: null }) })
    return () => { active = false }
  }, [tripId, attempt])

  return <main className="view-trip-page"><div className="vt-container">
    <div className="vt-topbar"><Link to="/my-trips"><ArrowLeft size={14} /> Back to my trips</Link><span>LESS PLANNING. MORE EXPLORING.</span></div>
    {state.status === 'ready' ? <><InfoSection trip={state.trip} /><Hotels trip={state.trip} /><PlacesToVisit key={tripId} trip={state.trip} /><Footer /></>
      : <section className="vt-state" role={state.status === 'error' ? 'alert' : 'status'}>
        {state.status === 'loading' ? <LoaderCircle className="vt-spinner" size={35} strokeWidth={1.4} /> : <Compass size={42} strokeWidth={1.2} />}
        <h1>{state.status === 'loading' ? 'Your adventure is on its way.' : state.status === 'missing' ? 'This trip is off the map.' : 'A small detour.'}</h1>
        <p>{state.status === 'loading' ? 'Bringing your itinerary together…' : state.status === 'missing' ? 'We couldn’t find a trip at this link. Head back to your saved adventures or plan a new one.' : 'We couldn’t load your trip. Check your connection and try again.'}</p>
        {state.status === 'error' && <button className="vt-primary" onClick={() => setAttempt(value => value + 1)}>Try again</button>}
        {state.status === 'missing' && <Link className="vt-primary" to="/create-trip">Plan a new trip <ArrowUpRight size={17} /></Link>}
      </section>}
  </div></main>
}
