"use client"
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { HackerTerminal } from '../components';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, Lock, ShoppingCart, Rocket, Cpu, CheckCircle2 } from 'lucide-react';
import styles from './appcontext.module.css';
import { es } from './locales/es';
import { en } from './locales/en';

const translations = { es, en };

const ALL_ACHIEVEMENTS = ['first_blood', 'curious', 'stalker', 'konami', 'polyglot', 'dj', 'reader'] as const;
type AchievementId = typeof ALL_ACHIEVEMENTS[number];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppContext = createContext<any>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<'es' | 'en'>('en');
  const [unlockedAchievements, setUnlockedAchievements] = useState<AchievementId[]>([]);
  const [activeToast, setActiveToast] = useState<{ id: string, title: string, desc: string } | null>(null);
  
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false); 
  
  const [isTouchDevice, setIsTouchDevice] = useState(false); 
  const [currentScore, setCurrentScore] = useState(0);
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);

  const langToggles = useRef(0);
  const muteToggles = useRef(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.matchMedia("(pointer: coarse)").matches;
      setIsTouchDevice(isTouch);
    }
  }, []);

  useEffect(() => {
    const savedAch = localStorage.getItem('portfolio_achievements');
    if (savedAch) setUnlockedAchievements(JSON.parse(savedAch));
    
    const savedShop = localStorage.getItem('portfolio_shop');
    if (savedShop) setPurchasedItems(JSON.parse(savedShop));
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.style.overflow = (isPanelOpen || isShopOpen) ? 'hidden' : 'auto';
    }
  }, [isPanelOpen, isShopOpen]);

  useEffect(() => {
    const handleScore = (e: Event) => setCurrentScore((e as CustomEvent).detail);
    window.addEventListener('updateGameScore', handleScore);
    return () => window.removeEventListener('updateGameScore', handleScore);
  }, []);

  useEffect(() => {
    const handleItemPurchased = (e: Event) => {
        const item = (e as CustomEvent).detail;
        setPurchasedItems(prev => {
            if (prev.includes(item)) return prev;
            const newItems = [...prev, item];
            localStorage.setItem('portfolio_shop', JSON.stringify(newItems));
            return newItems;
        });
    };
    window.addEventListener('itemPurchased', handleItemPurchased);
    return () => window.removeEventListener('itemPurchased', handleItemPurchased);
  }, []);

  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          unlockAchievement('konami');
          window.dispatchEvent(new CustomEvent('spawnKonamiBoss'));
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const t = translations[lang];

  const unlockAchievement = (id: AchievementId) => {
    setUnlockedAchievements(prev => {
      if (prev.includes(id)) return prev; 
      const newAchievements = [...prev, id];
      localStorage.setItem('portfolio_achievements', JSON.stringify(newAchievements));
      const achievementData = (t.achievements as unknown as Record<string, { title: string, desc: string }>)[id];
      setActiveToast({ id, title: achievementData.title, desc: achievementData.desc });
      setTimeout(() => setActiveToast(null), 4000);
      try {
        const audio = new Audio('/audio/achievement.mp3');
        audio.volume = 0.6;
        audio.play().catch(() => {});
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {}
      return newAchievements;
    });
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'es' ? 'en' : 'es');
    langToggles.current += 1;
    if (langToggles.current === 3) unlockAchievement('polyglot');
  };

  const trackMuteToggle = () => {
    muteToggles.current += 1;
    if (muteToggles.current === 3) unlockAchievement('dj');
  };

  const stopHoverPropagation = (node: HTMLElement | null) => {
    if (node) {
      if (!isTouchDevice) {
        node.onpointermove = (e) => e.stopPropagation();
        node.onmousemove = (e) => e.stopPropagation();
      } else {
        node.onpointermove = null;
        node.onmousemove = null;
      }
    }
  };

  const handleBuy = (id: string, cost: number) => {
      window.dispatchEvent(new CustomEvent('purchaseItem', { detail: { item: id, cost }}));
  };

  const shopItems = [
      { id: 'classic', cost: 100, icon: <Rocket size={24} color="#fcd34d" />, name: t.shop.items.classic.name, desc: t.shop.items.classic.desc },
      { id: 'drone', cost: 500, icon: <Cpu size={24} color="#fcd34d" />, name: t.shop.items.drone.name, desc: t.shop.items.drone.desc }
  ];

  return (
    <AppContext.Provider value={{ lang, toggleLanguage, t, unlockAchievement, trackMuteToggle, unlockedAchievements }}>
      {children}
      
      <button 
        ref={stopHoverPropagation}
        data-ui="true"
        className={`${styles.trophy_btn} ${unlockedAchievements.length > 0 ? styles.trophy_btn_active : styles.trophy_btn_inactive}`}
        onClick={() => setIsPanelOpen(true)}
        onTouchStart={(e) => e.stopPropagation()}
        title="Achievements"
      >
        <Trophy size={20} />
      </button>

      <button 
        ref={stopHoverPropagation}
        data-ui="true"
        className={styles.shop_btn}
        onClick={() => setIsShopOpen(true)}
        onTouchStart={(e) => e.stopPropagation()}
        title="Hangar"
      >
        <ShoppingCart size={20} />
      </button>

      <AnimatePresence>
        {isPanelOpen && (
          <>
            <motion.div ref={stopHoverPropagation} data-ui="true" className={styles.panel_backdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPanelOpen(false)} onTouchStart={(e) => e.stopPropagation()} />
            <motion.div ref={stopHoverPropagation} data-ui="true" className={styles.panel_content} initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} onTouchStart={(e) => e.stopPropagation()} >
              <div className={styles.panel_header}>
                <h3 className={styles.panel_title}><Trophy color="#f39c12" /> {t.achievements.panelTitle} ({unlockedAchievements.length}/{ALL_ACHIEVEMENTS.length})</h3>
                <button className={styles.close_btn} onClick={() => setIsPanelOpen(false)} onTouchStart={(e) => e.stopPropagation()} style={{ padding: '10px', margin: '-10px' }} ><X size={24} /></button>
              </div>
              <div className={styles.achievements_list}>
                {ALL_ACHIEVEMENTS.map(id => {
                  const isUnlocked = unlockedAchievements.includes(id);
                  const data = (t.achievements as unknown as Record<string, { title: string, desc: string }>)[id];
                  return (
                    <div key={id} className={`${styles.achievement_card} ${isUnlocked ? styles.card_unlocked : styles.card_locked}`}>
                      <div className={isUnlocked ? styles.icon_unlocked : styles.icon_locked}>{isUnlocked ? <Trophy size={20} /> : <Lock size={20} />}</div>
                      <div className={styles.card_info}>
                        <p className={isUnlocked ? styles.title_unlocked : styles.title_locked}>{isUnlocked ? data.title : t.achievements.locked}</p>
                        <p>{isUnlocked ? data.desc : t.achievements.lockedDesc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isShopOpen && (
          <>
            <motion.div ref={stopHoverPropagation} data-ui="true" className={styles.panel_backdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsShopOpen(false)} onTouchStart={(e) => e.stopPropagation()} />
            <motion.div ref={stopHoverPropagation} data-ui="true" className={styles.panel_content} style={{ left: 0, borderRight: '1px solid rgba(255, 255, 255, 0.1)', borderLeft: 'none' }} initial={{ x: '-100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '-100%', opacity: 0 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} onTouchStart={(e) => e.stopPropagation()} >
              <div className={styles.panel_header}>
                <h3 className={styles.panel_title} style={{ color: '#fcd34d' }}><ShoppingCart color="#fcd34d" /> {t.shop.title}</h3>
                <button className={styles.close_btn} onClick={() => setIsShopOpen(false)} onTouchStart={(e) => e.stopPropagation()} style={{ padding: '10px', margin: '-10px' }} ><X size={24} /></button>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '-10px', marginBottom: '20px' }}>{t.shop.desc}</p>
              
              <div style={{ background: 'rgba(252, 211, 77, 0.1)', padding: '12px', borderRadius: '8px', marginBottom: '20px', border: '1px solid rgba(252, 211, 77, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#fcd34d', fontWeight: 'bold' }}>{t.shop.score}</span>
                  <span style={{ color: 'white', fontSize: '1.2rem', fontWeight: '900' }}>{currentScore} pts</span>
              </div>

              <div className={styles.achievements_list}>
                {shopItems.map(item => {
                  const isBought = purchasedItems.includes(item.id);
                  const canAfford = currentScore >= item.cost;
                  return (
                    <div key={item.id} className={styles.shop_item}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                          {item.icon}
                          <div className={styles.shop_item_info}>
                              <p>{item.name}</p>
                              <p>{item.desc}</p>
                          </div>
                      </div>
                      <div>
                          {isBought ? (
                              <span className={styles.equipped_badge}><CheckCircle2 size={16} /> {t.shop.equipped}</span>
                          ) : (
                              <button 
                                className={styles.buy_btn} 
                                onClick={() => handleBuy(item.id, item.cost)}
                                disabled={!canAfford}
                                title={canAfford ? t.shop.buy : t.shop.insufficient}
                              >
                                {item.cost} pts
                              </button>
                          )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeToast && (
          <motion.div ref={stopHoverPropagation} data-ui="true" className={styles.toast_container} initial={{ opacity: 0, x: 50, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 20, scale: 0.9 }} onTouchStart={(e) => e.stopPropagation()} >
            <div className={styles.toast_icon}><Trophy size={24} color="#f39c12" /></div>
            <div>
              <p className={styles.toast_label}>{t.achievements.unlocked}</p>
              <p className={styles.toast_title}>{activeToast.title}</p>
              <p className={styles.toast_desc}>{activeToast.desc}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <HackerTerminal />
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);