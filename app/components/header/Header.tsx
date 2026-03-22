"use client"

import { useEffect } from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"
import styles from "./header.module.css"

export function Header() {
  const intensity = useMotionValue(0)

  const textShadow = useTransform(
    intensity,
    (val: number) => `0 0 ${20 * val}px rgba(180,200,255,${val})`
  )

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const val = Math.abs(e.clientX - window.innerWidth / 2) / window.innerWidth
      intensity.set(0.3 + val * 0.7)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [intensity])

  return (
    <header className={styles.header}>
      <motion.h1 className={styles.logo} style={{ textShadow }}>
        Tobías Moscatelli
      </motion.h1>
    </header>
  )
}