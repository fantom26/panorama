import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/components/**/*.stories.@(ts|tsx)', '../src/tokens/**/*.mdx'],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
    'msw-storybook-addon',
    {
      name: 'storybook-design-token',
      options: {
        designTokenGlob: '../tokens/*/build/css/storybook-tokens.css'
      }
    },
    '@storybook/addon-mcp'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  }
}
export default config
