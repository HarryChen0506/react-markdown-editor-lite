import path from 'node:path';
import { pluginLess } from '@rsbuild/plugin-less';
import { pluginReact } from '@rsbuild/plugin-react';
import { defineConfig } from '@rslib/core';

const bundlelessConfig = {
  source: {
    entry: {
      index: ['./src/**', '!src/**/*.less'],
    },
  },
  bundle: false,
  dts: true,
  redirect: {
    style: {
      extension: false,
    },
  },
  output: {
    copy: [{ from: '**/*.less', context: path.join(__dirname, 'src') }],
  },
};

export default defineConfig({
  lib: [
    {
      ...bundlelessConfig,
      format: 'esm',
      output: {
        ...bundlelessConfig.output,
        distPath: {
          root: './esm',
        },
      },
    },
    {
      ...bundlelessConfig,
      format: 'cjs',
      output: {
        ...bundlelessConfig.output,
        distPath: {
          root: './cjs',
        },
      },
    },
    {
      bundle: true,
      dts: false,
      format: 'umd',
      umdName: 'ReactMarkdownEditorLite',
      source: {
        entry: {
          index: ['src/index.ts', 'src/index.less'],
        },
      },
      output: {
        externals: {
          react: 'React',
        },
        distPath: {
          root: './lib',
        },
        minify: true,
        emitCss: true,
      },
      tools: {
        rspack: {
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
    },
  ],
  output: {
    target: 'web',
  },
  plugins: [pluginReact(), pluginLess()],
});
