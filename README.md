# Update Available

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Get app version.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
- [🏀 Online playground](https://stackblitz.com/github/@nasontech/nuxt-app-version?file=playground%2Fapp.vue)

## Features

Get your Nuxt app version.

## Quick Setup

Install the module to your Nuxt application with one command:

```bash
npx nuxi module add @nasontech/nuxt-app-version
```

That's it! You can now use `useAppVersion()` in your Nitro server app ✨

Create an api route to return the app version.

```typescript
export default defineEventHandler(() => {
    return useAppVersion()
})
```

Get the app version in your frontend.

```vue
<script setup lang="ts">
const { data: version } = await useFetch('/api/version')
</script>

<template>
    <div>
        <pre>Version: {{ version }}</pre>
    </div>
</template>
```

## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  npm install
  
  # Generate type stubs
  npm run dev:prepare
  
  # Develop with the playground
  npm run dev
  
  # Build the playground
  npm run dev:build
  
  # Run ESLint
  npm run lint
  
  # Run Vitest
  npm run test
  npm run test:watch
  
  # Release new version
  npm run release
  ```

</details>

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@nasontech/nuxt-app-version/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/@nasontech/nuxt-app-version
[npm-downloads-src]: https://img.shields.io/npm/dm/@nasontech/nuxt-app-version.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/@nasontech/nuxt-app-version
[license-src]: https://img.shields.io/npm/l/@nasontech/nuxt-app-version.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/@nasontech/nuxt-app-version
[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
