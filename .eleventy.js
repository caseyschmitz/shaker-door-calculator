import { EleventyHtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./assets/");

	eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
};

export const config = {
  pathPrefix: "/shaker-door-calculator/",
  dir: {
    input: "content",
    includes: "../_includes",
    data: "../_data",
    output: "_site"
  }
}
