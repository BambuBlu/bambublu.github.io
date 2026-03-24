"use client"

import { useEffect, useState } from "react"
import { HeroView } from "./components/hero/HeroView" 
import dynamic from "next/dynamic"
import styles from "./viewrender.module.css" 

const ProjectsView = dynamic(() => import('./components/project/ProjectsView').then(mod => mod.ProjectsView), { ssr: false })
const GameView = dynamic(() => import('./components/game/GameView').then(mod => mod.GameView), { ssr: false })
const ResumeeView = dynamic(() => import('./components/resumee/ResumeeView').then(mod => mod.ResumeeView), { ssr: false })

export function ViewRenderer() {
  const [view, setView] = useState("home")

  useEffect(() => {
    const handleViewChange = (e: Event) => setView((e as CustomEvent).detail)
    window.addEventListener("changeView", handleViewChange)
    return () => window.removeEventListener("changeView", handleViewChange)
  }, [])

  return (
    <div className={styles.container}>
      {view === "home" && (
        <div className={`${styles.view} ${styles.active}`}>
          <HeroView />
        </div>
      )}

      {view === "projects" && (
        <div className={`${styles.view} ${styles.active}`}>
          <ProjectsView />
        </div>
      )}

      {view === "game" && (
        <div className={`${styles.view} ${styles.active}`}>
          <GameView />
        </div>
      )}

      {view === "resumee" && (
        <div className={`${styles.view} ${styles.active}`}>
          <ResumeeView />
        </div>
      )}
    </div>
  )
}