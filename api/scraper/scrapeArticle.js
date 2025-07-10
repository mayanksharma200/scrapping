import axios from "axios";
import * as cheerio from "cheerio";

// Function to scrape article content dynamically
async function scrapeArticle(url) {
  try {
    // Fetch the webpage content
    const { data } = await axios.get(url);

    // Load the HTML into cheerio
    const $ = cheerio.load(data);

    // Create an object to store the extracted content
    let extractedContent = {};

    // Loop through all elements to grab text content
    $("*").each((index, element) => {
      const tag = $(element).get(0).tagName; // Get the tag name (e.g., h1, div, p, etc.)
      const textContent = $(element).text().trim(); // Extract and trim the text content

      // Skip if there is no meaningful content
      if (textContent.length > 0) {
        // Store the content by tag name
        if (!extractedContent[tag]) {
          extractedContent[tag] = [];
        }
        extractedContent[tag].push(textContent); // Add the text to the array
      }
    });

    return extractedContent;
  } catch (error) {
    console.error("Error scraping the article:", error);
    return null;
  }
}

export default scrapeArticle;
