import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "@/components/Header";
import TableOfContents from "@/components/TableOfContents";
import QnA from "@/components/QnA";
import { getPropertyBySlug, getSortedPropertiesData } from "@/lib/properties";
import { extractQnA, removeQnASection } from "@/lib/qna-utils";
import { toISOTimestamp, formatDisplayDate } from "@/lib/date-utils";
import type { Metadata } from "next";

const baseUrl = "https://www.budongsantrendreview.xyz";
const siteName = "부동산 트렌드 리뷰";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const properties = getSortedPropertiesData();
  return properties.map((property) => ({
    slug: property.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);

  if (!property) {
    return {
      title: "Not Found",
    };
  }

  const url = `${baseUrl}/${encodeURIComponent(slug)}`;
  const isoDate = toISOTimestamp(property.date);

  return {
    title: property.title,
    description: property.excerpt,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: property.title,
      description: property.excerpt,
      url: url,
      siteName: siteName,
      locale: "ko_KR",
      type: "article",
      publishedTime: isoDate,
      modifiedTime: isoDate,
      authors: [siteName],
      images: [
        {
          url: "/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: `${property.title} - ${siteName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: property.title,
      description: property.excerpt,
      images: ["/opengraph-image.png"],
    },
  };
}

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const qnaItems = extractQnA(property.content);
  const contentWithoutQnA = removeQnASection(property.content);
  const url = `${baseUrl}/${encodeURIComponent(slug)}`;
  const isoDate = toISOTimestamp(property.date);
  const displayDate = formatDisplayDate(property.date);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: property.title,
    description: property.excerpt,
    image: `${baseUrl}/opengraph-image.png`,
    author: {
      "@type": "Organization",
      name: siteName,
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
        width: 200,
        height: 50,
      },
    },
    datePublished: isoDate,
    dateModified: isoDate,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    inLanguage: "ko-KR",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "홈",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: property.title,
        item: url,
      },
    ],
  };

  const faqSchema =
    qnaItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: qnaItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <Header />
      <TableOfContents />
      <article className="relative">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        {faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        )}

        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-500">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-gray-700">
                홈
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span className="text-gray-700">{property.title}</span>
            </li>
          </ol>
        </nav>

        <div className="mb-8">
          <h1
            className="text-[42px] font-black leading-tight mb-4"
            style={{ color: property.lightColor }}
          >
            {property.title}
          </h1>
          <div className="flex gap-4 text-sm text-gray-600">
            <time dateTime={isoDate}>{displayDate}</time>
            <span>{property.readingTime}</span>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ node, ...props }) => {
                const text = props.children?.toString() || "";
                const id = text.toLowerCase().replace(/\s+/g, "-");
                return <h2 id={id} {...props} />;
              },
              h3: ({ node, ...props }) => {
                const text = props.children?.toString() || "";
                const id = text.toLowerCase().replace(/\s+/g, "-");
                return <h3 id={id} {...props} />;
              },
              a: ({ node, href, ...props }) => {
                const isExternal =
                  href?.startsWith("http") && !href?.includes(baseUrl);
                return (
                  <a
                    href={href}
                    {...(isExternal
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    {...props}
                  />
                );
              },
              img: ({ node, alt, ...props }) => (
                <img
                  alt={alt || "이미지"}
                  loading="lazy"
                  {...props}
                />
              ),
            }}
          >
            {contentWithoutQnA}
          </ReactMarkdown>
        </div>

        <QnA items={qnaItems} />
      </article>
    </>
  );
}
