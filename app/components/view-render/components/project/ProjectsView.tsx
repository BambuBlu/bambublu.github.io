/* eslint-disable @next/next/no-img-element */
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ExternalLink, Github } from "lucide-react"
import styles from "./projectsview.module.css"

type Project = {
  id: number;
  title: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  image: string;
  tags: string[];
  links?: { github?: string; live?: string };
}

const projectsData: Project[] = [
  {
    id: 1,
    title: "The Green Escape",
    category: "Game Dev",
    shortDesc: "TGE es un juego de plataformas 2D con un diseño pixel art, desarrollado en Godot Engine.",
    fullDesc: "The Green Escape es un juego de plataformas 2D con un diseño pixel art, desarrollado en Godot Engine. El juego presenta mecánicas de plataformas, combate y puzzles.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
    tags: ["Godot Engine", "Pixel Art", "C#", "GDScript"],
    links: { github: "#", live: "#" }
  },
  {
    id: 2,
    title: "E-Commerce Tabaqueria",
    category: "Web App",
    shortDesc: "Plataforma de E-Commerce desarrollada con React, Tailwind y Firebase.",
    fullDesc: "Desarrollo completo de una plataforma de E-Commerce para una tabaquería, integrando React para el frontend, Tailwind CSS para el diseño responsive y Firebase para la gestión de base de datos y autenticación.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop",
    tags: ["React", "Tailwind", "Firebase", "E-Commerce"],
    links: { github: "#", live: "#" }
  },
  {
    id: 3,
    title: "BambuBlu - Chat Bot Whatsapp",
    category: "Bot / Backend",
    shortDesc: "Chatbot de WhatsApp automatizado con IA para agendamiento de turnos.",
    fullDesc: "BambuBlu es un chatbot inteligente para WhatsApp diseñado para automatizar el agendamiento de turnos médicos y consultas. Utiliza IA para procesar el lenguaje natural y se integra con calendarios.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop",
    tags: ["Node.js", "WhatsApp API", "AI", "Bot"],
    links: { github: "#" }
  },
  {
    id: 4,
    title: "Portfolio Interactivo",
    category: "Web App",
    shortDesc: "Portfolio personal con un entorno interactivo y diseño moderno.",
    fullDesc: "Este mismo portfolio. Construido con Next.js y React, presenta un entorno espacial interactivo en el fondo (canvas), navegación fluida mediante un Bottom Menu y diseño responsivo.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    tags: ["Next.js", "React", "Framer Motion", "Canvas"],
    links: { github: "#", live: "https://www.tobiasmoscatelli.com" }
  }
];

export function ProjectsView() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset' };
  }, [selectedProject]);

  return (
    <section className={styles.wrapper}>
      <div className={styles.center_wrapper}>
        <div className={styles.glass_container} data-ui>
          
          {/* NUEVO: Contenedor que maneja el scroll interno */}
          <div className={styles.scroll_content}>
            <div className={styles.header}>
              <h2 className={styles.title}>Mis Proyectos</h2>
              <p className={styles.subtitle}>Una selección de mis trabajos en desarrollo web, móvil y videojuegos.</p>
            </div>

            <div className={styles.bento_grid}>
              {projectsData.map((project, index) => {
                const isWide = index % 4 === 0 || index % 4 === 3;
                
                return (
                  <motion.div
                    key={project.id}
                    className={`${styles.card} ${isWide ? styles.wide : styles.narrow}`}
                    onClick={() => setSelectedProject(project)}
                    whileHover={{ y: -8, scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className={styles.card_image}>
                      <img src={project.image} alt={project.title} loading="lazy" />
                      <div className={styles.card_overlay}>
                        <span className={styles.category_pill}>{project.category}</span>
                      </div>
                    </div>
                    <div className={styles.card_content}>
                      <h3>{project.title}</h3>
                      <p>{project.shortDesc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <div className={styles.modal_backdrop} onClick={() => setSelectedProject(null)}>
            <motion.div 
              className={styles.modal_content}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <button className={styles.close_btn} onClick={() => setSelectedProject(null)}>
                <X size={20} />
              </button>

              <div className={styles.modal_image_container}>
                <img src={selectedProject.image} alt={selectedProject.title} />
              </div>
              
              <div className={styles.modal_info}>
                <span className={styles.modal_category}>{selectedProject.category}</span>
                <h2>{selectedProject.title}</h2>
                <p className={styles.modal_desc}>{selectedProject.fullDesc}</p>
                
                <div className={styles.modal_tags}>
                  {selectedProject.tags.map(tag => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>

                {selectedProject.links && (
                  <div className={styles.modal_actions}>
                    {selectedProject.links.github && (
                      <a href={selectedProject.links.github} target="_blank" rel="noreferrer" className={styles.action_btn}>
                        <Github size={16} /> Code
                      </a>
                    )}
                    {selectedProject.links.live && (
                      <a href={selectedProject.links.live} target="_blank" rel="noreferrer" className={`${styles.action_btn} ${styles.primary}`}>
                        <ExternalLink size={16} /> Live Demo
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}