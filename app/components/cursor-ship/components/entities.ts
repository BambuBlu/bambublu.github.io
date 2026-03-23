export type Bullet = { x: number; y: number; vx: number; vy: number; life: number }
export type Asteroid = { x: number; y: number; vx: number; vy: number; size: number }
export type Particle = { x: number; y: number; vx: number; vy: number; life: number }
export type Star = { x: number; y: number; size: number }

export function createStars(count: number, width: number, height: number): Star[] {
  return Array.from({ length: count }).map(() => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 1.2,
  }))
}