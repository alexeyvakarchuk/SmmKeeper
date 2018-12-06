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
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>

    {children}
  </div>
);
