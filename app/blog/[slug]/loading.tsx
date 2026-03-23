"use client"
import { ArrowLeft, ChevronRight, Languages } from "lucide-react";
import styles from "./blogpost.module.css";
import { useAppContext } from "@/app/context/AppContext";
import Skeleton from "@/app/components/skeleton/Skeleton";

export default function LoadingSlug() {
  const { t, lang } = useAppContext();

  return (
    <main className={styles.post_wrapper}>
      <div className={styles.static_space_bg} />

      <article className={styles.container}>
        <nav className={styles.nav_header}>
          <div className={styles.nav_left}>
            <div className={styles.back_btn} style={{ pointerEvents: 'none', opacity: 0.7 }}>
              <ArrowLeft size={18} />
              <span>{t.blog.back}</span>
            </div>
            
            <div className={styles.breadcrumb}>
              <span className={styles.crumb_link}>{t.blog.crumbTerm}</span>
              <ChevronRight size={14} className={styles.crumb_icon} />
              <span className={styles.crumb_link}>{t.blog.crumbBlog}</span>
              <ChevronRight size={14} className={styles.crumb_icon} />
              <Skeleton width="100px" height="16px" borderRadius="4px" />
            </div>
          </div>

          <div className={styles.lang_toggle_btn} style={{ pointerEvents: 'none', opacity: 0.7 }}>
            <Languages size={16} />
            <span>{lang === 'es' ? 'EN' : 'ES'}</span>
          </div>
        </nav>

        <header className={styles.post_header}>
          <div className={styles.meta_tags}>
            <Skeleton width="120px" height="32px" borderRadius="8px" />
            <Skeleton width="180px" height="20px" borderRadius="6px" />
          </div>
          <Skeleton width="85%" height="60px" borderRadius="12px" style={{ marginTop: '16px' }} />
          <Skeleton width="60%" height="60px" borderRadius="12px" style={{ marginTop: '8px' }} />
        </header>

        <section className={styles.prose}>
          <Skeleton width="100%" height="22px" style={{ marginBottom: '12px' }} />
          <Skeleton width="100%" height="22px" style={{ marginBottom: '12px' }} />
          <Skeleton width="75%" height="22px" style={{ marginBottom: '32px' }} />

          <Skeleton width="100%" height="350px" borderRadius="16px" style={{ margin: '32px 0' }} />

          <Skeleton width="40%" height="32px" borderRadius="8px" style={{ marginTop: '40px', marginBottom: '24px' }} />

          <Skeleton width="100%" height="22px" style={{ marginBottom: '12px' }} />
          <Skeleton width="100%" height="22px" style={{ marginBottom: '12px' }} />
          <Skeleton width="100%" height="22px" style={{ marginBottom: '12px' }} />
          <Skeleton width="50%" height="22px" style={{ marginBottom: '32px' }} />
        </section>
      </article>
    </main>
  );
}