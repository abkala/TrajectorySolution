import { initializeNavigation } from "./navigation.js";
import { initializeSiteTools } from "./site-tools.js";
import { initializeCatalogs } from "./catalog.js";
import "./design-system.css";

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navigation");
const contactDialog = document.querySelector("#contact-dialog");
const inquiryForm = document.querySelector("#inquiry-form");
const megaNavigation = initializeNavigation(navigation);

function closeMenu() {
  megaNavigation.close();
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  navigation.classList.remove("is-open");
}

export function openInquiry(interest) {
  if (interest) {
    const select = inquiryForm.elements.namedItem("interest");
    if (![...select.options].some((option) => option.value === interest)) {
      throw new Error(`Unknown inquiry interest: ${interest}`);
    }
    select.value = interest;
  }
  closeMenu();
  contactDialog.showModal();
}

initializeSiteTools(closeMenu);
initializeCatalogs();

document.querySelectorAll("[data-contact]").forEach((button) => {
  button.addEventListener("click", () => openInquiry(button.dataset.interest));
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
navigation.addEventListener("focusout", (event) => {
  if (menuToggle.getAttribute("aria-expanded") === "true" && event.relatedTarget !== menuToggle && !navigation.contains(event.relatedTarget)) {
    closeMenu();
  }
});
document.addEventListener("pointerdown", (event) => {
  if (menuToggle.getAttribute("aria-expanded") === "true" && !document.querySelector(".site-header").contains(event.target)) {
    closeMenu();
  }
});
document.addEventListener("keydown", (event) => {
  if (!event.defaultPrevented && event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menuToggle.focus();
  }
});
matchMedia("(min-width: 1201px)").addEventListener("change", (event) => {
  const navigationHadFocus = navigation.contains(document.activeElement);
  closeMenu();
  if (navigationHadFocus) {
    if (event.matches) navigation.querySelector(".nav-page-link").focus();
    else menuToggle.focus();
  }
});
inquiryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const draft = [
    "Trejectory - Inquiry draft",
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
  download.download = "trejectory-inquiry.txt";
  document.body.append(download);
  download.click();
  download.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  document.querySelector("#inquiry-status").textContent = "Your draft download has started. No information has been sent or stored by this website.";
});
inquiryForm.addEventListener("input", () => {
  document.querySelector("#inquiry-status").textContent = "";
});
document.querySelector("#year").textContent = new Date().getFullYear();
