
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Ermöglicht Deploy unter Subpfad (z. B. GitHub Pages /<repo>/)
  // In GitHub Actions setzen wir BASE_PATH=/REPO_NAME/
  const base = process.env.BASE_PATH || '/';
  return {
    plugins: [react()],
    base,
  };
})
