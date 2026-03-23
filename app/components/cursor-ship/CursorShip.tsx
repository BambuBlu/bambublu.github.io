"use client"

import { useEffect, useRef } from "react"

type Bullet = { x: number; y: number; vx: number; vy: number; life: number }
type Asteroid = { x: number; y: number; vx: number; vy: number; size: number }
type Particle = { x: number; y: number; vx: number; vy: number; life: number }
type Star = { x: number; y: number; size: number }

export function CursorShip() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const isMobile = width < 768

    let mouseX = width / 2
    let mouseY = height / 2

    let shipX = mouseX
    let shipY = mouseY
    let angle = 0

    let shake = 0
    let score = 0
    let lastInputTime = Date.now()
    let isTouching = false

    const bullets: Bullet[] = []
    const asteroids: Asteroid[] = []
    const particles: Particle[] = []

    const globalStars: Star[] =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__STARFIELD__ || []

    const localStars: Star[] = Array.from({ length: isMobile ? 30 : 60 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.2,
    }))

    const stars = globalStars.length > 0 ? globalStars : localStars

    const ASTEROID_LIMIT = isMobile ? 3 : 6

    const audioCtx =
    
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new (window.AudioContext || (window as any).webkitAudioContext)()

    const isUI = (target: EventTarget | null) =>
      target instanceof HTMLElement && target.closest("[data-ui]")

    function playShootSound() {
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()

      osc.type = "square"
      osc.frequency.value = 400
      gain.gain.value = 0.04

      osc.connect(gain)
      gain.connect(audioCtx.destination)

      osc.start()
      osc.stop(audioCtx.currentTime + 0.05)
    }

    function spawnAsteroid() {
      if (asteroids.length < ASTEROID_LIMIT && Math.random() < 0.02) {
        asteroids.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.random() * 1 - 0.5,
          vy: Math.random() * 1 - 0.5,
          size: Math.random() * 25 + 20,
        })
      }
    }

    function autoPlay() {
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

    function shoot() {
      bullets.push({
        x: shipX,
        y: shipY,
        vx: Math.cos(angle) * 6,
        vy: Math.sin(angle) * 6,
        life: 60,
      })
    }

    function drawStars() {
      ctx.fillStyle = "rgba(255,255,255,0.5)"
      stars.forEach((s) => {
        ctx.fillRect(s.x, s.y, s.size, s.size)
      })
    }

    function drawShip() {
      ctx.save()
      ctx.translate(shipX, shipY)
      ctx.rotate(angle)

      ctx.shadowBlur = 20
      ctx.shadowColor = "rgba(180,200,255,0.9)"

      ctx.beginPath()
      ctx.moveTo(12, 0)
      ctx.lineTo(-8, 6)
      ctx.lineTo(-4, 0)
      ctx.lineTo(-8, -6)
      ctx.closePath()
      ctx.strokeStyle = "white"
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(-8, 0)
      ctx.lineTo(-18 - Math.random() * 4, 3)
      ctx.lineTo(-18 - Math.random() * 4, -3)
      ctx.closePath()
      ctx.fillStyle = "rgba(255,140,60,0.7)"
      ctx.fill()

      ctx.restore()
    }

    function drawBullets() {
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i]

        b.x += b.vx
        b.y += b.vy
        b.life--

        stars.forEach((s) => {
          const dx = s.x - b.x
          const dy = s.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 25) {
            const force = (25 - dist) / 25
            s.x += dx * 0.05 * force
            s.y += dy * 0.05 * force
          }
        })

        ctx.save()
        ctx.shadowBlur = 30
        ctx.shadowColor = "rgba(120,140,255,0.9)"

        ctx.fillStyle = "rgba(180,200,255,0.95)"
        ctx.beginPath()
        ctx.arc(b.x, b.y, 3, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()

        if (b.life <= 0) bullets.splice(i, 1)
      }
    }

    function drawAsteroids() {
      asteroids.forEach((a) => {
        a.x += a.vx
        a.y += a.vy

        ctx.beginPath()
        ctx.arc(a.x, a.y, a.size, 0, Math.PI * 2)
        ctx.strokeStyle = "rgba(200,200,200,0.6)"
        ctx.stroke()
      })
    }

    function drawParticles() {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]

        p.x += p.vx
        p.y += p.vy
        p.life--

        ctx.fillStyle = `rgba(255,255,255,${p.life / 30})`
        ctx.fillRect(p.x, p.y, 2, 2)

        if (p.life <= 0) particles.splice(i, 1)
      }
    }

    function handleCollisions() {
      for (let i = asteroids.length - 1; i >= 0; i--) {
        const a = asteroids[i]

        for (let j = bullets.length - 1; j >= 0; j--) {
          const b = bullets[j]

          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < a.size) {
            score++
            shake = 10

            for (let k = 0; k < 12; k++) {
              particles.push({
                x: a.x,
                y: a.y,
                vx: Math.random() * 2 - 1,
                vy: Math.random() * 2 - 1,
                life: 30,
              })
            }

            if (a.size > 15) {
              for (let k = 0; k < 2; k++) {
                asteroids.push({
                  x: a.x,
                  y: a.y,
                  vx: Math.random() * 2 - 1,
                  vy: Math.random() * 2 - 1,
                  size: a.size / 2,
                })
              }
            }

            asteroids.splice(i, 1)
            bullets.splice(j, 1)
            break
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height)

      autoPlay()

      if (shake > 0) {
        ctx.save()
        ctx.translate(
          Math.random() * shake - shake / 2,
          Math.random() * shake - shake / 2
        )
        shake *= 0.9
      }

      shipX += (mouseX - shipX) * 0.12
      shipY += (mouseY - shipY) * 0.12
      angle = Math.atan2(mouseY - shipY, mouseX - shipX)

      spawnAsteroid()

      drawStars()
      drawShip()
      drawBullets()
      drawAsteroids()
      drawParticles()

      handleCollisions()

      if (shake > 0) ctx.restore()

      requestAnimationFrame(animate)
    }

    animate()

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse") {
        mouseX = e.clientX
        mouseY = e.clientY
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

      const t = e.touches[0]
      mouseX = t.clientX
      mouseY = t.clientY

      shoot()
      playShootSound()

      e.preventDefault()
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isUI(e.target)) return

      const t = e.touches[0]
      mouseX = t.clientX
      mouseY = t.clientY
      lastInputTime = Date.now()

      e.preventDefault()
    }

    const handleTouchEnd = () => {
      isTouching = false
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    document.body.style.userSelect = "none"

    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerdown", handlePointerDown, { passive: false })

    window.addEventListener("touchstart", handleTouchStart, { passive: false })
    window.addEventListener("touchmove", handleTouchMove, { passive: false })
    window.addEventListener("touchend", handleTouchEnd)

    window.addEventListener("resize", handleResize)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).__GAME_SCORE__ = () => score
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).__STARFIELD__ = stars

    return () => {
      document.body.style.userSelect = ""

      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerdown", handlePointerDown)

      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)

      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  )
}