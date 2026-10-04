import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const UserTripCardItem = ({trip}) => {
    const [photoUrl,setPhotoUrl] = useState();

  useEffect(()=>{
    trip&&GetPlacePhoto();
  },[trip])

  const GetPlacePhoto=async()=>{
    const data={
      textQuery:trip?.userSelection?.location.label
    }
    const result= await GetPlaceDetails(data).then(resp=>{
      const photoUrl=PHOTO_REF_URL.replace('{NAME}',resp.data.places[0].photos[3].name)
      setPhotoUrl(photoUrl);
    })
  }

  return (
    <Link to={'/view-trip/'+trip?.id}>
    <div className='hover:scale-105 transition-all hover:shadow-sm rounded-xl pb-2 '>
     <img src={photoUrl ? photoUrl : ' /road-trip-vacation.jpg'}  className='rounded-xl h-[200px] w-full object-cover'/>
      <div className='m-2.5'>
      <h2 className='font-medium text-lg'>{trip?.userSelection?.location?.label}</h2>
      <h2 className="text-sm text-gray-600" >{trip?.userSelection?.noOfDays} Days trip with {trip?.userSelection?.budget} </h2>
      </div>
    </div>
   </Link>
  )
}

export default UserTripCardItem
