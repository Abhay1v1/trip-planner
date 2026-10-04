import { Button } from '@/components/ui/button'
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const PlaceCardItem = ({ activity }) => {

    const [photoUrl, setPhotoUrl] = useState();

    useEffect(() => {
        activity && GetPlacePhoto();
    }, [activity])

    const GetPlacePhoto = async () => {
        const data = {
            textQuery: activity.placeName
        }
        const result = await GetPlaceDetails(data).then(resp => {
            const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', resp.data.places[0].photos[3].name)
            setPhotoUrl(PhotoUrl);

        })
    }

  return (
    <div>
      <Link to={'https://www.google.com/maps/search/?api=1&query=' + activity?.placeName + "," + activity?.geoCoordinates} target='_blank'>
                <div className='my-4 bg-gray-50 gap-2 border rounded-xl flex flex-cols-2 hover:scale-105 transition-all hover:shadow-md cursor-pointer '>
                    <div className='w-full'>
                        <img src={photoUrl ? photoUrl : '/road-trip-vacation.jpg'} className='h-[200px] max-w-full rounded-xl object-cover' />
                    </div>
                <div className='mt-2.5'>
                        {/* <h2 className='font-medium text-sm text-orange-600'>{place.time}</h2> */}
                        <h2 className='font-bold'>{activity.placeName}</h2>
                        <p className='text-sm text-gray-500'>{activity.placeDetails}</p>
                        <h2 className='text-blue-700 text-sm'>{activity.ticketPricing}</h2>
                        <h2 className='text-sm text-yellow-500'>⭐{activity.rating}</h2>
                    </div>
                    <div className='mt-36 mx-6'>
                        <Button><FaLocationDot /></Button>
                    </div>
                </div>
            </Link>
    </div>
  )
}

export default PlaceCardItem
