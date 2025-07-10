import scrapeArticle from "../scraper/scrapeArticle.js";

// Function to handle scraping request
export const getArticleData = async (req, res) => {
  const url = req.query.url; // Get URL from query parameters
  if (!url) {
    return res.status(400).send("URL parameter is required");
  }

  const articleData = await scrapeArticle(url);
  if (articleData) {
    return res.json(articleData); // Return the scraped data
  }

  res.status(500).send("Failed to scrape the article");
};
