"use client"
import dynamic from 'next/dynamic'

const DynamicGame = dynamic(
  () => import('./GameBackground').then(mod => mod.GameBackground), 
  { ssr: false, loading: () => <div style={{ background: '#090A0F', height: '100vh' }} /> }
)

export function ClientGameBackground() { return <DynamicGame /> }