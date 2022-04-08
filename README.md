# App Store Review Templates

Extension for Chrome, Firefox, Edge, etc which enable templating on Google Play Store Reviews. 

Available on:
- [Chrome](https://chrome.google.com/webstore/detail/pganmakhjalohhdddmkhehgcoidfclja/)
- [Firefox](https://addons.mozilla.org/fr/firefox/addon/app-store-review-templates/)

Features:
- 2 level templates, could be use to support many languages
- limited sync on your browser account (Firefox limit is 102ko, Chrome is way larger)
- import & export without limitation (you can also edit the data outside and re-mport them)

![use template & edit directly from Play Store](/marketing/play-store.png)

![import & export](/marketing/settings.png)

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
