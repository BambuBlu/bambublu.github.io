/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useEffect, useState } from 'react'
import { AlertOctagon, RotateCcw, Terminal, Globe } from 'lucide-react'
import styles from './notfound.module.css'
import { Crosshair } from './components/crosshair'

const translations = {
  en: {
    title: "CRITICAL",
    badge: "KERNEL PANIC",
    desc: "The ship's core systems have suffered an unexpected failure. We recommend purging memory and rebooting.",
    btn: "Reboot System",
    toggle: "ES"
  },
  es: {
    title: "CRÍTICO",
    badge: "KERNEL PANIC", 
    desc: "Los sistemas centrales de la nave han sufrido un fallo inesperado. Recomendamos purgar la memoria y reiniciar.",
    btn: "Reiniciar Sistema",
    toggle: "EN"
  }
};

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [lang, setLang] = useState<"en" | "es">("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.error("Fallo crítico del sistema interceptado:", error);
  }, [error]);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('portfolio_lang');
    
    if (savedLang === 'es' || savedLang === 'en') {
      setLang(savedLang);
    } else {
      const browserLang = navigator.language.startsWith('es') ? 'es' : 'en';
      setLang(browserLang);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = lang === "en" ? "es" : "en";
    setLang(newLang);
    localStorage.setItem('portfolio_lang', newLang);
    
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: newLang }));
  };

  const t = translations[lang];

  if (!mounted) return null;

  return (
    <main className={styles.wrapper}>
      <Crosshair />
      
      <div className={styles.glass_container}>
        <button onClick={toggleLanguage} className={styles.lang_toggle} aria-label="Toggle Language">
          <Globe size={16} /> {t.toggle}
        </button>

        <div className={styles.icon_wrapper}>
          <Terminal size={56} strokeWidth={1.5} />
        </div>
        
        <h1 className={styles.title} style={{ fontSize: 'clamp(3rem, min(10vw, 10vh), 6rem)' }}>
          {t.title}
        </h1>
        
        <div className={styles.badge}>
          <AlertOctagon size={14} /> {t.badge}
        </div>
        
        <p className={styles.subtitle}>
          {t.desc}
        </p>
        
        <button onClick={() => reset()} className={styles.primary_btn}>
          <RotateCcw size={20} /> {t.btn}
        </button>
      </div>
    </main>
  )
}