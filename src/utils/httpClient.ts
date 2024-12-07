import axios from 'axios'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const getData = async <T>(url: string): Promise<T> => {
  await delay(1000)

  const { data } = await axios.get<T>(url)

  if (!data) {
    throw new Error("Can't get data from the server")
  }

  if (Array.isArray(data) && !data.length) {
    throw new Error("Can't get data from the server")
  }

  return data
}

export const client = axios.create({
  baseURL: 'api',
})
