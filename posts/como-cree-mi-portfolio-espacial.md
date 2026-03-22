---
title: "Cómo construí la Terminal Espacial: Next.js + Canvas API"
category: "Desarrollo Web"
date: "22 Mar 2026"
readTime: "10 min"
excerpt: "Un viaje profundo a través del desarrollo de mi portfolio interactivo. Arquitectura, optimización de rendimiento a 60fps y diseño UI/UX Glassmorphism."
---

El desarrollo web tradicional a veces puede sentirse... *estático*. Cuando me propuse rediseñar mi rincón en internet, tenía una regla de oro: **debía sentirse como un videojuego, pero funcionar como una web moderna**.

![Captura de la Terminal Espacial terminada](/blog/terminal-preview.jpg)

En este artículo te cuento paso a paso cómo logré unir el mundo del DOM con el renderizado de alto rendimiento de HTML5 Canvas.

---

## 🛠️ El Stack Tecnológico

Para este proyecto, decidí mantener las dependencias al mínimo y aprovechar las herramientas nativas. Mi stack principal fue:

* **[Next.js 15](https://nextjs.org/)**: Para el enrutamiento, SSR y el motor del blog.
* **React**: Gestión de estado y ciclo de vida de la UI.
* **HTML5 Canvas**: Todo el sistema de partículas, estrellas y colisiones.
* **CSS Modules**: Estilado encapsulado (nada de Tailwind esta vez, quería control total píxel por píxel).

## 🌌 Dando vida al espacio (Canvas)

El mayor desafío no fue dibujar las estrellas, sino **asegurar que el juego corriera a 60 FPS constantes** sin bloquear los hilos de React. 

![Gráfico de rendimiento mostrando 60FPS estables](https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop)

### El bucle de renderizado

Para lograrlo, utilicé `requestAnimationFrame` encapsulado dentro de un `useEffect`. Aquí un fragmento simplificado de cómo se inicializa el motor:

```typescript
useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let animationId: number;

  function animate() {
    animationId = requestAnimationFrame(animate);
    
    // 1. Limpiamos el frame anterior
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 2. Calculamos físicas y colisiones
    updatePhysics();
    
    // 3. Dibujamos la nueva escena
    drawBackground(ctx);
    drawShip(ctx);
  }

  animate(); // ¡Arrancamos el motor!

  return () => cancelAnimationFrame(animationId);
}, []);