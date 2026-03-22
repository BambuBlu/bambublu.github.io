/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import styles from "./resumeeview.module.css"

const resumeData = {
  en: {
    download: "Download PDF",
    header: {
      name: "Tobias Q. Moscatelli",
      location: "Buenos Aires, Argentina",
      contact: "moscatellitobias@gmail.com | +54 9 3484 20-5897 | Portfolio"
    },
    sections: {
      summary: {
        title: "Professional Summary",
        text: "Motivated and adaptable Junior Mobile Developer specializing in building cross-platform mobile apps with React Native and Kotlin. Strong foundation in modern development practices, user-centered design, and scalable mobile architectures. Experienced in remote collaboration, tech education, and fast-paced team environments."
      },
      skills: {
        title: "Technical Skills",
        items: [
          { label: "Languages", value: "JavaScript, TypeScript, Kotlin, C#, SQL, HTML/CSS" },
          { label: "Frameworks/Tools", value: "React Native, Angular, Android Studio, Git/GitHub/GitLab, Supabase, Room, SQLite" },
          { label: "Design & UX", value: "Figma, User-centered Design, Wireframing" },
          { label: "APIs & Data", value: "REST APIs, GraphQL" },
          { label: "Practices", value: "Agile/Scrum, Prototyping, Technical Documentation" }
        ]
      },
      experience: {
        title: "Professional Experience",
        roles: [
          {
            title: "Junior Mobile Developer",
            company: "Lightvessel",
            location: "(Remote)",
            period: "Jan 2022 - Mar 2025",
            points: [
              "Built and maintained core mobile interfaces in React Native and Kotlin.",
              "Integrated RESTful APIs and managed local data using SQLite and Supabase.",
              "Participated in performance tuning and cross-functional meetings.",
              "Applied UX principles to refine app navigation and user interaction.",
              "Collaborated on asset integration and design adaptation in production pipelines."
            ]
          },
          {
            title: "Professor, Game Development Diploma",
            company: "Universidad Nacional de Quilmes",
            location: "(Remote)",
            period: "Feb 2025 - Present",
            points: [
              "Designed and delivered curriculum for programming and game design.",
              "Managed content, virtual classrooms, and practical projects using Godot.",
              "Coordinated multi-subject consistency and team collaboration across the program."
            ]
          }
        ]
      },
      education: {
        title: "Education",
        items: [
          {
            degree: "Higher Technician in Programming (C#, C++, ASP.NET, OOP)",
            institution: "Universidad Tecnológica Nacional"
          },
          {
            degree: "Course - Design of interactive systems from a user-centered approach",
            institution: "Escuela de Ciencias Informáticas",
            period: "2022-2024"
          }
        ]
      },
      references: {
        title: "References",
        text: "Laboral - Ariel Alvarez Co-Founder/Technical Director +34 653 231 770 ariel@lightvessel.org"
      }
    }
  },
  es: {
    download: "Descargar PDF",
    header: {
      name: "Tobias Q. Moscatelli",
      location: "Buenos Aires, Argentina",
      contact: "moscatellitobias@gmail.com | +54 9 3484 20-5897 | Portfolio"
    },
    sections: {
      summary: {
        title: "Resumen Profesional",
        text: "Desarrollador Mobile Junior motivado y adaptable, especializado en la construcción de aplicaciones móviles multiplataforma con React Native y Kotlin. Sólida base en prácticas modernas de desarrollo, diseño centrado en el usuario y arquitecturas móviles escalables. Experiencia en colaboración remota, educación tecnológica y entornos de equipo dinámicos."
      },
      skills: {
        title: "Habilidades Técnicas",
        items: [
          { label: "Lenguajes", value: "JavaScript, TypeScript, Kotlin, C#, SQL, HTML/CSS" },
          { label: "Frameworks/Herramientas", value: "React Native, Angular, Android Studio, Git/GitHub/GitLab, Supabase, Room, SQLite" },
          { label: "Diseño y UX", value: "Figma, Diseño centrado en el usuario, Wireframing" },
          { label: "APIs y Datos", value: "REST APIs, GraphQL" },
          { label: "Prácticas", value: "Agile/Scrum, Prototipado, Documentación Técnica" }
        ]
      },
      experience: {
        title: "Experiencia Profesional",
        roles: [
          {
            title: "Desarrollador Mobile Junior",
            company: "Lightvessel",
            location: "(Remoto)",
            period: "Ene 2022 - Mar 2025",
            points: [
              "Construcción y mantenimiento de interfaces móviles core en React Native y Kotlin.",
              "Integración de APIs RESTful y gestión de datos locales usando SQLite y Supabase.",
              "Participación en optimización de rendimiento y reuniones interfuncionales.",
              "Aplicación de principios de UX para refinar la navegación de la app y la interacción del usuario.",
              "Colaboración en la integración de activos y adaptación de diseño en pipelines de producción."
            ]
          },
          {
            title: "Profesor, Diplomatura en Desarrollo de Videojuegos",
            company: "Universidad Nacional de Quilmes",
            location: "(Remoto)",
            period: "Feb 2025 - Presente",
            points: [
              "Diseño y dictado de currícula para programación y diseño de juegos.",
              "Gestión de contenido, aulas virtuales y proyectos prácticos usando Godot.",
              "Coordinación de consistencia multi-materia y colaboración de equipo a través del programa."
            ]
          }
        ]
      },
      education: {
        title: "Educación",
        items: [
          {
            degree: "Tecnicatura Superior en Programación (C#, C++, ASP.NET, OOP)",
            institution: "Universidad Tecnológica Nacional"
          },
          {
            degree: "Curso - Diseño de sistemas interactivos desde un enfoque centrado en el usuario",
            institution: "Escuela de Ciencias Informáticas",
            period: "2022-2024"
          }
        ]
      },
      references: {
        title: "Referencias",
        text: "Laboral - Ariel Alvarez Co-Founder/Technical Director +34 653 231 770 ariel@lightvessel.org"
      }
    }
  }
}

export function ResumeeView() {
  const [lang, setLang] = useState<"en" | "es">("en")
  const t = resumeData[lang]

  const changeLang = (e: React.MouseEvent, selectedLang: "en" | "es") => {
    e.stopPropagation();
    setLang(selectedLang);
  }

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
              <h1 className={styles.name}>{t.header.name}</h1>
              <p className={styles.location}>{t.header.location}</p>
              <p className={styles.contact}>{t.header.contact}</p>
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

            <section className={styles.section}>
              <h2 className={styles.section_title}>{t.sections.references.title}</h2>
              <p className={styles.reference_text}>{t.sections.references.text}</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}