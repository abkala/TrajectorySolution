import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { careerReferencePages, sitePages } from "../src/site-map.js";
import viteConfig from "../vite.config.js";

const pageUrl = new URL("../careers/chart-your-career/index.html", import.meta.url);
const route = "/careers/chart-your-career/";
const source = "https://www.ncs.co/en-sg/careers/chart-your-career/";

test("registers the NCS career reference in Careers navigation and the production build", () => {
  assert.equal(careerReferencePages.length, 1);
  assert.equal(careerReferencePages[0].url, route);
  assert.match(careerReferencePages[0].title, /NCS reference/);
  const careers = sitePages.find((page) => page.url === "/careers/");
  assert.ok(careers.links.includes(careerReferencePages[0]));
  assert.equal(careers.links.length, 4);
  assert.ok(Object.values(viteConfig.build.rollupOptions.input).includes(fileURLToPath(pageUrl)));
});

test("covers all four framework areas and the three onward resources in the supplied source", async () => {
  const html = await readFile(pageUrl, "utf8");
  for (const [id, heading] of [
    ["career-track", "Career track"],
    ["roles-skills-map", "Job roles and skills map"],
    ["skills-competencies", "Skills and competencies"],
    ["training-certification", "Training &amp; certification"],
  ]) {
    assert.ok(html.includes(`id="${id}"`), id);
    assert.ok(html.includes(`<h3>${heading}</h3>`), heading);
  }
  assert.equal([...html.matchAll(/<details>/g)].length, 4);
  for (const url of [
    source,
    "https://www.ncs.co/en-sg/careers/career-stories/",
    "https://www.ncs.co/careers/",
    "https://www.ncs.co/en-sg/careers/#opportunities",
  ]) {
    assert.ok(html.includes(`href="${url}"`), url);
  }
});

test("keeps attribution, date, shared site hooks and non-application notices explicit", async () => {
  const html = await readFile(pageUrl, "utf8");
  assert.match(html, /NCS information, not Trejectory employment policies/);
  assert.match(html, /datetime="2026-09-16"/);
  assert.match(html, /not an NCS application/);
  assert.match(html, /does not collect CVs or submit applications to NCS/);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const id of ["main", "navigation", "year", "contact-dialog", "inquiry-form", "framework", "resources", "source"]) {
    assert.ok(ids.includes(id), id);
  }
  for (const link of html.matchAll(/<a\b[^>]*href="https:[^"]*"[^>]*>/g)) {
    assert.match(link[0], /rel="noopener noreferrer"/);
    assert.match(link[0], /aria-label="[^"]*opens in a new tab[^"]*"/);
  }
  const overview = await readFile(new URL("../careers/index.html", import.meta.url), "utf8");
  assert.ok(overview.includes(`href="${route}"`));
});
