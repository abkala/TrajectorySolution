import "./catalog.css";

export function initializeCatalogs() {
  const catalogs = [];
  const grids = document.querySelectorAll(".catalog-section .offering-grid, .catalog-section .company-grid, .catalog-section .essay-list");
  for (const [index, grid] of [...grids].entries()) {
    const cards = [...grid.children].filter((element) => element.matches("article"));
    const gridId = grid.id || `catalog-items-${index}`;
    grid.id = gridId;
    const toolbar = document.createElement("div");
    toolbar.className = "catalog-toolbar";
    const label = document.createElement("label");
    label.className = "catalog-search";
    label.textContent = "Search this section";
    const input = document.createElement("input");
    input.type = "search";
    input.placeholder = "Find a topic, skill, or capability";
    input.setAttribute("aria-controls", gridId);
    label.append(input);
    const controls = document.createElement("div");
    controls.className = "catalog-actions";
    const count = document.createElement("p");
    count.className = "catalog-count";
    count.setAttribute("role", "status");
    const expand = document.createElement("button");
    expand.type = "button";
    expand.className = "catalog-expand";
    expand.setAttribute("aria-controls", gridId);
    controls.append(count, expand);
    toolbar.append(label, controls);
    const empty = document.createElement("div");
    empty.className = "catalog-empty";
    empty.hidden = true;
    empty.innerHTML = '<h3>No matching topics</h3><p>Try a broader search or return to all topics.</p>';
    const reset = document.createElement("button");
    reset.className = "button button-dark";
    reset.type = "button";
    reset.textContent = "Clear search";
    empty.append(reset);
    grid.before(toolbar);
    grid.after(empty);

    function updateExpand() {
      const details = cards.filter((card) => !card.hidden).map((card) => card.querySelector("details")).filter(Boolean);
      const allOpen = details.length > 0 && details.every((detail) => detail.open);
      expand.textContent = allOpen ? "Collapse all" : "Expand all";
      expand.setAttribute("aria-expanded", String(allOpen));
      expand.disabled = details.length === 0;
    }

    function filter() {
      const words = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
      for (const card of cards) {
        const text = card.textContent.toLowerCase();
        card.hidden = !words.every((word) => text.includes(word));
      }
      const visible = cards.filter((card) => !card.hidden).length;
      count.textContent = `${visible} of ${cards.length} topics`;
      empty.hidden = visible > 0;
      updateExpand();
    }
    input.addEventListener("input", filter);
    reset.addEventListener("click", () => {
      input.value = "";
      filter();
      input.focus();
    });
    expand.addEventListener("click", () => {
      const nextOpen = expand.getAttribute("aria-expanded") !== "true";
      for (const card of cards.filter((card) => !card.hidden)) {
        const details = card.querySelector("details");
        if (details) details.open = nextOpen;
      }
      updateExpand();
    });
    for (const detail of grid.querySelectorAll("details")) {
      detail.addEventListener("toggle", updateExpand);
    }
    catalogs.push({ grid, input, filter, updateExpand });
    filter();
  }

  function revealLinkedContent() {
    const target = document.getElementById(location.hash.slice(1));
    for (const catalog of catalogs) {
      if (target && catalog.grid.contains(target)) {
        catalog.input.value = "";
        catalog.filter();
        const article = target.closest("article");
        const detail = article?.querySelector("details");
        if (detail) detail.open = true;
        catalog.updateExpand();
      }
    }
  }
  revealLinkedContent();
  window.addEventListener("hashchange", revealLinkedContent);
}
