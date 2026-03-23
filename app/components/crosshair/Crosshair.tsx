"use client"
import { useEffect, useRef, useState } from "react";

export function Crosshair() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isTouchDevice = ('ontouchstart' in window) || 
                          (navigator.maxTouchPoints > 0) ||
                          window.matchMedia("(pointer: coarse)").matches;

    if (isTouchDevice) {
      return; 
    }

    setIsVisible(true);

    const updatePosition = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX - 12}px, ${e.clientY - 12}px, 0)`;
        const target = e.target as HTMLElement;
        const isHoveringUI = target.closest('button, a, [data-ui="true"]');
        if (isHoveringUI) {
          cursorRef.current.style.opacity = '0';
        } else {
          cursorRef.current.style.opacity = '1';
        }
      }
    };

    const hideCursor = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '0';
    };

    window.addEventListener("mousemove", updatePosition, { passive: true });
    window.addEventListener("mouseleave", hideCursor);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("mouseleave", hideCursor);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      ref={cursorRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "24px",
        height: "24px",
        border: "1px solid rgba(120, 140, 255, 0.5)",
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 9999999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 0 15px rgba(120, 140, 255, 0.15)",
        transition: "opacity 0.2s ease",
        willChange: "transform, opacity", 
      }}
    >
      <div 
        style={{ 
          width: "4px", 
          height: "4px", 
          backgroundColor: "#ffffff", 
          borderRadius: "50%",
          boxShadow: "0 0 8px rgba(255, 255, 255, 0.8)"
        }} 
      />
    </div>
  );
}