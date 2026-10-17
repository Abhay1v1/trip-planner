import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AI_PROMPT, SelectBudgetOptions, SelectTravelesList } from '@/constants/options'
import { generateTrip } from '@/service/AIModel'
import { useState } from 'react'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useGoogleLogin } from '@react-oauth/google'
import { FcGoogle } from 'react-icons/fc'
import { ArrowLeft, ArrowUpRight, CalendarDays, Check, Compass, Gem, Heart, Leaf, LoaderCircle, MapPin, Route, Sparkles, UserRound, Users, Wallet } from 'lucide-react'
import axios from 'axios'
import { db } from '@/service/firebaseConfig'
import { doc, setDoc } from 'firebase/firestore'
import { Link, useNavigate } from 'react-router-dom'
import './CreateTrip.css'

const budgetDetails = [
  { label: 'Budget-friendly', description: 'More experiences, less spending.', icon: Leaf },
  { label: 'A little of both', description: 'Comfort with room to explore.', icon: Wallet },
  { label: 'Treat yourself', description: 'Make it a little extra special.', icon: Gem },
]
const travelerDetails = [
  { label: 'Solo', description: 'Just me, on my terms', icon: UserRound },
  { label: 'A couple', description: 'An escape for two', icon: Heart },
  { label: 'Family', description: '3–5 fellow adventurers', icon: Users },
  { label: 'Friends', description: '5–10 memory makers', icon: Compass },
]
const placeStyles = {
  control: (base, state) => ({ ...base, minHeight: 48, borderRadius: 8, background: '#fafbf7', borderColor: state.isFocused ? '#58765b' : '#dce2d5', boxShadow: state.isFocused ? '0 0 0 3px #58765b18' : 'none', ':hover': { borderColor: '#8b9d80' } }),
  placeholder: base => ({ ...base, color: '#92998b', fontSize: 13 }),
  singleValue: base => ({ ...base, color: '#243e35', fontSize: 13 }),
  input: base => ({ ...base, color: '#243e35', fontSize: 13 }),
  option: (base, state) => ({ ...base, fontSize: 13, background: state.isSelected ? '#243e35' : state.isFocused ? '#eff3e8' : '#fff', color: state.isSelected ? '#fff' : '#243e35' }),
  menu: base => ({ ...base, zIndex: 30, borderRadius: 8, overflow: 'hidden' }),
}

