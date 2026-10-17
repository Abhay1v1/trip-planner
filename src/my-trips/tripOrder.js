// Older trips used a millisecond timestamp as their document ID and have no createdAt.
export function getTripCreatedTime(trip) {
  const value = trip.createdAt
  let timestamp = NaN
  if (typeof value?.toMillis === 'function') timestamp = value.toMillis()
  else if (value instanceof Date) timestamp = value.getTime()
  else if (typeof value?.seconds === 'number') timestamp = value.seconds * 1000 + (value.nanoseconds || 0) / 1e6
  else if (typeof value === 'number') timestamp = value
  else if (typeof value === 'string') timestamp = Date.parse(value)
  if (Number.isFinite(timestamp) && timestamp > 0) return timestamp
  const legacyTime = /^\d+$/.test(String(trip.id || '')) ? Number(trip.id) : NaN
  return Number.isFinite(legacyTime) && legacyTime > 0 ? legacyTime : 0
}

export function sortTripsNewestFirst(trips) {
  return [...trips].sort((a, b) => getTripCreatedTime(b) - getTripCreatedTime(a) || String(b.id).localeCompare(String(a.id)))
}
