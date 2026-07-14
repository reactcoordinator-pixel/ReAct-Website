import { Html, Head, Main, NextScript } from "next/document";

// Origin that serves our uploaded images (Supabase Storage / CDN). Opening the
// TLS connection early shaves the handshake off the first image request.
const SUPABASE_ORIGIN = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL as string).origin;
  } catch {
    return null;
  }
})();

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {SUPABASE_ORIGIN && (
          <>
            <link rel="preconnect" href={SUPABASE_ORIGIN} crossOrigin="" />
            <link rel="dns-prefetch" href={SUPABASE_ORIGIN} />
          </>
        )}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
