// @flow
import React from "react";
import Head from "next/head";

type Props = {
  children: Object,
  title?: string
};

export default ({ children, title = "SmmKeeper" }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <link rel="manifest" href="/static/manifest.webmanifest" />
      <meta name="apple-mobile-web-app-title" content="SmmKeeper" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/static/favicon/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/static/favicon/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/static/favicon/favicon-16x16.png"
      />
      <link
        rel="mask-icon"
        href="/static/favicon/safari-pinned-tab.svg"
        color="#1c7bff"
      />
      <link rel="shortcut icon" href="/static/favicon/favicon.ico" />
      <meta name="application-name" content="SmmKeeper" />
      <meta name="msapplication-TileColor" content="#1c7bff" />
      <meta
        name="msapplication-config"
        content="/static/favicon/browserconfig.xml"
      />
      <meta name="theme-color" content="#ffffff" />
    </Head>

    {children}
  </div>
);