export default function CreateTrip() {
  const [place, setPlace] = useState(null)
  const [formData, setFormData] = useState({})
  const [openDialog, setOpenDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const days = Number(formData.noOfDays)
  const validDays = Number.isInteger(days) && days >= 1 && days <= 5
  const completed = [Boolean(formData.location), validDays, Boolean(formData.budget), Boolean(formData.traveler)].filter(Boolean).length
  const travelerIndex = SelectTravelesList.findIndex(item => item.people === formData.traveler)
  const handleInputChange = (name, value) => setFormData(previous => ({ ...previous, [name]: value }))

  const generate = async () => {
    if (loading) return
    if (completed < 4) {
      toast.error('Choose a destination, 1–5 whole days, a budget, and your travel crew.')
      return
    }
    let user
    try { user = JSON.parse(localStorage.getItem('user')) } catch { user = null }
    if (!user?.email) { setOpenDialog(true); return }
    setLoading(true)
    try {
      const prompt = AI_PROMPT.replace('{location}', formData.location.label)
        .replaceAll('{totalDays}', formData.noOfDays)
        .replace('{traveler}', formData.traveler)
        .replace('{budget}', formData.budget)
      const result = await generateTrip(prompt)
      const tripData = JSON.parse(result.text)
      const docId = Date.now().toString()
      await setDoc(doc(db, 'AITrips', docId), {
        userSelection: formData, TripData: tripData, userEmail: user.email, id: docId, createdAt: new Date(),
      })
      toast.success('Your adventure is ready!')
      navigate('/view-trip/' + docId)
    } catch (error) {
      console.error('Trip creation failed:', error)
      toast.error('We couldn’t create your trip. Please try again.')
    } finally { setLoading(false) }
  }

  const login = useGoogleLogin({
    onSuccess: async (tokenInfo) => {
      try {
        const { data } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
          headers: { Authorization: `Bearer ${tokenInfo.access_token}`, Accept: 'application/json' },
        })
        localStorage.setItem('user', JSON.stringify(data))
        window.dispatchEvent(new Event('authChange'))
        setOpenDialog(false)
        await generate()
      } catch { toast.error('Unable to sign in. Please try again.') }
    },
    onError: () => toast.error('Unable to sign in. Please try again.'),
  })

  return (
    <main className="create-page">
      <div className="create-container">
        <Link to="/" className="create-back"><ArrowLeft size={14} /> Back to exploring</Link>
        <div className="create-heading"><div><span className="create-eyebrow"><Sparkles size={13} /> A LITTLE WANDERLUST, A PLAN THAT’S YOURS</span><h1>Let’s plan your <em>next escape.</em></h1><p>A few details from you. A world of possibilities from here.</p></div><span className="create-heading-icon" aria-hidden="true"><Compass size={45} strokeWidth={1} /></span></div>
        <div className="create-layout">
          <form className="create-form" onSubmit={event => { event.preventDefault(); generate() }} aria-busy={loading}>
            <fieldset disabled={loading} className="create-fields">
              <section className="create-section" aria-labelledby="destination-title">
                <div className="create-section-heading"><span className="create-step-number">01</span><div><h2 id="destination-title">Where are we heading?</h2><p>Every great trip starts with a little inspiration.</p></div><MapPin size={20} /></div>
                <div className="create-basics">
                  <div className="create-destination"><label htmlFor="trip-destination">Your destination</label><GooglePlacesAutocomplete apiKey={import.meta.env.VITE_GOOGLE_PLACES_API_KEY} selectProps={{ inputId: 'trip-destination', instanceId: 'trip-destination', value: place, isDisabled: loading, onChange: value => { setPlace(value); handleInputChange('location', value) }, placeholder: 'Search a city or destination', styles: placeStyles, isClearable: true }} /></div>
                  <div><label htmlFor="trip-days">How many days?</label><div className="create-days-input"><CalendarDays size={16} /><Input id="trip-days" type="number" min="1" max="5" step="1" required placeholder="e.g. 3" value={formData.noOfDays || ''} onChange={event => handleInputChange('noOfDays', event.target.value)} aria-describedby="trip-days-help" /></div><span className="create-field-hint" id="trip-days-help">A little getaway of 1–5 days</span></div>
                </div>
              </section>
              <section className="create-section" aria-labelledby="budget-title">
                <div className="create-section-heading"><span className="create-step-number">02</span><div><h2 id="budget-title">What’s your travel style?</h2><p>Your budget for activities and dining.</p></div><Wallet size={20} /></div>
                <div className="create-choices create-budget-choices" role="group" aria-labelledby="budget-title">{SelectBudgetOptions.map((item, index) => {
                  const { label, description, icon: Icon } = budgetDetails[index]
                  return <label className="create-choice" key={item.id}><input type="radio" name="budget" value={item.title} checked={formData.budget === item.title} onChange={() => handleInputChange('budget', item.title)} required /><span className="create-choice-content"><span className="create-choice-top"><Icon size={23} strokeWidth={1.5} /><span className="create-choice-check"><Check size={11} /></span></span><strong>{label}</strong><small>{description}</small><span className="create-budget-tag">{item.title === 'Cheap' ? 'Budget' : item.title}</span></span></label>
                })}</div>
              </section>
              <section className="create-section" aria-labelledby="travelers-title">
                <div className="create-section-heading"><span className="create-step-number">03</span><div><h2 id="travelers-title">Who’s coming along?</h2><p>Good company makes a great adventure.</p></div><Users size={20} /></div>
                <div className="create-choices create-traveler-choices" role="group" aria-labelledby="travelers-title">{SelectTravelesList.map((item, index) => {
                  const { label, description, icon: Icon } = travelerDetails[index]
                  return <label className="create-choice" key={item.id}><input type="radio" name="traveler" value={item.people} checked={formData.traveler === item.people} onChange={() => handleInputChange('traveler', item.people)} required /><span className="create-choice-content"><span className="create-choice-top"><Icon size={22} strokeWidth={1.5} /><span className="create-choice-check"><Check size={11} /></span></span><strong>{label}</strong><small>{description}</small></span></label>
                })}</div>
              </section>
            </fieldset>
            <div className="create-submit-row"><span><Sparkles size={15} /> Made for you, with a little help from AI.</span><button type="submit" disabled={loading} className="create-submit">{loading ? <><LoaderCircle className="create-spinner" size={18} /> Creating your trip…</> : <>Generate my trip <ArrowUpRight size={19} /></>}</button></div>
            {loading && <p className="create-loading" role="status">Finding places to explore and putting your itinerary together. This may take a moment.</p>}
          </form>
          <aside className="create-summary" aria-label="Your trip summary">
            <div className="create-summary-top"><span className="create-eyebrow">YOUR ADVENTURE, AT A GLANCE</span><Compass size={29} strokeWidth={1.2} /></div>
            <h2>A little preview<br />of what’s <em>next.</em></h2>
            <div className="create-progress-label"><span>Your trip essentials</span><span>{completed} of 4</span></div><div className="create-progress" role="progressbar" aria-label="Trip details completed" aria-valuemin={0} aria-valuemax={4} aria-valuenow={completed}><span style={{ width: `${completed * 25}%` }} /></div>
            <dl className="create-summary-list"><div><MapPin size={17} /><div><dt>DESTINATION</dt><dd>{formData.location?.label || 'Somewhere wonderful'}</dd></div></div><div><CalendarDays size={17} /><div><dt>DURATION</dt><dd>{validDays ? `${days} ${days === 1 ? 'day' : 'days'} of discovery` : 'A few days away'}</dd></div></div><div><Wallet size={17} /><div><dt>BUDGET</dt><dd>{formData.budget === 'Cheap' ? 'Budget-friendly' : formData.budget || 'Your kind of comfort'}</dd></div></div><div><Users size={17} /><div><dt>TRAVEL CREW</dt><dd>{travelerIndex >= 0 ? travelerDetails[travelerIndex].label : 'Your favorite company'}</dd></div></div></dl>
            <div className="create-included"><span>WHAT’S IN YOUR PLAN</span><p><Check size={14} /> A day-by-day itinerary</p><p><Check size={14} /> Hotels to consider</p><p><Check size={14} /> Places worth exploring</p></div>
            <div className="create-summary-footer"><Route size={19} /><p>The best stories start<br />with <em>“let’s go.”</em></p></div>
          </aside>
        </div>
        <p className="create-bottom-note">A starting point for your adventure. Check availability and local details before you go.</p>
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}><DialogContent className="create-auth-dialog"><DialogHeader><Compass size={33} strokeWidth={1.4} /><DialogTitle>Save your next adventure.</DialogTitle><DialogDescription>Sign in with Google to generate your itinerary and keep it in My Trips.</DialogDescription></DialogHeader><Button onClick={() => login()}><FcGoogle size={20} /> Continue with Google</Button></DialogContent></Dialog>
    </main>
  )
}
