import Vue from "vue";
import type { UniscriptPerPathOptions } from "./module";

type ScriptOptions = {
  src: string;
  async?: boolean;
  defer?: boolean;
  [key: string]: unknown;
};

const scriptEntries: [string, UniscriptPerPathOptions][] = JSON.parse(
  `<%= JSON.stringify(options.scripts) %>`
);

Vue.mixin({
  async middleware(ctx) {
    if (process.server) return;

    const scriptsToLoad: HTMLScriptElement[] = [];

    /**
     * @todo better algo for checking if we are on a page or layout or component
     */
    scriptEntries.forEach(([scriptName, options]) => {
      if (
        !options.routes?.some((route: string) => ctx.route.path.match(route))
      ) {
        return;
      }

      const selector = `script[src="${scriptName}"]`;
      const exists = !!document.querySelector(selector);

      if (exists) return;

      const script = document.createElement("script");
      script.src = scriptName;

      if (options.async) {
        script.setAttribute("async", "true");
      }

      if (options.defer) {
        script.setAttribute("defer", "true");
      }

      if (options.customAttributes) {
        Object.entries(options.customAttributes).forEach(([key, value]) => {
          script.setAttribute(key.toString(), value.toString());
        });
      }

      document.head.prepend(script);
      scriptsToLoad.push(script);
    });

    await Promise.all(
      scriptsToLoad.map((script) => {
        return new Promise((resolve) => {
          script.onload = () => {
            resolve(void undefined);
          };

          script.onerror = (error) => {
            // eslint-disable-next-line
            console.error(error);
            resolve(void undefined);
          };
        });
      })
    );
  },
  head() {
    if (!this.$vnode?.data.nuxtChild) return;

    const scriptArray: ScriptOptions[] = [];
    scriptEntries.forEach(([scriptName, { routes, ...options }]) => {
      /**
       * @todo better algo for checking if we are on a page or layout or component
       */
      if (!routes.some((route) => this.$route?.path.match(route))) return;

      const settings = {} as ScriptOptions;

      settings.src = scriptName;

      if (options.async) {
        settings.async = options.async;
      }

      if (options.defer) {
        settings.defer = options.defer;
      }

      if (options.customAttributes) {
        Object.entries(options.customAttributes).forEach(([key, value]) => {
          settings[key] = value;
        });
      }

      scriptArray.push(settings);
    });

    return {
      script: scriptArray,
    };
  },
});
