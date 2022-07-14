// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import {
  callsites,
  dirname,
  Fragment,
  fromFileUrl,
  frontMatter,
  gfm,
  h,
  html,
  HtmlOptions,
  join,
  relative,
  removeMarkdown,
  serve,
  serveDir,
  UnoCSS,
  walk,
} from "./deps.ts";
import { Index, PostPage } from "./components.tsx";
import type { ConnInfo } from "./deps.ts";
import type {
  BlogContext,
  BlogMiddleware,
  BlogSettings,
  BlogState,
  Post,
} from "./types.d.ts";

export { Fragment, h };

const IS_DEV = Deno.args.includes("--dev") && "watchFs" in Deno;
const POSTS = new Map<string, Post>();
const HMR_SOCKETS: Set<WebSocket> = new Set();
const HMR_CLIENT = `let socket;
let reconnectTimer;

const wsOrigin = window.location.origin
  .replace("http", "ws")
  .replace("https", "wss");
const hmrUrl = wsOrigin + "/hmr";

hmrSocket();

function hmrSocket(callback) {
  if (socket) {
    socket.close();
  }

  socket = new WebSocket(hmrUrl);
  socket.addEventListener("open", callback);
  socket.addEventListener("message", (event) => {
    if (event.data === "refresh") {
      console.log("refreshings");
      window.location.reload();
    }
  });

  socket.addEventListener("close", () => {
    console.log("reconnecting...");
    clearTimeout(reconnectTimer);
    reconnectTimer = setTimeout(() => {
      hmrSocket(() => {
        window.location.reload();
      });
    }, 1000);
  });
}
`;

export default async function blog(settings?: BlogSettings) {
  html.use(UnoCSS(settings?.unocss));
  const url = callsites()[1].getFileName()!;
  const blogState = await configureBlog(url, IS_DEV, settings);
  const blogHandler = createBlogHandler(blogState);
  serve(blogHandler);
}

export function createBlogHandler(state: BlogState) {
  const inner = handler;
  const withMiddlewares = composeMiddlewares(state);
  return function handler(req: Request, connInfo: ConnInfo) {
    const url = new URL(req.url);
    if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
      url.pathname = url.pathname.slice(0, -1);
      return Response.redirect(url.href, 307);
    }
    return withMiddlewares(req, connInfo, inner);
  };
}

function composeMiddlewares(state: BlogState) {
  return (
    req: Request,
    connInfo: ConnInfo,
    inner: (req: Request, ctx: BlogContext) => Promise<Response>
  ) => {
    const mws = state.middlewares?.reverse();
    const handlers: (() => Response | Promise<Response>)[] = [];
    const ctx = {
      next() {
        const handler = handlers.shift()!;
        return Promise.resolve(handler());
      },
      connInfo,
      state,
    };
    if (mws) {
      for (const mw of mws) {
        handlers.push(() => mw(req, ctx));
      }
    }
    handlers.push(() => inner(req, ctx));
    const handler = handlers.shift()!;
    return handler();
  };
}

export async function configureBlog(
  url: string,
  isDev: boolean,
  settings?: BlogSettings
): Promise<BlogState> {
  let directory;
  try {
    const blogPath = fromFileUrl(url);
    directory = dirname(blogPath);
  } catch (e) {
    console.log(e);
    throw new Error("Cannot run blog from a remote URL.");
  }
  const state: BlogState = {
    directory,
    ...settings,
  };
  await loadContent(directory, isDev);
  return state;
}

async function loadContent(blogDirectory: string, isDev: boolean) {
  const postsDirectory = join(blogDirectory, "posts");
  for await (const entry of walk(postsDirectory)) {
    if (entry.isFile && entry.path.endsWith(".md")) {
      await loadPost(postsDirectory, entry.path);
    }
  }
  if (isDev) {
    watchForChanges(postsDirectory).catch(() => {});
  }
}

async function watchForChanges(postsDirectory: string) {
  const watcher = Deno.watchFs(postsDirectory);
  for await (const event of watcher) {
    if (event.kind === "modify" || event.kind === "create") {
      for (const path of event.paths) {
        if (path.endsWith(".md")) {
          await loadPost(postsDirectory, path);
          HMR_SOCKETS.forEach((socket) => {
            socket.send("refresh");
          });
        }
      }
    }
  }
}

