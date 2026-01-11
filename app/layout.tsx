import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "부동산 트렌드 리뷰",
  description: "부동산 관련 트렌드와 정책 등 다양한 부동산 정보들을 떠먹여드립니다. 꿀팁받아가세요!!",
  metadataBase: new URL("https://propertyreviewlab.xyz"),
  verification: {
    google: "vi4LbSZZ_4ihh_mi0E487dru0ug1XdS3W3cwSqcjxOk",
  },
  keywords: ["부동산 트렌드", "부동산 정책", "부동산 정보", "부동산 꿀팁", "부동산 리뷰"],
  authors: [{ name: "부동산 트렌드 리뷰" }],
  creator: "부동산 트렌드 리뷰",
  publisher: "부동산 트렌드 리뷰",
  openGraph: {
    title: "부동산 트렌드 리뷰",
    description: "부동산 관련 트렌드와 정책 등 다양한 부동산 정보들을 떠먹여드립니다. 꿀팁받아가세요!!",
    type: "website",
    locale: "ko_KR",
    url: "https://propertyreviewlab.xyz",
    siteName: "부동산 트렌드 리뷰",
  },
  twitter: {
    card: "summary_large_image",
    title: "부동산 트렌드 리뷰",
    description: "부동산 관련 트렌드와 정책 등 다양한 부동산 정보들을 떠먹여드립니다. 꿀팁받아가세요!!",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "부동산 트렌드 리뷰",
    "alternateName": "PropertyReviewLab",
    "url": "https://propertyreviewlab.xyz",
    "description": "부동산 관련 트렌드와 정책 등 다양한 부동산 정보들을 떠먹여드립니다. 꿀팁받아가세요!!",
  };

  return (
    <html lang="ko">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PDQTKDPV');`,
          }}
        />
        {/* End Google Tag Manager */}
        {/* Google Analytics (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-DWB3TENH1D" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-DWB3TENH1D');`,
          }}
        />
        {/* End Google Analytics */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="mx-auto max-w-2xl bg-white px-5 py-12 text-black">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PDQTKDPV"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {children}
      </body>
    </html>
  );
}
