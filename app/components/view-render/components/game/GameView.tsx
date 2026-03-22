"use client"

import { useEffect, useState } from "react"
import { MousePointerClick, Move, Target, Trophy, AlertTriangle, Play } from "lucide-react"
import styles from "./gameview.module.css"

export function GameView() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const handleViewChange = (e: Event) => {
      const newView = (e as CustomEvent).detail;
      if (newView !== "game") {
        setIsPlaying(false);
      }
    };

    window.addEventListener("changeView", handleViewChange);
    return () => window.removeEventListener("changeView", handleViewChange);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      window.dispatchEvent(new CustomEvent("setGameDifficulty", { detail: "hard" }));
      window.dispatchEvent(new CustomEvent("resetGame")); 
    }

    return () => {
      window.dispatchEvent(new CustomEvent("setGameDifficulty", { detail: "normal" }));
    };
  }, [isPlaying]);

  if (isPlaying) return null;

  return (
    <section className={styles.wrapper}>
      <div className={styles.glass_container} data-ui>
        
        <div className={styles.content_inner}>
          
          <div className={styles.header}>
            <div className={styles.warning_badge}>
              <AlertTriangle size={14} /> Sistema Defensivo
            </div>
            <h2 className={styles.title}>Asteroid Defense</h2>
            <p className={styles.subtitle}>
              El campo de asteroides se ha vuelto inestable. ¡Sobrevive el mayor tiempo posible!
            </p>
          </div>

          {/* En desktop es un grid 2x2, en mobile es una lista apretada */}
          <div className={styles.tutorial_grid}>
            <div className={styles.tutorial_card}>
              <div className={styles.icon_wrapper}><Move size={24} /></div>
              <div className={styles.card_text}>
                <h3>Apuntar</h3>
                <p>Mueve el mouse o arrastra para dirigir tu nave.</p>
              </div>
            </div>
            
            <div className={styles.tutorial_card}>
              <div className={styles.icon_wrapper}><MousePointerClick size={24} /></div>
              <div className={styles.card_text}>
                <h3>Disparar</h3>
                <p>Haz clic izquierdo o tap rápido para destruir amenazas.</p>
              </div>
            </div>

            <div className={styles.tutorial_card}>
              <div className={styles.icon_wrapper}><Target size={24} /></div>
              <div className={styles.card_text}>
                <h3>Invasión</h3>
                <p>En este modo, los asteroides reaparecen en los bordes.</p>
              </div>
            </div>

            <div className={styles.tutorial_card}>
              <div className={styles.icon_wrapper}><Trophy size={24} /></div>
              <div className={styles.card_text}>
                <h3>Récord</h3>
                <p>Compite por el High Score guardado localmente.</p>
              </div>
            </div>
          </div>

          <div className={styles.action_area}>
            <button onClick={() => setIsPlaying(true)} className={styles.play_btn}>
              <Play fill="currentColor" size={20} />
              ¡INICIAR COMBATE!
            </button>
            <p className={styles.footer_note}>
              Navega a otra sección del menú inferior para salir.
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}