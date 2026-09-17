import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { partners } from "../src/partner-data.js";

const directory = new URL("../public/partner-logos/", import.meta.url);
const manifest = {};
await mkdir(directory, { recursive: true });

function imageExtension(bytes, contentType) {
  if (contentType === "image/jpeg" && bytes[0] === 0xff && bytes[1] === 0xd8) return "jpg";
  if (contentType === "image/png" && bytes.subarray(0, 8).toString("hex") === "89504e470d0a1a0a") return "png";
  if (contentType === "image/webp" && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") return "webp";
  if (contentType === "image/svg+xml") {
    const svg = bytes.toString("utf8");
    if (/<svg[\s>]/i.test(svg) && !/<(?:script|foreignObject)\b|\bon[a-z]+\s*=|\b(?:href|xlink:href)\s*=\s*["'](?:javascript:|https?:|\/\/)/i.test(svg)) {
      return "svg";
    }
  }
  throw new Error(`Unsupported or invalid partner image: ${contentType}`);
}

if (new Set(partners.map((partner) => partner.id)).size !== partners.length) {
  throw new Error("Partner IDs must be unique before downloading logos.");
}

async function downloadLogo(partner) {
  const source = new URL(partner.logoSource);
  if (source.protocol !== "https:" || source.hostname !== "www.ncs.co" || !/^[a-z0-9-]+$/.test(partner.id)) {
    throw new Error(`Invalid logo source or filename for ${partner.name}`);
  }
  const response = await fetch(source, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`${partner.name} logo download failed: HTTP ${response.status}`);
  const contentType = response.headers.get("content-type")?.split(";")[0].trim();
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length === 0 || bytes.length > 5 * 1024 * 1024) {
    throw new Error(`Unexpected logo size for ${partner.name}: ${bytes.length} bytes`);
  }
  const extension = imageExtension(bytes, contentType);
  const filename = `${partner.id}.${extension}`;
  await writeFile(new URL(filename, directory), bytes);
  manifest[partner.id] = {
    src: `/partner-logos/${filename}`,
    source: partner.logoSource,
    contentType,
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
  };
}

for (let offset = 0; offset < partners.length; offset += 4) {
  await Promise.all(partners.slice(offset, offset + 4).map(downloadLogo));
  const completed = Math.min(offset + 4, partners.length);
  if (completed % 20 === 0) console.log(`Downloaded ${completed} of ${partners.length} partner logos.`);
}

const ordered = Object.fromEntries(partners.map((partner) => [partner.id, manifest[partner.id]]));
await writeFile(new URL("../src/partner-logos.json", import.meta.url), `${JSON.stringify(ordered, null, 2)}\n`);
const totalBytes = Object.values(ordered).reduce((total, logo) => total + logo.bytes, 0);
console.log(`Saved ${partners.length} validated logos (${(totalBytes / 1024 / 1024).toFixed(2)} MiB) and their source manifest.`);
