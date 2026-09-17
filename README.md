# Trejectory

A responsive company concept website with a homepage, seven main sections and three attributed NCS reference pages for services and career development. Built with semantic HTML, CSS, and vanilla JavaScript, served and bundled with Vite.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite.

## Production build

```sh
npm run build
npm run preview
```

Deploy the generated `dist` directory to a static web host.

The build includes these separate HTML entry points:

| Page | URL |
| --- | --- |
| Home (brand logo) | `/` |
| AI Products & Platforms | `/ai-products-platforms/` |
| Services | `/services/` |
| NCS reference: Applications and Communications Engineering | `/services/applications-and-communications-engineering/` |
| NCS reference: Digital Resilience | `/services/digital-resilience/` |
| Industries | `/industries/` |
| Insights | `/insights/` |
| Partners | `/partners/` |
| Careers | `/careers/` |
| NCS reference: Career Development | `/careers/chart-your-career/` |
| About Us | `/about-us/` |

Use a host that serves directory `index.html` files; no single-page-app rewrite is required.

## Features and configuration

- Responsive navigation, original CSS hero artwork, and reduced-motion support.
- All seven navigation tabs have expandable section menus, with desktop hover, click, keyboard, and mobile accordion controls. Page links still work directly.
- A shared navy-and-blue visual system provides consistent headers, typography, cards, buttons, page banners, and the full seven-section footer.
- A dedicated homepage with editorial cards, service highlights, industry links, an attributed NCS partner-reference strip, and a careers feature.
- Shared site-wide search and footer sitemap in `src/site-tools.js`. Search covers pages, service topics and individual partner references locally; it does not send queries to a server.
- Full-width featured carousel with three original banners, previous/next controls, slide selectors, and live announcements. Slides advance manually (no autoplay); arrow keys work while focused on the controls.
- A 118-entry NCS partner reference with Table and Cards views. The table contains Partner name, Logo and Website columns. Both views share search, expertise filters, alphabetical groups (A-F, G-L, M-R, S-Z), and accessible detail dialogs. Filters combine, and reset restores all entries without changing the view.
- Partner detail links such as `/partners/#partner-microsoft` also work from homepage logos and site-wide search.
- Services page with six expandable offerings and service-specific inquiry buttons.
- Separate NCS reference pages for Applications and Communications Engineering and Digital Resilience, with original summaries, source links and clear non-affiliation notices.
- An NCS career-development reference covering all four framework areas from the supplied source, with searchable, expandable explanations and links to NCS career stories, jobs and talent programmes. It is linked from the Careers overview, shared navigation, footer and website search.
- Industries page with eight expandable sector profiles, links to relevant services, and clearly labelled example scenarios.
- AI platform concepts, original insight articles, illustrative career paths (not live vacancies), and an About Us page.
- Searchable topic collections and expand/collapse-all controls on Services, Industries, AI, Insights, Careers, and About Us. Deep links reveal matching article or service details.
- Shared navigation and inquiry behavior in `src/site.js`; the existing partner directory and carousel remain page-specific.
- Inquiry form with browser validation that downloads a text draft. It does **not** send, persist, or upload personal information.
- Partner names, original summaries, editorial categories, skills, website URLs and source provenance in `src/partner-data.js`. Shared logo and website rendering is in `src/partner-ui.js`.
- Page content in the root and each route's `index.html`; shared visual styles in `src/styles.css`, with inner-page styles in `src/pages.css` and `src/company-pages.css`.

The homepage uses `src/home.js` and `src/home.css`. The Partners page uses `src/main.js` and `src/partners.css`, with shared logo styling in `src/partner-logos.css`. All eleven HTML pages are explicitly included in `vite.config.js`.

Navigation sections and shared search entries are defined in `src/site-map.js`. Menu behavior is in `src/navigation.js`; topic browsing is in `src/catalog.js`; site-wide visual refinements are in `src/design-system.css`.

## NCS service and career reference coverage

The reference pages use original summaries, clear NCS attribution and a checked date of **16 September 2026**. They are not Trejectory service, employment or partnership claims.

- [Applications and Communications Engineering](./services/applications-and-communications-engineering/index.html): 11 service areas and 32 named detail entries from the [NCS overview](https://www.ncs.co/en-sg/services/applications-and-communications-engineering/) and its linked service pages, plus expert/partner context and 91 resource-link occurrences, including repeated links.
- [Digital Resilience](./services/digital-resilience/index.html): eight service areas and 41 capabilities from the [NCS overview](https://www.ncs.co/en-sg/services/digital-resilience/) and its linked service pages, with the overview's case studies, insight and expert references.
- [Career Development](./careers/chart-your-career/index.html): the four parts of the [NCS Career Progression Model](https://www.ncs.co/en-sg/careers/chart-your-career/) (career track, roles and skills map, skills and competencies, training and certification), plus all three onward career-resource links on that page.

Source inconsistencies are noted rather than filled with guesses, including mismatched Intelligence Platforms descriptions and the undefined acronym APMR. The career overview does not provide full job specifications, promotion thresholds, named course lists or individual eligibility; the local reference makes those limits explicit.

Linked articles, NCS photographs and source-page artwork are not reproduced. Career applications remain on NCS's own website; Trejectory's general inquiry form only downloads a local draft and does not send applications or CVs.

## Partner sources and logo maintenance

The reference was checked against the [NCS Singapore partner directory](https://www.ncs.co/en-sg/partners/) on **16 September 2026**. It includes all 118 entries from the four source tabs: A-F (47), G-L (22), M-R (23) and S-Z (26). This is a dated snapshot, not a live partnership register.

- The source supplies 117 website URLs. Lianxin Tech has no URL, so the table and dialog explicitly say "Not listed by NCS" rather than guessing.
- Source spelling is retained in `sourceName` where display names are normalised, including Ciena and Zscaler. HP Inc's source listing links to an HPE profile; this reference uses the main NCS directory instead and explains the discrepancy.
- The IBM artwork is a badge from NCS's listing. Its caption explicitly says that it is not a Trejectory accreditation.
- All 118 logo files are stored locally in [public/partner-logos](./public/partner-logos). [src/partner-logos.json](./src/partner-logos.json) records their source URLs, actual MIME types, sizes and SHA-256 checksums. Asset extensions follow the downloaded image type, not the sometimes-misleading source URL extension.
- Partner logos are included on the basis of the reuse permission confirmed for this project. They remain subject to their owners' terms. This repository does not grant additional rights to third-party artwork.
- Descriptions are original summaries, not copied NCS profile text. Categories are editorial groupings, not NCS certifications or claims about Trejectory's relationships.

To refresh approved logo assets after reviewing the source metadata in [src/partner-data.js](./src/partner-data.js), run:

```powershell
node .\scripts\download-partner-logos.js
npm test
npm run build
```

The downloader limits concurrency, checks image types and rejects active SVG content. Failed downloads stop the operation instead of silently substituting another company's logo. Browser image failures display an explicit unavailable message.

## Validation

```sh
npm test
npm run build
```

Tests use Node's built-in test runner without additional dependencies. They check the complete source-name set, logo integrity, website availability, attribution edge cases, combined partner filters, service/career route registration and the career source's four framework areas and three resource links.

This site is an independent frontend concept, not an NCS affiliation or endorsement. NCS-specific service, career-development and partner references are clearly attributed; NCS's prose, branding and page layouts are not reproduced. Before publishing, confirm ongoing rights to third-party logos, review the dated reference information, replace other illustrative content and connect an approved backend if online inquiry delivery is required.