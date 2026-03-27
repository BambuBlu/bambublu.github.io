/* eslint-disable @typescript-eslint/no-unused-vars */
"use client" 

import { AlertOctagon, RotateCcw, Terminal } from 'lucide-react'
import styles from './notfound.module.css'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body>
        <main className={styles.wrapper}>
          <div className={styles.glass_container}>
            <div className={styles.icon_wrapper}>
              <Terminal size={56} strokeWidth={1.5} />
            </div>
            <h1 className={styles.title} style={{ fontSize: 'clamp(3rem, 10vw, 6rem)' }}>
              FATAL
            </h1>
            <div className={styles.badge}>
              <AlertOctagon size={14} /> GLOBAL KERNEL PANIC
            </div>
            <p className={styles.subtitle}>
              El fallo ha sido tan grave que ha corrompido el soporte vital de la nave. 
            </p>
            <button onClick={() => reset()} className={styles.primary_btn}>
              <RotateCcw size={20} /> Forzar Reinicio Total
            </button>
          </div>
        </main>
      </body>
    </html>
  )
}