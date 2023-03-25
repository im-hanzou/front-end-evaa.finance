import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'es2020'
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "es2020"
    }
  },
  plugins: [react(), tsconfigPaths()],
  base: ((process.env.GITHUB_REPOSITORY ?? "") + "/").match(/(\/.*)/)?.[1],
  
});
