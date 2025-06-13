document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("projectList");
    const sidebar = document.getElementById("sidebarRecent");

    const searchInput = document.getElementById("searchInput");
    const tagFilter = document.getElementById("tagFilter");
    const monthFilter = document.getElementById("monthFilter");
    const sortOrder = document.getElementById("sortOrder");
    const clearBtn = document.getElementById("clearFilters");

    const ENTRIES_PER_PAGE = 2;
    let currentPage = 1;
    let allProjects = [];
    let filtered = [];


    fetch("../assets/json/projects.json")
        .then(res => res.json())
        .then(files => {
            return Promise.all(
                files.map(path =>
                    fetch(path)
                        .then(res => res.json())
                        .then(json => {
                            const name = path.split("/").pop().replace("entries_", "").replace(".json", "");
                            const first = json[0];
                            const coverBlock = first.content.find(c => c.type === "image");
                            const textBlock = first.content.find(c => c.type === "text");

                            return {
                                title: first.title,
                                date: first.date,
                                tags: first.tags || [],
                                cover: coverBlock ? coverBlock.src : "",
                                description: textBlock ? textBlock.value : "",
                                link: `../subpages/${name}.html`
                            };
                        })
                )
            );
        })
        .then(data => {
            allProjects = data.sort((a, b) => new Date(b.date) - new Date(a.date));
            generateFilters(allProjects);
            renderSidebar(allProjects);
            applyFilters();
        })
        .catch(err => console.error("Error loading projects:", err));


    function generateFilters(projects) {
        const tags = new Set();
        const months = new Set();

        projects.forEach(p => {
            (p.tags || []).forEach(t => tags.add(t));
            const date = new Date(p.date);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            months.add(key);
        });

        tagFilter.innerHTML = `<option value="all">All</option>`;
        [...tags].sort().forEach(tag => {
            const opt = document.createElement("option");
            opt.value = tag;
            opt.textContent = capitalize(tag);
            tagFilter.appendChild(opt);
        });

        monthFilter.innerHTML = `<option value="all">All</option>`;
        [...months].sort((a, b) => b.localeCompare(a)).forEach(m => {
            const [y, mo] = m.split("-");
            const opt = document.createElement("option");
            opt.value = m;
            opt.textContent = `${getMonthName(mo)} ${y}`;
            monthFilter.appendChild(opt);
        });
    }

    function applyFilters() {
        const keyword = searchInput.value.toLowerCase();
        const tag = tagFilter.value;
        const month = monthFilter.value;
        const order = sortOrder.value;

        filtered = allProjects.filter(p => {
            const textMatch =
                p.title.toLowerCase().includes(keyword) ||
                (p.description && p.description.toLowerCase().includes(keyword));

            const tagMatch =
                tag === "all" || (p.tags && p.tags.includes(tag));

            const monthMatch =
                month === "all" || new Date(p.date).toISOString().slice(0, 7) === month;

            return textMatch && tagMatch && monthMatch;
        });

        filtered.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return order === "asc" ? dateA - dateB : dateB - dateA;
        });

        renderPage(1);
    }

    function renderPage(page) {
        currentPage = page;
        container.innerHTML = "";

        const start = (page - 1) * ENTRIES_PER_PAGE;
        const end = start + ENTRIES_PER_PAGE;
        const visible = filtered.slice(start, end);

        visible.forEach(renderProject);
        renderPagination();
    }

    function renderProject(project) {
        const article = document.createElement("article");
        article.classList.add("article-recent");

        article.innerHTML = `
      <img src="${project.cover}" class="article-image" alt="${project.title}" />
      <div class="article-recent-main">
        <h2 class="article-title">${project.title}</h2>
        <div class="entry-tags">
          ${project.tags.map(t => `<span class="entry-tag ${t}">${t}</span>`).join("")}
        </div>
        <p class="article-info">${formatDate(project.date)}</p>
        <p class="entry-blog-body">${project.description}</p>
        <a href="${project.link}" class="article-read-more">Read more →</a>
      </div>
    `;

        container.appendChild(article);
    }

    function renderPagination() {
        const pagination = document.querySelector(".pagination");
        pagination.innerHTML = "";

        const totalPages = Math.ceil(filtered.length / ENTRIES_PER_PAGE);
        if (totalPages <= 1) return;

        const nav = document.createElement("nav");
        nav.classList.add("pagination__nav");

        const createBtn = (label, page, disabled = false, active = false) => {
            const btn = document.createElement("button");
            btn.textContent = label;
            btn.disabled = disabled;
            if (active) btn.classList.add("pagination__active");
            btn.addEventListener("click", () => renderPage(page));
            return btn;
        };

        nav.appendChild(createBtn("« Previous", currentPage - 1, currentPage === 1));

        let start = Math.max(1, currentPage - 1);
        let end = Math.min(start + 2, totalPages);
        if (end - start < 2) start = Math.max(1, end - 2);

        for (let i = start; i <= end; i++) {
            nav.appendChild(createBtn(`Page ${i}`, i, false, i === currentPage));
        }

        nav.appendChild(createBtn("Next »", currentPage + 1, currentPage === totalPages));
        pagination.appendChild(nav);
    }

    function renderSidebar(projects) {
        const recent = projects.slice(0, 3);
        sidebar.innerHTML = "";

        recent.forEach(p => {
            const post = document.createElement("div");
            post.classList.add("widget-recent-post");

            post.innerHTML = `
              <div class="widget-post-content">
                <span class="widget-recent-post-title">${p.title}</span>
                <img src="${p.cover}" alt="${p.title}" class="widget-image" />
              </div>
            `;

            post.addEventListener("click", () => window.location.href = p.link);
            sidebar.appendChild(post);
        });
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function getMonthName(m) {
        return new Date(2000, parseInt(m) - 1).toLocaleString("en-US", { month: "long" });
    }

    function formatDate(iso) {
        const [year, month, day] = iso.split("-");
        const d = new Date(+year, +month - 1, +day);
        return d.toLocaleDateString("en-US", {
            year: "numeric", month: "long", day: "numeric"
        });
    }

    searchInput.addEventListener("input", applyFilters);
    tagFilter.addEventListener("change", applyFilters);
    monthFilter.addEventListener("change", applyFilters);
    sortOrder.addEventListener("change", applyFilters);
    clearBtn.addEventListener("click", () => {
        searchInput.value = "";
        tagFilter.value = "all";
        monthFilter.value = "all";
        sortOrder.value = "desc";
        applyFilters();
    });
});


