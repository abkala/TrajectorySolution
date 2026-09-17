import logoManifest from "./partner-logos.json";
import "./partner-logos.css";

export function createPartnerLogo(partner, loading = "lazy") {
  const logo = logoManifest[partner.id];
  if (!logo || logo.source !== partner.logoSource) {
    throw new Error(`Missing or outdated logo manifest entry for ${partner.name}`);
  }
  const figure = document.createElement("figure");
  figure.className = "partner-logo-art";
  const image = document.createElement("img");
  image.src = logo.src;
  image.alt = partner.logoNote ? `${partner.name} badge from NCS's listing` : `${partner.name} logo`;
  image.width = 193;
  image.height = 80;
  image.loading = loading;
  image.decoding = "async";
  image.addEventListener("error", () => {
    const notice = document.createElement("span");
    notice.className = "partner-logo-error";
    notice.textContent = `${partner.name} logo unavailable`;
    image.replaceWith(notice);
    console.error(`Partner logo failed to load: ${logo.src}`);
  }, { once: true });
  figure.append(image);
  if (partner.logoNote) {
    const caption = document.createElement("figcaption");
    caption.textContent = partner.logoNote;
    figure.append(caption);
  }
  return figure;
}

export function createPartnerWebsite(partner) {
  if (partner.website === null) {
    const note = document.createElement("span");
    note.className = "partner-website-unavailable";
    note.textContent = "Not listed by NCS";
    return note;
  }
  const url = new URL(partner.website);
  if (!["https:", "http:"].includes(url.protocol)) {
    throw new Error(`Invalid website URL for ${partner.name}`);
  }
  const link = document.createElement("a");
  link.className = "partner-website";
  link.href = partner.website;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", `Visit ${partner.name}'s website (opens in a new tab)`);
  link.textContent = url.hostname.replace(/^www\./, "");
  const arrow = document.createElement("span");
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = " \u2197";
  link.append(arrow);
  return link;
}
