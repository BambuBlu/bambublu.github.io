"use client"

import { BottomMenu, ViewRenderer, Header, GameBackground } from "./components"

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