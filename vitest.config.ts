import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		setupFiles: "./src/setupTests.ts",
		environment: "jsdom",
		coverage: {
			provider: "istanbul",
			reporter: ["html"],
			exclude: ["src/App.tsx", "src/main.tsx"],
		},
	},
});