async function loadPost(postsDirectory: string, path: string) {
  const contents = await Deno.readTextFile(path);
  let pathname = "/" + relative(postsDirectory, path);
  pathname = pathname.slice(0, -3);
  pathname = pathname.replace(" ", "-");
  const { content, data: _data } = frontMatter(contents) as {
    data: Record<string, string | string[] | Date>;
    content: string;
  };
  const data = recordGetter(_data);
  let snippet: string | undefined = data.get("summary");
  if (!snippet) {
    const maybeSnippet = content.split("\n\n")[0];
    if (maybeSnippet) {
      snippet = removeMarkdown(maybeSnippet.replace("\n", " "));
    } else {
      snippet = "";
    }
  }
  const post: Post = {
    title: data.get("title"),
    author: data.get("author"),
    pathname: pathname,
    publishDate: data.get("date")!,
    snippet,
    markdown: content,
    coverHtml: data.get("cover"),
    coverAlt: data.get("coverAlt") ?? "",
    ogImage: data.get("ogImage") ?? data.get("cover"),
    tags: data.get("tags"),
    published: data.get("published"),
  };
  POSTS.set(pathname, post);
  console.log("Load: ", post.pathname);
}

export async function handler(req: Request, ctx: BlogContext) {
  const { state: blogState } = ctx;
  const { pathname, searchParams } = new URL(req.url);
  const canonicalUrl = blogState.canonicalUrl || new URL(req.url).origin;
  if (IS_DEV) {
    if (pathname == "/hmr.js") {
      return new Response(HMR_CLIENT, {
        headers: {
          "content-type": "application/javascript",
        },
      });
    }
    if (pathname == "/hmr") {
      const { response, socket } = Deno.upgradeWebSocket(req);
      HMR_SOCKETS.add(socket);
      socket.onclose = () => {
        HMR_SOCKETS.delete(socket);
      };
      return response;
    }
  }
  const sharedHtmlOptions: HtmlOptions = {
    colorScheme: blogState.theme ?? "auto",
    lang: blogState.lang ?? "en",
    scripts: IS_DEV ? [{ src: "/hmr.js" }] : undefined,
    links: [{ href: canonicalUrl, rel: "canonical" }],
  };
  if (blogState.favicon) {
    sharedHtmlOptions.links?.push({
      href: blogState.favicon,
      type: "image/x-icon",
      rel: "icon",
    });
  }
  if (pathname === "/") {
    return html({
      ...sharedHtmlOptions,
      title: blogState.title ?? "My Blog",
      meta: {
        description: blogState.description,
        "og:title": blogState.title,
        "og:description": blogState.description,
        "og:image": blogState.ogImage ?? blogState.cover,
        "twitter:title": blogState.title,
        "twitter:description": blogState.description,
        "twitter:image": blogState.ogImage ?? blogState.cover,
        "twitter:card": blogState.ogImage ? "summary_large_image" : undefined,
      },
      styles: [...(blogState.style ? [blogState.style] : [])],
      body: (
        <Index state={blogState} posts={filterPosts(POSTS, searchParams)} />
      ),
    });
  }
  const post = POSTS.get(pathname);
  if (post) {
    return html({
      ...sharedHtmlOptions,
      title: post.title,
      meta: {
        description: post.snippet,
        "og:title": post.title,
        "og:description": post.snippet,
        "og:image": post.ogImage,
        "twitter:title": post.title,
        "twitter:description": post.snippet,
        "twitter:image": post.ogImage,
        "twitter:card": post.ogImage ? "summary_large_image" : undefined,
      },
      styles: [
        gfm.CSS,
        `.markdown-body { --color-canvas-default: transparent !important; --color-canvas-subtle: #edf0f2; --color-border-muted: rgba(128,128,128,0.2); } .markdown-body img + p { margin-top: 16px; }`,
        ...(blogState.style ? [blogState.style] : []),
      ],
      body: <PostPage post={post} state={blogState} />,
    });
  }
  let fsRoot = blogState.directory;
  try {
    await Deno.lstat(join(blogState.directory, "./posts", pathname));
    fsRoot = join(blogState.directory, "./posts");
  } catch (e) {
    if (!(e instanceof Deno.errors.NotFound)) {
      console.error(e);
      return new Response(e.message, { status: 500 });
    }
  }
  return serveDir(req, { fsRoot });
}

export function redirects(redirectMap: Record<string, string>): BlogMiddleware {
  return async function (req: Request, ctx: BlogContext): Promise<Response> {
    const { pathname } = new URL(req.url);
    let maybeRedirect = redirectMap[pathname];
    if (!maybeRedirect) {
      maybeRedirect = redirectMap[pathname.slice(1)];
    }
    if (maybeRedirect) {
      if (!maybeRedirect.startsWith("/")) {
        maybeRedirect = "/" + maybeRedirect;
      }
      return new Response(null, {
        status: 307,
        headers: {
          location: maybeRedirect,
        },
      });
    }
    return await ctx.next();
  };
}

function filterPosts(posts: Map<string, Post>, searchParams: URLSearchParams) {
  const tag = searchParams.get("tag");
  if (!tag) {
    return posts;
  }
  return new Map(
    Array.from(posts.entries()).filter(([, p]) => p.tags?.includes(tag))
  );
}

function recordGetter(data: Record<string, unknown>) {
  return {
    get<T>(key: string): T | undefined {
      return data[key] as T;
    },
  };
}
