import React, { useState } from "react";
import axios from "axios";
import ArticleList from "./components/ArticleList";

function App() {
  const [url, setUrl] = useState("");
  const [articles, setArticles] = useState(null);
  const [error, setError] = useState(null);

  const handleScrape = async () => {
    try {
      // Use relative API path, will be proxied in development by Vite
      const response = await axios.get(
        `/api/articles?url=${encodeURIComponent(url)}`
      );
      setArticles(response.data);
      setError(null);
    } catch (err) {
      setError("Error fetching article data");
      setArticles(null);
    }
  };

  return (
    <div className="App">
      <h1>Scrape Article</h1>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter article URL"
      />
      <button onClick={handleScrape}>Scrape</button>

      {error && <p>{error}</p>}

      {articles && <ArticleList articles={articles} />}
    </div>
  );
}

export default App;
