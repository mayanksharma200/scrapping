import axios from "axios";
import * as cheerio from "cheerio";

// Function to scrape article content and structure it properly
let titlehead = null;
async function scrapeArticle(url) {
  try {
    // Fetch the webpage content
    const { data } = await axios.get(url);

    // Load the HTML into cheerio
    const $ = cheerio.load(data);

    // Extract basic content
    const title = extractTitle($);
    titlehead = title;
    const metaDescription = extractMetaDescription($);
    const sections = extractSections($); // Extract sections dynamically
    const summary = generateSummary(sections);

    // Structure the response in the desired format
    return {
      article: {
        title,
        meta_description: metaDescription,
        sections,
        summary,
      },
    };
  } catch (error) {
    console.error("Error scraping the article:", error);
    return null;
  }
}

// Extract the main title
function extractTitle($) {
  const titleSelectors = [
    "h1:first",
    "title",
    '[class*="title"]:first',
    '[id*="title"]:first',
  ];

  for (const selector of titleSelectors) {
    const element = $(selector).first();
    if (element.length) {
      const title = element.text().trim();
      if (title && title.length > 5) {
        return title;
      }
    }
  }

  return "Article Title";
}

// Extract meta description
function extractMetaDescription($) {
  const metaDesc =
    $('meta[name="description"]').attr("content") ||
    $('meta[property="og:description"]').attr("content") ||
    "Article description";

  return metaDesc.trim();
}

// Extract and organize content into sections dynamically
function extractSections($) {
  const sections = [];

  // Fetch the first two paragraphs for the Title section
  const paragraphs = $("p").get();
  const firstParagraph = $(paragraphs[0]).text().trim();
  const secondParagraph = $(paragraphs[1])
    ? $(paragraphs[1]).text().trim()
    : "";

  // Add the Title section with the first two paragraphs
  sections.push({
    title: titlehead,
    content: [firstParagraph, secondParagraph],
  });

  const headings = $("h2, h3, h4, h5, h6").get();

  if (headings.length === 0) {
    // If no headings found, create a single section with all paragraphs
    const allParagraphs = $("p")
      .get()
      .map((p) => $(p).text().trim())
      .filter((text) => text.length > 20);

    if (allParagraphs.length > 0) {
      sections.push({
        heading: "Article Content",
        content: allParagraphs,
      });
    }
    return sections;
  }

  // Group content by headings
  for (let i = 0; i < headings.length; i++) {
    const heading = $(headings[i]);
    const headingText = heading.text().trim();

    if (!headingText || headingText.length < 3) continue;

    const nextHeading = headings[i + 1];
    let content = [];
    let subsections = [];

    let currentElement = heading.next();
    while (
      currentElement.length &&
      (!nextHeading || !currentElement.is($(nextHeading)))
    ) {
      if (currentElement.is("p")) {
        const text = currentElement.text().trim();
        if (text && text.length > 20) content.push(text);
      } else if (currentElement.is("h3, h4, h5, h6")) {
        const subheadingText = currentElement.text().trim();
        const subContent = [];

        let subElement = currentElement.next();
        while (subElement.length && !subElement.is("h2, h3, h4, h5, h6")) {
          if (subElement.is("p")) {
            const subText = subElement.text().trim();
            if (subText && subText.length > 20) subContent.push(subText);
          }
          subElement = subElement.next();
        }

        if (subheadingText && subContent.length > 0) {
          subsections.push({
            subheading: subheadingText,
            content: subContent,
          });
        }
      } else if (currentElement.is("ul, ol")) {
        const listItems = currentElement
          .find("li")
          .get()
          .map((li) => $(li).text().trim())
          .filter((text) => text.length > 10);
        if (listItems.length > 0) content.push(...listItems);
      }

      currentElement = currentElement.next();
    }

    if (content.length > 0 || subsections.length > 0) {
      sections.push({
        heading: headingText,
        content: content,
        ...(subsections.length > 0 && { subsections }),
      });
    }
  }

  return sections;
}

// Generate a summary based on the extracted content
function generateSummary(sections) {
  return {
    total_sections: sections.length,
    total_subsections: sections.reduce(
      (acc, section) => acc + (section.subsections?.length || 0),
      0
    ),
    word_count_estimate: sections.reduce((acc, section) => {
      const sectionWords = section.content.join(" ").split(" ").length;
      const subsectionWords =
        section.subsections?.reduce(
          (subAcc, sub) => subAcc + sub.content.join(" ").split(" ").length,
          0
        ) || 0;
      return acc + sectionWords + subsectionWords;
    }, 0),
  };
}

export default scrapeArticle;
