import { BottomMenu, ViewRenderer, Header, ClientGameBackground } from "./components"

export default function Home() {
  return (
    <main>
      <ClientGameBackground />
      
      <Header />
      <ViewRenderer />
      <BottomMenu />
    </main>
  )
}