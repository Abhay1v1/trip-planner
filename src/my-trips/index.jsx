import { db } from '@/service/firebaseConfig'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { ArrowDownWideNarrow, ArrowUpRight, Compass, Map, Plus, Sparkles } from 'lucide-react'
import UserTripCardItem from './components/UserTripCardItem'
import { sortTripsNewestFirst } from './tripOrder'
import './MyTrips.css'

export default function MyTrips() {
  const navigate = useNavigate()
  const [state, setState] = useState({ status: 'loading', trips: [] })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    let user
    try { user = JSON.parse(localStorage.getItem('user')) } catch { user = null }
    if (!user?.email) { navigate('/', { replace: true }); return }
    setState({ status: 'loading', trips: [] })
    const tripsQuery = query(collection(db, 'AITrips'), where('userEmail', '==', user.email))
    getDocs(tripsQuery).then(snapshot => {
      const trips = snapshot.docs.map(document => ({ ...document.data(), id: document.id }))
      if (active) setState({ status: 'ready', trips: sortTripsNewestFirst(trips) })
    }).catch(() => { if (active) setState({ status: 'error', trips: [] }) })
    return () => { active = false }
  }, [navigate, attempt])

  return <main className="my-trips-page"><div className="my-trips-container">
    <div className="mt-page-heading"><div><span className="mt-eyebrow"><Sparkles size={13} /> YOUR OWN LITTLE WORLD OF ADVENTURES</span><h1>My trips<span>.</span></h1><p>Places you’ve dreamed of. Plans you can come back to.</p></div><Link to="/create-trip" className="mt-primary"><Plus size={16} /> Plan a new trip <ArrowUpRight size={17} /></Link></div>
    <div className="mt-collection-bar"><div><Map size={17} /><h2>Your collection</h2>{state.status === 'ready' && <span className="mt-trip-count">{state.trips.length} {state.trips.length === 1 ? 'trip' : 'trips'}</span>}</div><span className="mt-sort-label"><ArrowDownWideNarrow size={15} /> Newest first</span></div>
    {state.status === 'loading' ? <><p className="sr-only" role="status">Loading your saved trips.</p><div className="mt-trips-grid" aria-hidden="true">{[0, 1, 2].map(item => <div className="mt-skeleton" key={item}><div /><span /><span /><span /></div>)}</div></>
      : state.status === 'error' ? <section className="mt-empty" role="alert"><span className="mt-empty-icon"><Compass size={37} strokeWidth={1.2} /></span><h2>A small detour.</h2><p>We couldn’t load your trips. Check your connection and try again.</p><button className="mt-primary" onClick={() => setAttempt(value => value + 1)}>Try again <ArrowUpRight size={17} /></button></section>
        : state.trips.length ? <div className="mt-trips-grid">{state.trips.map((trip, index) => <UserTripCardItem key={trip.id} trip={trip} newest={index === 0} />)}<Link className="mt-new-trip-card" to="/create-trip"><span className="mt-new-trip-icon"><Plus size={28} strokeWidth={1.2} /></span><h2>Where to next?</h2><p>There’s always another<br />story waiting to happen.</p><span>Plan something new <ArrowUpRight size={15} /></span></Link></div>
          : <section className="mt-empty"><span className="mt-empty-icon"><Compass size={37} strokeWidth={1.2} /></span><span className="mt-eyebrow">A FRESH PAGE. A WORLD OF POSSIBILITIES.</span><h2>Your first adventure starts here.</h2><p>Pick a destination and we’ll help you turn a little curiosity into a trip worth taking.</p><Link className="mt-primary" to="/create-trip">Plan my first trip <ArrowUpRight size={17} /></Link></section>}
    <footer className="mt-footer"><Compass size={18} strokeWidth={1.3} /><span>Collect moments. Keep the plans.</span><span>Made for the joy of getting away.</span></footer>
  </div></main>
}
