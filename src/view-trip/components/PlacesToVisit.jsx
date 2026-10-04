import React from 'react'
import PlaceCardItem from './PlaceCardItem'

const PlacesToVisit = ({trip}) => {
  return (
    <div>
        <h2 className='font-bold text-xl mt-5'>Places To Visit</h2>
        <div>
            {trip?.TripData?.itinerary?.map((item,index)=>(
                <div key={index}>
                    <h2 className='font-medium text-lg'>Day {item.day}</h2>
                    <div>
                        {item?.plan?.map((activity,index)=>(
                            <div className='my-3'>
                                <h2 className='font-medium text-sm text-gray-500'>🕒 {activity.bestTimeToVisit}</h2>
                                <PlaceCardItem activity={activity} key={index}/>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default PlacesToVisit
