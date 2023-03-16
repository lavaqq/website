module.exports = (eleventyConfig) =>{
  eleventyConfig.addWatchTarget("./src/styles/");
  eleventyConfig.addPassthroughCopy({"public":"/"});
  return{
    dir:{
      input:'src'
    }
  }
}