import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios'

interface RequestData {
  url: string
  params?: Record<string, string>
  data?: any
  headers?: Record<string, string>
}

async function getRequest({ url, params, headers }: RequestData): Promise<any> {
  try {
    const config: AxiosRequestConfig = {
      params,
      headers,
    }
    const response: AxiosResponse = await axios.get(url, config)
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const axiosError: AxiosError = error
      console.error(
        'Error:',
        axiosError.response?.status,
        axiosError.response?.data,
      )
    } else {
      console.error('Error:', error.message)
    }
    throw error
  }
}

async function postRequest({ url, data, headers }: RequestData): Promise<any> {
  try {
    const config: AxiosRequestConfig = { headers }
    const response: AxiosResponse = await axios.post(url, data, config)
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const axiosError: AxiosError = error
      console.error(
        'Error:',
        axiosError.response?.status,
        axiosError.response?.data,
      )
    } else {
      console.error('Error:', error.message)
    }
    throw error
  }
}

export { getRequest, postRequest }
