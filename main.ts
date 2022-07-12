import blog from "./src/blog.tsx";

blog({
  title: "Mathieu Lava",
  author: "Mathieu Lava",
  avatar: "./img/0003.webp",
  avatarClass: "rounded-xl border-none",
  links: [
    { title: "Email", url: "mailto:mathieu@loak.studio" },
    { title: "GitHub", url: "https://github.com/lavaqq" },
    { title: "Twitter", url: "https://twitter.com/lavaqqm" },
    { title: "loak.studio", url: "https://loak.studio" },
  ],
  lang: "fr",
  timezone: "fr-BE",
  description: `Développeur web fullstack (PHP & JS) à Tournai, Belgique.`,

  // middlewares: [

  // If you want to set up Google Analytics, paste your GA key here.
  // ga("UA-XXXXXXXX-X"),

  // If you want to provide some redirections, you can specify them here,
  // pathname specified in a key will redirect to pathname in the value.
  // redirects({
  //  "/hello_world.html": "/hello_world",
  // }),

  // ]
});
