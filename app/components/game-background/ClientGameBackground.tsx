"use client"
import dynamic from 'next/dynamic'

const DynamicGame = dynamic(
  () => import('./GameBackground').then(mod => mod.GameBackground), 
  { 
    ssr: false, 
    loading: () => (
      <div 
        style={{ 
          position: 'fixed', 
          inset: 0,
          background: '#090A0F', 
          zIndex: -1 
        }} 
      />
    ) 
  }
)

export function ClientGameBackground() {
  return <DynamicGame />
}