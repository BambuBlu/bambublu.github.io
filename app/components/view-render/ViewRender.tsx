"use client"

import { useEffect, useState } from "react"
import { HeroView } from "./components"
import dynamic from "next/dynamic"
import styles from "./viewrender.module.css" 

const ProjectsView = dynamic(() => import('./components').then(mod => mod.ProjectsView))
const GameView = dynamic(() => import('./components').then(mod => mod.GameView))
const ResumeeView = dynamic(() => import('./components').then(mod => mod.ResumeeView))

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