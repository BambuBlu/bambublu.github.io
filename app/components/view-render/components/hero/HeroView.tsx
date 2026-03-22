"use client"

import { useEffect, useState } from "react"
import { 
  Atom, FileType, Zap, 
  Database, Smartphone, Gamepad2, 
  Palette, Users
} from "lucide-react"
import styles from "./heroview.module.css"

export function HeroView() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const changeView = (view: string) => {
    window.dispatchEvent(new CustomEvent("changeView", { detail: view }))
  }

  const techs = [
    { Icon: Atom, name: "React" },
    { Icon: Zap, name: "Next.js" },
    { Icon: Palette, name: "UI Design" },
    { Icon: Users, name: "UX" },
    { Icon: FileType, name: "TypeScript" },
    { Icon: Database, name: "Data" },
    { Icon: Smartphone, name: "Mobile" },
    { Icon: Gamepad2, name: "Game Dev" },
  ];

  return (
    <section className={styles.hero}>
      <div 
        className={styles.glow} 
        style={{ 
          left: `${mousePos.x * 100}%`, 
          top: `${mousePos.y * 100}%` 
        }} 
      />
      
      <div className={styles.content}>
        <div className={styles.badge}>Available for new projects</div>
        
        <h1 className={styles.title}>
          Hi, I&lsquo;m <span className={styles.name}>Tobias</span>
        </h1>
        
        <h2 className={styles.role}>
          Software Engineer <span className={styles.separator}>&</span> Game Developer
        </h2>

        <p className={styles.subtitle}>
          Building digital universes through scalable code and immersive experiences. 
          <span className={styles.desktop_only}> Specialized in crafting functional, high-performance systems.</span>
        </p>

        <div className={styles.actions}>
          <button data-ui onClick={() => changeView("projects")} className={styles.primary_btn}>
            View My Work
          </button>
          <button data-ui onClick={() => changeView("resumee")} className={styles.secondary_btn}>
            View My Resume
          </button>
        </div>

        <div className={styles.tech_stack}>
          {techs.map((tech, index) => (
            <div key={index} className={styles.tech_icon_wrapper} title={tech.name}>
              <tech.Icon size={20} strokeWidth={1.5} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}