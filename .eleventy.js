import { EleventyHtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  // Copy the assets folder to the output
  /*
  eleventyConfig.addPassthroughCopy({
    "./assets/": "/"
  });
  */
 eleventyConfig.addPassthroughCopy("./assets/");

  eleventyConfig.addBundle("css");
  eleventyConfig.addBundle("js");

  /*
  // Adds the {% css %} paired shortcode
	eleventyConfig.addBundle("css", {
		toFileDirectory: "dist",
	});
	// Adds the {% js %} paired shortcode
	eleventyConfig.addBundle("js", {
		toFileDirectory: "dist",
	});
  */

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
