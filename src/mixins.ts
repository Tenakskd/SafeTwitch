import type { FollowingStreamer } from '@/types'

const language = localStorage.getItem('language') || 'en-us'
const https = import.meta.env.SAFETWITCH_HTTPS.slice() === 'true'
const protocol = https ? 'https://' : 'http://'
const rootBackendUrl = `${protocol}${import.meta.env.SAFETWITCH_BACKEND_DOMAIN}/`

export function truncate(value: string, length: number) {
  if (value.length > length) {
    return value.substring(0, length) + '...'
  } else {
    return value
  }
}

export function abbreviate(text: number) {
  return Intl.NumberFormat(language, {
    //@ts-ignore
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(text)
}

/**
 * Gets the response from an endpoint from the backend
 * @param endpoint The endpoint to get data from
 * @returns The data from the enpoint
 */
export async function getEndpoint(endpoint: string) {
  const res = await fetch(rootBackendUrl + endpoint, {
    method: 'GET',
    headers: {
      'Accept-Language': language
    }
  })
  const rawData = await res.json()

  if (!res.ok) {
    throw res
  }
  if (rawData.status !== 'ok') {
    throw rawData
  }

  const data = rawData.data

  return data
}

/**
 * Gets the response from an endpoint from the backend
 * @param endpoint The endpoint to get data from
 * @returns The data from the enpoint
 */
export async function postEndpoint(endpoint: string, data: any) {
  const res = await fetch(rootBackendUrl + endpoint, {
    method: 'POST',
    headers: {
      'Accept-Language': language
    },
    body: JSON.stringify(data)
  })
  const rawData = await res.json()

  if (!res.ok) {
    throw res
  }
  if (rawData.status !== 'ok') {
    throw rawData
  }

  const finalData = rawData.data

  return finalData
}

/**
 * Converts a twitch timestamp (0h0m0s) to seconds
 * @param query 0h0m0s
 * @returns the seconds of the timestamp
 */
export function getTimeFromQuery(query: string) {
  //   H, M, S
  const x = query.split(/[^0-9.]/g)
  const times = x.map(Number)

  let time = 0
  time += times[0] * 3600
  time += times[1] * 60
  time += times[2]
  return time
}

/**
 * Returns a string of online streamers from a
 * array of string of the request streamers
 * @param streamers the array of streamers
 * @param cursor which 35 streamer chunk to fetch
 * @returns the streamers in that list that are online
 */
export async function followersStreaming(streamers: string[], cursor: number): Promise<string[]> {
  // do not make request if no followers
  if (streamers.length == 0) {
    return []
  }

  let res: string[] = []

  const payloadData = streamers.slice(cursor * 35, (cursor * 35) + 35)

  console.log(payloadData)
  const payload = {
    streamers: payloadData
  }

  await postEndpoint('api/users/isLive/bulk', payload).then((data: string[]) => {
    res = [...res, ...data]
  })

  return res
}

/**
 * Returns an array of FollowingStreamers
 * @param streamers the array of streamers
 * @param cursor which 35 streamer chunk to fetch
 * @returns the streamers in that list that are online
 */
export async function getParsedFollowing(
  streamers: string[],
  cursor: number
): Promise<FollowingStreamer[]> {
  // do not make request if no followers
  if (streamers.length == 0) {
    return []
  }

  let res: FollowingStreamer[] = []

  const payloadData = streamers.slice(cursor, cursor + 35)

  const payload = {
    streamers: payloadData
  }

  await postEndpoint('api/users/followingStreamer/bulk', payload).then(
    (data: FollowingStreamer[]) => {
      res = [...res, ...data]
    }
  )

  return res
}
