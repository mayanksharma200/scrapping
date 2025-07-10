import React from "react";

// Helper function to render content based on type
function renderContent(content) {
  if (typeof content === "string") {
    return <p>{content}</p>; // Render as paragraph if it's a string
  }

  if (Array.isArray(content)) {
    return (
      <ul>
        {content.map((item, index) => (
          <li key={index}>{item}</li> // Render as list item
        ))}
      </ul>
    );
  }

  return null;
}

function ArticleList({ articles }) {
  return (
    <div>
      <h2>Scraped Content</h2>
      {Object.keys(articles).map((tag) => (
        <div key={tag}>
          <h3>{tag.toUpperCase()}</h3>
          {articles[tag].map((content, index) => (
            <div key={index}>
              {renderContent(content)} {/* Render content dynamically */}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default ArticleList;
