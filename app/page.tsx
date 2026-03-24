import dynamic from 'next/dynamic'
import { BottomMenu, ViewRenderer, Header } from "./components"

const GameBackground = dynamic(() => import('./components').then(mod => mod.GameBackground), { ssr: false, })

export default function Home() {
  return (
    <main>
      <GameBackground />
      <Header />
      <ViewRenderer />
      <BottomMenu />
    </main>
  )
}