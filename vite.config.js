import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: fileURLToPath(new URL("./index.html", import.meta.url)),
        partners: fileURLToPath(new URL("./partners/index.html", import.meta.url)),
        services: fileURLToPath(new URL("./services/index.html", import.meta.url)),
        applicationsEngineering: fileURLToPath(new URL("./services/applications-and-communications-engineering/index.html", import.meta.url)),
        digitalResilience: fileURLToPath(new URL("./services/digital-resilience/index.html", import.meta.url)),
        industries: fileURLToPath(new URL("./industries/index.html", import.meta.url)),
        ai: fileURLToPath(new URL("./ai-products-platforms/index.html", import.meta.url)),
        insights: fileURLToPath(new URL("./insights/index.html", import.meta.url)),
        careers: fileURLToPath(new URL("./careers/index.html", import.meta.url)),
        careerDevelopment: fileURLToPath(new URL("./careers/chart-your-career/index.html", import.meta.url)),
        about: fileURLToPath(new URL("./about-us/index.html", import.meta.url)),
      },
    },
  },
});
