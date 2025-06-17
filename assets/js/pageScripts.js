const navMenu = document.getElementById("nav-menu"),
  navToggle = document.getElementById("nav-toggle");
navClose = document.getElementById("nav-close");
if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.add("show-menu");
  });
}

if (navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-menu");
  });
}

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll(".nav__link");

function linkAction() {
  const navMenu = document.getElementById("nav-menu");
  // When we click on each nav__link, we remove the show-menu class
  navMenu.classList.remove("show-menu");
}
navLink.forEach((n) => n.addEventListener("click", linkAction));

/*======================= ACCORD SKILLS ======================*/

const skillsContent = [...document.getElementsByClassName("skills__content")],
    skillsHeader = document.querySelectorAll(".skills__header");

function toggleSkills() {
  const item = this.parentNode;
  const isOpen = item.classList.contains("skills__open");

  skillsContent.forEach((el) => {
    el.classList.remove("skills__open");
    el.classList.add("skills__close");
  });

  if (!isOpen) {
    item.classList.remove("skills__close");
    item.classList.add("skills__open");
  }
}

skillsHeader.forEach((el) => {
  el.addEventListener("click", toggleSkills);
});




/*======================= Services Modal ===================*/
const modalViews = document.querySelectorAll(".services__modal"),
  modalBtns = document.querySelectorAll(".services__button"),
  modalCloses = document.querySelectorAll(".services__modal-close");

let modal = function (modalClick) {
  modalViews[modalClick].classList.add("active-modal");
};

modalBtns.forEach((modalBtn, i) => {
  modalBtn.addEventListener("click", () => {
    modal(i);
  });
});

modalCloses.forEach((modalClose) => {
  modalClose.addEventListener("click", () => {
    modalViews.forEach((modalView) => {
      modalView.classList.remove("active-modal");
    });
  });
});

/*======================= Portfolio Swiper ===================*/
var swiper = new Swiper(".portfolio__container", {
  cssMode: true,
  loop: true,

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

/*======================= Cards list ===================*/
document.addEventListener("DOMContentLoaded", () => {
  const cardsContainer = document.getElementById("projectCardsContainer");
  const paginationWrapper = document.getElementById("cardsPagination");

  if (!cardsContainer || !paginationWrapper) return;

  const CARDS_PER_PAGE = 4;
  let allCards = [];
  let currentPage = 1;

  fetch("assets/json/projects_cards.json")
      .then(res => res.json())
      .then(data => {
        allCards = data;
        renderCardPage(1);
      })
      .catch(err => console.error("Error loading project cards:", err));

  function renderCardPage(page) {
    currentPage = page;
    cardsContainer.innerHTML = "";
    paginationWrapper.innerHTML = "";

    const start = (page - 1) * CARDS_PER_PAGE;
    const end = start + CARDS_PER_PAGE;
    const visible = allCards.slice(start, end);

    visible.forEach((proj) => {
      const card = document.createElement("div");
      card.classList.add("project-card");

      const linksHTML = (proj.links || [])
          .map(link => `<a href="${link.url}" target="_blank" class="project-card-btn">${link.text} →</a>`)
          .join("");

      card.innerHTML = `
        <img src="${proj.image}" alt="${proj.title}" />
        <h3 class="project-card-title">${proj.title}</h3>
        <p class="project-card-desc">${proj.description}</p>
        <div class="project-card-links">${linksHTML}</div>
      `;
      cardsContainer.appendChild(card);
    });

    renderPaginationControls();
  }

  function renderPaginationControls() {
    const totalPages = Math.ceil(allCards.length / CARDS_PER_PAGE);
    if (totalPages <= 1) return;

    const nav = document.createElement("nav");
    nav.classList.add("pagination__nav");

    const createBtn = (label, page, disabled = false, active = false) => {
      const btn = document.createElement("button");
      btn.textContent = label;
      btn.disabled = disabled;
      if (active) btn.classList.add("pagination__active");
      btn.addEventListener("click", () => renderCardPage(page));
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
    paginationWrapper.appendChild(nav);
  }
});

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll("section[id]");

function scrollActive() {
  const scrollY = window.pageYOffset;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 50;
    sectionId = current.getAttribute("id");

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document
        .querySelector(".nav__menu a[href*=" + sectionId + "]")
        .classList.add("active-link");
    } else {
      document
        .querySelector(".nav__menu a[href*=" + sectionId + "]")
        .classList.remove("active-link");
    }
  });
}
window.addEventListener("scroll", scrollActive);

/*==================== CHANGE BACKGROUND HEADER ====================*/
function scrollHeader() {
  const nav = document.getElementById("header");
  // When the scroll is greater than 200 viewport height, add the scroll-header class to the header tag
  if (this.scrollY >= 80) nav.classList.add("scroll-header");
  else nav.classList.remove("scroll-header");
}
window.addEventListener("scroll", scrollHeader);

/*==================== SHOW SCROLL up ====================*/
function scrollUp() {
  const scrollUp = document.getElementById("scroll-up");
  // When the scroll is higher than 560 viewport height, add the show-scroll class to the a tag with the scroll-top class
  if (this.scrollY >= 560) scrollUp.classList.add("show-scroll");
  else scrollUp.classList.remove("show-scroll");
}
window.addEventListener("scroll", scrollUp);

/*==================== DARK LIGHT THEME ====================*/
const themeButton = document.getElementById("theme-button");
const darkTheme = "dark-theme";
const iconTheme = "uil-sun";

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem("selected-theme");
const selectedIcon = localStorage.getItem("selected-icon");

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () =>
  document.body.classList.contains(darkTheme) ? "dark" : "light";
const getCurrentIcon = () =>
  themeButton.classList.contains(iconTheme) ? "uil-moon" : "uil-sun";

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
  document.body.classList[selectedTheme === "dark" ? "add" : "remove"](
    darkTheme,
  );
  themeButton.classList[selectedIcon === "uil-moon" ? "add" : "remove"](
    iconTheme,
  );
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener("click", () => {
  // Add or remove the dark / icon theme
  document.body.classList.toggle(darkTheme);
  themeButton.classList.toggle(iconTheme);
  // We save the theme and the current icon that the user chose
  localStorage.setItem("selected-theme", getCurrentTheme());
  localStorage.setItem("selected-icon", getCurrentIcon());
});
