const carousel = document.querySelector(".feature-carousel");
const slides = [...carousel.querySelectorAll(".feature-slide")];
const selectors = [...carousel.querySelectorAll("[data-slide]")];
const status = carousel.querySelector("#feature-status");
let activeSlide = 0;

function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, position) => {
    slide.hidden = position !== activeSlide;
  });
  selectors.forEach((button, position) => {
    if (position === activeSlide) {
      button.setAttribute("aria-current", "true");
    } else {
      button.removeAttribute("aria-current");
    }
  });
  carousel.querySelector(".feature-position").textContent =
    `${String(activeSlide + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
  status.textContent = slides[activeSlide].getAttribute("aria-label");
}

selectors.forEach((button) => {
  button.addEventListener("click", () => showSlide(Number(button.dataset.slide)));
});
carousel.querySelectorAll("[data-direction]").forEach((button) => {
  button.addEventListener("click", () => showSlide(activeSlide + Number(button.dataset.direction)));
});
carousel.querySelector(".feature-controls").addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    showSlide(activeSlide + (event.key === "ArrowRight" ? 1 : -1));
  }
});
