import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		setupFiles: "./src/setupTests.ts",
		environment: "jsdom",
		coverage: {
			enabled: true,
			provider: "istanbul",
			reporter: ["html", "clover"],
			exclude: ["src/index.ts", "src/App.tsx", "src/main.tsx"],
			thresholds: {
				global: {
					statements: 80,
					branches: 80,
					functions: 80,
					lines: 80,
				},
			},
		},
	},
});
