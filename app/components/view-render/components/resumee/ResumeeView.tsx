/* eslint-disable @next/next/no-img-element */
"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Download } from "lucide-react"
import styles from "./resumeeview.module.css"
import { useAppContext } from "@/app/context/AppContext"
import enResume from "./en-data.json"
import esResume from "./es-data.json"

import { ResumeData } from "./resume"

const resumeData: Record<"en" | "es", ResumeData> = {
  en: enResume,
  es: esResume
}

export function ResumeeView() {
  const [lang, setLang] = useState<"en" | "es">("en")
  const { unlockAchievement } = useAppContext()
  const t = resumeData[lang]

  const changeLang = (e: React.MouseEvent, selectedLang: "en" | "es") => {
    e.stopPropagation();
    setLang(selectedLang);
  }

  const clickCount = useRef(0);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);

  const handleSecretClick = () => {
    clickCount.current += 1;
    
    if (clickTimer.current) clearTimeout(clickTimer.current);
    if (clickCount.current >= 5) {
      unlockAchievement('stalker');
      clickCount.current = 0;
    } else {
      clickTimer.current = setTimeout(() => {
        clickCount.current = 0;
      }, 1500);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.cv_frame}>
        
        <div className={styles.paper_controls}>
          <div className={styles.lang_group}>
            <button 
              aria-label="Change language"
              data-ui
              type="button"
              onClick={(e) => changeLang(e, "es")} 
              className={`${styles.lang_btn} ${lang === "es" ? styles.active_lang : ""}`}
              title="Español"
            >
              <img src="svg/flag-ar.svg" alt="ES" width={24} height={18} />
            </button>
            <button 
              aria-label="Change language"
              data-ui
              type="button"
              onClick={(e) => changeLang(e, "en")} 
              className={`${styles.lang_btn} ${lang === "en" ? styles.active_lang : ""}`}
              title="English"
            >
              <img src="svg/flag-us.svg" alt="EN" width={24} height={18} />
            </button>
          </div>

          <a aria-label="Resume Download Button" data-ui href={`/docs/TobiasMoscatelliCV_${lang}.pdf`} download className={styles.download_btn}>
            <Download size={14} /> <span>{t.download}</span>
          </a>
        </div>

        <div className={styles.scroll_container} data-ui>
          <div className={styles.paper}>
            
            <header className={styles.header}>
              <div className={styles.header_content}>
                <div className={styles.profile_image_container} onClick={handleSecretClick} style={{ cursor: 'pointer' }}>
                  <Image 
                    src="/img/pro.jpg" 
                    alt="Tobias Moscatelli" 
                    fill 
                    style={{ objectFit: "cover" }}
                    sizes="120px"
                    priority
                  />
                </div>
                <div className={styles.header_info}>
                  <h1 className={styles.name}>{t.header.name}</h1>
                  <p className={styles.location}>{t.header.location}</p>
                  <p className={styles.contact}>{t.header.contact}</p>
                  <a
                    href={t.header.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.website}
                  >
                    {t.header.website.replace("https://", "")}
                  </a>
                </div>
              </div>
            </header>

            <section className={styles.section}>
              <h2 className={styles.section_title}>{t.sections.summary.title}</h2>
              <p className={styles.summary_text}>{t.sections.summary.text}</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.section_title}>{t.sections.skills.title}</h2>
              <ul className={styles.skills_list}>
                {t.sections.skills.items.map((item, i) => (
                  <li key={i}>
                    <strong>{item.label}:</strong> {item.value}
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.section_title}>{t.sections.experience.title}</h2>
              {t.sections.experience.roles.map((role, i) => (
                <div key={i} className={styles.role_entry}>
                  <div className={styles.role_header}>
                    <h3 className={styles.role_title}>
                      <span className={styles.company}>{role.company}</span> <span className={styles.role_dash}>-</span> {role.title} {role.location}
                    </h3>
                    <span className={styles.role_period}>{role.period}</span>
                  </div>
                  <ul className={styles.bullet_list}>
                    {role.points.map((point, j) => (
                      <li key={j}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>

            <section className={styles.section}>
              <h2 className={styles.section_title}>{t.sections.education.title}</h2>
              {t.sections.education.items.map((item, i) => (
                <div key={i} className={styles.education_entry}>
                  <div className={styles.role_header}>
                    <h3 className={styles.institution}>{item.institution}</h3>
                    {item.period && <span className={styles.role_period}>{item.period}</span>}
                  </div>
                  <p className={styles.degree}>{item.degree}</p>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}