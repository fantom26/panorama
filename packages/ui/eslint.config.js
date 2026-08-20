import reactRefresh from 'eslint-plugin-react-refresh'
import storybook from 'eslint-plugin-storybook'
import tseslint from 'typescript-eslint'

import { config as reactInternalConfig } from '@repo/eslint-config/react-internal'

export default tseslint.config(
  { ignores: ['dist', 'storybook-static'] },
  ...reactInternalConfig,
  {
    plugins: {
      'react-refresh': reactRefresh
    },
    rules: {
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }]
    }
  },
  ...storybook.configs['flat/recommended']
)
