/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import styles from "./bottommenu.module.css"
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react"
import { useAppContext } from "@/app/context/AppContext";

import { 
  BriefcaseBusiness, Home, NotebookPen, 
  SquareUser, Github, Linkedin,
  Volume2, VolumeX, Pause, Play, 
  Gamepad2, Code
} from "lucide-react"

export function BottomMenu() {
  const { lang, toggleLanguage, t, trackMuteToggle, unlockAchievement } = useAppContext();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0); 
  const [isMuted, setIsMuted] = useState(true);
  const [isIdle, setIsIdle] = useState(false);
  const [currentView, setCurrentView] = useState("home"); 
  const [isTransitioning, setIsTransitioning] = useState(false); 

  const isHardcoreRef = useRef(false);
  const isMatrixRef = useRef(false);
  const isBossActiveRef = useRef(false); 

  const items = [
    { id: "home", label: t.nav.home, icon: <Home size={22} strokeWidth={2} /> },
    { id: "projects", label: t.nav.projects, icon: <BriefcaseBusiness size={22} strokeWidth={2} /> },
    { id: "resumee", label: t.nav.resume, icon: <SquareUser size={22} strokeWidth={2} /> },
    { id: "game", label: t.nav.game, icon: <Gamepad2 size={22} strokeWidth={2} /> },
    { id: "blog", label: t.nav.blog, icon: <NotebookPen size={22} strokeWidth={2} /> },
    { id: "github", label: "GitHub", icon: <Github size={22} strokeWidth={2} />, url: "https://github.com/BambuBlu" },
    { id: "linkedin", label: "LinkedIn", icon: <Linkedin size={22} strokeWidth={2} />, url: "https://www.linkedin.com/in/tobiasmoscatelli" },
  ];

  useEffect(() => {
    const handleGlobalViewChange = (e: Event) => {
      const newView = (e as CustomEvent).detail;
      setCurrentView(newView);
    };
    window.addEventListener("changeView", handleGlobalViewChange);
    return () => window.removeEventListener("changeView", handleGlobalViewChange);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("portfolio_highscore");
    if (saved) setHighScore(parseInt(saved));

    const audio = new Audio("/audio/bg-music.mp3");
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    const handleScoreUpdate = (e: Event) => {
      const newScore = (e as CustomEvent).detail;
      setScore(newScore);
      if (newScore > 0) unlockAchievement('first_blood');
      setHighScore((prev) => {
        if (newScore > prev) {
          localStorage.setItem("portfolio_highscore", newScore.toString());
          return newScore;
        }
        return prev;
      });
    };

    window.addEventListener("updateGameScore", handleScoreUpdate);
    return () => {
      window.removeEventListener("updateGameScore", handleScoreUpdate);
      audio.pause();
    };
  }, [unlockAchievement]);

  useEffect(() => {
    const updateAudioTrack = (forcePlay = false) => {
      if (!audioRef.current) return;
      let targetTrack = "/audio/bg-music.mp3";
      
      if (isBossActiveRef.current) targetTrack = "/audio/boss-theme.mp3"; 
      else if (isMatrixRef.current && isHardcoreRef.current) targetTrack = "/audio/matrix-arcade.mp3";
      else if (isMatrixRef.current && !isHardcoreRef.current) targetTrack = "/audio/matrix-bg.mp3";
      else if (!isMatrixRef.current && isHardcoreRef.current) targetTrack = "/audio/arcade-music.mp3";

      if (!audioRef.current.src.endsWith(targetTrack)) audioRef.current.src = targetTrack;
      if (forcePlay) audioRef.current.play().catch(() => {});
      else if (!isMuted) audioRef.current.play().catch(() => {});
    };

    const handleDifficultyChange = (e: Event) => { isHardcoreRef.current = (e as CustomEvent).detail === "hard"; updateAudioTrack(); };
    const handleMatrixToggle = () => {
      isMatrixRef.current = !isMatrixRef.current;
      if (isMatrixRef.current) { setIsMuted(false); window.dispatchEvent(new CustomEvent("toggleMute", { detail: false })); updateAudioTrack(true); }
      else updateAudioTrack();
    };

    const handleBossSpawn = () => {
      isBossActiveRef.current = true;
      setIsMuted(false); 
      window.dispatchEvent(new CustomEvent("toggleMute", { detail: false }));
      updateAudioTrack(true);
    };

    const handleBossDefeated = () => { isBossActiveRef.current = false; updateAudioTrack(); };

    window.addEventListener("setGameDifficulty", handleDifficultyChange);
    window.addEventListener("toggleMatrixMode", handleMatrixToggle);
    window.addEventListener("spawnKonamiBoss", handleBossSpawn);
    window.addEventListener("bossDefeated", handleBossDefeated);
    
    return () => {
      window.removeEventListener("setGameDifficulty", handleDifficultyChange);
      window.removeEventListener("toggleMatrixMode", handleMatrixToggle);
      window.removeEventListener("spawnKonamiBoss", handleBossSpawn);
      window.removeEventListener("bossDefeated", handleBossDefeated);
    };
  }, [isMuted]);

  const toggleMute = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    if (audioRef.current) { newState ? audioRef.current.pause() : audioRef.current.play().catch(() => {}); }
    window.dispatchEvent(new CustomEvent("toggleMute", { detail: newState }));
    trackMuteToggle();
  };

  const toggleIdle = () => {
    const newState = !isIdle;
    setIsIdle(newState);
    window.dispatchEvent(new CustomEvent("toggleIdle", { detail: newState }));
  };

  const router = useRouter();

  const handleItemClick = (item: any) => {
    if (isTransitioning) return;

    if (item.url) {
      window.open(item.url, '_blank');
    } else if (item.id === "blog") {
      unlockAchievement('reader');
      router.push('/blog');
    } else {
      if (item.id === currentView) return;
      setIsTransitioning(true);

      window.dispatchEvent(new CustomEvent("warpSpeed"));

      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("canvasFadeOut"));
        setTimeout(() => {
          setCurrentView(item.id);
          window.dispatchEvent(new CustomEvent("changeView", { detail: item.id }));
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent("canvasFadeIn"));
            setIsTransitioning(false);
          }, 50);
        }, 300); 
      }, 400);
    }
  };

  return (
    <div className={styles["bottom-menu"]}>
      <div className={styles["mobile-label"]}>{items.find(i => i.id === currentView)?.label}</div>
      <div className={styles["controls"]}>
        <button aria-label="Download Template" data-ui onClick={() => window.open("https://github.com/BambuBlu/bambublu.github.io", "_blank")} className={styles["control-btn"]} style={{ color: "#f5f5f5" }} title={lang === 'es' ? 'Descargar Plantilla (GitHub)' : 'Download Template (GitHub)'}>
          <Code size={16} />
        </button>
        <button aria-label="Change language" data-ui onClick={toggleLanguage} className={styles["control-btn"]} style={{ color: "#788cff" }}>
          <span style={{ fontSize: '9px', fontWeight: '800' }}>{lang === 'es' ? 'EN' : 'ES'}</span>
        </button>
        <button aria-label="Change volume" data-ui onClick={toggleMute} className={styles["control-btn"]} style={{ color: isMuted ? "#ff4b4b" : "#4ade80" }}>
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <button aria-label="Pause Mini Game" data-ui onClick={toggleIdle} className={styles["control-btn"]} style={{ color: isIdle ? "#f39c12" : "#fff" }}>
          {isIdle ? <Play size={16} /> : <Pause size={16} />}
        </button>
      </div>
      <div className={styles["score"]}>
        {score} <span style={{ opacity: 0.5, fontSize: '10px', marginLeft: '6px' }} suppressHydrationWarning>HI: {highScore}</span>
      </div>
      {items.map((item) => (
        <button 
          aria-label="Menu Button" key={item.id} data-ui onClick={() => handleItemClick(item)}
          className={`${styles["menu-item"]} ${currentView === item.id ? styles.active : ""}`} rel="noopener noreferrer"
        >
          <span className={styles["tooltip"]}>{item.label}</span>
          <span className={styles["icon-wrapper"]}>{item.icon}</span>
          {!item.url && <div className={styles["active-pill"]} />}
        </button>
      ))}
    </div>
  );
}