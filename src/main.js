const partners = [
  { name: "stratos", mark: "S", category: "Cloud", className: "stratos", tagline: "A clearer path to the cloud.", description: "Stratos is an illustrative cloud specialist focused on helping teams simplify infrastructure and design adaptable platforms for growth.", skills: ["Cloud strategy", "Platform engineering", "Infrastructure modernisation"] },
  { name: "neuralis", mark: "*", category: "Data & AI", className: "neuralis", tagline: "Make more of your intelligence.", description: "Neuralis represents the data and AI expertise that helps organisations connect information, discover opportunities, and build responsible intelligent experiences.", skills: ["Data platforms", "Applied AI", "Responsible automation"] },
  { name: "aegis", mark: "A", category: "Security", className: "aegis", tagline: "Resilience at every layer.", description: "Aegis is a fictional security partner demonstrating an integrated approach to protecting identities, applications, and the infrastructure businesses depend on.", skills: ["Identity and access", "Security operations", "Cyber resilience"] },
  { name: "form & field", mark: "ff", category: "Digital", className: "form-field", tagline: "Human needs. Digital possibilities.", description: "Form & Field represents a design-led digital studio, bringing customer understanding and product thinking together to make complex experiences feel simple.", skills: ["Experience design", "Digital products", "Customer research"] },
  { name: "northstack", mark: "N", category: "Cloud", className: "northstack", tagline: "Built for your next horizon.", description: "Northstack is an illustrative engineering partner focused on connecting reliable cloud foundations with the tools teams need to deliver software confidently.", skills: ["Cloud-native engineering", "Developer platforms", "Connected infrastructure"] },
  { name: "mosaic", mark: "+", category: "Data & AI", className: "mosaic", tagline: "The bigger picture, connected.", description: "Mosaic demonstrates how a data-focused partnership can bring fragmented information together and make insights useful across an organisation.", skills: ["Data integration", "Business intelligence", "Analytics engineering"] },
];

const grid = document.querySelector("#partner-grid");
const search = document.querySelector("#partner-search");
const filters = [...document.querySelectorAll("[data-filter]")];
const partnerDialog = document.querySelector("#partner-dialog");
const contactDialog = document.querySelector("#contact-dialog");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navigation");
let category = "All";
let selectedPartner;

function renderPartners() {
  const query = search.value.trim().toLowerCase();
  const visiblePartners = partners.filter((partner) =>
    (category === "All" || partner.category === category) &&
    [partner.name, partner.category, partner.tagline, ...partner.skills].join(" ").toLowerCase().includes(query),
  );
  grid.replaceChildren();
  for (const partner of visiblePartners) {
    const card = document.createElement("article");
    card.className = "partner-card";
    const logo = document.createElement("div");
    logo.className = `partner-logo ${partner.className}`;
    const mark = document.createElement("span");
    mark.className = "partner-mark";
    mark.textContent = partner.mark;
    mark.setAttribute("aria-hidden", "true");
    const name = document.createElement("h3");
    name.textContent = partner.name;
    logo.append(mark, name);
    const tag = document.createElement("span");
    tag.className = "category-tag";
    tag.textContent = partner.category;
    const tagline = document.createElement("p");
    tagline.textContent = partner.tagline;
    const button = document.createElement("button");
    button.className = "partner-details";
    button.setAttribute("aria-label", `Explore ${partner.name}`);
    button.innerHTML = 'Explore partner <span aria-hidden="true">&#8599;</span>';
    button.addEventListener("click", () => showPartner(partner));
    card.append(logo, tag, tagline, button);
    grid.append(card);
  }
  document.querySelector("#result-count").textContent = `Showing ${visiblePartners.length} of ${partners.length} example partners`;
  document.querySelector("#empty-state").hidden = visiblePartners.length > 0;
}

function setCategory(value) {
  category = value;
  for (const filter of filters) {
    const selected = filter.dataset.filter === value;
    filter.classList.toggle("selected", selected);
    filter.setAttribute("aria-pressed", String(selected));
  }
  renderPartners();
}

function showPartner(partner) {
  selectedPartner = partner;
  document.querySelector("#partner-dialog-title").textContent = partner.name;
  document.querySelector("#partner-dialog-category").textContent = `${partner.category} / EXAMPLE PARTNER`;
  document.querySelector("#partner-dialog-description").textContent = partner.description;
  const list = document.querySelector("#partner-dialog-skills");
  list.replaceChildren(...partner.skills.map((skill) => {
    const item = document.createElement("li");
    item.textContent = skill;
    return item;
  }));
  partnerDialog.showModal();
}

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  navigation.classList.remove("is-open");
}

filters.forEach((filter) => filter.addEventListener("click", () => setCategory(filter.dataset.filter)));
search.addEventListener("input", renderPartners);
document.querySelector("#reset-filters").addEventListener("click", () => {
  search.value = "";
  setCategory("All");
  search.focus();
});
document.querySelectorAll("[data-expertise]").forEach((link) => {
  link.addEventListener("click", () => {
    search.value = "";
    setCategory(link.dataset.expertise);
  });
});
document.querySelectorAll("[data-contact]").forEach((button) => {
  button.addEventListener("click", () => {
    closeMenu();
    contactDialog.showModal();
  });
});
document.querySelector("#partner-inquiry").addEventListener("click", () => {
  partnerDialog.close();
  document.querySelector('[name="interest"]').value = selectedPartner.category;
  contactDialog.showModal();
});
document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => button.closest("dialog").close());
});
document.querySelectorAll("dialog").forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) {
      dialog.close();
    }
  });
});
menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  navigation.classList.toggle("is-open", open);
});
navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menuToggle.focus();
  }
});
document.querySelector("#inquiry-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const draft = [
    "Trajectory Solution - Partnership inquiry draft",
    "This draft has not been sent.",
    "",
    `Name: ${data.get("name")}`,
    `Email: ${data.get("email")}`,
    `Company: ${data.get("company")}`,
    `Interest: ${data.get("interest")}`,
    "",
    String(data.get("message")),
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([draft], { type: "text/plain;charset=utf-8" }));
  const download = document.createElement("a");
  download.href = url;
  download.download = "trajectory-inquiry.txt";
  document.body.append(download);
  download.click();
  download.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  document.querySelector("#inquiry-status").textContent = "Your draft download has started. No information has been sent or stored by this website.";
});
document.querySelector("#inquiry-form").addEventListener("input", () => {
  document.querySelector("#inquiry-status").textContent = "";
});
document.querySelector("#year").textContent = new Date().getFullYear();
renderPartners();
