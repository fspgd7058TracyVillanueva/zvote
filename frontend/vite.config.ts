import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env file from root directory
  const env = loadEnv(mode, '../', '');
  
  return {
    plugins: [react()],
    base: './', // Use relative paths for GitHub Pages
    server: {
      port: 3000,
      host: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
    },
    envDir: '../', // Load .env file from parent directory
    define: {
      // Ensure environment variables are available on client side
      'process.env': env,
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  };
});
