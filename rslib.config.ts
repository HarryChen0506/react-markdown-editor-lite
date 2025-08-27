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
          react: {
            root: 'React',
            amd: 'react',
            commonjs: 'react',
            commonjs2: 'react',
          },
        },
        distPath: {
          root: './lib',
        },
        minify: true,
        emitCss: true,
        overrideBrowserslist: [
          'defaults',
          'not ie < 11',
          'last 2 versions',
          '> 0.2%',
          'iOS 7',
          'last 3 iOS versions',
        ],
      },
      tools: {
        rspack: {
          resolve: {
            symlinks: false,
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
    },
  ],
  output: {
    target: 'web',
  },
  plugins: [
    pluginReact({
      swcReactOptions: {
        runtime: 'classic',
      },
    }),
    pluginLess(),
  ],
});
