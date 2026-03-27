import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
export const alt = 'Tobias Moscatelli - Software Engineer & Game Dev'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #050508, #111116)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          border: '12px solid #222',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
           <div style={{ fontSize: 80, color: '#4ade80', marginRight: 20 }}>{`>_`}</div>
        </div>

        <h1 style={{ fontSize: 72, fontWeight: 'bold', color: 'white', margin: 0, letterSpacing: '-2px' }}>
          Tobias Moscatelli
        </h1>
        
        <h2 style={{ fontSize: 36, color: '#788cff', marginTop: 20, fontWeight: 'normal' }}>
          Software Engineer & Game Developer
        </h2>

        <div style={{ 
          display: 'flex', 
          marginTop: 40, 
          padding: '10px 20px', 
          background: 'rgba(74, 222, 128, 0.1)', 
          border: '2px solid rgba(74, 222, 128, 0.4)',
          borderRadius: '99px',
          color: '#4ade80',
          fontSize: 24,
          fontWeight: 'bold',
          letterSpacing: '2px'
        }}>
          SYSTEM_ONLINE
        </div>
      </div>
    ),
    { ...size }
  )
}