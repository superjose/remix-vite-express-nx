import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { lingui } from '@lingui/vite-plugin';
import tailwindcss from 'tailwindcss';
import { remixRoutes } from 'remix-routes/vite';
import macrosPlugin from 'vite-plugin-babel-macros';
import 'dotenv/config';
import { installGlobals } from '@remix-run/node';

installGlobals({ nativeFetch: true });

export default defineConfig(() => {
  return {
    root: __dirname,

    plugins: [
      nxViteTsPaths({}),
      remix({
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
        },
      }),
      remixRoutes(),
      lingui({
        cwd: __dirname,
      }),
      macrosPlugin(),
    ],
    css: {
      postcss: {
        plugins: [tailwindcss()],
      },
    },
  };
});
