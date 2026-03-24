import styles from "./header.module.css"

export function Header() {
  return (
    <header className={styles.header}>
      <h1 id="hero-logo" className={styles.logo}>
        Tobías Moscatelli
      </h1>
      
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if (window.matchMedia("(min-width: 769px)").matches) {
              document.addEventListener("mousemove", function(e) {
                var logo = document.getElementById("hero-logo");
                if (!logo) return;
                var val = Math.abs(e.clientX - window.innerWidth / 2) / window.innerWidth;
                var intensity = 0.3 + val * 0.7;
                logo.style.textShadow = "0 0 " + (20 * intensity) + "px rgba(180,200,255," + intensity + ")";
              });
            }
          `
        }}
      />
    </header>
  )
}