import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
           {/* Global Site Tag (gtag.js) - Google Analytics */}
           <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
        </Head>
        {/* Must  */}
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Im sooooooooo" />
        <meta name="keywords" content="nft, ethereum, protocol" />
        <link rel="shortcut icon" type="image/svg" href="/milady_maker_headphones.png" />
        <title>
          Please be patient with me, Im sooo
        </title>
        <meta
          name="description"
          content="pleasebepatientwith.me is a Milady NFT marketplace"
        />
        <meta name="keywords" content="NFT, API, Milady" />
        {/* Twitter */}
        {/* The optimal size is 1200 x 630 (1.91:1 ratio). */}
        <meta
          name="twitter:image"
          content="https://miladymaker.net/images/banner.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:site:domain"
          content="https://www.pleasebepatientwith.me/"
        />
        <meta name="twitter:url" content="https://pleasebepatientwith.me/" />
        {/* should be between 30-60 characters, with a maximum of 70 */}
        <meta
          name="twitter:title"
          content="pleasebepatientwith.me | Im sooooooo"
        />
        {/* should be between 55 and 200 characters long */}
        <meta
          name="twitter:description"
          content="pleasebepatientwith.me | Im soooooooo"
        />
        <meta name="twitter:site" content="@therealjfrantz" />
        <meta name="twitter:creator" content="@therealjfrantz" />

        {/* OG - https://ogp.me/ */}
        {/* https://www.opengraph.xyz/ */}
        {/* should be between 30-60 characters, with a maximum of 90 */}
        <meta
          name="og:title"
          content="pleasebepatientwith.me | Im sooooo"
        />
        <meta property="og:type" content="website" />
        <meta property="og:determiner" content="the" />
        <meta property="og:locale" content="en" />
        {/* Make sure the important part of your description is within the first 110 characters, so it doesn't get cut off on mobile. */}
        <meta
          property="og:description"
          content="pleasebepatientwith.me | Milady NFT | Im sooooooooo"
        />
        <meta property="og:site_name" content="Milady Maker" />
        <meta property="og:url" content="https://pleasebepatientwith.me/" />
        {/* The optimal size is 1200 x 630 (1.91:1 ratio). */}
        <meta
          property="og:image"
          content="https://miladymaker.net/images/banner.png"
        />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1280" />
        <meta property="og:image:height" content="640" />
        <meta property="og:image:alt" content="Milady Maker banner" />
        <body className="bg-white text-neutral-800">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
