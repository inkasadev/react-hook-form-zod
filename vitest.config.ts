import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		setupFiles: "./src/setupTests.ts",
		environment: "jsdom",
		coverage: {
			reporter: ["html", "clover"],
		},
	},
});
