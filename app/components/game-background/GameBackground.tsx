"use client"

import { useEffect, useRef, useState, memo } from "react" 
import styles from "./gamebackground.module.css"

type Star = { x: number; y: number; size: number }
type Twinkle = { x: number; y: number; size: number; alpha: number; speed: number }
type RainDrop = { x: number; y: number; speed: number; length: number }
type Splash = { x: number; y: number; radius: number; alpha: number }
type Galaxy = { x: number; y: number; radius: number; canvas: HTMLCanvasElement }
type ShootingStar = { x: number; y: number; vx: number; vy: number; life: number }
type Bullet = { x: number; y: number; vx: number; vy: number; life: number; isDrone?: boolean }
type Asteroid = { x: number; y: number; vx: number; vy: number; size: number; type: 'normal' | 'golden' }
type Particle = { x: number; y: number; vx: number; vy: number; life: number; color?: string }
type Boss = { x: number; y: number; vx: number; vy: number; hp: number; maxHp: number; type: 'normal' | 'konami'; width: number; height: number; shootTimer: number; hitTimer: number }
type BossBullet = { x: number; y: number; vx: number; vy: number; life: number; type: 'normal' | 'konami' }

// NUEVO: Tipo para textos flotantes
type FloatingText = { x: number; y: number; text: string; life: number; color: string; vy: number }

