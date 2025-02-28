export default function (eleventyConfig) {
  // Copy the assets folder to the output
  eleventyConfig.addPassthroughCopy("assets");

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site",
    },
  };
}
