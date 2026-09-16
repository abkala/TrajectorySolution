import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { partners, partnerCategories, partnerSource, filterPartners } from "../src/partner-data.js";

const sourceNames = [
  "Abbyy", "Acronis", "Adaption", "Adobe", "Agibot", "Akamai", "Alcatel-Lucent Enterprise",
  "Alibaba", "Alteryx", "Amazon Web Services", "Apple", "Arista Networks", "Automation Anywhere",
  "Axway", "BeyondTrust", "BitSight", "Blueprism", "BlueVoyant", "BMC", "Broadcom", "C3.ai",
  "Cato", "Checkpoint", "Chef", "Cienna", "Cisco", "Citrix", "Cloudera", "Cohesity", "Confluent",
  "Controp", "CyberArk", "Databricks", "DataRobot", "Dell Technologies", "Denodo", "Digital Asset",
  "Dynatrace", "EG Innovations", "Elastic", "Equinix", "Everpure", "Evie", "F5 Networks",
  "F\u00e1laina", "Forcepoint", "Fortinet", "GitLab", "Google Cloud", "H2O.ai", "HashiCorp",
  "HCL Software", "Hewlett Packard Enterprise", "Hitachi Vantara", "HP Inc", "Huawei", "IBM",
  "ICONICS", "Imperva", "Infoblox", "Informatica", "Intel", "I-Sprint Innovations", "Ivalua",
  "Jotron", "Juniper Networks", "Laiye", "Lenovo", "Lianxin Tech", "Magnolia", "MEGA International",
  "Menlo", "Microsoft", "Microstrategy", "Mistral AI", "Mulesoft", "NetApp", "Newgen", "Nexthink",
  "Nokia Solutions and Networks Singapore", "Nutanix", "NVIDIA", "Omnissa", "Oracle", "OutSystems",
  "Palo Alto", "Pegasystems", "Ping Identity", "Qlik", "Red Hat", "Riverbed", "Rubrik", "Salesforce",
  "SAP", "SAS", "Schneider Electric", "ServiceNow", "Snowflake", "Snow Software", "Solace",
  "Solarwinds", "Splunk", "Tableau", "Talend", "Tenable", "TIBCO Software", "Tigergraph", "Trellix",
  "Trend Micro", "Tricentis", "TYK", "UiPath", "Unitree", "Veeam", "Veritas", "Whatfix", "Workday", "Zcaler",
];

test("includes each of the 118 entries across all four NCS source tabs", () => {
  assert.equal(partners.length, 118);
  assert.deepEqual(partners.map((partner) => partner.sourceName).sort(), [...sourceNames].sort());
  assert.equal(new Set(partners.map((partner) => partner.id)).size, 118);
  assert.equal(new Set(partners.map((partner) => partner.name)).size, 118);
  assert.equal(partnerSource.checkedOn, "2026-09-16");
});

test("every profile has an original summary, expertise, a safe source and a stable ID", () => {
  for (const partner of partners) {
    assert.match(partner.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(partner.description.length >= 80, partner.name);
    assert.equal(partner.skills.length, 3, partner.name);
    assert.ok(partner.skills.every((skill) => skill.trim().length > 0), partner.name);
    assert.ok(partnerCategories.includes(partner.category), partner.name);
    assert.equal(new URL(partner.sourceUrl).origin, "https://www.ncs.co");
    assert.equal(new URL(partner.logoSource).origin, "https://www.ncs.co");
    assert.ok(partner.sourceUrl.startsWith(partnerSource.url), partner.name);
  }
});

test("preserves the 117 supplied website URLs and explicitly identifies the missing one", () => {
  const available = partners.filter((partner) => partner.website !== null);
  assert.equal(available.length, 117);
  for (const partner of available) {
    assert.equal(partner.website, partner.website.trim());
    assert.ok(["http:", "https:"].includes(new URL(partner.website).protocol), partner.name);
  }
  assert.deepEqual(partners.filter((partner) => partner.website === null).map((partner) => partner.name), ["Lianxin Tech"]);
  assert.match(partners.find((partner) => partner.name === "Lianxin Tech").sourceNote, /did not supply a website/);
});

test("retains source provenance for spelling corrections and ambiguous artwork or profile links", () => {
  assert.equal(partners.find((partner) => partner.name === "Ciena").sourceName, "Cienna");
  assert.equal(partners.find((partner) => partner.name === "Zscaler").sourceName, "Zcaler");
  assert.equal(partners.find((partner) => partner.name === "HP Inc.").sourceUrl, partnerSource.url);
  assert.match(partners.find((partner) => partner.name === "HP Inc.").sourceNote, /HPE/);
  assert.match(partners.find((partner) => partner.name === "IBM").logoNote, /not a Trejectory accreditation/);
});

test("includes every local logo with a matching source, file type, size and checksum", async () => {
  const manifest = JSON.parse(await readFile(new URL("../src/partner-logos.json", import.meta.url), "utf8"));
  assert.deepEqual(Object.keys(manifest).sort(), partners.map((partner) => partner.id).sort());
  assert.equal(new Set(Object.values(manifest).map((logo) => logo.src)).size, 118);
  await Promise.all(partners.map(async (partner) => {
    const logo = manifest[partner.id];
    assert.equal(logo.source, partner.logoSource, partner.name);
    assert.match(logo.src, /^\/partner-logos\/[a-z0-9-]+\.(jpg|png|svg|webp)$/);
    const contentTypes = { jpg: "image/jpeg", png: "image/png", svg: "image/svg+xml", webp: "image/webp" };
    assert.equal(logo.contentType, contentTypes[logo.src.split(".").at(-1)]);
    const bytes = await readFile(new URL(`../public${logo.src}`, import.meta.url));
    assert.equal(bytes.length, logo.bytes, partner.name);
    assert.ok(bytes.length > 0, partner.name);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), logo.sha256, partner.name);
  }));
});

