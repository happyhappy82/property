import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getSortedPropertiesData } from '../../lib/properties';
import { toISOTimestamp } from '../../lib/date-utils';

export async function GET(context: APIContext) {
  const properties = getSortedPropertiesData();

  return rss({
    title: '부동산 트렌드 리뷰',
    description: '부동산 관련 트렌드와 정책 등 다양한 부동산 정보들을 떠먹여드립니다.',
    site: context.site || 'https://www.budongsantrendreview.xyz',
    items: properties.map((property) => ({
      title: property.title,
      pubDate: new Date(toISOTimestamp(property.date)),
      description: property.excerpt,
      link: `/${property.slug}`,
    })),
    customData: `<language>ko</language>`,
  });
}
