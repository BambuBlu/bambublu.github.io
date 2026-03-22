"use client"
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, ChevronRight, Languages } from "lucide-react";
import styles from "./blogpost.module.css";
import { useAppContext } from "@/app/context/AppContext";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function BlogPostClient({ post }: { post: any }) {
  const { t, lang, toggleLanguage } = useAppContext();

  return (
    <main className={styles.post_wrapper}>
      <div className={styles.static_space_bg} />

      <article className={styles.container}>
        <nav className={styles.nav_header}>
          
          {/* Lado izquierdo: Botón volver y Breadcrumbs */}
          <div className={styles.nav_left}>
            <Link href="/blog" className={styles.back_btn}>
              <ArrowLeft size={18} />
              <span>{t.blog.back}</span>
            </Link>
            
            <div className={styles.breadcrumb}>
              <Link href="/" className={styles.crumb_link}>{t.blog.crumbTerm}</Link>
              <ChevronRight size={14} className={styles.crumb_icon} />
              <Link href="/blog" className={styles.crumb_link}>{t.blog.crumbBlog}</Link>
              <ChevronRight size={14} className={styles.crumb_icon} />
              <span className={styles.crumb_active}>{t.blog.crumbArt}</span>
            </div>
          </div>

          {/* Lado derecho: Botón de Idioma */}
          <button onClick={toggleLanguage} className={styles.lang_toggle_btn}>
            <Languages size={16} />
            <span>{lang === 'es' ? 'EN' : 'ES'}</span>
          </button>
          
        </nav>

        <header className={styles.post_header}>
          <div className={styles.meta_tags}>
            <span className={styles.category_pill}>{post.category}</span>
            <div className={styles.time_info}>
              <span><Calendar size={14} /> {post.date}</span>
              <span><Clock size={14} /> {post.readTime}</span>
            </div>
          </div>
          <h1 className={styles.title}>{post.title}</h1>
        </header>

        <section 
          className={styles.prose} 
          dangerouslySetInnerHTML={{ __html: post.contentHtml }} 
        />
      </article>
    </main>
  );
}