# webpack-config-ts-react

Shared Webpack configuration for React projects using TypeScript.

## Installation

To use this configuration in your project, install the necessary dependencies:

```bash
npm install --save-dev @uvarovag/webpack-config-ts-react webpack webpack-cli @uvarovag/to-camel-case webpack-merge
```

## Usage

### Step 1: Create a project structure

```
├── public/
│   └── index.html     // HTML template
├── src/               // Folder with the application's source code
│   └── index.tsx      // Entry point for the application
├── webpack.config.ts  // Webpack configuration
├── tsconfig.json      // TypeScript configuration
├── global.d.ts        // Global TypeScript declaration file
├── package.json       // Project description, dependencies, and scripts
├── eslint.config.mjs  // (optional) ESLint configuration for code quality checks
└── .prettierrc        // (optional) Prettier configuration for code formatting
```

### Step 2: Create a `webpack.config.ts` file

```ts
import toCamelCase from '@uvarovag/to-camel-case'
import baseConfig from '@uvarovag/webpack-config-ts-react'
import { merge } from 'webpack-merge'

import { name } from './package.json'

import type { TConfiguration, TEnv } from '@uvarovag/webpack-config-ts-react'

export default (env: TEnv): TConfiguration =>
    merge(baseConfig(env), {
        output: {
            uniqueName: toCamelCase(name),
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

### Step 3: Add scripts to your `package.json`

```json
"scripts": {
    "start": "webpack serve --env NODE_ENV=development",
    "build:dev": "webpack --env NODE_ENV=development",
    "build:prod": "webpack --env NODE_ENV=production",
}
```
