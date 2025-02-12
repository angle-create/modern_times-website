'use client'

import { useMemo } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'

const STORE_LOCATION = {
  lat: 35.6614,  // 渋谷の緯度
  lng: 139.7047, // 渋谷の経度
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '400px',
}

const options = {
  disableDefaultUI: true,
  zoomControl: true,
}

export function StoreMap() {
  const center = useMemo(() => STORE_LOCATION, [])

  return (
    <div className="space-y-4">
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={16}
            options={options}
          >
            <Marker position={center} />
          </GoogleMap>
        </LoadScript>
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-brown-900">アクセス</h2>
        <ul className="text-gray-600 space-y-2">
          <li>• 渋谷駅から徒歩10分</li>
          <li>• 表参道駅から徒歩8分</li>
          <li>• 明治神宮前駅から徒歩5分</li>
        </ul>
      </div>
    </div>
  )
} 