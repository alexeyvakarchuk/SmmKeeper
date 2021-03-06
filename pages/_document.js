// ./pages/_document.js
import Document, { Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <html lang="en">
        <Head />
        <body>
          <Main />
          <div id="connectAccPopup" />
          <div id="createTaskPopup" />
          <NextScript />
        </body>
      </html>
    );
  }
}
