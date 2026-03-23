/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X, ExternalLink, Github, BookOpen } from "lucide-react"
import { useAppContext } from "@/app/context/AppContext"
import styles from "./projectsview.module.css"
import ImageWithSkeleton from "@/app/components/skeleton/ImageWithSkeleton";

export function ProjectsView() {
  const { t, lang, unlockAchievement } = useAppContext();
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  const viewedProjects = useRef(new Set<number>());

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const projectsData = [
    { id: 1, image: "/img/passManagerApp.jpeg", tags: ["Android", "Kotlin", "Security", "Mobile"], links: { blog: "/blog/password-manager-app", github: "https://github.com/BambuBlu" } },
    { id: 2, image: "/img/spaceXApi.jpg", tags: ["React Native", "API", "Mobile", "SpaceX"], links: { blog: "/blog/spacex-launch-tracker", github: "https://github.com/BambuBlu/spacex-launch-tracker-app" } },
    { id: 3, image: "/img/portfolio1.png", tags: ["Godot Engine", "Game Dev", "Mobile", "Roguelite"], links: { live: "https://play.google.com/store/apps/details?id=com.battlecats.survivors" } },
    { id: 4, image: "/img/portfolio2.jpg", tags: ["Android", "Prank App", "Mobile"], links: { live: "https://play.google.com/store/apps/details?id=com.fingerscanner.sexyhotnessscan" } },
    { id: 5, image: "/img/portfolio3.jpg", tags: ["Idle Game", "Mobile", "Game Dev"], links: { live: "https://play.google.com/store/apps/details?id=com.guntapgames.machinegunclicker" } }
  ];

  const mergedProjects = t.projects.items.map((item: any) => ({
    ...item,
    ...projectsData.find(d => d.id === item.id)
  }));

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.style.overflow = selectedProject ? 'hidden' : 'auto';
    }
  }, [selectedProject]);

  return (
    <>
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
                    onClick={() => {
                      setSelectedProject(project);
                      viewedProjects.current.add(project.id);
                      if (viewedProjects.current.size === 3) {
                        unlockAchievement('curious');
                      }
                    }}
                    whileHover={{ y: -8, scale: 0.98 }}
                  >
                    <div className={styles.card_image}>
                      <ImageWithSkeleton 
                        src={project.image} 
                        alt={project.title} 
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        style={{ objectFit: "cover" }}
                        priority={index < 4}
                        borderRadius="inherit"
                      />
                      <div className={styles.card_overlay}><span className={styles.category_pill}>{project.category}</span></div>
                    </div>
                    <div className={styles.card_content}><h3>{project.title}</h3><p>{project.shortDesc}</p></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {mounted && createPortal(
        <AnimatePresence>
          {selectedProject && (
            <div 
              className={styles.modal_backdrop} 
              onPointerDown={(e) => e.stopPropagation()}
               onTouchStart={(e) => e.stopPropagation()}
            >
              <motion.div 
                className={styles.modal_content} 
                onPointerDown={(e) => e.stopPropagation()}
               onTouchStart={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
              >
                <button aria-label="Close" className={styles.close_btn} onClick={() => setSelectedProject(null)}>
                  <X size={20} />
                </button>
                
                <div className={styles.modal_image_container}>
                  <ImageWithSkeleton 
                    src={selectedProject.image} 
                    alt={selectedProject.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 700px"
                    style={{ objectFit: "cover", borderTopLeftRadius: "24px", borderTopRightRadius: "24px" }}
                    borderRadius="24px 24px 0 0"
                  />
                  <div className={styles.modal_image_gradient}></div>
                </div>

                <div className={styles.modal_info}>
                  <span className={styles.modal_category}>{selectedProject.category}</span>
                  <h2>{selectedProject.title}</h2>
                  <p className={styles.modal_desc}>{selectedProject.fullDesc}</p>
                  
                  <div className={styles.modal_tags}>
                    {selectedProject.tags?.map((tag: string) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  
                  <div className={styles.modal_actions}>
                    {selectedProject.links?.github && (
                      <a href={selectedProject.links.github} target="_blank" rel="noreferrer" className={styles.action_btn}>
                        <Github size={18} /> {t.projects.code}
                      </a>
                    )}
                    {selectedProject.links?.blog && (
                      <a href={selectedProject.links.blog} className={`${styles.action_btn} ${styles.secondary}`}>
                        <BookOpen size={18} /> {t.projects.blog}
                      </a>
                    )}
                    {selectedProject.links?.live && (
                      <a href={selectedProject.links.live} target="_blank" rel="noreferrer" className={`${styles.action_btn} ${styles.primary}`}>
                        <ExternalLink size={18} /> {t.projects.live}
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}