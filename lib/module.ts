import { resolve } from "path";
import type { Module } from "@nuxt/types";

type UniscriptCustomAttributes = {
  [key: string]: string | boolean;
};

export type UniscriptPerPathOptions = {
  routes: string[];
  async: boolean;
  defer: boolean;
  customAttributes: UniscriptCustomAttributes;
};

export interface UniscriptOptions {
  [key: string]: UniscriptPerPathOptions;
}

const uniscriptNuxtModule: Module = function (moduleOptions: UniscriptOptions) {
  const options: UniscriptOptions = Object.assign(
    {},
    moduleOptions,
    this.options.uniscript
  );

  const scripts = Object.entries(options);

  if (scripts.length < 1) return;

  this.addPlugin({
    src: resolve(__dirname, "plugin.js"),
    fileName: "uniscript.js",
    options: {
      scripts,
    },
  });
};

export default uniscriptNuxtModule;
module.exports.meta = require("../package.json");
