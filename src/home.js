import "./carousel.js";
import "./site.js";
import { partners } from "./partner-data.js";
import { createPartnerLogo } from "./partner-ui.js";

const featured = document.querySelector("#featured-partners");
for (const id of ["amazon-web-services", "google-cloud", "microsoft", "nvidia"]) {
  const partner = partners.find((item) => item.id === id);
  if (!partner) throw new Error(`Unknown featured partner reference: ${id}`);
  const link = document.createElement("a");
  link.href = `/partners/#partner-${partner.id}`;
  link.setAttribute("aria-label", `Explore ${partner.name} in the NCS partner reference`);
  const name = document.createElement("span");
  name.textContent = partner.name;
  link.append(createPartnerLogo(partner), name);
  featured.append(link);
}
