import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
	plugins: [solid(), tailwindcss()],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
});
