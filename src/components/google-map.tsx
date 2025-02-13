'use client'

import { useEffect, useState } from 'react'
import { GoogleMap as GoogleMapComponent, LoadScript, Marker } from '@react-google-maps/api'

interface GoogleMapProps {
  address: string
}

export function GoogleMap({ address }: GoogleMapProps) {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    const geocodeAddress = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
          )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        )
        const data = await response.json()

        if (data.results && data.results[0]) {
          const { lat, lng } = data.results[0].geometry.location
          setCoordinates({ lat, lng })
        }
      } catch (error) {
        console.error('Geocoding error:', error)
      }
    }

    geocodeAddress()
  }, [address])

  if (!coordinates) {
    return <div className="h-full bg-gray-100" />
  }

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
      <GoogleMapComponent
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={coordinates}
        zoom={16}
      >
        <Marker position={coordinates} />
      </GoogleMapComponent>
    </LoadScript>
  )
} 