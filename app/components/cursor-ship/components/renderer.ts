// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function render(ctx: CanvasRenderingContext2D, state: any) {
  const { width, height, shipX, shipY, angle, stars, engine } = state
  const { shake } = engine.getState()

  ctx.clearRect(0, 0, width, height)

  if (shake > 0) {
    ctx.save()
    ctx.translate(
      Math.random() * shake - shake / 2,
      Math.random() * shake - shake / 2
    )
  }

  ctx.fillStyle = "rgba(255,255,255,0.5)"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stars.forEach((s: any) => {
    ctx.fillRect(s.x, s.y, s.size, s.size)
  })

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  engine.bullets.forEach((b: any) => {
    ctx.save()
    ctx.shadowBlur = 30
    ctx.shadowColor = "rgba(120,140,255,0.9)"

    ctx.fillStyle = "rgba(180,200,255,0.95)"
    ctx.beginPath()
    ctx.arc(b.x, b.y, 3, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  engine.asteroids.forEach((a: any) => {
    ctx.beginPath()
    ctx.arc(a.x, a.y, a.size, 0, Math.PI * 2)
    ctx.strokeStyle = "rgba(200,200,200,0.6)"
    ctx.stroke()
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  engine.particles.forEach((p: any) => {
    ctx.fillStyle = `rgba(255,255,255,${p.life / 30})`
    ctx.fillRect(p.x, p.y, 2, 2)
  })

  if (shake > 0) ctx.restore()
}