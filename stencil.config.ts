import { Config } from "@stencil/core";
import { postcss } from "@stencil/postcss";
import autoprefixer from "autoprefixer";
import postcssNested from "postcss-nested";

export const config: Config = {
  namespace: "inclusive-dates",
  tsconfig: "tsconfig.stencil.json",
  testing: {
    browserHeadless: "shell",
    testPathIgnorePatterns: [
      '/node_modules/',
      '/dist/',
      '/www/',
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'html', 'lcov', 'json'],
    collectCoverageFrom: [
      'src/components/**/*.{ts,tsx}',
      'src/utils/**/*.{ts,tsx}',
      '!src/**/*.stories.ts',
      '!src/**/*.spec.tsx',
      '!src/**/*.e2e.ts',
      '!src/**/*.d.ts',
      '!src/index.ts',
    ],
  },
  outputTargets: [
    {
      copy: [
        {
          src: "themes/*.css",
          dest: "../themes",
          warn: true
        }
      ],
      type: "dist"
    },
    {
      generateTypeDeclarations: true,
      type: "dist-custom-elements"
    },
    {
      copy: [
        {
          src: "themes/*.{css,map}",
          dest: "themes",
          warn: true
        }
      ],
      type: "www",
      serviceWorker: null
    }
  ],
  plugins: [
    postcss({
      plugins: [autoprefixer(), postcssNested()]
    })
  ],
  sourceMap: false
};
