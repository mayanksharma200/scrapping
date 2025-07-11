import React, { useState } from "react";
import axios from "axios";
import ArticleList from "./components/ArticleList";

function App() {
  const [url, setUrl] = useState("");
  const [article, setArticle] = useState(null);
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
    <div className="bg-white text-gray-800 min-h-screen flex flex-col items-center p-8">
      <div className="w-full max-w-full bg-white rounded-xl shadow-xl p-6">
        <h1 className="text-3xl font-semibold text-center text-indigo-600 mb-8">
          Scrape Article
        </h1>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 w-full">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter article URL"
            className="w-full sm:w-2/3 p-4 border-2 border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-lg"
          />
          <button
            onClick={handleScrape}
            className="w-full sm:w-auto mt-4 sm:mt-0 bg-indigo-600 text-white py-3 px-8 rounded-xl hover:bg-indigo-700 transition-all duration-300"
          >
            Scrape
          </button>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {article && <ArticleList article={article} />}
      </div>
    </div>
  );
}

export default App;
