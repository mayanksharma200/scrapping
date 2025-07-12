import React, { useState } from "react";

// Keywords to remove during cleanup
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
  "X Research source",
  "Advertisement",
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

const ArticleList = () => {
  const [url, setUrl] = useState("");
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScrape = async () => {
    setError(null);
    setArticle(null);
    setLoading(true);
    try {
      const apiUrl =
        process.env.NODE_ENV === "development"
          ? "/api/articles"
          : "https://scrapping-production-bf36.up.railway.app/api/articles";

      const response = await fetch(`${apiUrl}?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      if (data && data.article) {
        setArticle(data.article);
        setError(null);
      } else {
        setError("No article data found in response.");
        setArticle(null);
      }
    } catch (err) {
      setError("Error fetching article data");
      setArticle(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full">
      <h1 className="text-4xl sm:text-5xl font-bold text-indigo-600 mb-8 text-center drop-shadow">
        Scrape Article
      </h1>
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-4 w-full">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter article URL"
          className="w-full sm:flex-1 min-w-[120px] p-5 border-2 border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-lg sm:text-xl transition h-16"
        />
        <button
          onClick={handleScrape}
          disabled={loading || !url}
          className={`w-full sm:w-auto bg-black text-white px-8 rounded-xl font-semibold shadow-lg border-2 border-white hover:bg-indigo-600 transition-all text-lg sm:text-xl h-16 min-w-[140px] flex items-center justify-center ${
            loading || !url ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Loading..." : "Scrape"}
        </button>
      </div>
      {error && <p className="text-red-500 text-center mt-6">{error}</p>}
      {article && (
        <div className="w-full mt-8 article-content text-gray-800">
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
                        <h3 className="text-xl mt-6">
                          {subsection.subheading}
                        </h3>
                        {groupContentBlocks(
                          removeAllDuplicates(
                            removeBoilerplate(subsection.content)
                          )
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
                  <li>
                    Total Subsections: {article.summary.total_subsections}
                  </li>
                )}
                <li>
                  Word Count Estimate: {article.summary.word_count_estimate}
                </li>
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default ArticleList;
