import { useEffect, useState } from 'react'
import { Compass } from 'lucide-react'
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi'

export default function TripPhoto({ query, alt, className = '', priority = false }) {
  const [photo, setPhoto] = useState(null)
  useEffect(() => {
    let active = true
    setPhoto(null)
    if (query) {
      GetPlaceDetails({ textQuery: query }).then(({ data }) => {
        const name = data.places?.[0]?.photos?.[0]?.name
        if (active && name) setPhoto(PHOTO_REF_URL.replace('{NAME}', name))
      }).catch(() => { /* Keep the destination-neutral fallback when photos are unavailable. */ })
    }
    return () => { active = false }
  }, [query])
  return <div className={`vt-photo ${className}`}>
    {photo ? <img src={photo} alt={alt} loading={priority ? 'eager' : 'lazy'} onError={() => setPhoto(null)} />
      : <div className="vt-photo-placeholder" role="img" aria-label={alt}><Compass size={44} strokeWidth={1} /><span>A LITTLE ROOM FOR WONDER</span></div>}
  </div>
}
