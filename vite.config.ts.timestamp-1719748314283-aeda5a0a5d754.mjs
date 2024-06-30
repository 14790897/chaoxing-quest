// vite.config.ts
import { crx } from "file:///C:/git-program/chaoxing-quest/node_modules/.pnpm/@crxjs+vite-plugin@2.0.0-beta.23/node_modules/@crxjs/vite-plugin/dist/index.mjs";
import vue from "file:///C:/git-program/chaoxing-quest/node_modules/.pnpm/@vitejs+plugin-vue@5.0.5_vite@5.3.1_vue@3.4.30/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { dirname, relative } from "node:path";
import { URL, fileURLToPath } from "node:url";
import AutoImport from "file:///C:/git-program/chaoxing-quest/node_modules/.pnpm/unplugin-auto-import@0.17.6_@vueuse+core@10.11.0/node_modules/unplugin-auto-import/dist/vite.js";
import IconsResolver from "file:///C:/git-program/chaoxing-quest/node_modules/.pnpm/unplugin-icons@0.19.0_@vue+compiler-sfc@3.4.30/node_modules/unplugin-icons/dist/resolver.js";
import Icons from "file:///C:/git-program/chaoxing-quest/node_modules/.pnpm/unplugin-icons@0.19.0_@vue+compiler-sfc@3.4.30/node_modules/unplugin-icons/dist/vite.js";
import Components from "file:///C:/git-program/chaoxing-quest/node_modules/.pnpm/unplugin-vue-components@0.27.1_vue@3.4.30/node_modules/unplugin-vue-components/dist/vite.js";
import { defineConfig } from "file:///C:/git-program/chaoxing-quest/node_modules/.pnpm/vite@5.3.1_@types+node@20.14.9_sass@1.77.6_terser@5.31.1/node_modules/vite/dist/node/index.js";
import Pages from "file:///C:/git-program/chaoxing-quest/node_modules/.pnpm/vite-plugin-pages@0.32.3_@vue+compiler-sfc@3.4.30_vite@5.3.1_vue-router@4.4.0/node_modules/vite-plugin-pages/dist/index.js";

// define.config.ts
import fs from "node:fs";
import { spawnSync } from "node:child_process";

// package.json
var package_default = {
  name: "vite-vue3-chrome-extension-v3",
  displayName: "chaoxing-questVite Vue 3 Chrome Extension",
  type: "module",
  version: "0.0.1",
  private: true,
  description: "chaoxing-quest \u505A\u9898",
  repository: {
    type: "git",
    url: "https://github.com/14790897/chaoxing-quest"
  },
  scripts: {
    build: "npm run build:chrome && npm run build:firefox",
    "build:chrome": "vite build",
    "build:firefox": "vite build -c vite.firefox.config.js",
    dev: 'concurrently "npm run dev:chrome" "npm run dev:firefox"',
    "dev:chrome": "vite",
    "dev:firefox": "vite build --mode development --watch -c vite.firefox.config.js",
    format: "prettier --write .",
    lint: "eslint . --fix",
    "lint:manifest": "web-ext lint --pretty",
    preview: "vite preview",
    typecheck: "vue-tsc --noEmit",
    "supabase:link": "env-cmd -f ./.env.local supabase link --project-ref tcrlagnatokjmiuxybkt",
    "migration:up": "supabase migration up --linked --debug && pnpm generate-types",
    "generate-types": "pnpm supabase gen types typescript --project-id tcrlagnatokjmiuxybkt --schema public > src/lib/database.types.ts"
  },
  dependencies: {
    "@supabase/supabase-js": "^2.44.0",
    "env-cmd": "^10.1.0",
    interactjs: "^1.10.27",
    marked: "^12.0.2",
    pinia: "^2.1.7",
    vue: "^3.4.27",
    "vue-router": "^4.3.3",
    "webextension-polyfill": "^0.12.0",
    xlsx: "^0.18.5"
  },
  devDependencies: {
    "@antfu/eslint-config": "^2.21.0",
    "@crxjs/vite-plugin": "^2.0.0-beta.23",
    "@iconify-json/mdi": "^1.1.66",
    "@tailwindcss/forms": "^0.5.7",
    "@tailwindcss/typography": "^0.5.13",
    "@types/chrome": "^0.0.268",
    "@types/eslint": "~8.56.10",
    "@types/node": "^20.14.2",
    "@types/webextension-polyfill": "~0.10.7",
    "@vitejs/plugin-vue": "^5.0.5",
    "@vue/compiler-sfc": "^3.4.27",
    "@vueuse/core": "^10.10.0",
    autoprefixer: "^10.4.19",
    "chrome-types": "^0.1.287",
    concurrently: "^8.2.2",
    "cross-env": "^7.0.3",
    daisyui: "^4.12.2",
    eslint: "^9.4.0",
    globals: "^15.4.0",
    postcss: "^8.4.38",
    prettier: "^3.3.1",
    "prettier-plugin-tailwindcss": "^0.6.2",
    sass: "^1.77.4",
    tailwindcss: "^3.4.4",
    terser: "^5.31.1",
    typescript: "^5.4.5",
    "unplugin-auto-import": "^0.17.6",
    "unplugin-icons": "^0.19.0",
    "unplugin-vue-components": "^0.27.0",
    "unplugin-vue-router": "^0.9.1",
    vite: "^5.2.13",
    "vite-plugin-pages": "^0.32.2",
    "vite-plugin-vue-devtools": "^7.2.1",
    "vue-tsc": "^2.0.21",
    "web-ext": "^8.0.0",
    "webext-bridge": "^6.0.1"
  },
  pnpm: {
    overrides: {},
    peerDependencyRules: {
      allowAny: [],
      allowedDeprecatedVersions: {
        "sourcemap-codec": "1.4.8"
      },
      allowedVersions: {},
      ignoreMissing: []
    }
  },
  overrides: {
    "@crxjs/vite-plugin": "$@crxjs/vite-plugin"
  }
};

