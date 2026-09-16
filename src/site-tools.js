import "./site-tools.css";
import { sitePages, servicePages, serviceReferencePages, careerReferencePages } from "./site-map.js";
import { partners, normalizePartnerText } from "./partner-data.js";

const partnerPages = partners.map((partner) => ({
  title: partner.name,
  url: `/partners/#partner-${partner.id}`,
  description: `NCS reference: ${partner.description}`,
  keywords: [partner.sourceName, partner.category, partner.website ?? "", ...partner.skills].join(" "),
}));
const pages = [...sitePages, ...servicePages, ...serviceReferencePages, ...careerReferencePages, ...partnerPages];

export function initializeSiteTools(closeMenu) {
  const searchButton = document.createElement("button");
  searchButton.className = "site-search-toggle";
  searchButton.type = "button";
  searchButton.setAttribute("aria-label", "Search website");
  searchButton.setAttribute("aria-haspopup", "dialog");
  searchButton.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>';
  document.querySelector(".site-header").append(searchButton);

  const dialog = document.createElement("dialog");
  dialog.id = "site-search-dialog";
  dialog.className = "site-dialog search-dialog";
  dialog.setAttribute("aria-labelledby", "site-search-title");
  dialog.innerHTML = `
    <button class="close-dialog" aria-label="Close website search" data-close>&times;</button>
    <p class="eyebrow section-eyebrow">FIND YOUR NEXT DIRECTION</p>
    <h2 id="site-search-title">What are you looking for?</h2>
    <label class="site-search-label" for="site-search-input">Search Trejectory</label>
    <input id="site-search-input" type="search" placeholder="Try cloud, careers, or healthcare" autocomplete="off" />
    <p class="site-search-status" role="status"></p>
    <ul class="site-search-results"></ul>
    <p class="search-local-note">Search runs locally. Your query is not sent to a server.</p>
  `;
  document.body.append(dialog);
  const input = dialog.querySelector("input");
  const results = dialog.querySelector(".site-search-results");

  function renderSearch() {
    const words = normalizePartnerText(input.value).trim().split(/\s+/).filter(Boolean);
    const matches = words.length
      ? pages.filter((page) => words.every((word) => normalizePartnerText(`${page.title} ${page.description} ${page.keywords}`).includes(word)))
      : pages.slice(0, 7);
    results.replaceChildren();
    for (const page of matches) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = page.url;
      const title = document.createElement("strong");
      title.textContent = page.title;
      const description = document.createElement("span");
      description.textContent = page.description;
      link.append(title, description);
      item.append(link);
      results.append(item);
      link.addEventListener("click", () => dialog.close());
    }
    dialog.querySelector(".site-search-status").textContent = words.length
      ? `${matches.length} result${matches.length === 1 ? "" : "s"}${matches.length ? "" : ". Try a different topic or clear your search."}`
      : "Explore the website";
  }

  searchButton.addEventListener("click", () => {
    closeMenu();
    renderSearch();
    dialog.showModal();
    input.focus();
  });
  input.addEventListener("input", renderSearch);

  const sitemap = document.createElement("nav");
  sitemap.className = "footer-sitemap";
  sitemap.setAttribute("aria-label", "Footer navigation");
  const groups = sitePages.map((page) => ({ title: page.title, items: [{ title: "Overview", url: page.url }, ...page.links] }));
  for (const group of groups) {
    const section = document.createElement("div");
    const title = document.createElement("h2");
    title.textContent = group.title;
    const list = document.createElement("ul");
    for (const page of group.items) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = page.url;
      link.textContent = page.title;
      item.append(link);
      list.append(item);
    }
    section.append(title, list);
    sitemap.append(section);
  }
  const contact = document.createElement("div");
  contact.innerHTML = '<h2>Let\'s connect</h2><p>Every possibility starts with a conversation.</p><button class="text-link" data-contact>Prepare an inquiry <span aria-hidden="true">&#8599;</span></button><p class="footer-disclaimer">Concept website. Inquiry drafts are not sent.</p>';
  sitemap.append(contact);
  document.querySelector(".footer-bottom").before(sitemap);
}
