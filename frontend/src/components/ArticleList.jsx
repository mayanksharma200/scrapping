import React from "react";
// import "./ArticleList.css";

// --- Helpers ---

// Known boilerplate/junk phrases to filter out
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

// Remove lines matching boilerplate
function removeBoilerplate(arr) {
  return arr.filter(
    (item) =>
      item &&
      item.trim().length > 0 &&
      !BOILERPLATE_KEYWORDS.some((kw) => item.includes(kw))
  );
}

// Remove all duplicates in an array (global)
function removeAllDuplicates(arr) {
  if (!Array.isArray(arr)) return [];
  const seen = new Set();
  return arr.filter((item) => {
    if (seen.has(item)) return false;
    seen.add(item);
    return true;
  });
}

// Group content for paragraphs/lists
function groupContentBlocks(contentArr) {
  if (!Array.isArray(contentArr)) return [];
  const blocks = [];
  let currentList = [];
  let isOrderedList = false;

  for (let i = 0; i < contentArr.length; i++) {
    const item = contentArr[i] || "";

    // Ordered list: "Step 1:" or "1." etc
    const isStep = /^Step\s*\d+[:.]?/i.test(item) || /^\d+\./.test(item);
    // Unordered bullet: "•", "-"
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

// Renders each content block
const renderBlock = (block, idx) => {
  switch (block.type) {
    case "ol":
      return (
        <ol key={idx} style={{ paddingLeft: 24 }}>
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      );
    case "ul":
      return (
        <ul key={idx} style={{ paddingLeft: 24 }}>
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    case "p":
      return <p key={idx}>{block.text}</p>;
    default:
      return <div key={idx}>{block.text}</div>;
  }
};

const ArticleList = ({ article }) => {
  if (!article) return <div>No article data available</div>;

  return (
    <div className="article-content">
      <h1 style={{ marginBottom: 8 }}>{article.title}</h1>
      {article.meta_description && (
        <p
          style={{
            fontStyle: "italic",
            color: "#f9429e",
            marginBottom: 16,
          }}
        >
          {article.meta_description}
        </p>
      )}

      {Array.isArray(article.sections) &&
        article.sections.map((section, index) => {
          // Clean section content before grouping
          let cleanContent = section.content || [];
          cleanContent = removeBoilerplate(cleanContent);
          cleanContent = removeAllDuplicates(cleanContent);

          return (
            <section key={index} style={{ marginBottom: 32 }}>
              <h2
                style={{
                  margin: "24px 0 8px 0",
                  fontSize: "1.3em",
                  color: "#f9429e",
                }}
              >
                {section.heading || section.title}
              </h2>
              {groupContentBlocks(cleanContent).map((block, i) =>
                renderBlock(block, i)
              )}
              {/* Subsections if present */}
              {section.subsections &&
                section.subsections.map((subsection, j) => (
                  <div key={j}>
                    <h3 style={{ marginTop: 12 }}>{subsection.subheading}</h3>
                    {groupContentBlocks(
                      removeAllDuplicates(removeBoilerplate(subsection.content))
                    ).map((block, k) => renderBlock(block, k))}
                  </div>
                ))}
            </section>
          );
        })}

      {/* Summary (optional) */}
      {article.summary && (
        <section>
          <h3 style={{ marginBottom: 8 }}>Summary:</h3>
          <ul>
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
