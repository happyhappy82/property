import { MetadataRoute } from "next";
import { getSortedPropertiesData } from "@/lib/properties";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.budongsantrendreview.xyz";
  const properties = getSortedPropertiesData();

  const propertyUrls: MetadataRoute.Sitemap = properties.map((property) => ({
    url: `${baseUrl}/${encodeURIComponent(property.slug)}`,
    lastModified: new Date(property.date),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...propertyUrls,
  ];
}
