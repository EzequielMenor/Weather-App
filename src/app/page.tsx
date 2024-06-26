/** @format  */
'use client'

import { useQuery } from 'react-query'
import Navbar from '../components/Navbar'
import axios from 'axios'
import { parseISO, format } from 'date-fns'
import Container from '@/components/container'
import { convertKelvinToCelsius } from '@/utils/convertKelvinToCelsius'

interface WeatherDetail {
  dt: number
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    sea_level: number
    grnd_level: number
    humidity: number
    temp_kf: number
  }
  weather: {
    id: number
    main: string
    description: string
    icon: string
  }[]
  clouds: {
    all: number
  }
  wind: {
    speed: number
    deg: number
    gust: number
  }
  visibility: number
  pop: number
  sys: {
    pod: string
  }
  dt_txt: string
}

interface WeatherData {
  cod: string
  message: number
  cnt: number
  list: WeatherDetail[]
  city: {
    id: number
    name: string
    coord: {
      lat: number
      lon: number
    }
    country: string
    population: number
    timezone: number
    sunrise: number
    sunset: number
  }
}

export default function Home() {
  const { isLoading, error, data } = useQuery<WeatherData>('repoData', async () => {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=gandia&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
    )
    return data
  })

  const firstData = data?.list[0]

  console.log('data', data)

  if (isLoading)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loading...</p>
      </div>
    )

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar location={data?.city.name} />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {/* today data */}
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="flex gap-1 text-2xl items-end">
              <p>{format(parseISO(firstData?.dt_txt ?? ''), 'EEEE')}</p>
              <p className="text-lg">
                ({format(parseISO(firstData?.dt_txt ?? ''), 'dd.MM.yy')})
              </p>
            </h2>
            <Container className="gap-10 px6 items-center">
              {/* Temperature */}
              <div className="flex flex-col px-4">
                <span className="text-5xl">
                  {convertKelvinToCelsius(firstData?.main.temp ?? 298.68)}°
                </span>
                <div className="text-xs space-x-1 whitespace-nowrap">
                  <span>Feels like</span>
                  <span>{convertKelvinToCelsius(firstData?.main.feels_like ?? 0)}°</span>
                  <p className="text-xs space-x-2">
                    <span>
                      {convertKelvinToCelsius(firstData?.main.temp_min ?? 0)}°⭣{' '}
                    </span>
                    <span>
                      {' '}
                      {convertKelvinToCelsius(firstData?.main.temp_max ?? 0)}°⭡
                    </span>
                  </p>
                </div>
              </div>
              {/* Time and weather icon */}
              <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                {data?.list.map((d, i) => (
                  <div
                    key={i}
                    className="flex flex-col justify-between gap-2 items-center text-sm font-semibold"
                  ></div>
                ))}
              </div>
            </Container>
          </div>
        </section>

        {/* 7 day forcast */}
        <section></section>
      </main>
    </div>
  )
}
