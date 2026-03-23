import { Bullet, Asteroid, Particle, Star } from "./entities"

export function createEngine(stars: Star[]) {
  const bullets: Bullet[] = []
  const asteroids: Asteroid[] = []
  const particles: Particle[] = []

  let shake = 0
  let score = 0

  function shoot(x: number, y: number, angle: number) {
    bullets.push({
      x,
      y,
      vx: Math.cos(angle) * 6,
      vy: Math.sin(angle) * 6,
      life: 60,
    })
  }

  function spawnAsteroid(width: number, height: number, limit: number) {
    if (asteroids.length < limit && Math.random() < 0.02) {
      asteroids.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.random() * 1 - 0.5,
        vy: Math.random() * 1 - 0.5,
        size: Math.random() * 25 + 20,
      })
    }
  }

  function update() {
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

      if (b.life <= 0) bullets.splice(i, 1)
    }

    asteroids.forEach((a) => {
        a.x += a.vx
        a.y += a.vy

        if (a.x < -a.size) a.x = window.innerWidth + a.size
        if (a.x > window.innerWidth + a.size) a.x = -a.size

        if (a.y < -a.size) a.y = window.innerHeight + a.size
        if (a.y > window.innerHeight + a.size) a.y = -a.size
    })

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.x += p.vx
      p.y += p.vy
      p.life--

      if (p.life <= 0) particles.splice(i, 1)
    }
  }

  function handleCollisions() {
    let hit = false
    let points = 0

    for (let i = asteroids.length - 1; i >= 0; i--) {
        const a = asteroids[i]

        for (let j = bullets.length - 1; j >= 0; j--) {
        const b = bullets[j]

        const dx = a.x - b.x
        const dy = a.y - b.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < a.size) {
            hit = true
            points++

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

    return { hit, points }
    }

  function decayShake() {
    shake *= 0.9
  }

  return {
    bullets,
    asteroids,
    particles,
    shoot,
    spawnAsteroid,
    update,
    handleCollisions,
    decayShake,
    getState: () => ({ shake, score }),
  }
}