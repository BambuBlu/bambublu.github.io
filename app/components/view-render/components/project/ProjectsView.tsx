/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ExternalLink, Github } from "lucide-react"
import { useAppContext } from "@/app/context/AppContext"
import styles from "./projectsview.module.css"

export function ProjectsView() {
  const { t, lang } = useAppContext();
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const projectsData = [
    { id: 1, image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop", tags: ["Godot Engine", "Pixel Art", "C#", "GDScript"], links: { github: "#", live: "#" } },
    { id: 2, image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop", tags: ["React", "Tailwind", "Firebase", "E-Commerce"], links: { github: "#", live: "#" } },
    { id: 3, image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop", tags: ["Node.js", "WhatsApp API", "AI", "Bot"], links: { github: "#" } },
    { id: 4, image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop", tags: ["Next.js", "React", "Framer Motion", "Canvas"], links: { github: "#", live: "https://www.tobiasmoscatelli.com" } }
  ];

  const mergedProjects = t.projects.items.map((item: any) => ({
    ...item,
    ...projectsData.find(d => d.id === item.id)
  }));

  return (
    <section className={styles.wrapper}>
      <div className={styles.center_wrapper}>
        <div className={styles.glass_container} data-ui>
          <div className={styles.scroll_content}>
            <div className={styles.header}>
              <h2 className={styles.title}>{t.projects.title}</h2>
              <p className={styles.subtitle}>{t.projects.subtitle}</p>
            </div>
            <div className={styles.bento_grid}>
              {mergedProjects.map((project: any, index: number) => (
                <motion.div
                  key={project.id}
                  className={`${styles.card} ${ (index % 4 === 0 || index % 4 === 3) ? styles.wide : styles.narrow}`}
                  onClick={() => setSelectedProject(project)}
                  whileHover={{ y: -8, scale: 0.98 }}
                >
                  <div className={styles.card_image}>
                    <img src={project.image} alt={project.title} loading="lazy" />
                    <div className={styles.card_overlay}><span className={styles.category_pill}>{project.category}</span></div>
                  </div>
                  <div className={styles.card_content}><h3>{project.title}</h3><p>{project.shortDesc}</p></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <div className={styles.modal_backdrop} onClick={() => setSelectedProject(null)}>
            <motion.div className={styles.modal_content} onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <button className={styles.close_btn} onClick={() => setSelectedProject(null)}><X size={20} /></button>
              <div className={styles.modal_image_container}><img src={selectedProject.image} alt={selectedProject.title} /></div>
              <div className={styles.modal_info}>
                <span className={styles.modal_category}>{selectedProject.category}</span>
                <h2>{selectedProject.title}</h2>
                <p className={styles.modal_desc}>{selectedProject.fullDesc}</p>
                <div className={styles.modal_tags}>{selectedProject.tags.map((tag: string) => <span key={tag}>{tag}</span>)}</div>
                <div className={styles.modal_actions}>
                  {selectedProject.links?.github && <a href={selectedProject.links.github} target="_blank" rel="noreferrer" className={styles.action_btn}><Github size={16} /> {t.projects.code}</a>}
                  {selectedProject.links?.live && <a href={selectedProject.links.live} target="_blank" rel="noreferrer" className={`${styles.action_btn} ${styles.primary}`}><ExternalLink size={16} /> {t.projects.live}</a>}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}