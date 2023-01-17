import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import Script from 'next/script';
// Import styled components ServerStyleSheet
import { ServerStyleSheet } from 'styled-components';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;800;900&display=swap"
          />
          <Script
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: `!function(e,t,a,r,g){e[r]=e[r]||[],e[r].push({"gtm.start":new Date().getTime(),event:"gtm.js"});var n=t.getElementsByTagName(a)[0],s=t.createElement(a);s.async=!0,s.src="https://www.googletagmanager.com/gtm.js?id="+g+("dataLayer"!=r?"&l="+r:""),n.parentNode.insertBefore(s,n)}(window,document,"script","dataLayer","GTM-TLRRVXK");`}}
          />
        </Head>
        <body>
          {/* <!-- Google Tag Manager (noscript) --> */}
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-TLRRVXK"
              height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}
            ></iframe>
          </noscript>
          {/* <!-- End Google Tag Manager (noscript) --> */}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
