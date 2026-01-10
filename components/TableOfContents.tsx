"use client";

import { useEffect, useState } from "react";
import Link from "./Link";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const headings = document.querySelectorAll("article h2, article h3");
    const items: TocItem[] = [];

    headings.forEach((heading) => {
      const id = heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, "-") || "";
      const text = heading.textContent || "";
      const level = parseInt(heading.tagName.substring(1));

      if (id && text) {
        items.push({ id, text, level });
      }
    });

    setToc(items);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0% -35% 0%" }
    );

    const headings = document.querySelectorAll("article h2, article h3");
    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <nav className="hidden xl:block fixed right-[max(0px,calc(50%-45rem))] top-24 w-64 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="border-l-2 border-gray-200 pl-4">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">목차</h2>
        <ul className="space-y-2 text-sm">
          {toc.map((item) => (
            <li
              key={item.id}
              style={{ marginLeft: `${(item.level - 2) * 0.75}rem` }}
            >
              <Link
                href={`#${item.id}`}
                className={`block py-1 transition-colors ${
                  activeId === item.id
                    ? "text-blue-600 font-medium"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
