import React, { useState } from "react";
import axios from "axios";
import ArticleList from "./components/ArticleList";

function App() {
  const [url, setUrl] = useState("");
  const [article, setArticle] = useState(null); // Now holds the actual article object
  const [error, setError] = useState(null);

  const handleScrape = async () => {
    setError(null);
    setArticle(null);
    try {
      const apiUrl =
        process.env.NODE_ENV === "development"
          ? "/api/articles"
          : "https://scrapping-production-bf36.up.railway.app/api/articles";

      const response = await axios.get(
        `${apiUrl}?url=${encodeURIComponent(url)}`
      );
      // The API gives { article: {...}, ... }
      if (response.data && response.data.article) {
        setArticle(response.data.article);
        setError(null);
      } else {
        setError("No article data found in response.");
        setArticle(null);
      }
    } catch (err) {
      setError("Error fetching article data");
      setArticle(null);
    }
  };

  return (
    <div
      className="App"
      style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}
    >
      <h1>Scrape Article</h1>
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter article URL"
          style={{ width: "60%", marginRight: 8, padding: 8 }}
        />
        <button onClick={handleScrape} style={{ padding: 8 }}>
          Scrape
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {article && <ArticleList article={article} />}
    </div>
  );
}

export default App;
