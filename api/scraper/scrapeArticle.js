import axios from "axios";
import * as cheerio from "cheerio";

// Function to scrape article content efficiently
async function scrapeArticle(url) {
  try {
    // Fetch the webpage content
    const { data } = await axios.get(url);

    // Load the HTML into cheerio
    const $ = cheerio.load(data);

    // Create an object to store the extracted content
    let extractedContent = {};

    // Define target selectors for common article content
    const contentSelectors = {
      title: 'h1, title, [class*="title"], [id*="title"]',
      headings: 'h2, h3, h4, h5, h6',
      paragraphs: 'p',
      lists: 'ul, ol',
      articles: 'article, [role="main"], main, [class*="content"], [class*="article"]',
      meta: 'meta[name="description"], meta[property="og:description"]'
    };

    // Extract content using targeted selectors
    Object.entries(contentSelectors).forEach(([key, selector]) => {
      const elements = $(selector);
      if (elements.length > 0) {
        extractedContent[key] = [];
        
        elements.each((index, element) => {
          let textContent;
          
          if (key === 'meta') {
            // For meta tags, get the content attribute
            textContent = $(element).attr('content');
          } else {
            // For other elements, get direct text content only (not nested)
            textContent = $(element).contents()
              .filter(function() {
                return this.nodeType === 3; // Text nodes only
              })
              .text()
              .trim();
          }
          
          // Only add non-empty, meaningful content
          if (textContent && textContent.length > 10) {
            extractedContent[key].push(textContent);
          }
        });
        
        // Remove empty arrays
        if (extractedContent[key].length === 0) {
          delete extractedContent[key];
        }
      }
    });

    return extractedContent;
  } catch (error) {
    console.error("Error scraping the article:", error);
    return null;
  }
}

export default scrapeArticle;
