import scrapeArticle from "../scraper/scrapeArticle.js";

// Function to validate URL to prevent SSRF attacks
const isValidUrl = (url) => {
  try {
    const parsedUrl = new URL(url);

    // Only allow HTTP and HTTPS protocols
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return false;
    }

    // Block localhost and private IP ranges
    const hostname = parsedUrl.hostname.toLowerCase();

    // Block localhost variations
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1"
    ) {
      return false;
    }

    // Block private IP ranges (RFC 1918)
    const ip = hostname.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
    if (ip) {
      const [, a, b, c, d] = ip.map(Number);
      // 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
      if (
        a === 10 ||
        (a === 172 && b >= 16 && b <= 31) ||
        (a === 192 && b === 168) ||
        (a === 169 && b === 254)
      ) {
        return false;
      }
    }

    // Block common cloud metadata endpoints
    if (
      hostname === "169.254.169.254" ||
      hostname === "metadata.google.internal"
    ) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

// Function to handle scraping request
export const getArticleData = async (req, res) => {
  const url = req.query.url; // Get URL from query parameters
  if (!url) {
    return res.status(400).send("URL parameter is required");
  }

  // Validate URL to prevent SSRF attacks
  if (!isValidUrl(url)) {
    return res.status(400).send("Invalid or potentially dangerous URL");
  }

  const articleData = await scrapeArticle(url);
  if (articleData) {
    return res.json(articleData); // Return the scraped data
  }

  res.status(500).send("Failed to scrape the article");
};
