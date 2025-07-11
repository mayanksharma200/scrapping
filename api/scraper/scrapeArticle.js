import axios from "axios";
import * as cheerio from "cheerio";

function cleanText(str) {
  return str
    .replace(/\s+/g, " ")
    .replace(/function\s+\w+\(.*?\)\s*{[\s\S]*?}/g, "") // Remove inline JS functions
    .replace(/WH\.\w+\([^)]+\);?/g, "") // Remove wikiHow's JS calls
    .replace(/^\s*Download Article\s*/i, "") // Remove "Download Article" headings
    .replace(/^[^a-zA-Z0-9]*$/, "") // Remove non-text junk lines
    .replace(/\{.*?\}/g, "") // Remove template-like {var}
    .replace(/<[^>]+>/g, "") // Remove any residual HTML tags
    .replace(/Advertisement/g, "") // Remove 'Advertisement'
    .trim();
}

// Remove scripts/styles/noscript and hidden nodes before main processing
function removeJunkTags($) {
  $(
    "script, style, noscript, .hidden, [aria-hidden='true'], .ad, .advertisement"
  ).remove();
}

// Find the main content container by comparing text length
function findMainContainer($) {
  const candidates = ["main", "article", "section", "body", "div"];
  let maxLen = 0,
    best = $("body");
  candidates.forEach((sel) => {
    $(sel).each((i, el) => {
      const len = cleanText($(el).text()).length;
      if (len > maxLen) {
        maxLen = len;
        best = $(el);
      }
    });
  });
  return best;
}

// Recursively collect sections
function extractSections($, node) {
  let sections = [];
  let currentSection = { heading: "Introduction", content: [] };

  function process(el) {
    if (el.type === "tag") {
      const tag = el.tagName.toLowerCase();
      const text = cleanText($(el).text());
      if (/^h[1-6]$/.test(tag)) {
        if (currentSection.content.length) sections.push(currentSection);
        currentSection = { heading: text, content: [] };
      } else {
        if ((tag === "ul" || tag === "ol") && $(el).find("li").length) {
          $(el)
            .find("li")
            .each((i, li) => {
              const t = cleanText($(li).text());
              if (t.length > 0) currentSection.content.push(t);
            });
        } else if (["p", "div", "span", "li"].includes(tag)) {
          // Post-clean filter for code/junk
          if (
            text.length > 20 &&
            !/^\s*function\s*\w*\s*\(/.test(text) && // Remove lines starting with function
            !/^\s*WH\.\w*\(/.test(text) && // Remove lines starting with WH.something
            !/^\s*var /.test(text) && // Remove var statements
            !/^\s*Download Article/i.test(text) && // Remove Download Article
            !/<.*?>/.test(text) && // Remove HTML
            !/log in/i.test(text) // Remove Log In
          ) {
            currentSection.content.push(text);
          }
        }
        $(el)
          .contents()
          .each((i, child) => process(child));
      }
    }
  }

  $(node)
    .contents()
    .each((i, el) => process(el));

  if (currentSection.content.length) sections.push(currentSection);

  // Filter out sections with "Introduction" and clean unwanted sections
  return sections.filter(
    (sec) =>
      sec.content.length &&
      // sec.heading.toLowerCase() !== "introduction" &&
      sec.heading.toLowerCase() !== "log in" && // Remove "log in" sections
      sec.heading.length < 120
  );
}

async function scrapeArticle(url) {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      },
    });

    const $ = cheerio.load(data);
    removeJunkTags($); // Clean before processing!
    const main = findMainContainer($);

    const title =
      $("h1").first().text().trim() ||
      $("title").text().trim() ||
      "Untitled Article";
    const metaDescription =
      $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content") ||
      "";

    const sections = extractSections($, main);

    // Merge duplicate "Introduction" sections
    if (
      sections.length > 1 &&
      sections[0].heading === "Introduction" &&
      sections[1].heading === "Introduction"
    ) {
      sections[0].content.push(...sections[1].content);
      sections.splice(1, 1);
    }

    const filteredSections = sections
      .map((sec) => ({
        heading: sec.heading,
        content: sec.content.filter(
          (c) =>
            c.length > 20 &&
            !/function\s*\w+\s*\(/.test(c) &&
            !/WH\.\w+\(/.test(c) &&
            !/^\s*Download Article/i.test(c)
        ),
      }))
      .filter((sec) => sec.content.length);

    const summary = {
      total_sections: filteredSections.length,
      word_count_estimate: filteredSections.reduce(
        (acc, section) =>
          acc + (section.content?.join(" ").split(/\s+/).length || 0),
        0
      ),
    };

    return {
      article: {
        title,
        meta_description: metaDescription,
        sections: filteredSections,
        summary,
      },
    };
  } catch (error) {
    console.error("Error scraping the article:", error.message);
    return null;
  }
}

export default scrapeArticle;
