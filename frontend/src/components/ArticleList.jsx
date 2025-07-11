import React from "react";

// Function to render each type of content based on its tag
const renderContent = (tag, content, key) => {
  // Ensure content is always an array, even if it's a string
  const contentArray = Array.isArray(content) ? content : [content];

  switch (tag) {
    case "h1":
      return contentArray.map((item, i) => <h1 key={`${key}-${i}`}>{item}</h1>);
    case "h2":
      return contentArray.map((item, i) => <h2 key={`${key}-${i}`}>{item}</h2>);
    case "h3":
      return contentArray.map((item, i) => <h3 key={`${key}-${i}`}>{item}</h3>);
    case "p":
      return contentArray.map((item, i) => <p key={`${key}-${i}`}>{item}</p>);
    case "ul":
      return (
        <ul key={key}>
          {contentArray.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol key={key}>
          {contentArray.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      );
    case "strong":
      return contentArray.map((item, i) => (
        <strong key={`${key}-${i}`}>{item}</strong>
      ));
    case "a":
      return contentArray.map((item, i) => (
        <a key={`${key}-${i}`} href={item}>
          {item}
        </a>
      ));
    default:
      return contentArray.map((item, i) => (
        <div key={`${key}-${i}`}>{item}</div>
      ));
  }
};

const ArticleList = ({ articles }) => {
  const { article } = articles;

  if (!article) return null;

  return (
    <div>
      <h1>{article.title}</h1>
      <p>{article.meta_description}</p>

      {article.sections.map((section, index) => (
        <div key={index}>
          <h2>{section.heading || section.title}</h2>
          {section.content.map((content, i) => (
            <div key={i}>{renderContent("p", content, `content-${i}`)}</div>
          ))}

          {/* Render subsections if available */}
          {section.subsections &&
            section.subsections.map((subsection, j) => (
              <div key={j}>
                <h3>{subsection.subheading}</h3>
                {subsection.content.map((subContent, k) => (
                  <div key={k}>
                    {renderContent("p", subContent, `subContent-${k}`)}
                  </div>
                ))}
              </div>
            ))}
        </div>
      ))}

      <h3>Summary:</h3>
      <ul>
        <li>Total Sections: {article.summary.total_sections}</li>
        <li>Total Subsections: {article.summary.total_subsections}</li>
        <li>Word Count Estimate: {article.summary.word_count_estimate}</li>
      </ul>
    </div>
  );
};

export default ArticleList;
