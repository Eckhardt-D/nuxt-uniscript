# Nuxt Uniscript

> This module is meant for Nuxt v2 only (currently).

Nuxt Uniscript is a module that makes using page-level 3rd party scripts a breeze.

## Quick Start

```bash
pnpm install nuxt-uniscript # or yarn or npm etc..
```

_nuxt.config.js_

```js
export default {
  modules: ["nuxt-uniscript"],
  uniscript: {
    "https://example.com/my-blocking-script.js": {
      routes: ["/page1", "/page2"],
      async: false, // Leave out (default false)
      defer: false, // Leave out (default false)
      customAttributes: {
        "data-key": "12345",
      },
    },
  },
};
```

## The problem this module solves

Let's say you have a vital 3rd party script that needs to be loaded into the head of a specific page of your app. The simple way would be to do this:

_nuxt.config.js_

```js
export default {
  head: {
    script: [
      {
        src: "https://myscript.com/script.js",
      },
    ],
  },
};
```

However this has some performance drawback, because now you are loading it into the head of every SSR page. Downloading the resource unnecessarily each time for the user.

The other option is to do a page-level head:

_page.vue_

```vue
<template></template>

<script>
export default {
  head() {
    return {
      script: [
        {
          src: "https://script.com/myscript.js",
        },
      ],
    };
  },
};
</script>
```

The problem with this is that if you for example route to `/page` with `<nuxt-link>` or

```js
this.$router.push("/page");
```

your script will not be loaded into the head because you are on the client-side.

## Solution

This package makes scripts that are important (blocking scripts) universal. For example, let's say your script injects a property on the Window:

```js
window.MyScriptVariable;
```

And you want to access that `window.MyScriptVariable` e.g. in a `mounted()` hook, this package ensures that the script is loaded before the mounted hook fires.

## Notes

You of course can use this for async, deferred scripts too if you want, but the main benefit lies in using it for blocking scripts and only injecting those scripts on the pages that you need them, to improve performance of other pages.
