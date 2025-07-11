import React from "react";

const BOILERPLATE_KEYWORDS = [
  "QuizzesPRO Courses",
  "Hot Guides",
  "Tech Help",
  "Random Article",
  "LOG IN",
  "Community Dashboard",
  "Personality Quizzes",
  "Trivia Quizzes",
  "Taylor Swift Quizzes",
  "About wikiHow",
  "Pro Upgrade",
  "Forums",
  "RANDOM",
];

function removeBoilerplate(arr) {
  return arr.filter(
    (item) =>
      item &&
      item.trim().length > 0 &&
      !BOILERPLATE_KEYWORDS.some((kw) => item.includes(kw))
  );
}

function removeAllDuplicates(arr) {
  if (!Array.isArray(arr)) return [];
  const seen = new Set();
  return arr.filter((item) => {
    if (seen.has(item)) return false;
    seen.add(item);
    return true;
  });
}

function groupContentBlocks(contentArr) {
  if (!Array.isArray(contentArr)) return [];
  const blocks = [];
  let currentList = [];
  let isOrderedList = false;

  for (let i = 0; i < contentArr.length; i++) {
    const item = contentArr[i] || "";

    const isStep = /^Step\s*\d+[:.]?/i.test(item) || /^\d+\./.test(item);
    const isBullet = /^[•\-]/.test(item);

    if (isStep) {
      if (!isOrderedList) {
        if (currentList.length) blocks.push({ type: "ul", items: currentList });
        currentList = [];
        isOrderedList = true;
      }
      currentList.push(
        item.replace(/^Step\s*\d+[:.]?\s*/i, "").replace(/^\d+\.\s*/, "")
      );
    } else if (isBullet) {
      if (isOrderedList) {
        if (currentList.length) blocks.push({ type: "ol", items: currentList });
        currentList = [];
        isOrderedList = false;
      }
      currentList.push(item.replace(/^[•\-]\s*/, ""));
    } else {
      if (currentList.length) {
        blocks.push({ type: isOrderedList ? "ol" : "ul", items: currentList });
        currentList = [];
        isOrderedList = false;
      }
      if (item.trim()) blocks.push({ type: "p", text: item });
    }
  }
  if (currentList.length) {
    blocks.push({ type: isOrderedList ? "ol" : "ul", items: currentList });
  }
  return blocks;
}

const renderBlock = (block, idx) => {
  switch (block.type) {
    case "ol":
      return (
        <ol key={idx} className="list-decimal pl-6 mb-4">
          {block.items.map((item, i) => (
            <li key={i} className="mb-2">
              {item}
            </li>
          ))}
        </ol>
      );
    case "ul":
      return (
        <ul key={idx} className="list-disc pl-6 mb-4">
          {block.items.map((item, i) => (
            <li key={i} className="mb-2">
              {item}
            </li>
          ))}
        </ul>
      );
    case "p":
      return (
        <p key={idx} className="mb-4 text-gray-700">
          {block.text}
        </p>
      );
    default:
      return <div key={idx}>{block.text}</div>;
  }
};

const ArticleList = ({ article }) => {
  if (!article) return <div>No article data available</div>;

  return (
    <div className="article-content text-gray-800">
      <h1 className="text-3xl font-semibold text-indigo-600 mb-6">
        {article.title}
      </h1>
      {article.meta_description && (
        <p className="italic text-indigo-400 mb-6">
          {article.meta_description}
        </p>
      )}

      {Array.isArray(article.sections) &&
        article.sections.map((section, index) => {
          let cleanContent = section.content || [];
          cleanContent = removeBoilerplate(cleanContent);
          cleanContent = removeAllDuplicates(cleanContent);

          return (
            <section key={index} className="mb-8">
              <h2 className="text-2xl text-indigo-600 mb-4">
                {section.heading || section.title}
              </h2>
              {groupContentBlocks(cleanContent).map((block, i) =>
                renderBlock(block, i)
              )}
              {section.subsections &&
                section.subsections.map((subsection, j) => (
                  <div key={j}>
                    <h3 className="text-xl mt-6">{subsection.subheading}</h3>
                    {groupContentBlocks(
                      removeAllDuplicates(removeBoilerplate(subsection.content))
                    ).map((block, k) => renderBlock(block, k))}
                  </div>
                ))}
            </section>
          );
        })}

      {article.summary && (
        <section>
          <h3 className="text-xl font-semibold mb-4">Summary:</h3>
          <ul className="list-disc pl-6">
            <li>Total Sections: {article.summary.total_sections}</li>
            {article.summary.total_subsections !== undefined && (
              <li>Total Subsections: {article.summary.total_subsections}</li>
            )}
            <li>Word Count Estimate: {article.summary.word_count_estimate}</li>
          </ul>
        </section>
      )}
    </div>
  );
};

export default ArticleList;
