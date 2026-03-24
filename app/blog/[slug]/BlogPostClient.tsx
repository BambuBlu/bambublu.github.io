"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, ChevronRight, Languages, Eye, Heart } from "lucide-react";
import Giscus from "@giscus/react";
import ReactMarkdown from 'react-markdown';
import Zoom from 'react-medium-image-zoom'; 
import styles from "./blogpost.module.css";
import { useAppContext } from "@/app/context/AppContext";
import ImageWithSkeleton from "@/app/components/skeleton/ImageWithSkeleton";
import 'react-medium-image-zoom/dist/styles.css';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function BlogPostClient({ post, slug }: { post: any, slug: string }) {
  const { t, lang, toggleLanguage } = useAppContext();
  
  const [views, setViews] = useState<number>(0);
  const [claps, setClaps] = useState<number>(0);
  const [hasClapped, setHasClapped] = useState<boolean>(false);

  useEffect(() => {
    fetch(`/api/stats?slug=${slug}`) 
      .then(res => res.json())
      .then(data => {
        if (data.views !== undefined) setViews(data.views);
        if (data.claps !== undefined) setClaps(data.claps);
      });

    const viewTimer = setTimeout(() => {
      fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: slug, action: 'view' })
      });
    }, 3000);

    return () => clearTimeout(viewTimer);
  }, [slug]);

  const handleClap = async () => {
    if (hasClapped) return;
    setHasClapped(true);
    setClaps(prev => prev + 1);

    await fetch('/api/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: slug, action: 'clap' }) 
    });
  };

  return (
    <main className={styles.post_wrapper}>
      <div className={styles.static_space_bg} />

      <article className={styles.container}>
        <nav className={styles.nav_header}>
          <div className={styles.nav_actions}>
            <Link href="/blog" className={styles.back_btn}>
              <ArrowLeft size={18} /><span>{t.blog.back}</span>
            </Link>
            <button aria-label="Change language" onClick={toggleLanguage} className={styles.lang_toggle_btn}>
              <Languages size={16} /><span>{lang === 'es' ? 'EN' : 'ES'}</span>
            </button>
          </div>
          
          <div className={styles.breadcrumb}>
            <Link href="/" className={styles.crumb_link}>{t.blog.crumbTerm}</Link>
            <ChevronRight size={14} className={styles.crumb_icon} />
            <Link href="/blog" className={styles.crumb_link}>{t.blog.crumbBlog}</Link>
            <ChevronRight size={14} className={styles.crumb_icon} />
            <span className={styles.crumb_active}>{post.title}</span> 
          </div>
        </nav>

        <header className={styles.post_header}>
          <div className={styles.meta_tags}>
            <span className={styles.category_pill}>{post.category || 'Development'}</span>
            <div className={styles.time_info}>
              <span><Calendar size={14} /> {new Date(post.date).toLocaleDateString(lang === 'es' ? 'es-AR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span><Clock size={14} /> {post.readTime}</span>
              <span className={styles.stats_badge}><Eye size={14} /> {views}</span>
              <span className={styles.stats_badge}><Heart size={14} /> {claps}</span>
            </div>
          </div>
          <h1 className={styles.title}>{post.title}</h1>
        </header>

        <section className={styles.prose}>
          <ReactMarkdown
            components={{
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              img: ({ node, ...props }) => {
                if (!props.src) return null;

                return (
                  <figure style={{ margin: '40px 0', width: '100%', boxSizing: 'border-box' }}>
                    <Zoom classDialog="dark_zoom" zoomMargin={45}> 
                      <ImageWithSkeleton
                        src={props.src as string}
                        alt={props.alt || 'Imagen del blog'}
                        width={1920} 
                        height={1080}
                        style={{ 
                          width: '100%', 
                          maxWidth: '100%', 
                          height: 'auto', 
                          objectFit: 'cover',
                          cursor: 'zoom-in',
                          display: 'block'
                        }}
                        borderRadius="16px"
                      />
                    </Zoom>
                    {props.alt && (
                      <figcaption style={{ display: 'block', textAlign: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: '16px' }}>
                        {props.alt}
                      </figcaption>
                    )}
                  </figure>
                );
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
        </section>

        <div className={styles.interaction_section}>
          <button 
            onClick={handleClap} 
            className={`${styles.clap_btn} ${hasClapped ? styles.clapped : ''}`}
            disabled={hasClapped}
          >
            <Heart size={20} className={hasClapped ? styles.heart_filled : ''} />
            <span>{hasClapped ? (lang === 'es' ? '¡Gracias!' : 'Thanks!') : (lang === 'es' ? 'Me gusta' : 'Like')}</span>
            <div className={styles.clap_count}>{claps}</div>
          </button>
        </div>

        <div className={styles.comments_section}>
          <h3 className={styles.comments_title}>{lang === 'es' ? 'Comentarios' : 'Comments'}</h3>
          <Giscus
            id="comments"
            repo="BambuBlu/bambublu.github.io"
            repoId="R_kgDOKH_uPw" 
            category="General"
            categoryId="DIC_kwDOKH_uP84C5H0l" 
            mapping="pathname" 
            term="Welcome to @giscus/react component!"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="top"
            theme="transparent_dark" 
            lang={lang}
            loading="lazy"
          />
        </div>

      </article>
    </main>
  );
}