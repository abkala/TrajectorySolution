import { sitePages } from "./site-map.js";
import "./navigation.css";

export function initializeNavigation(navigation) {
  const desktop = matchMedia("(min-width: 1201px)");
  const hover = matchMedia("(hover: hover)");
  let current;
  let closeTimer;
  const shade = document.createElement("div");
  shade.className = "navigation-shade";
  shade.hidden = true;
  shade.setAttribute("aria-hidden", "true");
  document.body.append(shade);

  function close() {
    clearTimeout(closeTimer);
    if (current) {
      current.button.setAttribute("aria-expanded", "false");
      current.panel.hidden = true;
      current = undefined;
    }
    shade.hidden = true;
  }

  function open(entry) {
    close();
    current = entry;
    entry.panel.hidden = false;
    entry.button.setAttribute("aria-expanded", "true");
    shade.hidden = !desktop.matches;
  }

  const anchors = [...navigation.querySelectorAll(":scope > a")];
  for (const [index, anchor] of anchors.entries()) {
    const page = sitePages.find((item) => item.url === anchor.getAttribute("href"));
    if (!page) {
      throw new Error(`Missing navigation configuration for ${anchor.getAttribute("href")}`);
    }
    const wrapper = document.createElement("div");
    wrapper.className = "nav-entry";
    anchor.before(wrapper);
    wrapper.append(anchor);
    anchor.classList.add("nav-page-link");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "nav-disclosure";
    button.setAttribute("aria-label", `Explore ${page.title} menu`);
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", `mega-panel-${index}`);
    button.innerHTML = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="m3 4.5 3 3 3-3"/></svg>';

    const panel = document.createElement("div");
    panel.className = "mega-panel";
    panel.id = `mega-panel-${index}`;
    panel.hidden = true;
    const intro = document.createElement("div");
    intro.className = "mega-intro";
    const eyebrow = document.createElement("p");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = "DISCOVER TREJECTORY";
    const title = document.createElement("h2");
    title.textContent = page.title;
    const description = document.createElement("p");
    description.textContent = page.description;
    const overview = document.createElement("a");
    overview.className = "mega-overview";
    overview.href = page.url;
    overview.textContent = `Explore ${page.title} \u2192`;
    intro.append(eyebrow, title, description, overview);
    const list = document.createElement("ul");
    list.className = "mega-links";
    for (const item of page.links) {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = item.url;
      const heading = document.createElement("strong");
      heading.textContent = item.title;
      const summary = document.createElement("span");
      summary.textContent = item.description;
      link.append(heading, summary);
      li.append(link);
      list.append(li);
    }
    panel.append(intro, list);
    wrapper.append(button, panel);
    const entry = { wrapper, button, panel };
    button.addEventListener("click", () => current === entry ? close() : open(entry));
    wrapper.addEventListener("pointerenter", () => clearTimeout(closeTimer));
    anchor.addEventListener("pointerenter", (event) => {
      clearTimeout(closeTimer);
      if (desktop.matches && hover.matches && event.pointerType !== "touch" &&
          !document.activeElement?.closest(".mega-panel")) {
        open(entry);
      }
    });
    wrapper.addEventListener("pointerleave", () => {
      if (desktop.matches && !wrapper.contains(document.activeElement)) {
        closeTimer = setTimeout(close, 180);
      }
    });
    wrapper.addEventListener("focusout", (event) => {
      if (current === entry && !wrapper.contains(event.relatedTarget)) close();
    });
    wrapper.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" && (event.target === anchor || event.target === button)) {
        event.preventDefault();
        open(entry);
        panel.querySelector("a").focus();
      }
    });
  }
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && current) {
      const trigger = current.button;
      close();
      trigger.focus();
      event.preventDefault();
    }
  });
  document.addEventListener("pointerdown", (event) => {
    if (!navigation.contains(event.target)) close();
  });
  desktop.addEventListener("change", close);
  return { close };
}
