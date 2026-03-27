/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, Terminal, Rocket, Globe } from 'lucide-react'
import styles from './not-found.module.css'
import { Crosshair } from './components/crosshair' 

const translations = {
  en: {
    badge: "SYSTEM ERROR",
    desc: "The space sector you are looking for has been devoured by a black hole or simply never existed.",
    btn: "Return to Base",
    toggle: "ES"
  },
  es: {
    badge: "ERROR DE SISTEMA",
    desc: "El sector espacial que buscas ha sido devorado por un agujero negro o simplemente nunca existió.",
    btn: "Volver a la Base",
    toggle: "EN"
  }
};

export default function NotFound() {
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
        
        <h1 className={styles.title}>404</h1>
        
        <div className={styles.badge}>
          <AlertTriangle size={14} /> {t.badge}
        </div>
        
        <p className={styles.subtitle}>
          {t.desc}
        </p>
        
        <Link href="/" className={styles.primary_btn} data-ui>
          <Rocket size={20} /> {t.btn}
        </Link>
      </div>
    </main>
  )
}