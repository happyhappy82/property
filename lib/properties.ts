import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const propertiesDirectory = path.join(process.cwd(), 'content/properties');

export interface Property {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  lightColor: string;
  darkColor: string;
  readingTime: string;
  notionPageId?: string;
}

export function getSortedPropertiesData(): Property[] {
  if (!fs.existsSync(propertiesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(propertiesDirectory);
  const allPropertiesData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(propertiesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || '',
        date: data.date || '',
        excerpt: data.excerpt || '',
        content,
        lightColor: data.lightColor || 'lab(62.926 59.277 -1.573)',
        darkColor: data.darkColor || 'lab(80.993 32.329 -7.093)',
        readingTime: readingTime(content).text,
        notionPageId: data.notionPageId,
      };
    });

  return allPropertiesData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getPropertyBySlug(slug: string): Property | null {
  const fullPath = path.join(propertiesDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || '',
    date: data.date || '',
    excerpt: data.excerpt || '',
    content,
    lightColor: data.lightColor || 'lab(62.926 59.277 -1.573)',
    darkColor: data.darkColor || 'lab(80.993 32.329 -7.093)',
    readingTime: readingTime(content).text,
    notionPageId: data.notionPageId,
  };
}
