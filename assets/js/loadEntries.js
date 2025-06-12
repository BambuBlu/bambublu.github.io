document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("entryContainer");
    const pagTop = document.getElementById("pagination-top");
    const pagBottom = document.getElementById("pagination-bottom");

    const searchInput = document.getElementById("searchInput");
    const tagFilter = document.getElementById("tagFilter");
    const monthFilter = document.getElementById("monthFilter");
    const sortOrder = document.getElementById("sortOrder");

    const ENTRIES_PER_PAGE = 2;

    let entries = [];
    let filteredEntries = [];
    let currentPage = 1;

    fetch("../assets/js/entries.json")
        .then(res => res.json())
        .then(data => {
            entries = data;
            generateTagOptions(entries);
            generateMonthOptions(entries);
            applyFiltersFromURL();
            applyFilters();
        })
        .catch(err => console.error("Error loading entries:", err));

    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedTag = tagFilter.value;
        const selectedMonth = monthFilter.value;
        const sort = sortOrder.value;

        filteredEntries = entries.filter(entry => {
            const titleMatch = entry.title.toLowerCase().includes(searchTerm);
            const textMatch = entry.content.some(block =>
                block.type === "text" && block.value.toLowerCase().includes(searchTerm)
            );
            const keywordMatch = titleMatch || textMatch;

            const tagMatch = selectedTag === "all" || (entry.tags && entry.tags.includes(selectedTag));
            const monthMatch = selectedMonth === "all" || entry.date.startsWith(selectedMonth);

            return keywordMatch && tagMatch && monthMatch;
        });

        filteredEntries.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sort === "asc" ? dateA - dateB : dateB - dateA;
        });

        updateURLParams();
        renderPage(1);
    }

    function renderPage(page) {
        currentPage = page;
        container.innerHTML = "";
        pagTop.innerHTML = "";
        pagBottom.innerHTML = "";

        const start = (page - 1) * ENTRIES_PER_PAGE;
        const end = start + ENTRIES_PER_PAGE;
        const visible = filteredEntries.slice(start, end);

        visible.forEach(renderEntry);
        renderPagination(pagTop, page);
        renderPagination(pagBottom, page);
    }

    function renderEntry(entry) {
        const article = document.createElement("article");
        article.classList.add("entry-blog");

        const meta = document.createElement("div");
        meta.classList.add("entry-blog-meta");
        const date = document.createElement("p");
        date.classList.add("entry-blog-date");
        date.textContent = `Entry | ${formatDate(entry.date)}`;
        meta.appendChild(date);
        article.appendChild(meta);

        const mainContent = document.createElement("div");
        mainContent.classList.add("entry-blog-main");

        const title = document.createElement("h2");
        title.classList.add("entry-blog-title");
        title.textContent = entry.title;
        mainContent.appendChild(title);

        if (entry.tags && entry.tags.length > 0) {
            const tagWrapper = document.createElement("div");
            tagWrapper.classList.add("entry-tags");

            entry.tags.forEach(tag => {
                const tagEl = document.createElement("span");
                tagEl.classList.add("entry-tag");

                const safeTag = tag.toLowerCase().replace(/\s+/g, "-");
                tagEl.classList.add(safeTag || "default");

                tagEl.textContent = tag;
                tagWrapper.appendChild(tagEl);
            });

            mainContent.appendChild(tagWrapper);
        }


        entry.content.forEach(block => {
            let el;
            switch (block.type) {
                case "text":
                    el = document.createElement("p");
                    el.classList.add("entry-blog-body");
                    el.textContent = block.value;
                    break;
                case "image":
                case "gif":
                    el = document.createElement("img");
                    el.src = block.src;
                    el.alt = block.alt || "";
                    el.classList.add(block.type === "gif" ? "entry-gif" : "entry-image");
                    break;
                case "code":
                    el = document.createElement("pre");
                    el.classList.add("entry-code");
                    const code = document.createElement("code");
                    code.textContent = block.value;
                    el.appendChild(code);
                    break;
                case "video":
                    el = document.createElement("div");
                    el.classList.add("entry-video");
                    const iframe = document.createElement("iframe");
                    iframe.src = block.src;
                    iframe.title = block.title || "Video demo";
                    iframe.frameBorder = 0;
                    iframe.allowFullscreen = true;
                    el.appendChild(iframe);
                    break;
            }
            if (el) mainContent.appendChild(el);
        });

        article.appendChild(mainContent);
        container.appendChild(article);
    }

    function renderPagination(wrapper, currentPage) {
        const totalPages = Math.ceil(filteredEntries.length / ENTRIES_PER_PAGE);
        if (totalPages <= 1) return;

        const nav = document.createElement("nav");
        nav.classList.add("pagination__nav");

        const buildButton = (label, page, disabled = false, active = false) => {
            const btn = document.createElement("button");
            btn.textContent = label;
            btn.disabled = disabled;
            if (active) btn.classList.add("pagination__active");
            btn.addEventListener("click", () => {
                currentPage = page;
                updateURLParams();
                renderPage(page);
            });
            return btn;
        };

        nav.appendChild(buildButton("« Anterior", currentPage - 1, currentPage === 1));

        let startPage = Math.max(1, currentPage - 1);
        let endPage = Math.min(startPage + 2, totalPages);
        if (endPage - startPage < 2) {
            startPage = Math.max(1, endPage - 2);
        }

        for (let i = startPage; i <= endPage; i++) {
            nav.appendChild(buildButton(`Página ${i}`, i, false, i === currentPage));
        }

        nav.appendChild(buildButton("Siguiente »", currentPage + 1, currentPage === totalPages));
        wrapper.appendChild(nav);
    }

    function formatDate(iso) {
        const d = new Date(iso);
        return d.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    }

    function generateTagOptions(entries) {
        const tagSet = new Set();
        entries.forEach(entry => {
            (entry.tags || []).forEach(tag => tagSet.add(tag));
        });

        const sortedTags = Array.from(tagSet).sort();

        tagFilter.innerHTML = '<option value="all">All</option>';
        sortedTags.forEach(tag => {
            const opt = document.createElement("option");
            opt.value = tag;
            opt.textContent = capitalize(tag);
            tagFilter.appendChild(opt);
        });
    }

    function generateMonthOptions(entries) {
        const monthSet = new Set();
        entries.forEach(entry => {
            const [year, month] = entry.date.split("-");
            monthSet.add(`${year}-${month}`);
        });

        const sorted = Array.from(monthSet).sort((a, b) => new Date(b + "-01") - new Date(a + "-01"));

        monthFilter.innerHTML = '<option value="all">All</option>';
        sorted.forEach(monthKey => {
            const [year, month] = monthKey.split("-");
            const label = `${capitalize(new Date(monthKey + "-01").toLocaleString("default", { month: "long" }))} ${year}`;
            const opt = document.createElement("option");
            opt.value = monthKey;
            opt.textContent = label;
            monthFilter.appendChild(opt);
        });
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function updateURLParams() {
        const params = new URLSearchParams();
        params.set("search", searchInput.value);
        params.set("tag", tagFilter.value);
        params.set("month", monthFilter.value);
        params.set("sort", sortOrder.value);
        params.set("page", currentPage);
        history.replaceState(null, "", "?" + params.toString());
    }

    function applyFiltersFromURL() {
        const params = new URLSearchParams(window.location.search);
        searchInput.value = params.get("search") || "";
        tagFilter.value = params.get("tag") || "all";
        monthFilter.value = params.get("month") || "all";
        sortOrder.value = params.get("sort") || "desc";
        currentPage = parseInt(params.get("page")) || 1;
    }

    // Events
    searchInput.addEventListener("input", applyFilters);
    tagFilter.addEventListener("change", applyFilters);
    monthFilter.addEventListener("change", applyFilters);
    sortOrder.addEventListener("change", applyFilters);
});




