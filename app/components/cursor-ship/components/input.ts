export function createInput(onShoot: () => void) {
  let mouseX = window.innerWidth / 2
  let mouseY = window.innerHeight / 2
  let lastInputTime = Date.now()
  let isTouching = false

  const isUI = (target: EventTarget | null) =>
    target instanceof HTMLElement && target.closest("[data-ui]")

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
    onShoot()
    e.preventDefault()
  }

  const handleTouchStart = (e: TouchEvent) => {
    if (isUI(e.target)) return

    isTouching = true
    lastInputTime = Date.now()

    const t = e.touches[0]
    mouseX = t.clientX
    mouseY = t.clientY

    onShoot()
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

  function mount() {
    document.body.style.userSelect = "none"

    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerdown", handlePointerDown, { passive: false })

    window.addEventListener("touchstart", handleTouchStart, { passive: false })
    window.addEventListener("touchmove", handleTouchMove, { passive: false })
    window.addEventListener("touchend", handleTouchEnd)
  }

  function unmount() {
    document.body.style.userSelect = ""

    window.removeEventListener("pointermove", handlePointerMove)
    window.removeEventListener("pointerdown", handlePointerDown)

    window.removeEventListener("touchstart", handleTouchStart)
    window.removeEventListener("touchmove", handleTouchMove)
    window.removeEventListener("touchend", handleTouchEnd)
  }

  return {
    mount,
    unmount,
    getState: () => ({ mouseX, mouseY, lastInputTime, isTouching }),
  }
}