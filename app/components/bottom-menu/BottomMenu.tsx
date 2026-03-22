"use client"

import styles from "./bottommenu.module.css"
import { useEffect, useState, useRef } from "react"
import { 
  BriefcaseBusiness, Home, NotebookPen, 
  SquareUser, Github, Linkedin,
  Volume2, VolumeX, Pause, Play, 
  Gamepad2
} from "lucide-react"

const items = [
  { id: "home", label: "Home", icon: <Home size={22} strokeWidth={2} /> },
  { id: "projects", label: "Projects", icon: <BriefcaseBusiness size={22} strokeWidth={2} /> },
  { id: "resumee", label: "Resumee", icon: <SquareUser size={22} strokeWidth={2} /> },
  { id: "game", label: "Mini Game!", icon: <Gamepad2 size={22} strokeWidth={2} /> },
  { id: "blog", label: "Blog", icon: <NotebookPen size={22} strokeWidth={2} /> },
  { id: "github", label: "GitHub", icon: <Github size={22} strokeWidth={2} />, url: "https://github.com/BambuBlu" },
  { id: "linkedin", label: "LinkedIn", icon: <Linkedin size={22} strokeWidth={2} />, url: "https://www.linkedin.com/in/tobiasmoscatelli" },
];

export function BottomMenu() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0); 
  const [isMuted, setIsMuted] = useState(true);
  const [isIdle, setIsIdle] = useState(false);
  const [currentView, setCurrentView] = useState("home"); 

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
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHighScore(parseInt(saved));
    }

    const audio = new Audio("/audio/bg-music.mp3");
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    const handleScoreUpdate = (e: Event) => {
      const newScore = (e as CustomEvent).detail;
      setScore(newScore);
      
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
  }, []);

  const toggleMute = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    if (audioRef.current) {
      if (newState) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
    }
    window.dispatchEvent(new CustomEvent("toggleMute", { detail: newState }));
  };

  const toggleIdle = () => {
    const newState = !isIdle;
    setIsIdle(newState);
    window.dispatchEvent(new CustomEvent("toggleIdle", { detail: newState }));
  };

  const handleItemClick = (item: typeof items[0]) => {
    if (item.url) {
      window.open(item.url, '_blank');
    } else {
      if (item.id === currentView) return;
      setCurrentView(item.id);
      window.dispatchEvent(new CustomEvent("changeView", { detail: item.id }));
    }
  };

  return (
    <div className={styles["bottom-menu"]}>
      <div className={styles["mobile-label"]}>
        {items.find(i => i.id === currentView)?.label}
      </div>

      <div className={styles["controls"]}>
        <button data-ui onClick={toggleMute} className={styles["control-btn"]} style={{ color: isMuted ? "#ff4b4b" : "#4ade80" }}>
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <button data-ui onClick={toggleIdle} className={styles["control-btn"]} style={{ color: isIdle ? "#f39c12" : "#fff" }}>
          {isIdle ? <Play size={16} /> : <Pause size={16} />}
        </button>
      </div>
      
      <div className={styles["score"]}>
        {score} 
        <span style={{ opacity: 0.5, fontSize: '10px', marginLeft: '6px' }} suppressHydrationWarning>
          HI: {highScore}
        </span>
      </div>

      {items.map((item) => (
        <button 
          key={item.id}
          data-ui
          onClick={() => handleItemClick(item)}
          className={`${styles["menu-item"]} ${currentView === item.id ? styles.active : ""}`}
        >
          <span className={styles["tooltip"]}>{item.label}</span>
          <span className={styles["icon-wrapper"]}>{item.icon}</span>
          {!item.url && <div className={styles["active-pill"]} />}
        </button>
      ))}
    </div>
  );
}