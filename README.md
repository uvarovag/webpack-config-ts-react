# webpack-config-ts-react

Shared Webpack configuration for React projects using TypeScript.

## Installation

To use this configuration in your project, install the necessary dependencies:

```bash
npm install --save-dev @uvarovag/webpack-config-ts-react webpack webpack-cli
```

## Usage

### Step 1: Create a `webpack.config.ts` file

```ts
import toCamelCase from '@uvarovag/to-camel-case'
import baseConfig from '@uvarovag/webpack-config-ts-react'
import { merge } from 'webpack-merge'

import packageJson from './package.json'

import type { TEnv } from '@uvarovag/webpack-config-ts-react'

export default (env: TEnv) =>
    merge(baseConfig(env), {
        output: {
            uniqueName: toCamelCase(packageJson.name),
        },
        devServer: {
            proxy: [
                {
                    secure: false,
                    changeOrigin: true,
                    pathRewrite: {
                        '^/pokeapi': '',
                    },
                    context: '/pokeapi',
                    target: 'https://pokeapi.co/api/v2/',
                },
            ],
        },
    })
```

### Step 2: Add scripts to your `package.json`

```json
"scripts": {
    "start": "webpack serve --env NODE_ENV=development",
    "build:dev": "webpack --env NODE_ENV=development",
    "build:prod": "webpack --env NODE_ENV=production",
}
```
