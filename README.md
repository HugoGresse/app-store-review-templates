# app-store-review-templates

This template should help get you started developing a svelte web extension in Vite.

## Usage Notes
Switch between Manifest V2 and Manifest V3 builds using the MANIFEST_VERSION environment variable in `.env`

Hot-Reload during development is currently not supported in Manifest V3. Use watch mode for development.

Refer to [@samrum/vite-plugin-web-extension](https://github.com/samrum/vite-plugin-web-extension) for more usage notes.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Watch for Development (When Hot-Reload is not available)

```sh
npm run watch
```

### Compile and Minify for Production

```sh
npm run build
```

### Load complited extension in browser

```sh
npm run serve:chrome
```

```sh
npm run serve:firefox
```
