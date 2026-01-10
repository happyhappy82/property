import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "부동산리뷰Lab",
  description: "아파트, 빌라, 오피스텔 등 부동산 매물 정보 및 투자 가이드를 제공하는 사이트입니다.",
  metadataBase: new URL("https://propertyreviewlab.xyz"),
  keywords: ["부동산 리뷰", "아파트 리뷰", "오피스텔 추천", "부동산 투자", "매물 정보"],
  authors: [{ name: "PropertyReviewLab" }],
  creator: "PropertyReviewLab",
  publisher: "PropertyReviewLab",
  openGraph: {
    title: "부동산리뷰Lab",
    description: "아파트, 빌라, 오피스텔 등 부동산 매물 정보 및 투자 가이드를 제공하는 사이트입니다.",
    type: "website",
    locale: "ko_KR",
    url: "https://propertyreviewlab.xyz",
    siteName: "부동산리뷰Lab",
  },
  twitter: {
    card: "summary_large_image",
    title: "부동산리뷰Lab",
    description: "아파트, 빌라, 오피스텔 등 부동산 매물 정보 및 투자 가이드를 제공하는 사이트입니다.",
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
    "name": "부동산리뷰Lab",
    "alternateName": "PropertyReviewLab",
    "url": "https://propertyreviewlab.xyz",
    "description": "아파트, 빌라, 오피스텔 등 부동산 매물 정보 및 투자 가이드를 제공하는 사이트입니다.",
  };

  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="mx-auto max-w-2xl bg-white px-5 py-12 text-black">
        {children}
      </body>
    </html>
  );
}
