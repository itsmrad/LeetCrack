import { defineConfig } from 'wxt';
import path from 'path';
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  srcDir: 'src',

  manifest:({ browser, manifestVersion, mode, command }) => ({
    permissions: [
      'storage',
      'activeTab',
      'scripting',
      'contextMenus',
      'tabs',
      'declarativeNetRequest'
    ],
  }),

  vite: () => ({
    plugins: [
      tailwindcss()
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }),
});