// define.config.ts
var changelog = fs.readFileSync("./CHANGELOG.md", "utf-8");
var gitCommit = spawnSync("git", ["rev-parse", "--short", "HEAD"]).stdout.toString().trim();
var jsn = (value) => JSON.stringify(value);
var defineViteConfig = {
  __VERSION__: jsn(package_default.version),
  __DISPLAY_NAME__: jsn(package_default.displayName),
  __CHANGELOG__: jsn(changelog),
  __GIT_COMMIT__: jsn(gitCommit),
  __GITHUB_URL__: jsn(package_default.repository.url)
};

// manifest.config.ts
import { defineManifest } from "file:///C:/git-program/chaoxing-quest/node_modules/.pnpm/@crxjs+vite-plugin@2.0.0-beta.23/node_modules/@crxjs/vite-plugin/dist/index.mjs";
var { version, name, description, displayName } = package_default;
var [major, minor, patch, label = "0"] = version.replace(/[^\d.-]+/g, "").split(/[.-]/);
var manifest_config_default = defineManifest(async (env) => ({
  name: env.mode === "staging" ? `[INTERNAL] ${name}` : displayName || name,
  description,
  // up to four numbers separated by dots
  version: `${major}.${minor}.${patch}.${label}`,
  // semver is OK in "version_name"
  version_name: version,
  manifest_version: 3,
  // key: '',
  action: {
    default_popup: "src/popup/index.html"
  },
  background: {
    service_worker: "src/background/index.ts",
    type: "module"
  },
  content_scripts: [
    {
      all_frames: false,
      js: ["src/content-script/index.ts"],
      matches: [
        "*://*.chaoxing.com/*",
        "*://*.xuexi365.com/*",
        "*://127.0.0.1/*"
      ],
      run_at: "document_end"
    }
  ],
  offline_enabled: false,
  host_permissions: [],
  permissions: ["storage", "tabs", "background", "activeTab"],
  web_accessible_resources: [
    {
      matches: ["*://*/*"],
      resources: ["src/content-script/index.ts"]
    },
    {
      matches: ["*://*/*"],
      resources: ["src/content-script/iframe/index.html"]
    }
  ],
  icons: {
    16: "src/assets/logo.png",
    24: "src/assets/logo.png",
    32: "src/assets/logo.png",
    128: "src/assets/logo.png"
  }
}));