test("Git preserves downloaded logo bytes without text conversion", async () => {
  const attributes = await readFile(new URL("../.gitattributes", import.meta.url), "utf8");
  assert.match(attributes, /^public\/partner-logos\/\*\*\s+binary\s*$/m);
});

test("alphabet filters cover all names exactly once with the source tab counts", () => {
  const expected = { "A-F": 47, "G-L": 22, "M-R": 23, "S-Z": 26 };
  const ids = [];
  for (const [range, count] of Object.entries(expected)) {
    const matching = filterPartners({ range });
    assert.equal(matching.length, count, range);
    ids.push(...matching.map((partner) => partner.id));
  }
  assert.equal(new Set(ids).size, partners.length);
});

test("category, alphabet and multi-word text filters combine", () => {
  assert.deepEqual(filterPartners({ query: "  CLOUD  ", category: "Cloud", range: "A-F" }).map((partner) => partner.name),
    ["Akamai", "Alibaba Cloud", "Amazon Web Services", "Dynatrace", "eG Innovations"]);
  assert.deepEqual(filterPartners({ query: "AMAZON web" }).map((partner) => partner.name), ["Amazon Web Services"]);
  assert.equal(filterPartners({ query: "Microsoft", category: "Security" }).length, 0);
  assert.equal(filterPartners({ query: "Microsoft", range: "A-F" }).length, 0);
  for (const category of partnerCategories) {
    assert.ok(filterPartners({ category }).length > 0, category);
    assert.ok(filterPartners({ category }).every((partner) => partner.category === category));
  }
});

test("search supports accents, source spellings, descriptions, expertise and website domains", () => {
  assert.deepEqual(filterPartners({ query: " FALAINA " }).map((partner) => partner.name), ["F\u00e1laina"]);
  assert.deepEqual(filterPartners({ query: "Cienna" }).map((partner) => partner.name), ["Ciena"]);
  assert.deepEqual(filterPartners({ query: "zcaler" }).map((partner) => partner.name), ["Zscaler"]);
  assert.deepEqual(filterPartners({ query: "aws.amazon.com" }).map((partner) => partner.name), ["Amazon Web Services"]);
  assert.ok(filterPartners({ query: "document processing" }).some((partner) => partner.name === "ABBYY"));
  assert.ok(filterPartners({ query: "psychological" }).some((partner) => partner.name === "Lianxin Tech"));
});

test("empty queries reset to all results without mutating source order", () => {
  const order = partners.map((partner) => partner.id);
  assert.equal(filterPartners({ query: "   " }).length, 118);
  assert.equal(filterPartners({ query: "no-matching-partner-123456" }).length, 0);
  const sorted = filterPartners().map((partner) => partner.name);
  assert.deepEqual(sorted, [...sorted].sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" })));
  assert.deepEqual(partners.map((partner) => partner.id), order);
});

test("invalid filter categories and ranges are reported, not silently ignored", () => {
  assert.throws(() => filterPartners({ category: "Unknown" }), RangeError);
  assert.throws(() => filterPartners({ range: "Z-A" }), RangeError);
});
