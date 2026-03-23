"use client"
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, ChevronRight, Languages } from "lucide-react";
import styles from "./blog.module.css";
import { useAppContext } from "@/app/context/AppContext";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function BlogClient({ posts }: { posts: any[] }) {
  const { t, lang, toggleLanguage } = useAppContext();

  const filteredPosts = posts.filter(post => !post.language || post.language === lang);

  return (
    <main className={styles.blog_wrapper}>
      <div className={styles.static_space_bg} />

      <div className={styles.container}>
        <header className={styles.header}>
          
          <div className={styles.top_bar}>
            
            <div className={styles.nav_left}>
              <Link href="/" className={styles.back_btn}>
                <ArrowLeft size={20} />
                <span>{t.blog.back}</span>
              </Link>

              <div className={styles.breadcrumb}>
                <Link href="/" className={styles.crumb_link}>{t.blog.crumbTerm}</Link>
                <ChevronRight size={14} className={styles.crumb_icon} />
                <span className={styles.crumb_active}>{t.blog.crumbBlog}</span>
              </div>
            </div>
            
            <button aria-label="Change language" onClick={toggleLanguage} className={styles.lang_toggle_btn}>
              <Languages size={16} />
              <span>{lang === 'es' ? 'EN' : 'ES'}</span>
            </button>
            
          </div>
          
          <h1 className={styles.title}>{t.blog.title}</h1>
          <p className={styles.subtitle}>{t.blog.subtitle}</p>
        </header>

        <div className={styles.posts_grid}>
          {filteredPosts.map((post) => (
            <article key={post.slug} className={styles.post_card}>
              <div className={styles.post_meta}>
                <span className={styles.category}>{post.category || 'DevLog'}</span>
                <div className={styles.time_info}>
                  <span>
                    <Calendar size={14} /> 
                    {new Date(post.date).toLocaleDateString(lang === 'es' ? 'es-AR' : 'en-US', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </span>
                  <span><Clock size={14} /> {post.readTime || '5 min'}</span>
                </div>
              </div>
              
              <h2 className={styles.post_title}>{post.title}</h2>
              <p className={styles.post_excerpt}>{post.summary}</p>
              
              <Link href={`/blog/${post.slug}`} className={styles.read_more}>
                {t.blog.readMore} <ChevronRight size={16} />
              </Link>
            </article>
          ))}
          
          {filteredPosts.length === 0 && (
             <p style={{color: 'white', opacity: 0.5}}>{t.blog.empty}</p>
          )}
        </div>
      </div>
    </main>
  );
}