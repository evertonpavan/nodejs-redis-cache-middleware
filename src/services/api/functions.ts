import axios from 'axios'
import { env } from '@/env'

async function getAllPeople() {
  const apiResponse = await axios.get(`${env.API_BASE_URL}/people`, {
    headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' },
    params: { trophies: true },
  })

  console.log('Requesting sent to the API')
  return apiResponse.data
}

export { getAllPeople }
