// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { Fragment, gfm, h } from "./deps.ts";
import type { BlogState, DateStyle, Post } from "./types.d.ts";

const socialAppIcons = new Map([
  ["github.com", IconGithub],
  ["twitter.com", IconTwitter],
  ["loak.studio", IconLoak],
]);

interface IndexProps {
  state: BlogState;
  posts: Map<string, Post>;
}

export function Index({ state, posts }: IndexProps) {
  const postIndex = [];
  for (const [_key, post] of posts.entries()) {
    postIndex.push(post);
  }
  postIndex.sort(
    (a, b) => (b.publishDate?.getTime() ?? 0) - (a.publishDate?.getTime() ?? 0)
  );
  const publishedPost = postIndex.filter((post) => post.published === true);
  return (
    <>
      {state.header || (
        <header
          class={[
            "w-full",
            publishedPost.length > 0 ? "h-auto my-8" : "h-screen",
          ].join(" ")}
        >
          <div class="max-w-screen-sm h-full px-6 mx-auto flex flex-col items-center justify-center">
            {state.avatar && (
              <a
                href="/"
                class={[
                  "bg-cover bg-center bg-no-repeat w-30 h-30",
                  state.avatarClass,
                ].join(" ")}
                style={{ backgroundImage: `url(${state.avatar})` }}
              />
            )}
            <h1 class="mt-3 text-4xl text-gray-900 dark:text-gray-100 font-bold">
              {state.title}
            </h1>
            {state.description && (
              <p class="text-lg text-gray-600 dark:text-gray-400">
                {state.description}
              </p>
            )}
            {state.links && (
              <nav class="mt-3 flex gap-2">
                {state.links.map((link) => {
                  const url = new URL(link.url);
                  let Icon = IconExternalLink;
                  if (url.protocol === "mailto:") {
                    Icon = IconEmail;
                  } else {
                    const icon = socialAppIcons.get(
                      url.hostname.replace(/^www\./, "")
                    );
                    if (icon) {
                      Icon = icon;
                    }
                  }
                  return (
                    <a
                      class="relative flex items-center justify-center w-8 h-8 rounded-full bg-gray-600/10 dark:bg-gray-400/10 text-gray-700 dark:text-gray-400 hover:bg-gray-600/15 dark:hover:bg-gray-400/15 hover:text-black dark:hover:text-white transition-colors group"
                      target="_blank"
                      href={link.url}
                    >
                      {link.icon ? link.icon : <Icon />}
                      <Tooltip>{link.title}</Tooltip>
                    </a>
                  );
                })}
              </nav>
            )}
          </div>
        </header>
      )}
      {publishedPost.length > 0 && (
        <div
          class={[
            "max-w-screen-sm px-6 mx-auto",
            publishedPost.length > 1 ? "mb-8" : "mb-0",
          ].join(" ")}
        >
          <div class="pt-8 lt-sm:pt-12 border-t-1 border-gray-300/80">
            {publishedPost.map((post) => (
              <PostCard
                post={post}
                key={post.pathname}
                dateStyle={state.dateStyle}
                lang={state.lang}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function PostCard({
  post,
  dateStyle,
  lang,
}: {
  post: Post;
  dateStyle?: DateStyle;
  lang?: string;
}) {
  return (
    <div class="pt-12 first:pt-0 flex flex-col gap-y-2">
      <h3 class="text-2xl font-bold">
        <a class="" href={post.pathname}>
          {post.title}
        </a>
      </h3>
      <Tags tags={post.tags} />
      <p class="text-gray-500/80">
        {post.author && <span>By {post.author || ""} at </span>}
        <PrettyDate date={post.publishDate} dateStyle={dateStyle} lang={lang} />
      </p>
      <p class="text-gray-600 dark:text-gray-400">{post.snippet}</p>
      <p>
        <a
          class="leading-tight text-gray-900 dark:text-gray-100 inline-block border-b-1 border-gray-600 hover:text-gray-500 hover:border-gray-500 transition-colors"
          href={post.pathname}
          title={`Read "${post.title}"`}
        >
          Lire l'article
        </a>
      </p>
    </div>
  );
}

interface PostPageProps {
  state: BlogState;
  post: Post;
}

export function PostPage({ post, state }: PostPageProps) {
  const html = gfm.render(post.markdown);
  return (
    <Fragment>
      {state.showHeaderOnPostPage && state.header}
      <div class="max-w-screen-sm px-6 pt-8 mx-auto">
        <div class="pb-16">
          <a
            href="/"
            class="inline-flex items-center gap-1 text-sm text-gray-500/80 hover:text-gray-700 transition-colors"
            title="Back to Index Page"
          >
            <svg
              className="inline-block w-5 h-5"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.91675 14.4167L3.08341 10.5833C3.00008 10.5 2.94119 10.4097 2.90675 10.3125C2.87175 10.2153 2.85425 10.1111 2.85425 10C2.85425 9.88889 2.87175 9.78472 2.90675 9.6875C2.94119 9.59028 3.00008 9.5 3.08341 9.41667L6.93758 5.5625C7.09036 5.40972 7.27786 5.33334 7.50008 5.33334C7.7223 5.33334 7.91675 5.41667 8.08341 5.58334C8.23619 5.73611 8.31258 5.93056 8.31258 6.16667C8.31258 6.40278 8.23619 6.59722 8.08341 6.75L5.66675 9.16667H16.6667C16.9029 9.16667 17.1006 9.24639 17.2601 9.40584C17.4201 9.56584 17.5001 9.76389 17.5001 10C17.5001 10.2361 17.4201 10.4339 17.2601 10.5933C17.1006 10.7533 16.9029 10.8333 16.6667 10.8333H5.66675L8.10425 13.2708C8.25703 13.4236 8.33341 13.6111 8.33341 13.8333C8.33341 14.0556 8.25008 14.25 8.08341 14.4167C7.93064 14.5694 7.73619 14.6458 7.50008 14.6458C7.26397 14.6458 7.06953 14.5694 6.91675 14.4167Z"
                fill="currentColor"
              />
            </svg>
            RETOUR
          </a>
        </div>
        {post.coverHtml && (
          <div
            class="pb-12"
            dangerouslySetInnerHTML={{ __html: post.coverHtml }}
          />
        )}
        <article>
          <h1 class="text-4xl text-gray-900 dark:text-gray-100 font-bold">
            {post.title}
          </h1>
          <Tags tags={post.tags} />
          <p class="mt-1 text-gray-500">
            {(post.author || state.author) && (
              <span>By {post.author || state.author} at </span>
            )}
            <PrettyDate
              date={post.publishDate}
              dateStyle={state.dateStyle}
              lang={state.lang}
            />
          </p>
          <div
            class="mt-8 markdown-body"
            data-color-mode={state.theme ?? "auto"}
            data-light-theme="light"
            data-dark-theme="dark"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </article>
        {state.section}
      </div>
    </Fragment>
  );
}

function Tooltip({ children }: { children: string }) {
  return (
    <div
      className={
        "absolute top-10 px-3 h-8 !leading-8 bg-black/80 text-white text-sm rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity"
      }
    >
      <span
        className="block absolute text-black/80"
        style={{ top: -4, left: "50%", marginLeft: -4.5, width: 9, height: 4 }}
      >
        <svg
          className="absolute"
          width="9"
          height="4"
          viewBox="0 0 9 4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.83564 0.590546C4.21452 0.253758 4.78548 0.253758 5.16436 0.590546L9 4H0L3.83564 0.590546Z"
            fill="currentColor"
          />
        </svg>
      </span>
      {children}
    </div>
  );
}

function PrettyDate({
  date,
  dateStyle,
  lang,
}: {
  date: Date;
  dateStyle?: DateStyle;
  lang?: string;
}) {
  const formatted = date.toLocaleDateString(lang ?? "en-US", { dateStyle });
  return <time dateTime={date.toISOString()}>{formatted}</time>;
}

function Tags({ tags }: { tags?: string[] }) {
  return tags && tags.length > 0 ? (
    <section class="flex gap-x-1">
      {tags?.map((tag) => (
        <span class="inline-flex items-center px-1 py-0.5 text-sm justify-center bg-gray-600/10 rounded-xl text-gray-600 font-bold">
          <a href={`/?tag=${tag}`}>{tag}</a>
        </span>
      ))}
    </section>
  ) : null;
}

function IconEmail() {
  return (
    <svg
      className="inline-block w-5 h-5"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.99963 18C8.9063 18 7.87297 17.7899 6.89963 17.3696C5.9263 16.9499 5.07643 16.3765 4.35003 15.6496C3.6231 14.9232 3.04977 14.0733 2.63003 13.1C2.20977 12.1267 1.99963 11.0933 1.99963 10C1.99963 8.89333 2.20977 7.8568 2.63003 6.8904C3.04977 5.92347 3.6231 5.0768 4.35003 4.3504C5.07643 3.62347 5.9263 3.04987 6.89963 2.6296C7.87297 2.20987 8.9063 2 9.99963 2C11.1063 2 12.1428 2.20987 13.1092 2.6296C14.0762 3.04987 14.9228 3.62347 15.6492 4.3504C16.3762 5.0768 16.9495 5.92347 17.3692 6.8904C17.7895 7.8568 17.9996 8.89333 17.9996 10V11.16C17.9996 11.9467 17.7298 12.6165 17.19 13.1696C16.6498 13.7232 15.9863 14 15.1996 14C14.7196 14 14.273 13.8933 13.8596 13.68C13.4463 13.4667 13.1063 13.1867 12.8396 12.84C12.4796 13.2 12.0564 13.4835 11.57 13.6904C11.0831 13.8968 10.5596 14 9.99963 14C8.89297 14 7.94977 13.6099 7.17003 12.8296C6.38977 12.0499 5.99963 11.1067 5.99963 10C5.99963 8.89333 6.38977 7.94987 7.17003 7.1696C7.94977 6.38987 8.89297 6 9.99963 6C11.1063 6 12.0498 6.38987 12.83 7.1696C13.6098 7.94987 13.9996 8.89333 13.9996 10V11.16C13.9996 11.5467 14.1196 11.8499 14.3596 12.0696C14.5996 12.2899 14.8796 12.4 15.1996 12.4C15.5196 12.4 15.7996 12.2899 16.0396 12.0696C16.2796 11.8499 16.3996 11.5467 16.3996 11.16V10C16.3996 8.25333 15.7695 6.74987 14.5092 5.4896C13.2495 4.22987 11.7463 3.6 9.99963 3.6C8.25297 3.6 6.7495 4.22987 5.48923 5.4896C4.2295 6.74987 3.59963 8.25333 3.59963 10C3.59963 11.7467 4.2295 13.2499 5.48923 14.5096C6.7495 15.7699 8.25297 16.4 9.99963 16.4H13.9996V18H9.99963ZM9.99963 12.4C10.6663 12.4 11.233 12.1667 11.6996 11.7C12.1663 11.2333 12.3996 10.6667 12.3996 10C12.3996 9.33333 12.1663 8.76667 11.6996 8.3C11.233 7.83333 10.6663 7.6 9.99963 7.6C9.33297 7.6 8.7663 7.83333 8.29963 8.3C7.83297 8.76667 7.59963 9.33333 7.59963 10C7.59963 10.6667 7.83297 11.2333 8.29963 11.7C8.7663 12.1667 9.33297 12.4 9.99963 12.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconExternalLink() {
  return (
    <svg
      className="inline-block w-5 h-5"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.66715 5.83333C6.66715 5.3731 7.04025 5 7.50049 5L14.1672 5C14.6274 5 15.0005 5.3731 15.0005 5.83333V12.5C15.0005 12.9602 14.6274 13.3333 14.1672 13.3333C13.7069 13.3333 13.3338 12.9602 13.3338 12.5V7.84518L6.42308 14.7559C6.09764 15.0814 5.57 15.0814 5.24457 14.7559C4.91913 14.4305 4.91913 13.9028 5.24457 13.5774L12.1553 6.66667L7.50049 6.66667C7.04025 6.66667 6.66715 6.29357 6.66715 5.83333Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconGithub() {
  return (
    <svg
      className="inline-block w-5 h-5"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 2C5.58161 2 2 5.67194 2 10.2029C2 13.8265 4.292 16.9015 7.4712 17.9857C7.8712 18.0611 8.01681 17.808 8.01681 17.5902C8.01681 17.3961 8.01042 16.8794 8.00641 16.1956C5.7808 16.6911 5.3112 15.0959 5.3112 15.0959C4.948 14.1476 4.4232 13.8954 4.4232 13.8954C3.69681 13.3876 4.47841 13.3975 4.47841 13.3975C5.28081 13.4548 5.70322 14.2426 5.70322 14.2426C6.41683 15.4955 7.57603 15.1335 8.03122 14.9239C8.10481 14.3941 8.31122 14.033 8.54002 13.8282C6.76402 13.621 4.896 12.9168 4.896 9.77384C4.896 8.87877 5.208 8.14588 5.7192 7.57263C5.6368 7.36544 5.36241 6.531 5.79759 5.40254C5.79759 5.40254 6.46959 5.18143 7.99759 6.24272C8.59777 6.06848 9.28719 5.96782 9.99941 5.96674C10.6794 5.97002 11.364 6.06092 12.0032 6.24272C13.5304 5.18143 14.2008 5.40171 14.2008 5.40171C14.6376 6.53097 14.3624 7.36543 14.2808 7.5726C14.7928 8.14583 15.1032 8.87874 15.1032 9.7738C15.1032 12.9249 13.232 13.6185 11.4504 13.8216C11.7376 14.0747 11.9928 14.575 11.9928 15.3407C11.9928 16.4364 11.9832 17.3216 11.9832 17.5902C11.9832 17.8097 12.1272 18.0652 12.5336 17.9849C15.7378 16.8608 18 13.8039 18 10.2062C18 10.2051 18 10.2039 18 10.2027C18 5.67175 14.4176 2 10 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconTwitter() {
  return (
    <svg
      className="inline-block w-5 h-5"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.0005 5.02869C17.4116 5.29638 16.7768 5.47229 16.119 5.55642C16.7921 5.15106 17.3122 4.50861 17.5569 3.73615C16.9221 4.11856 16.2185 4.38624 15.4766 4.53921C14.8724 3.88146 14.0234 3.49905 13.0598 3.49905C11.2624 3.49905 9.79399 4.96751 9.79399 6.78013C9.79399 7.04016 9.82458 7.29255 9.87812 7.52965C7.15536 7.39198 4.73089 6.08414 3.11712 4.10326C2.83414 4.5851 2.67353 5.15106 2.67353 5.74762C2.67353 6.8872 3.24714 7.89676 4.13433 8.47037C3.59131 8.47037 3.08653 8.31741 2.64294 8.08797V8.11091C2.64294 9.70173 3.77487 11.0325 5.27391 11.3308C4.79263 11.4625 4.28737 11.4808 3.79781 11.3843C4.00554 12.0363 4.41237 12.6068 4.96111 13.0156C5.50985 13.4244 6.17291 13.651 6.85709 13.6635C5.69734 14.5816 4.25976 15.0779 2.7806 15.0708C2.52056 15.0708 2.26053 15.0555 2.00049 15.0249C3.45364 15.9579 5.18213 16.501 7.03299 16.501C13.0598 16.501 16.3714 11.4991 16.3714 7.16253C16.3714 7.01722 16.3714 6.87955 16.3638 6.73424C17.0062 6.27534 17.5569 5.69408 18.0005 5.02869Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconLoak() {
  return (
    <svg
      className="inline-block w-4 h-4"
      fill="currentColor"
      width="31"
      height="26"
      viewBox="0 0 31 26"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M29.1441 0.303659C26.7901 0.581117 24.4174 0.664431 22.0498 0.552761C20.826 0.498605 19.6058 0.381039 18.3942 0.200536C17.3354 0.050539 16.4988 -0.0673157 15.1723 0.0438427C9.96538 0.483119 6.27501 3.95983 5.26709 5.01383C1.69049 8.76375 1.04264 13.0172 0.730758 15.0583C0.226429 18.4523 0.551603 21.9181 1.67845 25.1589L1.94616 25.929L2.76133 25.9571C3.62871 25.9857 4.50278 26 5.38354 26C6.26163 26 7.14373 25.9853 8.02181 25.9571C12.447 25.8112 14.6677 25.7388 17.3046 24.875C18.6044 24.4491 21.6495 23.4514 24.3601 20.7474C26.9167 18.2028 27.8738 15.46 28.7987 12.8123C29.6955 10.245 29.9512 7.84904 30.1573 5.92185L30.2015 5.50935C30.3447 4.17947 30.4344 2.83084 30.4692 1.50497L30.5 0.13893L29.1441 0.303659ZM27.8483 5.25891L27.8055 5.67408C27.6034 7.57315 27.3732 9.72534 26.566 12.0329C25.6906 14.5386 24.8647 16.9051 22.6923 19.0707C20.3806 21.3755 17.8093 22.2179 16.5724 22.6237C14.2581 23.3818 12.1552 23.4514 7.94819 23.5893C6.52666 23.6349 5.09308 23.6442 3.67823 23.6121C3.64076 23.4876 3.61131 23.3617 3.5765 23.2371C3.73178 22.9411 3.89776 22.6559 4.05972 22.3666C4.55595 21.5132 5.13909 20.7134 5.79983 19.98C9.03777 16.364 13.9797 15.7935 18.5709 16.7658C17.2089 15.8599 15.6497 15.2941 14.024 15.1158C12.3983 14.9375 10.7536 15.152 9.22784 15.7413C10.053 14.9856 10.9214 14.2786 11.8286 13.6239C15.5943 12.2526 19.6207 11.749 23.6078 12.1507C21.3979 10.865 18.7583 10.4459 16.2137 10.7927L18.2215 9.61418C20.3779 8.33251 22.5236 7.03611 24.5836 5.54016C22.1869 6.33548 19.8329 7.25409 17.5308 8.29233C16.3837 8.81063 15.2553 9.34901 14.1162 9.93828C13.7053 10.1539 13.297 10.3856 12.8888 10.6267C14.0193 8.88083 14.7649 6.91396 15.0759 4.85714C13.6649 7.41669 12.1157 9.89753 10.4352 12.2887C9.31682 13.1234 8.28257 14.0653 7.34719 15.1011C7.84309 13.0607 7.99017 10.951 7.78221 8.86152C6.29241 13.3333 4.83608 17.6779 3.29006 22.0974C2.82 19.9041 2.74791 17.6441 3.07723 15.4252C3.37305 13.482 3.92319 9.86462 6.9831 6.65978C7.84512 5.75712 10.9987 2.78396 15.3718 2.41567C16.4319 2.32594 17.0449 2.41567 18.0622 2.55629C19.3443 2.74811 20.6355 2.87283 21.9306 2.92994C23.9683 3.02584 26.0101 2.98557 28.0424 2.80941C27.9983 3.61564 27.9313 4.4433 27.843 5.25757L27.8483 5.25891Z"></path>
    </svg>
  );
}
