import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import devToolsJson from "vite-plugin-devtools-json";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    cloudflare({
      viteEnvironment: { name: "ssr" },
      configPath: "./wrangler.jsonc",
    }),
    tailwindcss(),
    reactRouter(),
    devToolsJson(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  envPrefix: ["PUBLIC_", "VITE_"],
});
