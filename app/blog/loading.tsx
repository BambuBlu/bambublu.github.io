"use client"
import { ArrowLeft, ChevronRight, Languages, Search, Filter, Tag as TagIcon } from "lucide-react";
import styles from "./blog.module.css";
import { useAppContext } from "@/app/context/AppContext";
import Skeleton from "@/app/components/skeleton/Skeleton";

export default function LoadingBlogIndex() {
  const { t, lang } = useAppContext();

  return (
    <main className={styles.blog_wrapper}>
      <div className={styles.static_space_bg} />

      <div className={styles.container}>
        
        <header className={styles.header}>
          <div className={styles.top_bar}>
            <div className={styles.nav_left}>
              <div className={styles.back_btn} style={{ pointerEvents: 'none', opacity: 0.7 }}>
                <ArrowLeft size={20} />
                <span>{t.blog.back}</span>
              </div>
              <div className={styles.breadcrumb}>
                <span className={styles.crumb_link}>{t.blog.crumbTerm}</span>
                <ChevronRight size={14} className={styles.crumb_icon} />
                <span className={styles.crumb_active}>{t.blog.crumbBlog}</span>
              </div>
            </div>
            <div className={styles.lang_toggle_btn} style={{ pointerEvents: 'none', opacity: 0.7 }}>
              <Languages size={16} />
              <span>{lang === 'es' ? 'EN' : 'ES'}</span>
            </div>
          </div>
          <h1 className={styles.title}>{t.blog.title}</h1>
          <p className={styles.subtitle}>{t.blog.subtitle}</p>
        </header>

        <div className={styles.super_search_panel} style={{ pointerEvents: 'none' }}>
          <div className={styles.search_row}>
            <div className={styles.search_input_wrapper}>
              <Search className={styles.search_icon} size={18} />
              <Skeleton width="100%" height="50px" borderRadius="12px" />
            </div>
            <Skeleton width="180px" height="50px" borderRadius="12px" />
          </div>

          <div className={styles.filters_row}>
            <div className={styles.categories_scroll}>
              <Filter size={16} className={styles.filter_icon}/>
              <Skeleton width="60px" height="30px" borderRadius="20px" />
              <Skeleton width="90px" height="30px" borderRadius="20px" />
              <Skeleton width="110px" height="30px" borderRadius="20px" />
            </div>
            <div className={styles.tags_scroll}>
              <TagIcon size={16} className={styles.filter_icon}/>
              <Skeleton width="70px" height="24px" borderRadius="8px" />
              <Skeleton width="85px" height="24px" borderRadius="8px" />
            </div>
          </div>
        </div>

        <div className={styles.posts_grid}>
          <div className={styles.results_count}>
            <Skeleton width="120px" height="16px" borderRadius="4px" style={{ marginLeft: 'auto' }} />
          </div>

          {[1, 2, 3].map((item) => (
            <article key={item} className={styles.post_card} style={{ pointerEvents: 'none' }}>
              
              <div className={styles.post_meta}>
                <Skeleton width="100px" height="26px" borderRadius="6px" />
                <Skeleton width="160px" height="20px" borderRadius="4px" />
              </div>
              
              <Skeleton width="75%" height="32px" borderRadius="8px" style={{ marginTop: '8px' }} />
              
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Skeleton width="100%" height="20px" borderRadius="6px" />
                <Skeleton width="85%" height="20px" borderRadius="6px" />
              </div>
              
              <div className={styles.card_tags} style={{ marginTop: '16px' }}>
                <Skeleton width="50px" height="20px" borderRadius="4px" />
                <Skeleton width="65px" height="20px" borderRadius="4px" />
              </div>
              
              <Skeleton width="110px" height="20px" borderRadius="4px" style={{ marginTop: '20px' }} />
            </article>
          ))}
        </div>

      </div>
    </main>
  );
}