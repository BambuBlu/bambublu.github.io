"use client"

import { useEffect, useState } from "react"
import { useAppContext } from "@/app/context/AppContext"
import { MousePointerClick, Move, Target, Trophy, AlertTriangle, Play } from "lucide-react"
import styles from "./gameview.module.css"
import { Crosshair } from "@/app/components/crosshair"

export function GameView() {
  const { t } = useAppContext();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const handleViewChange = (e: Event) => {
      if ((e as CustomEvent).detail !== "game") setIsPlaying(false);
    };
    window.addEventListener("changeView", handleViewChange);
    return () => window.removeEventListener("changeView", handleViewChange);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      window.dispatchEvent(new CustomEvent("setGameDifficulty", { detail: "hard" }));
      window.dispatchEvent(new CustomEvent("resetGame")); 
    }
    return () => { window.dispatchEvent(new CustomEvent("setGameDifficulty", { detail: "normal" })); };
  }, [isPlaying]);

  if (isPlaying) return null;

  return (
    <section className={styles.wrapper}>
      <Crosshair />
      <div className={styles.glass_container} data-ui>
        <div className={styles.scroll_content}>
          <div className={styles.content_inner}>
            <div className={styles.header}>
              <div className={styles.warning_badge}><AlertTriangle size={14} /> {t.game.badge}</div>
              <h2 className={styles.title}>{t.game.title}</h2>
              <p className={styles.subtitle}>{t.game.subtitle}</p>
            </div>

            <div className={styles.tutorial_grid}>
              <div className={styles.tutorial_card}>
                <div className={styles.icon_wrapper}><Move size={24} /></div>
                <div className={styles.card_text}><h3>{t.game.aim}</h3><p>{t.game.aimDesc}</p></div>
              </div>
              <div className={styles.tutorial_card}>
                <div className={styles.icon_wrapper}><MousePointerClick size={24} /></div>
                <div className={styles.card_text}><h3>{t.game.shoot}</h3><p>{t.game.shootDesc}</p></div>
              </div>
              <div className={styles.tutorial_card}>
                <div className={styles.icon_wrapper}><Target size={24} /></div>
                <div className={styles.card_text}><h3>{t.game.invasion}</h3><p>{t.game.invasionDesc}</p></div>
              </div>
              <div className={styles.tutorial_card}>
                <div className={styles.icon_wrapper}><Trophy size={24} /></div>
                <div className={styles.card_text}><h3>{t.game.record}</h3><p>{t.game.recordDesc}</p></div>
              </div>
            </div>

            <div className={styles.action_area}>
              <button aria-label="Start Mini Game" onClick={() => setIsPlaying(true)} className={styles.play_btn}>
                <Play fill="currentColor" size={20} /> {t.game.start}
              </button>
              <p className={styles.footer_note}>{t.game.exitNote}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}