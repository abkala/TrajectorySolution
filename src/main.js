import "./site.js";
import { partners, partnerCategories, partnerSource, filterPartners } from "./partner-data.js";
import { createPartnerLogo, createPartnerWebsite } from "./partner-ui.js";

const grid = document.querySelector("#partner-grid");
const tablePanel = document.querySelector("#partner-table-panel");
const tableBody = document.querySelector("#partner-table-body");
const search = document.querySelector("#partner-search");
const filterGroup = document.querySelector("#partner-filters");
const partnerDialog = document.querySelector("#partner-dialog");
const linkStatus = document.querySelector("#partner-link-status");
const viewButtons = [...document.querySelectorAll("[data-partner-view]")];
let category = "All";
let alphabetRange = "All";
let view = "table";

for (const value of ["All", ...partnerCategories]) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "filter";
  button.dataset.filter = value;
  button.textContent = value === "All" ? `All partners (${partners.length})` : value;
  button.setAttribute("aria-controls", "partner-grid partner-table-panel");
  filterGroup.append(button);
}
const filters = [...document.querySelectorAll("[data-filter]")];
const alphabetFilters = [...document.querySelectorAll("[data-range]")];

function detailButton(partner, className, text) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = text;
  button.setAttribute("aria-label", `Read about ${partner.name}`);
  button.setAttribute("aria-haspopup", "dialog");
  button.setAttribute("aria-controls", "partner-dialog");
  button.addEventListener("click", () => showPartner(partner));
  return button;
}

function createTableRow(partner) {
  const row = document.createElement("tr");
  row.id = `partner-${partner.id}`;
  const name = document.createElement("th");
  name.scope = "row";
  const tag = document.createElement("span");
  tag.className = "partner-table-category";
  tag.textContent = partner.category;
  name.append(detailButton(partner, "partner-name", partner.name), tag);
  const logo = document.createElement("td");
  logo.append(createPartnerLogo(partner));
  const website = document.createElement("td");
  website.append(createPartnerWebsite(partner));
  row.append(name, logo, website);
  return row;
}

function createCard(partner) {
  const card = document.createElement("article");
  card.className = "partner-card";
  card.id = `partner-${partner.id}`;
  const name = document.createElement("h3");
  name.textContent = partner.name;
  const tag = document.createElement("span");
  tag.className = "category-tag";
  tag.textContent = partner.category;
  const description = document.createElement("p");
  description.textContent = partner.description;
  card.append(
    createPartnerLogo(partner), name, tag, description, createPartnerWebsite(partner),
    detailButton(partner, "partner-details", "Read partner summary \u2197"),
  );
  return card;
}

function renderPartners() {
  const visiblePartners = filterPartners({ query: search.value, category, range: alphabetRange });
  grid.replaceChildren();
  tableBody.replaceChildren();
  const container = view === "table" ? tableBody : grid;
  for (const partner of visiblePartners) {
    container.append(view === "table" ? createTableRow(partner) : createCard(partner));
  }
  tablePanel.hidden = view !== "table" || visiblePartners.length === 0;
  grid.hidden = view !== "cards" || visiblePartners.length === 0;
  document.querySelector("#partner-table-hint").hidden = tablePanel.hidden;
  document.querySelector("#result-count").textContent = `Showing ${visiblePartners.length} of ${partners.length} NCS-listed partners`;
  document.querySelector("#empty-state").hidden = visiblePartners.length > 0;
  linkStatus.hidden = true;
}

function syncFilters() {
  for (const filter of filters) {
    const selected = filter.dataset.filter === category;
    filter.classList.toggle("selected", selected);
    filter.setAttribute("aria-pressed", String(selected));
  }
  for (const filter of alphabetFilters) {
    filter.setAttribute("aria-pressed", String(filter.dataset.range === alphabetRange));
  }
}

function showPartner(partner) {
  document.querySelector("#partner-dialog-title").textContent = partner.name;
  document.querySelector("#partner-dialog-category").textContent = `${partner.category} / NCS REFERENCE`;
  document.querySelector("#partner-dialog-logo").replaceChildren(createPartnerLogo(partner, "eager"));
  document.querySelector("#partner-dialog-description").textContent = partner.description;
  document.querySelector("#partner-dialog-skills").replaceChildren(...partner.skills.map((skill) => {
    const item = document.createElement("li");
    item.textContent = skill;
    return item;
  }));
  document.querySelector("#partner-dialog-website").replaceChildren(createPartnerWebsite(partner));
  const source = document.querySelector("#partner-dialog-source");
  source.href = partner.sourceUrl;
  source.textContent = partner.profile ? "View NCS profile \u2197" : "View NCS directory \u2197";
  source.setAttribute("aria-label", `View the NCS source for ${partner.name} (opens in a new tab)`);
  const sourceNote = document.querySelector("#partner-dialog-source-note");
  sourceNote.textContent = partner.sourceNote ?? "";
  sourceNote.hidden = !partner.sourceNote;
  if (!partnerDialog.open) partnerDialog.showModal();
}

function resetFilters() {
  search.value = "";
  category = "All";
  alphabetRange = "All";
  syncFilters();
  renderPartners();
}

function openPartnerFromHash() {
  if (!location.hash.startsWith("#partner-")) {
    linkStatus.hidden = true;
    return;
  }
  const partner = partners.find((item) => `#partner-${item.id}` === location.hash);
  if (!partner) {
    if (partnerDialog.open) partnerDialog.close();
    linkStatus.textContent = "This partner reference was not found. Search the directory below or reset the filters.";
    linkStatus.hidden = false;
    return;
  }
  resetFilters();
  document.getElementById(`partner-${partner.id}`).querySelector("button").focus();
  showPartner(partner);
}

partnerDialog.addEventListener("close", () => {
  if (!partnerDialog.open && location.hash.startsWith("#partner-")) {
    const url = new URL(location.href);
    url.hash = "partners";
    history.replaceState(history.state, "", url);
  }
});
// Embedded previews may not dispatch the native dialog cancellation event.
partnerDialog.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !event.defaultPrevented) {
    event.preventDefault();
    partnerDialog.close();
  }
});
filters.forEach((filter) => filter.addEventListener("click", () => {
  category = filter.dataset.filter;
  syncFilters();
  renderPartners();
}));
alphabetFilters.forEach((filter) => filter.addEventListener("click", () => {
  alphabetRange = filter.dataset.range;
  syncFilters();
  renderPartners();
}));
viewButtons.forEach((button) => button.addEventListener("click", () => {
  view = button.dataset.partnerView;
  viewButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
  renderPartners();
}));
search.addEventListener("input", renderPartners);
document.querySelectorAll("[data-reset-partners]").forEach((button) => button.addEventListener("click", () => {
  resetFilters();
  search.focus();
}));
document.querySelectorAll("[data-expertise]").forEach((link) => {
  link.addEventListener("click", () => {
    search.value = "";
    alphabetRange = "All";
    category = link.dataset.expertise;
    syncFilters();
    renderPartners();
  });
});
document.querySelectorAll("[data-partner-total]").forEach((element) => { element.textContent = partners.length; });
const checked = document.querySelector("#partner-source-checked");
checked.dateTime = partnerSource.checkedOn;
checked.textContent = new Intl.DateTimeFormat("en-GB", {
  day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
}).format(new Date(`${partnerSource.checkedOn}T00:00:00Z`));
window.addEventListener("hashchange", openPartnerFromHash);
syncFilters();
renderPartners();
openPartnerFromHash();
