import { useEffect, useState } from 'react'
import { ArrowUpRight, ChevronDown, Compass, LogOut, Map, Plus, Sparkles } from 'lucide-react'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { googleLogout, useGoogleLogin } from '@react-oauth/google'
import { FcGoogle } from 'react-icons/fc'
import { toast } from 'sonner'
import axios from 'axios'
import './Header.css'

function Avatar({ user }) {
  const [failed, setFailed] = useState(false)
  const initials = (user.name || user.email || 'Traveler').trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase()
  return <span className="travel-avatar" aria-hidden="true">
    {user.picture && !failed
      ? <img src={user.picture} alt="" referrerPolicy="no-referrer" onError={() => setFailed(true)} />
      : initials}
  </span>
}

const Header = () => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })
  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    const syncUser = () => {
      try { setUser(JSON.parse(localStorage.getItem('user'))) } catch { setUser(null) }
    }
    window.addEventListener('storage', syncUser)
    window.addEventListener('authChange', syncUser)
    return () => {
      window.removeEventListener('storage', syncUser)
      window.removeEventListener('authChange', syncUser)
    }
  }, [])

  const getUserProfile = async (tokenInfo) => {
    try {
      const { data } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
        headers: { Authorization: `Bearer ${tokenInfo.access_token}`, Accept: 'application/json' },
      })
      localStorage.setItem('user', JSON.stringify(data))
      setUser(data)
      window.dispatchEvent(new Event('authChange'))
      setOpenDialog(false)
    } catch {
      toast.error('Unable to sign in. Please try again.')
    }
  }

  const login = useGoogleLogin({
    onSuccess: getUserProfile,
    onError: () => toast.error('Unable to sign in. Please try again.'),
  })

  const handleLogout = () => {
    googleLogout()
    localStorage.removeItem('user')
    setUser(null)
    window.dispatchEvent(new Event('authChange'))
    window.location.reload()
  }

  return (
    <>
      <header className="travel-header">
        <div className="travel-header-inner">
          <a className="travel-brand" href="/" aria-label="Trip Planner home">
            <span className="travel-brand-mark"><Compass size={27} strokeWidth={1.5} /></span>
            <span className="travel-brand-text"><strong>trip<span>planner</span><i>.</i></strong><small>A LITTLE WANDER GOES A LONG WAY</small></span>
          </a>
          <nav className="travel-header-nav" aria-label="Main navigation">
            <a className="travel-explore-link" href="/#how-it-works">How it works</a>
            {user && <a className="travel-trips-link" href="/my-trips"><Map size={17} /><span>My Trips</span></a>}
            <a className="travel-create-link" href="/create-trip"><Plus size={17} /><span>Create Trip</span><ArrowUpRight className="travel-create-arrow" size={16} /></a>
            <span className="travel-header-divider" aria-hidden="true" />
            {user ? (
              <Popover>
                <PopoverTrigger className="travel-profile-trigger" aria-label="Open account menu">
                  <Avatar key={user.picture || user.email} user={user} />
                  <ChevronDown className="travel-profile-chevron" size={14} />
                </PopoverTrigger>
                <PopoverContent align="end" sideOffset={15} className="travel-account-menu">
                  <div className="travel-account-info"><span className="travel-account-eyebrow">YOUR NEXT ADVENTURE AWAITS</span><strong>{user.name || 'Hello, traveler'}</strong><span>{user.email}</span></div>
                  <a href="/my-trips" className="travel-account-action"><Map size={16} /> My trips <ArrowUpRight size={15} /></a>
                  <button type="button" className="travel-account-action travel-logout" onClick={handleLogout}><LogOut size={16} /> Sign out</button>
                </PopoverContent>
              </Popover>
            ) : <button type="button" className="travel-signin" onClick={() => setOpenDialog(true)}>Sign in <ArrowUpRight size={15} /></button>}
          </nav>
        </div>
      </header>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="travel-login-dialog">
          <DialogHeader>
            <span className="travel-login-icon"><Compass size={30} strokeWidth={1.4} /></span>
            <DialogTitle className="travel-login-title">A world of possibilities.</DialogTitle>
            <DialogDescription>Sign in to save your itineraries and keep your next adventure close.</DialogDescription>
          </DialogHeader>
          <Button onClick={() => login()} className="travel-google-button"><FcGoogle size={20} /> Continue with Google</Button>
          <p className="travel-login-note"><Sparkles size={13} /> Your pace. Your places. Your plans.</p>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Header
