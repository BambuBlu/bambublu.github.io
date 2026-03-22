"use client"

import { useEffect, useState } from "react"
import { HeroView, ResumeeView, ProjectsView, GameView } from "./components"
import styles from "./viewrender.module.css" 

export function ViewRenderer() {
  const [view, setView] = useState("home")

  useEffect(() => {
    const handleViewChange = (e: Event) => setView((e as CustomEvent).detail)
    window.addEventListener("changeView", handleViewChange)
    return () => window.removeEventListener("changeView", handleViewChange)
  }, [])

  return (
    <div className={styles.container}>
      
      <div className={`${styles.view} ${view === "home" ? styles.active : ""}`}>
        <HeroView />
      </div>

      <div className={`${styles.view} ${view === "projects" ? styles.active : ""}`}>
        <ProjectsView />
      </div>

      <div className={`${styles.view} ${view === "game" ? styles.active : ""}`}>
        <GameView />
      </div>

      <div className={`${styles.view} ${view === "resumee" ? styles.active : ""}`}>
        <ResumeeView />
      </div>

    </div>
  )
}