// vite.config.ts
var __vite_injected_original_import_meta_url = "file:///C:/git-program/chaoxing-quest/vite.config.ts";
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url)),
      "~": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url)),
      src: fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  plugins: [
    // legacy({
    //   targets: ['defaults'],
    // }),
    crx({
      manifest: manifest_config_default,
      browser: "chrome"
    }),
    vue(),
    Pages({
      dirs: [
        {
          dir: "src/pages",
          baseRoute: ""
        },
        {
          dir: "src/setup/pages",
          baseRoute: "setup"
        },
        {
          dir: "src/popup/pages",
          baseRoute: "popup"
        },
        {
          dir: "src/content-script/iframe/pages",
          baseRoute: "iframe"
        }
      ]
    }),
    AutoImport({
      imports: ["vue", "vue-router", "vue/macros", "@vueuse/core"],
      dts: "src/types/auto-imports.d.ts",
      dirs: ["src/composables/", "src/stores/", "src/utils/"]
    }),
    // https://github.com/antfu/unplugin-vue-components
    Components({
      dirs: ["src/components"],
      // generate `components.d.ts` for ts support with Volar
      dts: "src/types/components.d.ts",
      resolvers: [
        // auto import icons
        IconsResolver({
          prefix: "i",
          enabledCollections: ["mdi"]
        })
      ]
    }),
    // https://github.com/antfu/unplugin-icons
    Icons({
      autoInstall: true,
      compiler: "vue3",
      scale: 1.5
    }),
    // rewrite assets to use relative path
    {
      name: "assets-rewrite",
      enforce: "post",
      apply: "build",
      transformIndexHtml(html, { path }) {
        return html.replace(
          /"\/assets\//g,
          `"${relative(dirname(path), "/assets")}/`
        );
      }
    }
  ],
  build: {
    rollupOptions: {
      input: {
        iframe: "src/content-script/iframe/index.html",
        popup: "src/popup/index.html",
        setup: "src/setup/index.html"
      }
    },
    minify: "terser",
    terserOptions: {},
    outDir: "dist/chrome"
  },
  server: {
    port: 8888,
    strictPort: true,
    hmr: {
      port: 8889,
      overlay: false
    }
  },
  optimizeDeps: {
    include: ["vue", "@vueuse/core"],
    exclude: ["vue-demi"]
  },
  assetsInclude: ["src/assets/*/**"],
  define: defineViteConfig
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAiZGVmaW5lLmNvbmZpZy50cyIsICJwYWNrYWdlLmpzb24iLCAibWFuaWZlc3QuY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcZ2l0LXByb2dyYW1cXFxcY2hhb3hpbmctcXVlc3RcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXGdpdC1wcm9ncmFtXFxcXGNoYW94aW5nLXF1ZXN0XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9naXQtcHJvZ3JhbS9jaGFveGluZy1xdWVzdC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGNyeCB9IGZyb20gJ0Bjcnhqcy92aXRlLXBsdWdpbidcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCB7IGRpcm5hbWUsIHJlbGF0aXZlIH0gZnJvbSAnbm9kZTpwYXRoJ1xyXG5pbXBvcnQgeyBVUkwsIGZpbGVVUkxUb1BhdGggfSBmcm9tICdub2RlOnVybCdcclxuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSdcclxuaW1wb3J0IEljb25zUmVzb2x2ZXIgZnJvbSAndW5wbHVnaW4taWNvbnMvcmVzb2x2ZXInXHJcbmltcG9ydCBJY29ucyBmcm9tICd1bnBsdWdpbi1pY29ucy92aXRlJ1xyXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgUGFnZXMgZnJvbSAndml0ZS1wbHVnaW4tcGFnZXMnXHJcbmltcG9ydCB7IGRlZmluZVZpdGVDb25maWcgYXMgZGVmaW5lIH0gZnJvbSAnLi9kZWZpbmUuY29uZmlnJ1xyXG5pbXBvcnQgbWFuaWZlc3QgZnJvbSAnLi9tYW5pZmVzdC5jb25maWcnXHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpLFxyXG4gICAgICAnfic6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKSxcclxuICAgICAgc3JjOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSksXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgcGx1Z2luczogW1xyXG4gICAgLy8gbGVnYWN5KHtcclxuICAgIC8vICAgdGFyZ2V0czogWydkZWZhdWx0cyddLFxyXG4gICAgLy8gfSksXHJcblxyXG4gICAgY3J4KHtcclxuICAgICAgbWFuaWZlc3QsXHJcbiAgICAgIGJyb3dzZXI6ICdjaHJvbWUnLFxyXG4gICAgfSksXHJcblxyXG4gICAgdnVlKCksXHJcblxyXG4gICAgUGFnZXMoe1xyXG4gICAgICBkaXJzOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgZGlyOiAnc3JjL3BhZ2VzJyxcclxuICAgICAgICAgIGJhc2VSb3V0ZTogJycsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBkaXI6ICdzcmMvc2V0dXAvcGFnZXMnLFxyXG4gICAgICAgICAgYmFzZVJvdXRlOiAnc2V0dXAnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgZGlyOiAnc3JjL3BvcHVwL3BhZ2VzJyxcclxuICAgICAgICAgIGJhc2VSb3V0ZTogJ3BvcHVwJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGRpcjogJ3NyYy9jb250ZW50LXNjcmlwdC9pZnJhbWUvcGFnZXMnLFxyXG4gICAgICAgICAgYmFzZVJvdXRlOiAnaWZyYW1lJyxcclxuICAgICAgICB9LFxyXG4gICAgICBdLFxyXG4gICAgfSksXHJcblxyXG4gICAgQXV0b0ltcG9ydCh7XHJcbiAgICAgIGltcG9ydHM6IFsndnVlJywgJ3Z1ZS1yb3V0ZXInLCAndnVlL21hY3JvcycsICdAdnVldXNlL2NvcmUnXSxcclxuICAgICAgZHRzOiAnc3JjL3R5cGVzL2F1dG8taW1wb3J0cy5kLnRzJyxcclxuICAgICAgZGlyczogWydzcmMvY29tcG9zYWJsZXMvJywgJ3NyYy9zdG9yZXMvJywgJ3NyYy91dGlscy8nXSxcclxuICAgIH0pLFxyXG5cclxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbnRmdS91bnBsdWdpbi12dWUtY29tcG9uZW50c1xyXG4gICAgQ29tcG9uZW50cyh7XHJcbiAgICAgIGRpcnM6IFsnc3JjL2NvbXBvbmVudHMnXSxcclxuICAgICAgLy8gZ2VuZXJhdGUgYGNvbXBvbmVudHMuZC50c2AgZm9yIHRzIHN1cHBvcnQgd2l0aCBWb2xhclxyXG4gICAgICBkdHM6ICdzcmMvdHlwZXMvY29tcG9uZW50cy5kLnRzJyxcclxuICAgICAgcmVzb2x2ZXJzOiBbXHJcbiAgICAgICAgLy8gYXV0byBpbXBvcnQgaWNvbnNcclxuICAgICAgICBJY29uc1Jlc29sdmVyKHtcclxuICAgICAgICAgIHByZWZpeDogJ2knLFxyXG4gICAgICAgICAgZW5hYmxlZENvbGxlY3Rpb25zOiBbJ21kaSddLFxyXG4gICAgICAgIH0pLFxyXG4gICAgICBdLFxyXG4gICAgfSksXHJcblxyXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FudGZ1L3VucGx1Z2luLWljb25zXHJcbiAgICBJY29ucyh7XHJcbiAgICAgIGF1dG9JbnN0YWxsOiB0cnVlLFxyXG4gICAgICBjb21waWxlcjogJ3Z1ZTMnLFxyXG4gICAgICBzY2FsZTogMS41LFxyXG4gICAgfSksXHJcblxyXG4gICAgLy8gcmV3cml0ZSBhc3NldHMgdG8gdXNlIHJlbGF0aXZlIHBhdGhcclxuICAgIHtcclxuICAgICAgbmFtZTogJ2Fzc2V0cy1yZXdyaXRlJyxcclxuICAgICAgZW5mb3JjZTogJ3Bvc3QnLFxyXG4gICAgICBhcHBseTogJ2J1aWxkJyxcclxuICAgICAgdHJhbnNmb3JtSW5kZXhIdG1sKGh0bWwsIHsgcGF0aCB9KSB7XHJcbiAgICAgICAgcmV0dXJuIGh0bWwucmVwbGFjZShcclxuICAgICAgICAgIC9cIlxcL2Fzc2V0c1xcLy9nLFxyXG4gICAgICAgICAgYFwiJHtyZWxhdGl2ZShkaXJuYW1lKHBhdGgpLCAnL2Fzc2V0cycpfS9gXHJcbiAgICAgICAgKVxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICBdLFxyXG4gIGJ1aWxkOiB7XHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIGlucHV0OiB7XHJcbiAgICAgICAgaWZyYW1lOiAnc3JjL2NvbnRlbnQtc2NyaXB0L2lmcmFtZS9pbmRleC5odG1sJyxcclxuICAgICAgICBwb3B1cDogJ3NyYy9wb3B1cC9pbmRleC5odG1sJyxcclxuICAgICAgICBzZXR1cDogJ3NyYy9zZXR1cC9pbmRleC5odG1sJyxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBtaW5pZnk6ICd0ZXJzZXInLFxyXG4gICAgdGVyc2VyT3B0aW9uczoge30sXHJcbiAgICBvdXREaXI6ICdkaXN0L2Nocm9tZScsXHJcbiAgfSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIHBvcnQ6IDg4ODgsXHJcbiAgICBzdHJpY3RQb3J0OiB0cnVlLFxyXG4gICAgaG1yOiB7XHJcbiAgICAgIHBvcnQ6IDg4ODksXHJcbiAgICAgIG92ZXJsYXk6IGZhbHNlLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIG9wdGltaXplRGVwczoge1xyXG4gICAgaW5jbHVkZTogWyd2dWUnLCAnQHZ1ZXVzZS9jb3JlJ10sXHJcbiAgICBleGNsdWRlOiBbJ3Z1ZS1kZW1pJ10sXHJcbiAgfSxcclxuICBhc3NldHNJbmNsdWRlOiBbJ3NyYy9hc3NldHMvKi8qKiddLFxyXG4gIGRlZmluZSxcclxufSlcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxnaXQtcHJvZ3JhbVxcXFxjaGFveGluZy1xdWVzdFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcZ2l0LXByb2dyYW1cXFxcY2hhb3hpbmctcXVlc3RcXFxcZGVmaW5lLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovZ2l0LXByb2dyYW0vY2hhb3hpbmctcXVlc3QvZGVmaW5lLmNvbmZpZy50c1wiO2ltcG9ydCBmcyBmcm9tICdub2RlOmZzJ1xyXG5pbXBvcnQgeyBzcGF3blN5bmMgfSBmcm9tICdub2RlOmNoaWxkX3Byb2Nlc3MnXHJcbmltcG9ydCBwYWNrYWdlSnNvbiBmcm9tICcuL3BhY2thZ2UuanNvbidcclxuXHJcbi8vIFJlYWQgQ0hBTkdFTE9HLm1kIGZpbGUgaW50byBhIHN0cmluZy5cclxuY29uc3QgY2hhbmdlbG9nID0gZnMucmVhZEZpbGVTeW5jKCcuL0NIQU5HRUxPRy5tZCcsICd1dGYtOCcpXHJcblxyXG4vLyBHZXQgdGhlIGN1cnJlbnQgZ2l0IGNvbW1pdCBoYXNoLlxyXG5jb25zdCBnaXRDb21taXQgPSBzcGF3blN5bmMoJ2dpdCcsIFsncmV2LXBhcnNlJywgJy0tc2hvcnQnLCAnSEVBRCddKVxyXG4gIC5zdGRvdXQudG9TdHJpbmcoKVxyXG4gIC50cmltKClcclxuXHJcbmNvbnN0IGpzbiA9ICh2YWx1ZTogc3RyaW5nKSA9PiBKU09OLnN0cmluZ2lmeSh2YWx1ZSlcclxuXHJcbi8vIERvbid0IGZvcmdldCB0byBhZGQgeW91ciBhZGRlZCB2YXJpYWJsZXMgdG8gdml0ZS1lbnYuZC50cyBhbHNvIVxyXG5cclxuLy8gVGhlc2UgdmFyaWFibGVzIGFyZSBhdmFpbGFibGUgaW4geW91ciBWdWUgY29tcG9uZW50cyBhbmQgd2lsbCBiZSByZXBsYWNlZCBieSB0aGVpciB2YWx1ZXMgYXQgYnVpbGQgdGltZS5cclxuLy8gVGhlc2Ugd2lsbCBiZSBjb21waWxlZCBpbnRvIHlvdXIgYXBwLiBEb24ndCBzdG9yZSBzZWNyZXRzIGhlcmUhXHJcblxyXG5leHBvcnQgY29uc3QgZGVmaW5lVml0ZUNvbmZpZyA9IHtcclxuICBfX1ZFUlNJT05fXzoganNuKHBhY2thZ2VKc29uLnZlcnNpb24pLFxyXG4gIF9fRElTUExBWV9OQU1FX186IGpzbihwYWNrYWdlSnNvbi5kaXNwbGF5TmFtZSksXHJcbiAgX19DSEFOR0VMT0dfXzoganNuKGNoYW5nZWxvZyksXHJcbiAgX19HSVRfQ09NTUlUX186IGpzbihnaXRDb21taXQpLFxyXG4gIF9fR0lUSFVCX1VSTF9fOiBqc24ocGFja2FnZUpzb24ucmVwb3NpdG9yeS51cmwpLFxyXG59XHJcbiIsICJ7XG4gIFwibmFtZVwiOiBcInZpdGUtdnVlMy1jaHJvbWUtZXh0ZW5zaW9uLXYzXCIsXG4gIFwiZGlzcGxheU5hbWVcIjogXCJjaGFveGluZy1xdWVzdFZpdGUgVnVlIDMgQ2hyb21lIEV4dGVuc2lvblwiLFxuICBcInR5cGVcIjogXCJtb2R1bGVcIixcbiAgXCJ2ZXJzaW9uXCI6IFwiMC4wLjFcIixcbiAgXCJwcml2YXRlXCI6IHRydWUsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJjaGFveGluZy1xdWVzdCBcdTUwNUFcdTk4OThcIixcbiAgXCJyZXBvc2l0b3J5XCI6IHtcbiAgICBcInR5cGVcIjogXCJnaXRcIixcbiAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS8xNDc5MDg5Ny9jaGFveGluZy1xdWVzdFwiXG4gIH0sXG4gIFwic2NyaXB0c1wiOiB7XG4gICAgXCJidWlsZFwiOiBcIm5wbSBydW4gYnVpbGQ6Y2hyb21lICYmIG5wbSBydW4gYnVpbGQ6ZmlyZWZveFwiLFxuICAgIFwiYnVpbGQ6Y2hyb21lXCI6IFwidml0ZSBidWlsZFwiLFxuICAgIFwiYnVpbGQ6ZmlyZWZveFwiOiBcInZpdGUgYnVpbGQgLWMgdml0ZS5maXJlZm94LmNvbmZpZy5qc1wiLFxuICAgIFwiZGV2XCI6IFwiY29uY3VycmVudGx5IFxcXCJucG0gcnVuIGRldjpjaHJvbWVcXFwiIFxcXCJucG0gcnVuIGRldjpmaXJlZm94XFxcIlwiLFxuICAgIFwiZGV2OmNocm9tZVwiOiBcInZpdGVcIixcbiAgICBcImRldjpmaXJlZm94XCI6IFwidml0ZSBidWlsZCAtLW1vZGUgZGV2ZWxvcG1lbnQgLS13YXRjaCAtYyB2aXRlLmZpcmVmb3guY29uZmlnLmpzXCIsXG4gICAgXCJmb3JtYXRcIjogXCJwcmV0dGllciAtLXdyaXRlIC5cIixcbiAgICBcImxpbnRcIjogXCJlc2xpbnQgLiAtLWZpeFwiLFxuICAgIFwibGludDptYW5pZmVzdFwiOiBcIndlYi1leHQgbGludCAtLXByZXR0eVwiLFxuICAgIFwicHJldmlld1wiOiBcInZpdGUgcHJldmlld1wiLFxuICAgIFwidHlwZWNoZWNrXCI6IFwidnVlLXRzYyAtLW5vRW1pdFwiLFxuICAgIFwic3VwYWJhc2U6bGlua1wiOiBcImVudi1jbWQgLWYgLi8uZW52LmxvY2FsIHN1cGFiYXNlIGxpbmsgLS1wcm9qZWN0LXJlZiB0Y3JsYWduYXRva2ptaXV4eWJrdFwiLFxuICAgIFwibWlncmF0aW9uOnVwXCI6IFwic3VwYWJhc2UgbWlncmF0aW9uIHVwIC0tbGlua2VkIC0tZGVidWcgJiYgcG5wbSBnZW5lcmF0ZS10eXBlc1wiLFxuICAgIFwiZ2VuZXJhdGUtdHlwZXNcIjogXCJwbnBtIHN1cGFiYXNlIGdlbiB0eXBlcyB0eXBlc2NyaXB0IC0tcHJvamVjdC1pZCB0Y3JsYWduYXRva2ptaXV4eWJrdCAtLXNjaGVtYSBwdWJsaWMgPiBzcmMvbGliL2RhdGFiYXNlLnR5cGVzLnRzXCJcbiAgfSxcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQHN1cGFiYXNlL3N1cGFiYXNlLWpzXCI6IFwiXjIuNDQuMFwiLFxuICAgIFwiZW52LWNtZFwiOiBcIl4xMC4xLjBcIixcbiAgICBcImludGVyYWN0anNcIjogXCJeMS4xMC4yN1wiLFxuICAgIFwibWFya2VkXCI6IFwiXjEyLjAuMlwiLFxuICAgIFwicGluaWFcIjogXCJeMi4xLjdcIixcbiAgICBcInZ1ZVwiOiBcIl4zLjQuMjdcIixcbiAgICBcInZ1ZS1yb3V0ZXJcIjogXCJeNC4zLjNcIixcbiAgICBcIndlYmV4dGVuc2lvbi1wb2x5ZmlsbFwiOiBcIl4wLjEyLjBcIixcbiAgICBcInhsc3hcIjogXCJeMC4xOC41XCJcbiAgfSxcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQGFudGZ1L2VzbGludC1jb25maWdcIjogXCJeMi4yMS4wXCIsXG4gICAgXCJAY3J4anMvdml0ZS1wbHVnaW5cIjogXCJeMi4wLjAtYmV0YS4yM1wiLFxuICAgIFwiQGljb25pZnktanNvbi9tZGlcIjogXCJeMS4xLjY2XCIsXG4gICAgXCJAdGFpbHdpbmRjc3MvZm9ybXNcIjogXCJeMC41LjdcIixcbiAgICBcIkB0YWlsd2luZGNzcy90eXBvZ3JhcGh5XCI6IFwiXjAuNS4xM1wiLFxuICAgIFwiQHR5cGVzL2Nocm9tZVwiOiBcIl4wLjAuMjY4XCIsXG4gICAgXCJAdHlwZXMvZXNsaW50XCI6IFwifjguNTYuMTBcIixcbiAgICBcIkB0eXBlcy9ub2RlXCI6IFwiXjIwLjE0LjJcIixcbiAgICBcIkB0eXBlcy93ZWJleHRlbnNpb24tcG9seWZpbGxcIjogXCJ+MC4xMC43XCIsXG4gICAgXCJAdml0ZWpzL3BsdWdpbi12dWVcIjogXCJeNS4wLjVcIixcbiAgICBcIkB2dWUvY29tcGlsZXItc2ZjXCI6IFwiXjMuNC4yN1wiLFxuICAgIFwiQHZ1ZXVzZS9jb3JlXCI6IFwiXjEwLjEwLjBcIixcbiAgICBcImF1dG9wcmVmaXhlclwiOiBcIl4xMC40LjE5XCIsXG4gICAgXCJjaHJvbWUtdHlwZXNcIjogXCJeMC4xLjI4N1wiLFxuICAgIFwiY29uY3VycmVudGx5XCI6IFwiXjguMi4yXCIsXG4gICAgXCJjcm9zcy1lbnZcIjogXCJeNy4wLjNcIixcbiAgICBcImRhaXN5dWlcIjogXCJeNC4xMi4yXCIsXG4gICAgXCJlc2xpbnRcIjogXCJeOS40LjBcIixcbiAgICBcImdsb2JhbHNcIjogXCJeMTUuNC4wXCIsXG4gICAgXCJwb3N0Y3NzXCI6IFwiXjguNC4zOFwiLFxuICAgIFwicHJldHRpZXJcIjogXCJeMy4zLjFcIixcbiAgICBcInByZXR0aWVyLXBsdWdpbi10YWlsd2luZGNzc1wiOiBcIl4wLjYuMlwiLFxuICAgIFwic2Fzc1wiOiBcIl4xLjc3LjRcIixcbiAgICBcInRhaWx3aW5kY3NzXCI6IFwiXjMuNC40XCIsXG4gICAgXCJ0ZXJzZXJcIjogXCJeNS4zMS4xXCIsXG4gICAgXCJ0eXBlc2NyaXB0XCI6IFwiXjUuNC41XCIsXG4gICAgXCJ1bnBsdWdpbi1hdXRvLWltcG9ydFwiOiBcIl4wLjE3LjZcIixcbiAgICBcInVucGx1Z2luLWljb25zXCI6IFwiXjAuMTkuMFwiLFxuICAgIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHNcIjogXCJeMC4yNy4wXCIsXG4gICAgXCJ1bnBsdWdpbi12dWUtcm91dGVyXCI6IFwiXjAuOS4xXCIsXG4gICAgXCJ2aXRlXCI6IFwiXjUuMi4xM1wiLFxuICAgIFwidml0ZS1wbHVnaW4tcGFnZXNcIjogXCJeMC4zMi4yXCIsXG4gICAgXCJ2aXRlLXBsdWdpbi12dWUtZGV2dG9vbHNcIjogXCJeNy4yLjFcIixcbiAgICBcInZ1ZS10c2NcIjogXCJeMi4wLjIxXCIsXG4gICAgXCJ3ZWItZXh0XCI6IFwiXjguMC4wXCIsXG4gICAgXCJ3ZWJleHQtYnJpZGdlXCI6IFwiXjYuMC4xXCJcbiAgfSxcbiAgXCJwbnBtXCI6IHtcbiAgICBcIm92ZXJyaWRlc1wiOiB7fSxcbiAgICBcInBlZXJEZXBlbmRlbmN5UnVsZXNcIjoge1xuICAgICAgXCJhbGxvd0FueVwiOiBbXSxcbiAgICAgIFwiYWxsb3dlZERlcHJlY2F0ZWRWZXJzaW9uc1wiOiB7XG4gICAgICAgIFwic291cmNlbWFwLWNvZGVjXCI6IFwiMS40LjhcIlxuICAgICAgfSxcbiAgICAgIFwiYWxsb3dlZFZlcnNpb25zXCI6IHt9LFxuICAgICAgXCJpZ25vcmVNaXNzaW5nXCI6IFtdXG4gICAgfVxuICB9LFxuICBcIm92ZXJyaWRlc1wiOiB7XG4gICAgXCJAY3J4anMvdml0ZS1wbHVnaW5cIjogXCIkQGNyeGpzL3ZpdGUtcGx1Z2luXCJcbiAgfVxufSIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcZ2l0LXByb2dyYW1cXFxcY2hhb3hpbmctcXVlc3RcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXGdpdC1wcm9ncmFtXFxcXGNoYW94aW5nLXF1ZXN0XFxcXG1hbmlmZXN0LmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovZ2l0LXByb2dyYW0vY2hhb3hpbmctcXVlc3QvbWFuaWZlc3QuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lTWFuaWZlc3QgfSBmcm9tICdAY3J4anMvdml0ZS1wbHVnaW4nXHJcbmltcG9ydCBwYWNrYWdlSnNvbiBmcm9tICcuL3BhY2thZ2UuanNvbicgYXNzZXJ0IHsgdHlwZTogJ2pzb24nIH1cclxuXHJcbmNvbnN0IHsgdmVyc2lvbiwgbmFtZSwgZGVzY3JpcHRpb24sIGRpc3BsYXlOYW1lIH0gPSBwYWNrYWdlSnNvblxyXG4vLyBDb252ZXJ0IGZyb20gU2VtdmVyIChleGFtcGxlOiAwLjEuMC1iZXRhNilcclxuY29uc3QgW21ham9yLCBtaW5vciwgcGF0Y2gsIGxhYmVsID0gJzAnXSA9IHZlcnNpb25cclxuICAvLyBjYW4gb25seSBjb250YWluIGRpZ2l0cywgZG90cywgb3IgZGFzaFxyXG4gIC5yZXBsYWNlKC9bXlxcZC4tXSsvZywgJycpXHJcbiAgLy8gc3BsaXQgaW50byB2ZXJzaW9uIHBhcnRzXHJcbiAgLnNwbGl0KC9bLi1dLylcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZU1hbmlmZXN0KGFzeW5jIChlbnYpID0+ICh7XHJcbiAgbmFtZTogZW52Lm1vZGUgPT09ICdzdGFnaW5nJyA/IGBbSU5URVJOQUxdICR7bmFtZX1gIDogZGlzcGxheU5hbWUgfHwgbmFtZSxcclxuICBkZXNjcmlwdGlvbixcclxuICAvLyB1cCB0byBmb3VyIG51bWJlcnMgc2VwYXJhdGVkIGJ5IGRvdHNcclxuICB2ZXJzaW9uOiBgJHttYWpvcn0uJHttaW5vcn0uJHtwYXRjaH0uJHtsYWJlbH1gLFxyXG4gIC8vIHNlbXZlciBpcyBPSyBpbiBcInZlcnNpb25fbmFtZVwiXHJcbiAgdmVyc2lvbl9uYW1lOiB2ZXJzaW9uLFxyXG4gIG1hbmlmZXN0X3ZlcnNpb246IDMsXHJcbiAgLy8ga2V5OiAnJyxcclxuICBhY3Rpb246IHtcclxuICAgIGRlZmF1bHRfcG9wdXA6ICdzcmMvcG9wdXAvaW5kZXguaHRtbCcsXHJcbiAgfSxcclxuICBiYWNrZ3JvdW5kOiB7XHJcbiAgICBzZXJ2aWNlX3dvcmtlcjogJ3NyYy9iYWNrZ3JvdW5kL2luZGV4LnRzJyxcclxuICAgIHR5cGU6ICdtb2R1bGUnLFxyXG4gIH0sXHJcbiAgY29udGVudF9zY3JpcHRzOiBbXHJcbiAgICB7XHJcbiAgICAgIGFsbF9mcmFtZXM6IGZhbHNlLFxyXG4gICAgICBqczogWydzcmMvY29udGVudC1zY3JpcHQvaW5kZXgudHMnXSxcclxuICAgICAgbWF0Y2hlczogW1xyXG4gICAgICAgICcqOi8vKi5jaGFveGluZy5jb20vKicsXHJcbiAgICAgICAgJyo6Ly8qLnh1ZXhpMzY1LmNvbS8qJyxcclxuICAgICAgICAnKjovLzEyNy4wLjAuMS8qJyxcclxuICAgICAgXSxcclxuICAgICAgcnVuX2F0OiAnZG9jdW1lbnRfZW5kJyxcclxuICAgIH0sXHJcbiAgXSxcclxuICBvZmZsaW5lX2VuYWJsZWQ6IGZhbHNlLFxyXG4gIGhvc3RfcGVybWlzc2lvbnM6IFtdLFxyXG4gIHBlcm1pc3Npb25zOiBbJ3N0b3JhZ2UnLCAndGFicycsICdiYWNrZ3JvdW5kJywgJ2FjdGl2ZVRhYiddLFxyXG4gIHdlYl9hY2Nlc3NpYmxlX3Jlc291cmNlczogW1xyXG4gICAge1xyXG4gICAgICBtYXRjaGVzOiBbJyo6Ly8qLyonXSxcclxuICAgICAgcmVzb3VyY2VzOiBbJ3NyYy9jb250ZW50LXNjcmlwdC9pbmRleC50cyddLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbWF0Y2hlczogWycqOi8vKi8qJ10sXHJcbiAgICAgIHJlc291cmNlczogWydzcmMvY29udGVudC1zY3JpcHQvaWZyYW1lL2luZGV4Lmh0bWwnXSxcclxuICAgIH0sXHJcbiAgXSxcclxuICBpY29uczoge1xyXG4gICAgMTY6ICdzcmMvYXNzZXRzL2xvZ28ucG5nJyxcclxuICAgIDI0OiAnc3JjL2Fzc2V0cy9sb2dvLnBuZycsXHJcbiAgICAzMjogJ3NyYy9hc3NldHMvbG9nby5wbmcnLFxyXG4gICAgMTI4OiAnc3JjL2Fzc2V0cy9sb2dvLnBuZycsXHJcbiAgfSxcclxufSkpXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBK1EsU0FBUyxXQUFXO0FBQ25TLE9BQU8sU0FBUztBQUNoQixTQUFTLFNBQVMsZ0JBQWdCO0FBQ2xDLFNBQVMsS0FBSyxxQkFBcUI7QUFDbkMsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxtQkFBbUI7QUFDMUIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVzs7O0FDVGlRLE9BQU8sUUFBUTtBQUNsUyxTQUFTLGlCQUFpQjs7O0FDRDFCO0FBQUEsRUFDRSxNQUFRO0FBQUEsRUFDUixhQUFlO0FBQUEsRUFDZixNQUFRO0FBQUEsRUFDUixTQUFXO0FBQUEsRUFDWCxTQUFXO0FBQUEsRUFDWCxhQUFlO0FBQUEsRUFDZixZQUFjO0FBQUEsSUFDWixNQUFRO0FBQUEsSUFDUixLQUFPO0FBQUEsRUFD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
