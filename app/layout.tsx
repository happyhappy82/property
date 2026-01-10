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
