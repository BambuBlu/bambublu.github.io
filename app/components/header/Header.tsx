"use client"

import { useEffect, useRef } from "react"
import styles from "./header.module.css"

export function Header() {
  const logoRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!logoRef.current) return;
      const val = Math.abs(e.clientX - window.innerWidth / 2) / window.innerWidth;
      const intensity = 0.3 + val * 0.7;
      logoRef.current.style.textShadow = `0 0 ${20 * intensity}px rgba(180,200,255,${intensity})`;
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <header className={styles.header}>
      <h1 
        ref={logoRef} 
        id="hero-logo" 
        className={styles.logo}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        fetchpriority="high"
      >
        Tobías Moscatelli
      </h1>
    </header>
  )
}