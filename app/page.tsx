import { BottomMenu, ViewRenderer, Header, ClientGameBackground } from "./components"

export default async function Home() {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return (
    <main>
      <ClientGameBackground />
      
      <Header />
      <ViewRenderer />
      <BottomMenu />
    </main>
  )
}