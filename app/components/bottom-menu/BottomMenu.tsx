/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import styles from "./bottommenu.module.css"
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react"
import { useAppContext } from "@/app/context/AppContext";

import { 
  BriefcaseBusiness, Home, NotebookPen, 
  SquareUser, Github, Linkedin,
  Volume2, VolumeX, Pause, Play, 
  Gamepad2, Code
} from "lucide-react"

const TARGET_VOL = 0.3;
const FADE_STEP = 0.05;
const FADE_SPEED = 40;

export function BottomMenu() {
  const { lang, toggleLanguage, t, trackMuteToggle, unlockAchievement } = useAppContext();
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null); 
  
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

  const performFadeIn = useCallback((audio: HTMLAudioElement) => {
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    audio.play().catch(() => {});
    
    fadeIntervalRef.current = setInterval(() => {
      if (audio.volume < TARGET_VOL - 0.01) {
        audio.volume = Math.min(TARGET_VOL, audio.volume + FADE_STEP);
      } else {
        audio.volume = TARGET_VOL;
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      }
    }, FADE_SPEED);
  }, []);

  const performFadeOutAndSwitch = useCallback((audio: HTMLAudioElement, newSrc: string, shouldPlay: boolean) => {
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    
    if (audio.paused || audio.volume === 0) {
      audio.src = newSrc;
      audio.load();
      audio.volume = 0;
      if (shouldPlay) performFadeIn(audio);
      return;
    }

    fadeIntervalRef.current = setInterval(() => {
      if (audio.volume > 0.01) {
        audio.volume = Math.max(0, audio.volume - FADE_STEP);
      } else {
        audio.volume = 0;
        audio.pause();
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        
        audio.src = newSrc;
        audio.load();
        if (shouldPlay) performFadeIn(audio);
      }
    }, FADE_SPEED);
  }, [performFadeIn]);


  const updateAudioTrack = useCallback((forcePlay = false, bypassMute = false) => {
    if (!audioRef.current) return;
    
    let targetTrack = "/audio/bg-music.mp3";
    
    if (isBossActiveRef.current) targetTrack = "/audio/boss-theme.mp3"; 
    else if (isMatrixRef.current && isHardcoreRef.current) targetTrack = "/audio/matrix-arcade.mp3";
    else if (isMatrixRef.current && !isHardcoreRef.current) targetTrack = "/audio/matrix-bg.mp3";
    else if (!isMatrixRef.current && isHardcoreRef.current) targetTrack = "/audio/arcade-music.mp3";

    const audio = audioRef.current;
    const currentSrc = new URL(audio.src, window.location.origin).pathname;
    const shouldPlay = forcePlay || (!isMuted && !bypassMute);

    if (currentSrc !== targetTrack) {
        performFadeOutAndSwitch(audio, targetTrack, shouldPlay);
    } else {
        if (shouldPlay && audio.paused) {
            performFadeIn(audio);
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMuted, performFadeOutAndSwitch, performFadeIn]);

  useEffect(() => {
    const handleGlobalViewChange = (e: Event) => setCurrentView((e as CustomEvent).detail);
    window.addEventListener("changeView", handleGlobalViewChange);
    
    const saved = localStorage.getItem("portfolio_highscore");
    if (saved) setHighScore(parseInt(saved));

    if (!audioRef.current) {
        const audio = new Audio("/audio/bg-music.mp3");
        audio.loop = true;
        audio.volume = 0; 
        audioRef.current = audio;
    }

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
      window.removeEventListener("changeView", handleGlobalViewChange);
      window.removeEventListener("updateGameScore", handleScoreUpdate);
    };
  }, [unlockAchievement]);

  useEffect(() => {
    const handleDifficultyChange = (e: Event) => { 
        isHardcoreRef.current = (e as CustomEvent).detail === "hard"; 
        updateAudioTrack(); 
    };
    
    const handleMatrixToggle = () => {
      isMatrixRef.current = !isMatrixRef.current;
      if (isMatrixRef.current) { 
          setIsMuted(false); 
          window.dispatchEvent(new CustomEvent("toggleMute", { detail: false })); 
          updateAudioTrack(true); 
      }
      else updateAudioTrack();
    };

    const handleBossSpawn = () => {
      isBossActiveRef.current = true;
      setIsMuted(false); 
      window.dispatchEvent(new CustomEvent("toggleMute", { detail: false }));
      updateAudioTrack(true);
    };

    const handleBossDefeated = () => { 
        isBossActiveRef.current = false; 
        updateAudioTrack(); 
    };

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
  }, [updateAudioTrack]);

  const toggleMute = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    
    if (audioRef.current) {
        const audio = audioRef.current;
        if (newState) {
            if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = setInterval(() => {
              if (audio.volume > 0.01) {
                audio.volume = Math.max(0, audio.volume - FADE_STEP);
              } else {
                audio.volume = 0;
                audio.pause();
                if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
              }
            }, FADE_SPEED);
        } else {
            updateAudioTrack(true);
        }
    }
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