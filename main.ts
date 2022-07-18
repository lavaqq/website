import blog, { redirects } from "./src/blog.tsx";

blog({
  title: "Mathieu Lava",
  author: "Mathieu Lava",
  avatar: "./img/0004.webp",
  avatarClass: "rounded-xl",
  links: [
    { title: "Email", url: "mailto:mathieu@loak.studio" },
    { title: "GitHub", url: "https://github.com/lavaqq" },
    { title: "Twitter", url: "https://twitter.com/lavaqqm" },
    { title: "loak.studio", url: "https://loak.studio" },
  ],
  lang: "fr",
  timezone: "fr-BE",
  description: `Développeur web fullstack (PHP & JS) à Tournai, Belgique.`,
  middlewares: [
    redirects({
      // ...
    }),
  ],
});
