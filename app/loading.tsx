/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import styles from './loading.module.css'
import { Crosshair } from './components/crosshair'

const translations = {
  en: {
    title: "LOADING",
    desc: "Initializing quantum engines and establishing secure connection...",
  },
  es: {
    title: "CARGANDO",
    desc: "Inicializando motores cuánticos y estableciendo conexión segura...",
  }
};

export default function Loading() {
  const [lang, setLang] = useState<"en" | "es">("en");
  const [mounted, setMounted] = useState(false);

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

  const t = mounted ? translations[lang] : translations.en;

  return (
    <main className={styles.wrapper}>
      <Crosshair />
      
      <div className={styles.glass_container}>
        {/* Ícono giratorio */}
        <div className={styles.spinner_wrapper}>
          <Loader2 size={48} strokeWidth={2} className={styles.spinner} />
        </div>
        
        <h1 className={styles.title}>
          {t.title}
        </h1>
        
        <div className={styles.progress_bar}>
          <div className={styles.progress_fill}></div>
        </div>
        
        <p className={styles.subtitle}>
          {t.desc}
        </p>
      </div>
    </main>
  )
}