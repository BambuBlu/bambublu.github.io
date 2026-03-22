"use client"
import React, { createContext, useContext, useState } from 'react';

const translations = {
  es: {
    nav: { home: "Inicio", projects: "Proyectos", resume: "CV", game: "Mini Juego!", blog: "Blog" },
    hero: {
      badge: "Disponible para nuevos proyectos",
      hi: "Hola, soy",
      subtitle: "Construyendo universos digitales a través de código escalable y experiencias inmersivas.",
      desktopOnly: " Especializado en crear sistemas funcionales de alto rendimiento.",
      viewWork: "Ver mis trabajos",
      viewResume: "Ver mi CV"
    },
    game: {
      badge: "Sistema Defensivo",
      title: "Asteroid Defense",
      subtitle: "El campo de asteroides se ha vuelto inestable. ¡Sobrevive el mayor tiempo posible!",
      aim: "Apuntar",
      aimDesc: "Mueve el mouse o arrastra para dirigir tu nave.",
      shoot: "Disparar",
      shootDesc: "Haz clic izquierdo o tap rápido para destruir amenazas.",
      invasion: "Invasión",
      invasionDesc: "En este modo, los asteroides reaparecen en los bordes.",
      record: "Récord",
      recordDesc: "Compite por el High Score guardado localmente.",
      start: "¡INICIAR COMBATE!",
      exitNote: "Navega a otra sección del menú inferior para salir."
    },
    projects: {
      title: "Mis Proyectos",
      subtitle: "Una selección de mis trabajos en desarrollo web, móvil y videojuegos.",
      code: "Código",
      live: "Demo en vivo",
      items: [
        { id: 1, title: "The Green Escape", category: "Game Dev", shortDesc: "TGE es un juego de plataformas 2D con un diseño pixel art, desarrollado en Godot Engine.", fullDesc: "The Green Escape es un juego de plataformas 2D con un diseño pixel art, desarrollado en Godot Engine. El juego presenta mecánicas de plataformas, combate y puzzles." },
        { id: 2, title: "E-Commerce Tabaquería", category: "Web App", shortDesc: "Plataforma de E-Commerce desarrollada con React, Tailwind y Firebase.", fullDesc: "Desarrollo completo de una plataforma de E-Commerce para una tabaquería, integrando React para el frontend, Tailwind CSS para el diseño responsive y Firebase para la gestión de base de datos y autenticación." },
        { id: 3, title: "BambuBlu - Bot Whatsapp", category: "Bot / Backend", shortDesc: "Chatbot de WhatsApp automatizado con IA para agendamiento de turnos.", fullDesc: "BambuBlu es un chatbot inteligente para WhatsApp diseñado para automatizar el agendamiento de turnos médicos y consultas. Utiliza IA para procesar el lenguaje natural." },
        { id: 4, title: "Portfolio Interactivo", category: "Web App", shortDesc: "Portfolio personal con un entorno interactivo y diseño moderno.", fullDesc: "Este mismo portfolio. Construido con Next.js y React, presenta un entorno espacial interactivo en el fondo (canvas) y navegación fluida." }
      ]
    },
    blog: {
      back: "Volver a la Terminal",
      title: "Bitácora de Desarrollo",
      subtitle: "Artículos, tutoriales y reflexiones sobre programación y desarrollo de videojuegos.",
      readMore: "Leer artículo",
      empty: "No hay artículos publicados todavía.",
      crumbTerm: "Terminal",
      crumbBlog: "Blog",
      crumbArt: "Artículo"
    }
  },
  en: {
    nav: { home: "Home", projects: "Projects", resume: "Resume", game: "Mini Game!", blog: "Blog" },
    hero: {
      badge: "Available for new projects",
      hi: "Hi, I'm",
      subtitle: "Building digital universes through scalable code and immersive experiences.",
      desktopOnly: " Specialized in crafting functional, high-performance systems.",
      viewWork: "View My Work",
      viewResume: "View My Resume"
    },
    game: {
      badge: "Defense System",
      title: "Asteroid Defense",
      subtitle: "The asteroid field has become unstable. Survive as long as possible!",
      aim: "Aiming",
      aimDesc: "Move mouse or drag to steer your ship.",
      shoot: "Shooting",
      shootDesc: "Left click or quick tap to destroy threats.",
      invasion: "Invasion",
      invasionDesc: "In this mode, asteroids wrap around screen edges.",
      record: "Record",
      recordDesc: "Compete for the local High Score.",
      start: "START COMBAT!",
      exitNote: "Navigate to another section in the menu to exit."
    },
    projects: {
      title: "My Projects",
      subtitle: "A selection of my work in web, mobile, and game development.",
      code: "Code",
      live: "Live Demo",
      items: [
        { id: 1, title: "The Green Escape", category: "Game Dev", shortDesc: "TGE is a 2D platformer with pixel art design, developed in Godot Engine.", fullDesc: "The Green Escape is a 2D platformer with pixel art design, developed in Godot Engine. Features platforming mechanics, combat, and puzzles." },
        { id: 2, title: "E-Commerce Smoke Shop", category: "Web App", shortDesc: "E-Commerce platform developed with React, Tailwind, and Firebase.", fullDesc: "Full development of an E-Commerce platform, integrating React for the frontend, Tailwind CSS for responsive design, and Firebase for database management." },
        { id: 3, title: "BambuBlu - Whatsapp Bot", category: "Bot / Backend", shortDesc: "Automated WhatsApp chatbot with AI for appointment scheduling.", fullDesc: "BambuBlu is an intelligent WhatsApp chatbot designed to automate medical and consultation scheduling using AI for natural language processing." },
        { id: 4, title: "Interactive Portfolio", category: "Web App", shortDesc: "Personal portfolio with an interactive environment and modern design.", fullDesc: "This very portfolio. Built with Next.js and React, featuring an interactive space environment in the background (canvas)." }
      ]
    },
    blog: {
      back: "Back to Terminal",
      title: "Development Log",
      subtitle: "Articles, tutorials, and thoughts on programming and game development.",
      readMore: "Read article",
      empty: "No articles published yet.",
      crumbTerm: "Terminal",
      crumbBlog: "Blog",
      crumbArt: "Article"
    }
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppContext = createContext<any>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<'es' | 'en'>('en');

  const toggleLanguage = () => setLang(prev => prev === 'es' ? 'en' : 'es');


  const t = translations[lang];

  return (
    <AppContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);