interface QnAItem {
  question: string;
  answer: string;
}

export function extractQnA(content: string): QnAItem[] {
  // Q&A 섹션 찾기 (여러 가능한 제목 패턴)
  const qnaRegex = /##\s*(?:자주\s*묻는\s*질문|.*Q\s*&\s*A.*)\s*\n([\s\S]*?)(?=\n##\s[^#]|\n#\s|$)/i;
  const match = content.match(qnaRegex);

  if (!match) return [];

  const qnaSection = match[1];
  const items: QnAItem[] = [];

  // <details>/<summary> 형식 파싱
  const detailsRegex = /<details>\s*<summary>\s*\*?\*?Q\d*:\s*(.*?)\*?\*?\s*<\/summary>\s*([\s\S]*?)<\/details>/gi;
  let detailsMatch;

  while ((detailsMatch = detailsRegex.exec(qnaSection)) !== null) {
    const question = detailsMatch[1].replace(/\*\*/g, '').trim();
    const answer = detailsMatch[2]
      .replace(/^A\d*:\s*/i, '')
      .trim();

    if (question && answer) {
      items.push({ question, answer });
    }
  }

  // Q. / A. 형식 파싱 (Notion에서 가져온 일반적인 형식)
  if (items.length === 0) {
    // Q. 또는 Q1. 등으로 시작하는 질문을 찾아 분리
    const qaRegex = /Q\d*\.\s*(.*?)\n+A\d*\.\s*([\s\S]*?)(?=\n+Q\d*\.|$)/gi;
    let qaMatch;

    while ((qaMatch = qaRegex.exec(qnaSection)) !== null) {
      const question = qaMatch[1].replace(/\*\*/g, '').trim();
      const answer = qaMatch[2].trim();

      if (question && answer) {
        items.push({ question, answer });
      }
    }
  }

  // 기존 ### 형식도 지원 (fallback)
  if (items.length === 0) {
    const qaPairs = qnaSection.split(/\n###\s+/).filter(Boolean);

    for (const pair of qaPairs) {
      const lines = pair.trim().split('\n');
      const question = lines[0].replace(/^Q:\s*/i, '').replace(/\*\*/g, '').trim();
      const answer = lines
        .slice(1)
        .join('\n')
        .replace(/^A:\s*/i, '')
        .trim();

      if (question && answer) {
        items.push({ question, answer });
      }
    }
  }

  return items;
}

export function removeQnASection(content: string): string {
  // Q&A 섹션 제거 (여러 가능한 제목 패턴)
  const qnaRegex = /##\s*(?:자주\s*묻는\s*질문|.*Q\s*&\s*A.*)\s*\n[\s\S]*$/i;
  return content.replace(qnaRegex, '').trim();
}
