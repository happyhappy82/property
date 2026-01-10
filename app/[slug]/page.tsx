import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "@/components/Header";
import TableOfContents from "@/components/TableOfContents";
import QnA from "@/components/QnA";
import { getPropertyBySlug, getSortedPropertiesData } from "@/lib/properties";
import { extractQnA, removeQnASection } from "@/lib/qna-utils";
import type { Metadata } from "next";

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

  const url = `https://propertyreviewlab.xyz/${slug}`;

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
      siteName: "PropertyReviewLab",
      locale: "ko_KR",
      type: "article",
      publishedTime: property.date,
      authors: ["PropertyReviewLab"],
    },
    twitter: {
      card: "summary_large_image",
      title: property.title,
      description: property.excerpt,
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

  const propertySchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: property.title,
    author: {
      "@type": "Organization",
      name: "PropertyReviewLab",
    },
    publisher: {
      "@type": "Organization",
      name: "PropertyReviewLab",
    },
    datePublished: property.date,
    description: property.excerpt,
  };

  return (
    <>
      <Header />
      <TableOfContents />
      <article className="relative">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(propertySchema) }}
        />

        <div className="mb-8">
          <h1
            className="text-[42px] font-black leading-tight mb-4"
            style={{ color: property.lightColor }}
          >
            {property.title}
          </h1>
          <div className="flex gap-4 text-sm text-gray-600">
            <time dateTime={property.date}>{property.date}</time>
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
