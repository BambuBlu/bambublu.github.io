"use client"

import { useEffect, useRef, memo } from "react" 
import styles from "./gamebackground.module.css"

type Star = { x: number; y: number; size: number }
type Twinkle = { x: number; y: number; size: number; alpha: number; speed: number }
type RainDrop = { x: number; y: number; speed: number; length: number }
type Splash = { x: number; y: number; radius: number; alpha: number }
type Galaxy = { x: number; y: number; radius: number; canvas: HTMLCanvasElement }
type ShootingStar = { x: number; y: number; vx: number; vy: number; life: number }
type Bullet = { x: number; y: number; vx: number; vy: number; life: number }
type Asteroid = { x: number; y: number; vx: number; vy: number; size: number }
type Particle = { x: number; y: number; vx: number; vy: number; life: number }

export const GameBackground = memo(function GameBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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
      osc.frequency.value = isHardcore ? 300 : 400 
      gain.gain.value = 0.04
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.start()
      osc.stop(audioCtx.currentTime + 0.05)
    }

    function shoot() {
      if (isIdle) return
      bullets.push({ x: shipX, y: shipY, vx: Math.cos(angle) * 6, vy: Math.sin(angle) * 6, life: 60 })
    }

    function autoPlay() {
      if (isIdle) return
      const idleTime = Date.now() - lastInputTime
      if (idleTime > 2000 && !isTouching) {
        const target = asteroids[0]
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

    function drawBackground() {
      if (!isMobile) {
        galaxies.forEach((g) => {
          ctx.drawImage(g.canvas, g.x - g.radius + bgMouseX * 0.02, g.y - g.radius + bgMouseY * 0.02)
        })
      }

      ctx.fillStyle = "white"
      stars.forEach((s) => {
        ctx.fillRect(s.x + bgMouseX * 0.01, s.y + bgMouseY * 0.01, s.size, s.size)
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
          if (!isMobile && Math.random() < 0.3) {
             splashes.push({ x: r.x, y: height, radius: 0, alpha: 0.8 })
          }
          r.y = 0
          r.x = Math.random() * width
        }
      })

      if (!isMobile) {
        for (let i = splashes.length - 1; i >= 0; i--) {
          const s = splashes[i]
          s.radius += 1.5
          s.alpha -= 0.03
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(255,255,255,${s.alpha})`
          ctx.stroke()
          if (s.alpha <= 0) splashes.splice(i, 1)
        }
      }

      if (Math.random() < 0.005) {
        shootingStars.push({ x: Math.random() * width, y: 0, vx: Math.random() * 4 + 2, vy: Math.random() * 4 + 2, life: 80 })
      }
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i]
        s.x += s.vx
        s.y += s.vy
        s.life--
        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(s.x - s.vx * 5, s.y - s.vy * 5)
        ctx.strokeStyle = "rgba(255,255,255,0.8)"
        ctx.lineWidth = 2
        ctx.stroke()
        if (s.life <= 0) shootingStars.splice(i, 1)
      }
    }

    function drawGame() {
      ctx.save()
      ctx.translate(shipX, shipY)
      ctx.rotate(angle)
      if (!isMobile) {
        ctx.shadowBlur = isHardcore ? 30 : 20
        ctx.shadowColor = isHardcore ? "rgba(239, 68, 68, 0.9)" : "rgba(180,200,255,0.9)"
      }
      ctx.beginPath()
      ctx.moveTo(12, 0)
      ctx.lineTo(-8, 6)
      ctx.lineTo(-4, 0)
      ctx.lineTo(-8, -6)
      ctx.closePath()
      ctx.strokeStyle = isHardcore ? "#ef4444" : "white" 
      ctx.lineWidth = isHardcore ? 2 : 1
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(-8, 0)
      ctx.lineTo(-18 - Math.random() * (isHardcore ? 8 : 4), 3)
      ctx.lineTo(-18 - Math.random() * (isHardcore ? 8 : 4), -3)
      ctx.closePath()
      ctx.fillStyle = isHardcore ? "rgba(239, 68, 68, 0.9)" : "rgba(255,140,60,0.7)"
      ctx.fill()
      ctx.restore()

      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i]
        b.x += b.vx
        b.y += b.vy
        b.life--

        if (!isMobile) {
          stars.forEach((s) => {
            const dx = s.x - b.x
            const dy = s.y - b.y
            const distSq = dx * dx + dy * dy
            if (distSq < 625) {
              const dist = Math.sqrt(distSq)
              const force = (25 - dist) / 25
              s.x += dx * 0.05 * force
              s.y += dy * 0.05 * force
            }
          })
        }

        ctx.save()
        if (!isMobile) {
          ctx.shadowBlur = 30
          ctx.shadowColor = isHardcore ? "rgba(239, 68, 68, 0.9)" : "rgba(120,140,255,0.9)"
        } else {
          ctx.fillStyle = isHardcore ? "rgba(239, 68, 68, 0.3)" : "rgba(120,140,255,0.3)"
          ctx.fillRect(b.x - 6, b.y - 6, 12, 12)
        }
        ctx.fillStyle = isHardcore ? "#fca5a5" : "rgba(180,200,255,0.95)" 
        ctx.fillRect(b.x - 2, b.y - 2, 4, 4) 
        ctx.restore()
        if (b.life <= 0) bullets.splice(i, 1)
      }

      const currentLimit = isHardcore ? ASTEROID_LIMIT + (isMobile ? 2 : 4) : ASTEROID_LIMIT;
      const spawnProbability = isHardcore ? 0.05 : 0.02;

      if (!isIdle && asteroids.length < currentLimit && Math.random() < spawnProbability) {
        const speedMultiplier = isHardcore ? 2.5 : 1;
        let startX, startY;
        if (Math.random() > 0.5) {
            startX = Math.random() > 0.5 ? 0 : width;
            startY = Math.random() * height;
        } else {
            startX = Math.random() * width;
            startY = Math.random() > 0.5 ? 0 : height;
        }

        asteroids.push({
          x: startX, y: startY,
          vx: (Math.random() * 2 - 1) * speedMultiplier, 
          vy: (Math.random() * 2 - 1) * speedMultiplier, 
          size: Math.random() * 25 + 20,
        })
      }

      asteroids.forEach((a) => {
        a.x += a.vx
        a.y += a.vy
        
        if (isHardcore) {
            if (a.x < -a.size) a.x = width + a.size;
            else if (a.x > width + a.size) a.x = -a.size;
            if (a.y < -a.size) a.y = height + a.size;
            else if (a.y > height + a.size) a.y = -a.size;
        }
        
        ctx.beginPath()
        ctx.arc(a.x, a.y, a.size, 0, Math.PI * 2)
        ctx.strokeStyle = isHardcore ? "rgba(239, 68, 68, 0.6)" : "rgba(200,200,200,0.6)"
        ctx.lineWidth = isHardcore ? 2 : 1;
        ctx.stroke()
      })

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.life--
        ctx.fillStyle = isHardcore ? `rgba(239, 68, 68, ${p.life / 30})` : `rgba(255,255,255,${p.life / 30})`
        ctx.fillRect(p.x, p.y, isHardcore ? 3 : 2, isHardcore ? 3 : 2) 
        if (p.life <= 0) particles.splice(i, 1)
      }
    }

    function handleCollisions() {
      if (isIdle) return
      
      if (isHardcore && damageOverlayAlpha <= 0) {
        for (let i = asteroids.length - 1; i >= 0; i--) {
          const a = asteroids[i]
          const dx = a.x - shipX
          const dy = a.y - shipY
          const dist = Math.sqrt(dx * dx + dy * dy)
          
          if (dist < a.size + 10) {
            score = Math.max(0, score - 5); 
            window.dispatchEvent(new CustomEvent("updateGameScore", { detail: score }))
            shake = 25; 
            damageOverlayAlpha = 1; 
            
            for (let k = 0; k < 20; k++) {
              particles.push({ x: a.x, y: a.y, vx: Math.random() * 6 - 3, vy: Math.random() * 6 - 3, life: 40 })
            }
            asteroids.splice(i, 1);
            break;
          }
        }
      }

      for (let i = asteroids.length - 1; i >= 0; i--) {
        const a = asteroids[i]
        let hit = false;
        
        for (let j = bullets.length - 1; j >= 0; j--) {
          const b = bullets[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          if (dx * dx + dy * dy < a.size * a.size) { 
            score += isHardcore ? 2 : 1; 
            window.dispatchEvent(new CustomEvent("updateGameScore", { detail: score }))
            shake = isHardcore ? 15 : 10 
            
            for (let k = 0; k < (isHardcore ? 20 : 12); k++) {
              particles.push({ x: a.x, y: a.y, vx: Math.random() * 4 - 2, vy: Math.random() * 4 - 2, life: 30 })
            }
            if (a.size > 15) {
              for (let k = 0; k < 2; k++) {
                const speedMultiplier = isHardcore ? 2.5 : 1;
                asteroids.push({ 
                  x: a.x, y: a.y, 
                  vx: (Math.random() * 3 - 1.5) * speedMultiplier, 
                  vy: (Math.random() * 3 - 1.5) * speedMultiplier, 
                  size: a.size / 2 
                })
              }
            }
            asteroids.splice(i, 1)
            bullets.splice(j, 1)
            hit = true;
            break
          }
        }
        if(hit) break;
      }
    }

    function animate() {
      animationId = requestAnimationFrame(animate)
      if (Date.now() < pauseUntil) return

      ctx.clearRect(0, 0, width, height)
      autoPlay()

      if (shake > 0) {
        ctx.save()
        ctx.translate(Math.random() * shake - shake / 2, Math.random() * shake - shake / 2)
        shake *= 0.9
      }

      shipX += (mouseX - shipX) * 0.12
      shipY += (mouseY - shipY) * 0.12
      angle = Math.atan2(mouseY - shipY, mouseX - shipX)

      drawBackground()
      drawGame()
      handleCollisions()

      if (isHardcore) {
        const gradient = ctx.createRadialGradient(width/2, height/2, height * 0.4, width/2, height/2, height * 0.8);
        gradient.addColorStop(0, "transparent");
        gradient.addColorStop(1, "rgba(239, 68, 68, 0.15)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        if (damageOverlayAlpha > 0) {
          ctx.fillStyle = `rgba(239, 68, 68, ${damageOverlayAlpha})`;
          ctx.fillRect(0, 0, width, height);
          damageOverlayAlpha -= 0.05;
        }
      }

      if (shake > 0) ctx.restore()
    }

    animate()

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse") {
        mouseX = e.clientX
        mouseY = e.clientY
        bgMouseX = (e.clientX - width / 2) * 0.05
        bgMouseY = (e.clientY - height / 2) * 0.05
        lastInputTime = Date.now()
      }
    }

    const handlePointerDown = (e: PointerEvent) => {
      if (isUI(e.target)) return
      lastInputTime = Date.now()
      shoot()
      playShootSound()
      e.preventDefault()
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (isUI(e.target)) return
      isTouching = true
      lastInputTime = Date.now()
      mouseX = e.touches[0].clientX
      mouseY = e.touches[0].clientY
      shoot()
      playShootSound()
      e.preventDefault()
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isUI(e.target)) return
      mouseX = e.touches[0].clientX
      mouseY = e.touches[0].clientY
      lastInputTime = Date.now()
      e.preventDefault()
    }

    const handleTouchEnd = () => { isTouching = false }
    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    const handleViewChange = (e: Event) => { 
      pauseUntil = Date.now() + 350;
      
      const newView = (e as CustomEvent).detail;
      if (newView && newView !== "game") {
        isHardcore = false;
        damageOverlayAlpha = 0;
        asteroids = []; 
      }
    }
    
    const handleMute = (e: Event) => { isMuted = (e as CustomEvent).detail }
    const handleIdle = (e: Event) => { isIdle = (e as CustomEvent).detail }
    
    const handleDifficultyChange = (e: Event) => { 
      isHardcore = (e as CustomEvent).detail === "hard";
      if(!isHardcore) {
          asteroids = []; 
      }
    }
    
    const handleResetGame = () => {
        score = 0;
        window.dispatchEvent(new CustomEvent("updateGameScore", { detail: 0 }));
        asteroids = []; 
        bullets.length = 0; 
    }

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
    }
  }, [])

  return ( <canvas ref={canvasRef} className={styles.gamebackground} /> )
})