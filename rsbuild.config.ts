import { defineConfig } from '@rsbuild/core';
import { pluginLess } from '@rsbuild/plugin-less';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  output: {
    manifest: false,
    polyfill: 'off',
    filenameHash: false,
    legalComments: 'inline',
    distPath: {
      root: `./preview`,
      html: './',
      js: '.',
      css: '.',
    },
  },
  performance: {
    chunkSplit: {
      strategy: 'all-in-one',
    },
  },
  tools: {
    rspack: {
      output: {
        asyncChunks: false,
      },
      module: {
        rules: [
          {
            test: /\.(eot|ttf)$/,
            type: 'asset/inline',
          },
        ],
      },
    },
  },
  source: {
    entry: {
      index: './demo/index.tsx',
    },
  },
  plugins: [pluginReact(), pluginLess()],
});
