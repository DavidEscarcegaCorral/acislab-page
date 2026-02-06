import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkToc from 'remark-toc';
import { getSiteConfig } from './src/utils/config';
import icon from 'astro-icon';

const siteConfig = getSiteConfig();
console.log('Astro Config - URL:', siteConfig.url);
console.log('Astro Config - Base:', siteConfig.base);

// https://astro.build/config
export default defineConfig({
  site: siteConfig.url,
  base: siteConfig.base,
  integrations: [
    tailwind(),
    mdx({
      remarkPlugins: [remarkToc],
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'append' }]
      ],
      shikiConfig: {
        theme: 'github-dark',
        langs: ['html', 'css', 'js', 'ts', 'jsx', 'tsx', 'json', 'bash', 'md'],
        wrap: true
      }
    }),
    react(),
    sitemap(),
    icon()
  ],
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    }
  },
  output: 'static',
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        jpeg: { quality: 80 },
        png: { quality: 80 },
        webp: { quality: 80 },
        avif: { quality: 65 }
      }
    },
    dev: {
      format: 'webp'
    }
  },
  vite: {
    base: siteConfig.base,
    build: {
      assetsInlineLimit: 4096,
    },
    server: {
      watch: {
        usePolling: false
      },
      hmr: {
        overlay: true
      }
    },
    define: {
      'import.meta.env.PUBLIC_BASE_URL': JSON.stringify(siteConfig.base)
    }
  }
});