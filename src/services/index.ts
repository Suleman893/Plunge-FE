//Third Party Imports
import axios from 'axios'

//Configuration Imports
import { envConfig } from '@configs/envConfig'

const BASE_URL = envConfig.COUNTRY_STATE_API_URL
const API_KEY = envConfig.COUNTRY_STATE_API_KEY

export const fetchStatesByCountry = async (countryCode: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/countries/${countryCode}/states`, {
      headers: {
        'X-CSCAPI-KEY': API_KEY
      }
    })

    return response.data
  } catch (error) {
    return []
  }
}
