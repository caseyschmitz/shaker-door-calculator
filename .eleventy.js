import { EleventyHtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  // Copy the assets folder to the output
  eleventyConfig.addPassthroughCopy("assets");

  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site",
    },
  };
}

export const config = {
  pathPrefix: "/shaker-door-calculator/"
}
