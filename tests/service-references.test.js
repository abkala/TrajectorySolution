import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { servicePages, serviceReferencePages, sitePages } from "../src/site-map.js";
import viteConfig from "../vite.config.js";

const referenceRoutes = [
  "/services/applications-and-communications-engineering/",
  "/services/digital-resilience/",
];

test("registers both requested service routes as explicitly attributed NCS references", () => {
  assert.deepEqual(serviceReferencePages.map((page) => page.url), referenceRoutes);
  for (const page of serviceReferencePages) {
    assert.match(page.title, /NCS reference/);
    assert.match(page.description, /independent, attributed reference/i);
    assert.match(page.keywords, /\bncs\b/);
  }
});

test("preserves the seven main sections and six existing service topics", () => {
  assert.equal(sitePages.length, 7);
  assert.deepEqual(servicePages.map((page) => page.url), [
    "/services/#strategy", "/services/#engineering", "/services/#cloud",
    "/services/#data", "/services/#security", "/services/#operations",
  ]);
  const services = sitePages.find((page) => page.url === "/services/");
  assert.deepEqual(services.links, [...servicePages, ...serviceReferencePages]);
  assert.equal(new Set(services.links.map((page) => page.url)).size, 8);
});

test("builds both nested references as real HTML entries, not SPA fallback routes", () => {
  const inputs = Object.values(viteConfig.build.rollupOptions.input);
  assert.equal(inputs.length, 11);
  assert.equal(new Set(inputs).size, 11);
  for (const route of referenceRoutes) {
    const expected = fileURLToPath(new URL(`..${route}index.html`, import.meta.url));
    assert.ok(inputs.includes(expected), `Missing production HTML entry: ${route}`);
  }
});