export const GameBackground = memo(function GameBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasAlpha, setCanvasAlpha] = useState(1)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    const isMobile = width < 768

    let isMuted = false
    let isIdle = false
    let pauseUntil = 0
    let isHardcore = false 
    let damageOverlayAlpha = 0 
    
    let isMatrixMode = false
    let matrixDrops: number[] = Array(Math.floor(width / 20)).fill(0)
    let powerUpType: 'none' | 'spread' = 'none'
    let powerUpTimer = 0
    
    // SISTEMA DE HANGAR Y DRON
    let warpFactor = 1;
    let shipSkin: 'normal' | 'classic' = 'normal';
    let hasDrone = false;
    let droneAngle = 0;
    let droneShootTimer = 0;

    // CARGAR INVENTARIO AL INICIAR
    const savedItems = JSON.parse(localStorage.getItem('portfolio_shop') || '[]');
    if (savedItems.includes('classic')) shipSkin = 'classic';
    if (savedItems.includes('drone')) hasDrone = true;
    
    let mouseX = width / 2
    let mouseY = height / 2
    let bgMouseX = 0
    let bgMouseY = 0
    let shipX = mouseX
    let shipY = mouseY
    let angle = 0
    let shake = 0
    let score = 0
    let lastInputTime = Date.now()
    let isTouching = false
    let animationId: number

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()

    const stars: Star[] = Array.from({ length: isMobile ? 60 : 150 }).map(() => ({
      x: Math.random() * width, y: Math.random() * height, size: Math.random() * 1.5 + 0.5,
    }))
    const twinkles: Twinkle[] = Array.from({ length: isMobile ? 15 : 40 }).map(() => ({
      x: Math.random() * width, y: Math.random() * height, size: Math.random() * 2 + 0.5,
      alpha: Math.random(), speed: Math.random() * 0.02 + 0.005,
    }))
    const rain: RainDrop[] = Array.from({ length: isMobile ? 4 : 12 }).map(() => ({
      x: Math.random() * width, y: Math.random() * height,
      speed: Math.random() * 1.2 + 0.5, length: Math.random() * 6 + 4,
    }))
    const splashes: Splash[] = []
    const shootingStars: ShootingStar[] = []
    const bullets: Bullet[] = []
    let asteroids: Asteroid[] = [] 
    const particles: Particle[] = []
    const floatingTexts: FloatingText[] = [] // Array para textos flotantes

    let bosses: Boss[] = []
    let bossBullets: BossBullet[] = []
    let nextBossScore = 100 

    const galaxies: Galaxy[] = isMobile ? [] : Array.from({ length: 3 }).map(() => {
      const radius = Math.random() * 250 + 150
      const hue = Math.random() * 60 + 220
      const offCanvas = document.createElement("canvas")
      const size = radius * 2
      offCanvas.width = size
      offCanvas.height = size
      const offCtx = offCanvas.getContext("2d")!
      const gradient = offCtx.createRadialGradient(radius, radius, 0, radius, radius, radius)
      gradient.addColorStop(0, `hsla(${hue}, 80%, 60%, 0.12)`)
      gradient.addColorStop(0.4, `hsla(${hue}, 80%, 40%, 0.08)`)
      gradient.addColorStop(1, "transparent")
      offCtx.fillStyle = gradient
      offCtx.beginPath()
      offCtx.arc(radius, radius, radius, 0, Math.PI * 2)
      offCtx.fill()
      return { x: Math.random() * width, y: Math.random() * height, radius, canvas: offCanvas }
    })

    const ASTEROID_LIMIT = isMobile ? 3 : 6
    const isUI = (target: EventTarget | null) => target instanceof HTMLElement && target.closest("[data-ui]")

    function playShootSound() {
      if (isMuted) return
      if (audioCtx.state === 'suspended') audioCtx.resume()
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      osc.type = "square"
      osc.frequency.value = powerUpType === 'spread' ? 600 : (isHardcore ? 300 : 400)
      gain.gain.value = 0.04
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.start()
      osc.stop(audioCtx.currentTime + 0.05)
    }

    function shoot() {
      if (isIdle) return
      const speed = 6;
      bullets.push({ x: shipX, y: shipY, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 60 })
      if (powerUpType === 'spread') {
        bullets.push({ x: shipX, y: shipY, vx: Math.cos(angle - 0.25) * speed, vy: Math.sin(angle - 0.25) * speed, life: 60 })
        bullets.push({ x: shipX, y: shipY, vx: Math.cos(angle + 0.25) * speed, vy: Math.sin(angle + 0.25) * speed, life: 60 })
      }
    }

    function spawnBoss(type: 'normal' | 'konami') {
      bosses.push({
          x: width / 2, y: -100, 
          vx: Math.random() > 0.5 ? 2 : -2, vy: 2,
          hp: type === 'konami' ? 300 : 100, maxHp: type === 'konami' ? 300 : 100,
          type: type, width: type === 'konami' ? 100 : 70, height: type === 'konami' ? 100 : 70,
          shootTimer: 0, hitTimer: 0
      });
    }

    function autoPlay() {
      if (isIdle) return
      const idleTime = Date.now() - lastInputTime
      if (idleTime > 2000 && !isTouching) {
        const target = asteroids[0] || bosses[0]
        if (target) {
          mouseX += (target.x - mouseX) * 0.05
          mouseY += (target.y - mouseY) * 0.05
          if (Math.random() < 0.05) shoot()
        } else {
          mouseX += Math.sin(Date.now() * 0.001) * 2
          mouseY += Math.cos(Date.now() * 0.001) * 2
        }
      }
    }

    function drawMatrixRain() {
      ctx.fillStyle = isHardcore ? "#ef4444" : "#4ade80"; 
      ctx.font = "16px monospace";
      const mChars = "01ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";
      for (let i = 0; i < matrixDrops.length; i++) {
        const text = mChars.charAt(Math.floor(Math.random() * mChars.length));
        ctx.fillText(text, i * 20, matrixDrops[i] * 20);
        if (matrixDrops[i] * 20 > height && Math.random() > 0.975) matrixDrops[i] = 0;
        matrixDrops[i]++;
      }
    }

    function drawBackground() {
      warpFactor += (1 - warpFactor) * 0.05;

      if (!isMobile) {
        galaxies.forEach((g) => {
          ctx.drawImage(g.canvas, g.x - g.radius + bgMouseX * 0.02, g.y - g.radius + bgMouseY * 0.02)
        })
      }
      
      ctx.fillStyle = "white"
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"
      
      stars.forEach((s) => {
        if (warpFactor > 1.1) {
            s.y += (warpFactor * (s.size * 0.5));
            if (s.y > height) { s.y = 0; s.x = Math.random() * width; }
            ctx.lineWidth = s.size;
            ctx.beginPath(); ctx.moveTo(s.x + bgMouseX * 0.01, s.y + bgMouseY * 0.01); ctx.lineTo(s.x + bgMouseX * 0.01, s.y - (warpFactor * 2) + bgMouseY * 0.01); ctx.stroke();
        } else {
            ctx.fillRect(s.x + bgMouseX * 0.01, s.y + bgMouseY * 0.01, s.size, s.size)
        }
      })
      
      twinkles.forEach((t) => {
        t.alpha += t.speed
        if (t.alpha > 1 || t.alpha < 0) t.speed *= -1
        ctx.fillStyle = `rgba(255,255,255,${t.alpha})`
        ctx.fillRect(t.x, t.y, t.size, t.size)
      })

      ctx.strokeStyle = "rgba(255, 255, 255, 0.64)"
      ctx.lineWidth = 0.7
      rain.forEach((r) => {
        r.y += r.speed
        ctx.beginPath()
        ctx.moveTo(r.x, r.y)
        ctx.lineTo(r.x + 1, r.y + r.length)
        ctx.stroke()
        if (r.y > height) {
          if (!isMobile && Math.random() < 0.3) splashes.push({ x: r.x, y: height, radius: 0, alpha: 0.8 })
          r.y = 0; r.x = Math.random() * width
        }
      })

      if (!isMobile) {
        for (let i = splashes.length - 1; i >= 0; i--) {
          const s = splashes[i]
          s.radius += 1.5; s.alpha -= 0.03
          ctx.beginPath(); ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(255,255,255,${s.alpha})`; ctx.stroke()
          if (s.alpha <= 0) splashes.splice(i, 1)
        }
      }

      if (Math.random() < 0.005 && warpFactor <= 1.1) {
        shootingStars.push({ x: Math.random() * width, y: 0, vx: Math.random() * 4 + 2, vy: Math.random() * 4 + 2, life: 80 })
      }
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i]
        s.x += s.vx; s.y += s.vy; s.life--
        ctx.beginPath()
        ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx * 5, s.y - s.vy * 5)
        ctx.strokeStyle = "rgba(255,255,255,0.8)"; ctx.lineWidth = 2; ctx.stroke()
        if (s.life <= 0) shootingStars.splice(i, 1)
      }
    }

    function drawGame() {
      ctx.save()
      ctx.translate(shipX, shipY)
      ctx.rotate(angle)
      
      if (!isMobile) {
        ctx.shadowBlur = isHardcore ? 30 : 20
        if (isMatrixMode) ctx.shadowColor = isHardcore ? "rgba(239, 68, 68, 0.9)" : "rgba(74, 222, 128, 0.9)" 
        else if (powerUpType === 'spread') ctx.shadowColor = "rgba(255, 215, 0, 0.9)"
        else ctx.shadowColor = isHardcore ? "rgba(239, 68, 68, 0.9)" : "rgba(180,200,255,0.9)"
      }
      
      // SKIN DE LA NAVE
      if (shipSkin === 'classic') {
          ctx.beginPath(); ctx.moveTo(12, 0); ctx.lineTo(-10, 10); ctx.lineTo(-5, 0); ctx.lineTo(-10, -10); ctx.closePath();
      } else {
          ctx.beginPath(); ctx.moveTo(12, 0); ctx.lineTo(-8, 6); ctx.lineTo(-4, 0); ctx.lineTo(-8, -6); ctx.closePath();
      }
      
      if (isMatrixMode) ctx.strokeStyle = isHardcore ? "#ef4444" : "#4ade80"
      else if (powerUpType === 'spread') ctx.strokeStyle = "#ffd700" 
      else ctx.strokeStyle = isHardcore ? "#ef4444" : "white" 
      
      ctx.lineWidth = isHardcore || powerUpType === 'spread' || isMatrixMode ? 2 : 1
      ctx.stroke()

      // Fuego interior de la nave (solo si es normal)
      if (shipSkin === 'normal') {
          ctx.beginPath(); ctx.moveTo(-8, 0); ctx.lineTo(-18 - Math.random() * (isHardcore ? 8 : 4), 3); ctx.lineTo(-18 - Math.random() * (isHardcore ? 8 : 4), -3); ctx.closePath();
          if (isMatrixMode) ctx.fillStyle = isHardcore ? "rgba(239, 68, 68, 0.5)" : "rgba(74, 222, 128, 0.5)"
          else ctx.fillStyle = powerUpType === 'spread' ? "rgba(255, 215, 0, 0.8)" : (isHardcore ? "rgba(239, 68, 68, 0.9)" : "rgba(255,140,60,0.7)")
          ctx.fill()
      }
      ctx.restore()

      // DRON COMPAÑERO
      if (hasDrone) {
          droneAngle += 0.05;
          const dX = Math.cos(droneAngle) * 40;
          const dY = Math.sin(droneAngle) * 40;
          
          ctx.save();
          ctx.translate(shipX + dX, shipY + dY);
          ctx.fillStyle = isMatrixMode ? "#4ade80" : "#00f3ff";
          if (!isMobile) { ctx.shadowBlur = 10; ctx.shadowColor = ctx.fillStyle; }
          ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI*2); ctx.fill();
          ctx.restore();

          const globalDx = shipX + dX;
          const globalDy = shipY + dY;
          if (!isIdle && droneShootTimer <= 0) {
              let closest: {x: number, y: number} | null = null;
              let minDist = 300 * 300;
              const targets = [...asteroids, ...bosses];
              for (const t of targets) {
                 const dist = (t.x - globalDx)**2 + (t.y - globalDy)**2;
                 if (dist < minDist) { 
                     minDist = dist; 
                     closest = t; 
                 }
              }

              if (closest) {
                 const a = Math.atan2(closest.y - globalDy, closest.x - globalDx);
                 bullets.push({ x: globalDx, y: globalDy, vx: Math.cos(a)*8, vy: Math.sin(a)*8, life: 40, isDrone: true });
                 droneShootTimer = 30;
              }
          }
          if (droneShootTimer > 0) droneShootTimer--;
      }

      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i]
        b.x += b.vx; b.y += b.vy; b.life--

        ctx.save()
        if (!isMobile) {
          ctx.shadowBlur = 30
          if (b.isDrone) ctx.shadowColor = "#00f3ff";
          else if (isMatrixMode) ctx.shadowColor = isHardcore ? "rgba(239, 68, 68, 0.9)" : "rgba(74, 222, 128, 0.9)"
          else ctx.shadowColor = powerUpType === 'spread' ? "rgba(255, 215, 0, 0.9)" : (isHardcore ? "rgba(239, 68, 68, 0.9)" : "rgba(120,140,255,0.9)")
        }
        
        if (b.isDrone) ctx.fillStyle = "#ffffff";
        else ctx.fillStyle = isMatrixMode ? (isHardcore ? "#fca5a5" : "#4ade80") : (powerUpType === 'spread' ? "#fef08a" : (isHardcore ? "#fca5a5" : "rgba(180,200,255,0.95)"))
        
        if (b.isDrone) ctx.fillRect(b.x - 1.5, b.y - 1.5, 3, 3) 
        else ctx.fillRect(b.x - 2, b.y - 2, 4, 4) 
        ctx.restore()
        if (b.life <= 0) bullets.splice(i, 1)
      }

      const currentLimit = isHardcore ? ASTEROID_LIMIT + (isMobile ? 2 : 4) : ASTEROID_LIMIT;
      const spawnProbability = isHardcore ? 0.05 : 0.02;

      if (!isIdle && asteroids.length < currentLimit && Math.random() < spawnProbability) {
        const speedMultiplier = isHardcore ? 2.5 : 1;
        let startX, startY;
        if (Math.random() > 0.5) {
            startX = Math.random() > 0.5 ? 0 : width; startY = Math.random() * height;
        } else {
            startX = Math.random() * width; startY = Math.random() > 0.5 ? 0 : height;
        }
        asteroids.push({
          x: startX, y: startY,
          vx: (Math.random() * 2 - 1) * speedMultiplier, vy: (Math.random() * 2 - 1) * speedMultiplier, 
          size: Math.random() * 25 + 20, type: Math.random() < 0.05 ? 'golden' : 'normal'
        })
      }

      asteroids.forEach((a) => {
        a.x += a.vx; a.y += a.vy
        if (isHardcore) {
            if (a.x < -a.size) a.x = width + a.size; else if (a.x > width + a.size) a.x = -a.size;
            if (a.y < -a.size) a.y = height + a.size; else if (a.y > height + a.size) a.y = -a.size;
        }
        ctx.save()
        ctx.beginPath()
        ctx.arc(a.x, a.y, a.size, 0, Math.PI * 2)
        if (a.type === 'golden') {
          ctx.strokeStyle = "rgba(255, 215, 0, 0.9)"; ctx.lineWidth = 3;
          if (!isMobile) { ctx.shadowBlur = 20; ctx.shadowColor = "rgba(255, 255, 255, 0.8)"; }
        } else if (isMatrixMode) {
          ctx.strokeStyle = isHardcore ? "rgba(239, 68, 68, 0.6)" : "rgba(74, 222, 128, 0.6)"; ctx.lineWidth = 2;
        } else {
          ctx.strokeStyle = isHardcore ? "rgba(239, 68, 68, 0.6)" : "rgba(200,200,200,0.6)"; ctx.lineWidth = isHardcore ? 2 : 1;
        }
        ctx.stroke()
        ctx.restore()
      })

      bosses.forEach((b) => {
        ctx.save();
        ctx.translate(b.x, b.y);
        if (b.hitTimer > 0) {
            ctx.fillStyle = "white"; b.hitTimer--;
        } else {
            if (b.type === 'konami') ctx.fillStyle = isMatrixMode ? "#00ff41" : "rgba(168, 85, 247, 0.8)"; 
            else ctx.fillStyle = isMatrixMode ? "#00f3ff" : "rgba(220, 38, 38, 0.8)"; 
        }

        if (!isMobile) {
            ctx.shadowBlur = 20;
            ctx.shadowColor = ctx.fillStyle as string;
        }

        ctx.beginPath();
        if (isMatrixMode) {
          if (b.type === 'konami') {
             for(let i=0; i<8; i++) {
                const r = i % 2 === 0 ? b.width/2 : b.width/3;
                const a = (Math.PI / 4) * i;
                ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
             }
          } else {
             ctx.rect(-b.width/2, -b.height/2, b.width, b.height); ctx.rotate(Math.PI / 4);
          }
        } else {
          if (b.type === 'konami') {
              for (let i = 0; i < 6; i++) { const a = (Math.PI / 3) * i; ctx.lineTo(Math.cos(a) * b.width/2, Math.sin(a) * b.height/2); }
          } else {
              ctx.moveTo(0, b.height/2); ctx.lineTo(b.width/2, 0); ctx.lineTo(0, -b.height/2); ctx.lineTo(-b.width/2, 0);
          }
        }
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = isMatrixMode ? "#111116" : "black";
        ctx.beginPath(); ctx.arc(0, 0, b.width/4, 0, Math.PI*2); ctx.fill();

        ctx.fillStyle = "rgba(255, 0, 0, 0.5)"; ctx.fillRect(-b.width/2, -b.height/2 - 15, b.width, 5);
        ctx.fillStyle = isMatrixMode ? "#4ade80" : "#ef4444"; ctx.fillRect(-b.width/2, -b.height/2 - 15, b.width * (b.hp / b.maxHp), 5);
        ctx.restore();
      });

      bossBullets.forEach((bb) => {
        ctx.save();
        let bulletColor = bb.type === 'konami' ? "#a855f7" : "#dc2626";
        if (isMatrixMode) bulletColor = bb.type === 'konami' ? "#00ff41" : "#00f3ff";
        ctx.fillStyle = bulletColor;
        if (!isMobile) { ctx.shadowBlur = 10; ctx.shadowColor = bulletColor; }
        ctx.beginPath(); ctx.arc(bb.x, bb.y, bb.type === 'konami' ? 6 : 4, 0, Math.PI*2); ctx.fill();
        ctx.restore();
      });

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx; p.y += p.vy; p.life--
        
        if (p.color) ctx.fillStyle = p.color === 'gold' ? `rgba(255, 215, 0, ${p.life / 30})` : p.color;
        else if (isMatrixMode) ctx.fillStyle = isHardcore ? `rgba(239, 68, 68, ${p.life / 30})` : `rgba(74, 222, 128, ${p.life / 30})`;
        else ctx.fillStyle = isHardcore ? `rgba(239, 68, 68, ${p.life / 30})` : `rgba(255,255,255,${p.life / 30})`;
        
        ctx.fillRect(p.x, p.y, isHardcore || isMatrixMode ? 3 : 2, isHardcore || isMatrixMode ? 3 : 2) 
        if (p.life <= 0) particles.splice(i, 1)
      }

      // DIBUJAR TEXTOS FLOTANTES
      for (let i = floatingTexts.length - 1; i >= 0; i--) {
          const ft = floatingTexts[i];
          ft.y += ft.vy; ft.life--;
          ctx.save();
          ctx.globalAlpha = Math.max(0, ft.life / 40); 
          ctx.fillStyle = ft.color;
          ctx.font = "bold 16px monospace";
          ctx.textAlign = "center";
          ctx.fillText(ft.text, ft.x, ft.y);
          ctx.restore();
          if (ft.life <= 0) floatingTexts.splice(i, 1);
      }
    }

    function updateBosses() {
        if (isIdle) return;
        bosses.forEach((b) => {
            b.x += b.vx;
            if (b.y < height / 4) b.y += b.vy;
            else { b.vy = 0; if (b.x < b.width || b.x > width - b.width) b.vx *= -1; }

            b.shootTimer++;
            const shootThreshold = b.type === 'konami' ? 30 : 60; 
            if (b.shootTimer > shootThreshold) {
                b.shootTimer = 0;
                const angleToShip = Math.atan2(shipY - b.y, shipX - b.x);
                const speed = b.type === 'konami' ? 6 : 4;
                bossBullets.push({ x: b.x, y: b.y, vx: Math.cos(angleToShip) * speed, vy: Math.sin(angleToShip) * speed, life: 150, type: b.type });
                
                if (b.type === 'konami') {
                    bossBullets.push({ x: b.x, y: b.y, vx: Math.cos(angleToShip + 0.4) * speed, vy: Math.sin(angleToShip + 0.4) * speed, life: 150, type: b.type });
                    bossBullets.push({ x: b.x, y: b.y, vx: Math.cos(angleToShip - 0.4) * speed, vy: Math.sin(angleToShip - 0.4) * speed, life: 150, type: b.type });
                }
            }
        });

        for (let i = bossBullets.length - 1; i >= 0; i--) {
            const bb = bossBullets[i];
            bb.x += bb.vx; bb.y += bb.vy; bb.life--;
            if (bb.life <= 0) bossBullets.splice(i, 1);
        }
    }

    function handleCollisions() {
      if (isIdle) return
      
      if (score >= nextBossScore) {
          spawnBoss('normal');
          nextBossScore = Math.floor(score / 100) * 100 + 100; 
      }
      
      if (powerUpType !== 'none' && Date.now() > powerUpTimer) {
        powerUpType = 'none';
      }
      
      if (damageOverlayAlpha <= 0) {
        if (isHardcore) {
            for (let i = asteroids.length - 1; i >= 0; i--) {
              const a = asteroids[i]; const dx = a.x - shipX; const dy = a.y - shipY;
              if (Math.sqrt(dx * dx + dy * dy) < a.size + 10) {
                score = Math.max(0, score - 5); 
                window.dispatchEvent(new CustomEvent("updateGameScore", { detail: score }))
                shake = 25; damageOverlayAlpha = 1; 
                floatingTexts.push({ x: shipX, y: shipY, text: "-5", life: 30, color: '#ef4444', vy: -1 });
                for (let k = 0; k < 20; k++) particles.push({ x: a.x, y: a.y, vx: Math.random() * 6 - 3, vy: Math.random() * 6 - 3, life: 40 })
                asteroids.splice(i, 1);
                break;
              }
            }
        }
        
        for (let i = bossBullets.length - 1; i >= 0; i--) {
            const bb = bossBullets[i]; const dx = bb.x - shipX; const dy = bb.y - shipY;
            if (dx*dx + dy*dy < 144) { 
                const dmg = bb.type === 'konami' ? 20 : 10;
                score = Math.max(0, score - dmg); 
                window.dispatchEvent(new CustomEvent("updateGameScore", { detail: score }));
                shake = 30; damageOverlayAlpha = 1;
                floatingTexts.push({ x: shipX, y: shipY, text: `-${dmg}`, life: 30, color: '#ef4444', vy: -1 });
                for (let k = 0; k < 20; k++) particles.push({x: shipX, y: shipY, vx: Math.random()*6-3, vy: Math.random()*6-3, life: 40, color: '#ef4444'});
                bossBullets.splice(i, 1);
                break;
            }
        }
      }

      for (let i = bosses.length - 1; i >= 0; i--) {
          const b = bosses[i];
          for (let j = bullets.length - 1; j >= 0; j--) {
              const bul = bullets[j];
              const dx = b.x - bul.x; const dy = b.y - bul.y;
              if (Math.abs(dx) < b.width/2 && Math.abs(dy) < b.height/2) {
                  b.hp -= isHardcore ? 1 : 2; 
                  b.hitTimer = 5;
                  bullets.splice(j, 1);
                  for (let k = 0; k < 3; k++) particles.push({x: bul.x, y: bul.y, vx: Math.random()*4-2, vy: Math.random()*4-2, life: 10, color: 'white'});

                  if (b.hp <= 0) {
                      const pts = b.type === 'konami' ? 500 : 100;
                      score += pts;
                      window.dispatchEvent(new CustomEvent("updateGameScore", { detail: score }));
                      shake = 40;
                      floatingTexts.push({ x: b.x, y: b.y, text: `+${pts}`, life: 50, color: b.type === 'konami' ? '#a855f7' : '#ef4444', vy: -2 });
                      for (let k = 0; k < 50; k++) {
                          particles.push({x: b.x, y: b.y, vx: Math.random()*10-5, vy: Math.random()*10-5, life: 40, color: b.type === 'konami' ? '#a855f7' : '#dc2626'});
                      }
                      
                      if (b.type === 'konami') {
                          const remainingKonami = bosses.filter(boss => boss.type === 'konami' && boss !== b).length;
                          if (remainingKonami === 0) window.dispatchEvent(new CustomEvent("bossDefeated"));
                      }
                      bosses.splice(i, 1);
                  }
                  break;
              }
          }
      }

      for (let i = asteroids.length - 1; i >= 0; i--) {
        const a = asteroids[i]
        let hit = false;
        for (let j = bullets.length - 1; j >= 0; j--) {
          const b = bullets[j]; const dx = a.x - b.x; const dy = a.y - b.y;
          if (dx * dx + dy * dy < a.size * a.size) { 
            if (a.type === 'golden') {
              const pts = isHardcore ? 10 : 5;
              score += pts; powerUpType = 'spread'; powerUpTimer = Date.now() + 8000; shake = isHardcore ? 20 : 15;
              floatingTexts.push({ x: a.x, y: a.y, text: `+${pts} POWERUP!`, life: 40, color: '#ffd700', vy: -1.5 });
              for (let k = 0; k < 30; k++) particles.push({ x: a.x, y: a.y, vx: Math.random() * 6 - 3, vy: Math.random() * 6 - 3, life: 40, color: 'gold' })
            } else {
              const pts = isHardcore ? 2 : 1;
              score += pts; shake = isHardcore ? 15 : 10;
              floatingTexts.push({ x: a.x, y: a.y, text: `+${pts}`, life: 30, color: '#ffffff', vy: -1 });
              for (let k = 0; k < (isHardcore ? 20 : 12); k++) particles.push({ x: a.x, y: a.y, vx: Math.random() * 4 - 2, vy: Math.random() * 4 - 2, life: 30 })
            }
            window.dispatchEvent(new CustomEvent("updateGameScore", { detail: score }))
            if (a.size > 15) {
              for (let k = 0; k < 2; k++) {
                asteroids.push({ 
                  x: a.x, y: a.y, vx: (Math.random() * 3 - 1.5) * (isHardcore ? 2.5 : 1), vy: (Math.random() * 3 - 1.5) * (isHardcore ? 2.5 : 1), 
                  size: a.size / 2, type: 'normal' 
                })
              }
            }
            asteroids.splice(i, 1); bullets.splice(j, 1); hit = true; break
          }
        }
        if(hit) break;
      }
    }

    function animate() {
      animationId = requestAnimationFrame(animate)
      if (Date.now() < pauseUntil) return

      if (isMatrixMode) {
        ctx.fillStyle = "rgba(10, 10, 15, 0.15)"; ctx.fillRect(0, 0, width, height); drawMatrixRain();
      } else {
        ctx.clearRect(0, 0, width, height); drawBackground();
      }

      autoPlay()

      if (shake > 0) {
        ctx.save(); ctx.translate(Math.random() * shake - shake / 2, Math.random() * shake - shake / 2); shake *= 0.9;
      }

      shipX += (mouseX - shipX) * 0.12
      shipY += (mouseY - shipY) * 0.12
      angle = Math.atan2(mouseY - shipY, mouseX - shipX)

      // PROPULSORES (Fuego de la nave al moverse rápido)
      const distToMouse = Math.hypot(mouseX - shipX, mouseY - shipY);
      if (distToMouse > 5 && Math.random() < 0.6) {
          const backX = shipX - Math.cos(angle) * 8;
          const backY = shipY - Math.sin(angle) * 8;
          particles.push({
              x: backX + (Math.random() * 4 - 2), y: backY + (Math.random() * 4 - 2),
              vx: -Math.cos(angle) * 2 + (Math.random() - 0.5), vy: -Math.sin(angle) * 2 + (Math.random() - 0.5),
              life: 20, color: isMatrixMode ? '#4ade80' : '#f97316'
          });
      }

      updateBosses() 
      drawGame()
      handleCollisions()

      if (damageOverlayAlpha > 0) {
        ctx.fillStyle = `rgba(239, 68, 68, ${damageOverlayAlpha})`; ctx.fillRect(0, 0, width, height); damageOverlayAlpha -= 0.05;
      }

      if (isHardcore && !isMatrixMode) {
        const gradient = ctx.createRadialGradient(width/2, height/2, height * 0.4, width/2, height/2, height * 0.8);
        gradient.addColorStop(0, "transparent"); gradient.addColorStop(1, "rgba(239, 68, 68, 0.15)");
        ctx.fillStyle = gradient; ctx.fillRect(0, 0, width, height);
      }

      if (shake > 0) ctx.restore()
    }

    animate()

    const handlePointerMove = (e: PointerEvent) => { if (e.pointerType === "mouse") { mouseX = e.clientX; mouseY = e.clientY; bgMouseX = (e.clientX - width / 2) * 0.05; bgMouseY = (e.clientY - height / 2) * 0.05; lastInputTime = Date.now(); } }
    const handlePointerDown = (e: PointerEvent) => { if (isUI(e.target)) return; lastInputTime = Date.now(); shoot(); playShootSound(); e.preventDefault() }
    const handleTouchStart = (e: TouchEvent) => { if (isUI(e.target)) return; isTouching = true; lastInputTime = Date.now(); mouseX = e.touches[0].clientX; mouseY = e.touches[0].clientY; shoot(); playShootSound(); e.preventDefault() }
    const handleTouchMove = (e: TouchEvent) => { if (isUI(e.target)) return; mouseX = e.touches[0].clientX; mouseY = e.touches[0].clientY; lastInputTime = Date.now(); e.preventDefault() }
    const handleTouchEnd = () => { isTouching = false }
    const handleResize = () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; matrixDrops = Array(Math.floor(width / 20)).fill(0) }
    
    const handleViewChange = (e: Event) => { 
      pauseUntil = Date.now() + 350;
      const newView = (e as CustomEvent).detail;
      if (newView && newView !== "game") {
        isHardcore = false; damageOverlayAlpha = 0; asteroids = []; bosses = []; bossBullets = []; nextBossScore = 100;
        window.dispatchEvent(new CustomEvent("bossDefeated"));
      }
    }
    
    const handleMute = (e: Event) => { isMuted = (e as CustomEvent).detail }
    const handleIdle = (e: Event) => { isIdle = (e as CustomEvent).detail }
    const handleDifficultyChange = (e: Event) => { 
      isHardcore = (e as CustomEvent).detail === "hard";
      if(!isHardcore) { asteroids = []; bosses = []; bossBullets = []; nextBossScore = score + 100; window.dispatchEvent(new CustomEvent("bossDefeated")); }
    }
    const handleResetGame = () => {
        score = 0; window.dispatchEvent(new CustomEvent("updateGameScore", { detail: 0 }));
        asteroids = []; bosses = []; bossBullets = []; nextBossScore = 100; bullets.length = 0; powerUpType = 'none'; 
        window.dispatchEvent(new CustomEvent("bossDefeated"));
    }

    const handleMatrixToggle = () => { isMatrixMode = !isMatrixMode; }
    const handleKonamiBoss = () => { spawnBoss('konami'); shake = 50; };
    const handleFadeOut = () => setCanvasAlpha(0);
    const handleFadeIn = () => setCanvasAlpha(1);
    const handleWarp = () => { warpFactor = 40; };

    const handlePurchase = (e: Event) => {
        const { item, cost } = (e as CustomEvent).detail;
        if (score >= cost) {
            score -= cost;
            window.dispatchEvent(new CustomEvent("updateGameScore", { detail: score }));
            window.dispatchEvent(new CustomEvent("itemPurchased", { detail: item }));
            
            if (item === 'drone') hasDrone = true;
            if (item === 'classic') shipSkin = 'classic';
            
            floatingTexts.push({ x: shipX, y: shipY - 30, text: `COMPRADO!`, life: 60, color: '#fcd34d', vy: -1.5 });
        }
    };

    const handleCheatScore = (e: Event) => {
        const points = (e as CustomEvent).detail;
        score += points;
        window.dispatchEvent(new CustomEvent("updateGameScore", { detail: score }));
        
        floatingTexts.push({ 
            x: width / 2, 
            y: height / 2 - 50, 
            text: `+${points} MOTHERLODE!`, 
            life: 80, 
            color: '#fcd34d', 
            vy: -2 
        });
    };

    document.body.style.userSelect = "none"
    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerdown", handlePointerDown, { passive: false })
    window.addEventListener("touchstart", handleTouchStart, { passive: false })
    window.addEventListener("touchmove", handleTouchMove, { passive: false })
    window.addEventListener("touchend", handleTouchEnd)
    window.addEventListener("resize", handleResize)
    window.addEventListener("changeView", handleViewChange)
    window.addEventListener("toggleMute", handleMute)
    window.addEventListener("toggleIdle", handleIdle)
    window.addEventListener("setGameDifficulty", handleDifficultyChange)
    window.addEventListener("resetGame", handleResetGame)
    window.addEventListener("canvasFadeOut", handleFadeOut)
    window.addEventListener("canvasFadeIn", handleFadeIn)
    window.addEventListener("toggleMatrixMode", handleMatrixToggle)
    window.addEventListener("spawnKonamiBoss", handleKonamiBoss)
    window.addEventListener("warpSpeed", handleWarp)
    window.addEventListener("purchaseItem", handlePurchase)
    window.addEventListener("addCheatScore", handleCheatScore)

    return () => {
      cancelAnimationFrame(animationId)
      document.body.style.userSelect = ""
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerdown", handlePointerDown)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("changeView", handleViewChange)
      window.removeEventListener("toggleMute", handleMute)
      window.removeEventListener("toggleIdle", handleIdle)
      window.removeEventListener("setGameDifficulty", handleDifficultyChange)
      window.removeEventListener("resetGame", handleResetGame)
      window.removeEventListener("canvasFadeOut", handleFadeOut)
      window.removeEventListener("canvasFadeIn", handleFadeIn)
      window.removeEventListener("toggleMatrixMode", handleMatrixToggle)
      window.removeEventListener("spawnKonamiBoss", handleKonamiBoss)
      window.removeEventListener("warpSpeed", handleWarp)
      window.removeEventListener("purchaseItem", handlePurchase)
      window.removeEventListener("addCheatScore", handleCheatScore)
    }
  }, [])

  return ( 
    <canvas 
      ref={canvasRef} 
      className={styles.gamebackground} 
      style={{ opacity: canvasAlpha, transition: 'opacity 0.3s ease-in-out' }} 
    /> 
  )
})