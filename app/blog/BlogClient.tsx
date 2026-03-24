"use client"
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import { ArrowLeft, Calendar, Clock, ChevronRight, Languages, Search, Tag as TagIcon, X, Filter, ChevronDown, Check } from "lucide-react";
import styles from "./blog.module.css";
import { useAppContext } from "@/app/context/AppContext";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function BlogClient({ posts }: { posts: any[] }) {
  const { t, lang, toggleLanguage } = useAppContext();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, shortest
  const [isSortOpen, setIsSortOpen] = useState(false);

  const basePosts = useMemo(() => posts.filter(p => !p.language || p.language === lang), [posts, lang]);
  
  const categories = useMemo(() => ["All", ...Array.from(new Set(basePosts.map(p => p.category)))], [basePosts]);
  const allTags = useMemo(() => Array.from(new Set(basePosts.flatMap(p => p.tags))), [basePosts]);

  const fuse = useMemo(() => new Fuse(basePosts, {
    keys: [
      { name: 'title', weight: 2.0 },
      { name: 'tags', weight: 1.5 },
      { name: 'summary', weight: 1.0 },
      { name: 'slug', weight: 0.5 }
    ],
    threshold: 0.4,
    includeScore: true
  }), [basePosts]);

  const filteredAndSortedPosts = useMemo(() => {
    let result = basePosts;

    if (searchQuery.trim()) {
      result = fuse.search(searchQuery).map(res => res.item);
    }

    if (selectedCategory !== "All") {
      result = result.filter(post => post.category === selectedCategory);
    }

    if (selectedTags.length > 0) {
      result = result.filter(post => 
        selectedTags.every(tag => post.tags.includes(tag))
      );
    }

    return result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      
      if (sortBy === "newest") return dateB - dateA;
      if (sortBy === "oldest") return dateA - dateB;
      if (sortBy === "shortest") {
        const timeA = parseInt(a.readTime) || 99;
        const timeB = parseInt(b.readTime) || 99;
        return timeA - timeB;
      }
      return 0;
    });
  }, [basePosts, searchQuery, selectedCategory, selectedTags, sortBy, fuse]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Bloqueo estricto del scroll del fondo al abrir el menú
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.style.overflow = isSortOpen ? 'hidden' : 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isSortOpen]);

  return (
    <main className={styles.blog_wrapper}>
      <div className={styles.static_space_bg} />

      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.top_bar}>
            <div className={styles.nav_left}>
              <Link href="/" className={styles.back_btn}><ArrowLeft size={20} /><span>{t.blog.back}</span></Link>
              <div className={styles.breadcrumb}>
                <Link href="/" className={styles.crumb_link}>{t.blog.crumbTerm}</Link><ChevronRight size={14} className={styles.crumb_icon} /><span className={styles.crumb_active}>{t.blog.crumbBlog}</span>
              </div>
            </div>
            <button onClick={toggleLanguage} className={styles.lang_toggle_btn}><Languages size={16} /><span>{lang === 'es' ? 'EN' : 'ES'}</span></button>
          </div>
          <h1 className={styles.title}>{t.blog.title}</h1>
          <p className={styles.subtitle}>{t.blog.subtitle}</p>
        </header>

        <div className={styles.super_search_panel}>
          
          <div className={styles.search_row}>
            <div className={styles.search_input_wrapper}>
              <Search className={styles.search_icon} size={18} />
              <input 
                type="text" 
                placeholder={lang === 'es' ? "Buscar por título, tag o palabra clave..." : "Search by title, tag or keyword..."}
                className={styles.search_input}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && <button className={styles.clear_search} onClick={() => setSearchQuery("")}><X size={14} /></button>}
            </div>

            <div className={styles.custom_select_wrapper}>
              <button 
                className={styles.sort_trigger} 
                onClick={() => setIsSortOpen(!isSortOpen)}
                aria-expanded={isSortOpen}
              >
                {sortBy === "newest" ? (lang === 'es' ? "Más recientes" : "Newest first") :
                 sortBy === "oldest" ? (lang === 'es' ? "Más antiguos" : "Oldest first") :
                 (lang === 'es' ? "Lectura rápida" : "Quick read")}
                <ChevronDown size={16} className={`${styles.sort_icon} ${isSortOpen ? styles.sort_icon_open : ''}`} />
              </button>

              {isSortOpen && (
                <div 
                  className={styles.sort_overlay} 
                  onClick={() => setIsSortOpen(false)} 
                  onTouchStart={() => setIsSortOpen(false)}
                />
              )}

              <div className={`${styles.sort_menu} ${isSortOpen ? styles.sort_menu_open : ''}`}>
                <div className={styles.sort_menu_handle} onClick={() => setIsSortOpen(false)} onTouchStart={() => setIsSortOpen(false)} />
                <span className={styles.sort_menu_title}>{lang === 'es' ? "Ordenar por" : "Sort by"}</span>
                
                <button 
                  className={`${styles.sort_option} ${sortBy === "newest" ? styles.sort_option_active : ''}`}
                  onClick={() => { setSortBy("newest"); setIsSortOpen(false); }}
                >
                  {lang === 'es' ? "Más recientes" : "Newest first"}
                  {sortBy === "newest" && <Check size={16} />}
                </button>
                
                <button 
                  className={`${styles.sort_option} ${sortBy === "oldest" ? styles.sort_option_active : ''}`}
                  onClick={() => { setSortBy("oldest"); setIsSortOpen(false); }}
                >
                  {lang === 'es' ? "Más antiguos" : "Oldest first"}
                  {sortBy === "oldest" && <Check size={16} />}
                </button>
                
                <button 
                  className={`${styles.sort_option} ${sortBy === "shortest" ? styles.sort_option_active : ''}`}
                  onClick={() => { setSortBy("shortest"); setIsSortOpen(false); }}
                >
                  {lang === 'es' ? "Lectura rápida" : "Quick read"}
                  {sortBy === "shortest" && <Check size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className={styles.filters_row}>
            <div className={styles.categories_scroll}>
              <Filter size={16} className={styles.filter_icon}/>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`${styles.pill_btn} ${selectedCategory === cat ? styles.pill_active : ""}`}
                >
                  {cat === "All" ? (lang === 'es' ? "Todos" : "All") : cat}
                </button>
              ))}
            </div>

            {allTags.length > 0 && (
              <div className={styles.tags_scroll}>
                <TagIcon size={16} className={styles.filter_icon}/>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`${styles.tag_btn} ${selectedTags.includes(tag) ? styles.tag_active : ""}`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.posts_grid}>
          <div className={styles.results_count}>
            {filteredAndSortedPosts.length} {lang === 'es' ? "resultados encontrados" : "results found"}
          </div>

          {filteredAndSortedPosts.map((post) => (
            <article key={post.slug} className={styles.post_card}>
              <div className={styles.post_meta}>
                <span className={styles.category}>{post.category}</span>
                <div className={styles.time_info}>
                  <span><Calendar size={14} /> {new Date(post.date).toLocaleDateString(lang === 'es' ? 'es-AR' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span><Clock size={14} /> {post.readTime}</span>
                </div>
              </div>
              
              <h2 className={styles.post_title}>{post.title}</h2>
              <p className={styles.post_excerpt}>{post.summary}</p>
              
              {post.tags && post.tags.length > 0 && (
                <div className={styles.card_tags}>
                  {post.tags.map((t: string) => <span key={t}>#{t}</span>)}
                </div>
              )}
              
              <Link href={`/blog/${post.slug}`} className={styles.read_more}>
                {t.blog.readMore} <ChevronRight size={16} />
              </Link>
            </article>
          ))}
          
          {filteredAndSortedPosts.length === 0 && (
            <div className={styles.empty_state}>
              <p>{lang === 'es' ? "Tus filtros no arrojaron resultados en la base de datos." : "Your filters yielded no results in the database."}</p>
              <button onClick={() => {setSearchQuery(""); setSelectedCategory("All"); setSelectedTags([]);}} className={styles.reset_btn}>
                {lang === 'es' ? "Limpiar terminal de búsqueda" : "Clear search terminal"}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}