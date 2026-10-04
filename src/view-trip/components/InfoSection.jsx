import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { IoShareSocial } from "react-icons/io5";

function InfoSection({trip}) {

    const [photoUrl,setPhotoUrl] = useState();
  useEffect(()=>{
    trip&&GetPlacePhoto();
  },[trip])

    const GetPlacePhoto=async()=>{
    const data={
      textQuery:trip?.userSelection?.location?.label
    }
    const result= await GetPlaceDetails(data).then(resp=>{
      // console.log(resp.data.places[0].photos[3].name)
       const photoUrl=PHOTO_REF_URL.replace('{NAME}',resp.data.places[0].photos[3].name)
       setPhotoUrl(photoUrl);
     
    })
  }

  return (
    <div>
       <img src={photoUrl ? photoUrl : '/road-trip-vacation.jpg'} className='h-[400px] w-full object-fill rounded-xl'/>
       <div>
        <div>
            <h2 className='font-bold text-2xl mt-4'>{trip?.userSelection?.location?.label}</h2>
            <div className='flex gap-6 mt-4'>
                    <h2 className='bg-gray-200 font-medium text-gray-600 rounded-full p-1 px-4 md:text-md'>🗓️ {trip?.userSelection?.noOfDays} Day</h2>
                    <h2 className='bg-gray-200 font-medium text-gray-600 rounded-full p-1 px-4 md:text-md'>👩‍👧‍👦 Number of Traveler : {trip?.userSelection?.traveler} </h2>
                    <h2 className='bg-gray-200 font-medium text-gray-600 rounded-full p-1 px-4 md:text-md'>💵 {trip?.userSelection?.budget} Budget </h2>
                    <button className=''><IoShareSocial/></button>
            </div>
        </div>
       </div>
    </div>
  )
}

export default InfoSection
