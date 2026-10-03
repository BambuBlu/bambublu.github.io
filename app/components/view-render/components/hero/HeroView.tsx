"use client"

import { useEffect, useState } from "react"
import { useAppContext } from "@/app/context/AppContext"
import { Atom, Smartphone, Server, Database, Cloud, Layers, FileCode, Code2 } from "lucide-react"
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
    { Icon: Smartphone, name: "Mobile (Flutter & RN)" },
    { Icon: Atom, name: "React & Next.js" },
    { Icon: Server, name: "Backend & APIs" },
    { Icon: Database, name: "Data & Firebase" },
    { Icon: Layers, name: "Architecture" },
    { Icon: Cloud, name: "AWS & DevOps" },
    { Icon: FileCode, name: "TypeScript" },
    { Icon: Code2, name: "Kotlin" },
  ];

  return (
    <section className={styles.hero}>
      <Crosshair />
      <div className={styles.glow} style={{ left: `${mousePos.x * 100}%`, top: `${mousePos.y * 100}%` }} />
      <div className={styles.content}>
        <div className={styles.scroll_content} >
          <div className={styles.badge}>{t.hero.badge}</div>
          <h1 className={styles.title}>{t.hero.hi} <span className={styles.name}>Tobias</span></h1>
          <h2 className={styles.role}>Mobile <span className={styles.separator}>&</span> Full Stack Developer</h2>
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
      </div>
    </section>
  )
}