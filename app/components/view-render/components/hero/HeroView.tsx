"use client"

import { useEffect, useState } from "react"
import { useAppContext } from "@/app/context/AppContext"
import { Atom, FileType, Zap, Database, Smartphone, Gamepad2, Palette, Users } from "lucide-react"
import styles from "./heroview.module.css"
import { Crosshair } from "@/app/components/crosshair"

export function HeroView() {
  const { t } = useAppContext();
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) return;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const changeView = (view: string) => {
    window.dispatchEvent(new CustomEvent("changeView", { detail: view }))
  }

  const techs = [
    { Icon: Atom, name: "React" }, { Icon: Zap, name: "Next.js" },
    { Icon: Palette, name: "UI Design" }, { Icon: Users, name: "UX" },
    { Icon: FileType, name: "TypeScript" }, { Icon: Database, name: "Data" },
    { Icon: Smartphone, name: "Mobile" }, { Icon: Gamepad2, name: "Game Dev" },
  ];

  return (
    <section className={styles.hero}>
      <Crosshair />
      <div className={styles.glow} style={{ left: `${mousePos.x * 100}%`, top: `${mousePos.y * 100}%` }} />
      <div className={styles.content}>
        <div className={styles.badge}>{t.hero.badge}</div>
        <h1 className={styles.title}>{t.hero.hi} <span className={styles.name}>Tobias</span></h1>
        <h2 className={styles.role}>Software Engineer <span className={styles.separator}>&</span> Game Developer</h2>
        <p className={styles.subtitle}>
          {t.hero.subtitle}
          <span className={styles.desktop_only}>{t.hero.desktopOnly}</span>
        </p>
        <div className={styles.actions}>
          <button aria-label="View Projects" data-ui onClick={() => changeView("projects")} className={styles.primary_btn}>{t.hero.viewWork}</button>
          <button aria-label="View Resumee" data-ui onClick={() => changeView("resumee")} className={styles.secondary_btn}>{t.hero.viewResume}</button>
        </div>
        <div className={styles.tech_stack}>
          {techs.map((tech, i) => (
            <div key={i} className={styles.tech_icon_wrapper} title={tech.name}>
              <tech.Icon size={20} strokeWidth={1.5} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}