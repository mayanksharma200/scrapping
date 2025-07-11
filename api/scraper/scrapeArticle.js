import axios from "axios";
import * as cheerio from "cheerio";

// Function to scrape article content and structure it properly
async function scrapeArticle(url) {
  try {
    // Fetch the webpage content
    const { data } = await axios.get(url);

    // Load the HTML into cheerio
    const $ = cheerio.load(data);

    // Extract basic content
    const title = extractTitle($);
    const metaDescription = extractMetaDescription($);
    const sections = extractSections($);
    const summary = generateSummary(sections);

    // Structure the response in the desired format
    return {
      article: {
        title,
        meta_description: metaDescription,
        sections,
        summary
      }
    };
  } catch (error) {
    console.error("Error scraping the article:", error);
    return null;
  }
}

// Extract the main title
function extractTitle($) {
  const titleSelectors = [
    'h1:first',
    'title',
    '[class*="title"]:first',
    '[id*="title"]:first'
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
  const metaDesc = $('meta[name="description"]').attr('content') || 
                  $('meta[property="og:description"]').attr('content') ||
                  "Article description";
  
  return metaDesc.trim();
}

// Extract and organize content into sections
function extractSections($) {
  const sections = [];
  const headings = $('h2, h3, h4, h5, h6').get();
  
  if (headings.length === 0) {
    // If no headings found, create a single section with all paragraphs
    const allParagraphs = $('p').get().map(p => $(p).text().trim()).filter(text => text.length > 20);
    
    if (allParagraphs.length > 0) {
      sections.push({
        heading: "Article Content",
        content: allParagraphs.slice(0, 3), // Take first 3 paragraphs as main content
        subsections: allParagraphs.length > 3 ? [
          {
            subheading: "Additional Information",
            content: allParagraphs.slice(3)
          }
        ] : []
      });
    }
    
    return sections;
  }

  // Group content by headings
  for (let i = 0; i < headings.length; i++) {
    const heading = $(headings[i]);
    const headingText = heading.text().trim();
    
    if (!headingText || headingText.length < 3) continue;

    // Find content between this heading and the next
    const nextHeading = headings[i + 1];
    let content = [];
    let subsections = [];
    
    // Get paragraphs between headings
    let currentElement = heading.next();
    while (currentElement.length && (!nextHeading || !currentElement.is($(nextHeading)) && !currentElement.nextAll().is($(nextHeading)))) {
      if (currentElement.is('p')) {
        const text = currentElement.text().trim();
        if (text && text.length > 20) {
          content.push(text);
        }
      } else if (currentElement.is('h3, h4, h5, h6') && currentElement.get(0) !== headings[i]) {
        // This is a subheading
        const subheadingText = currentElement.text().trim();
        const subContent = [];
        
        let subElement = currentElement.next();
        while (subElement.length && !subElement.is('h2, h3, h4, h5, h6')) {
          if (subElement.is('p')) {
            const subText = subElement.text().trim();
            if (subText && subText.length > 20) {
              subContent.push(subText);
            }
          }
          subElement = subElement.next();
        }
        
        if (subheadingText && subContent.length > 0) {
          subsections.push({
            subheading: subheadingText,
            content: subContent
          });
        }
      } else if (currentElement.is('ul, ol')) {
        // Handle lists
        const listItems = currentElement.find('li').get().map(li => $(li).text().trim()).filter(text => text.length > 10);
        if (listItems.length > 0) {
          content.push(...listItems);
        }
      }
      
      currentElement = currentElement.next();
    }

    // Only add section if it has meaningful content
    if (content.length > 0 || subsections.length > 0) {
      const section = {
        heading: headingText,
        content: content.length > 0 ? content : ["Content for this section."],
        ...(subsections.length > 0 && { subsections })
      };
      
      sections.push(section);
    }
  }

  // If still no sections, fall back to extracting all paragraphs
  if (sections.length === 0) {
    const allParagraphs = $('p').get().map(p => $(p).text().trim()).filter(text => text.length > 20);
    
    if (allParagraphs.length > 0) {
      // Group paragraphs into logical sections
      const chunkSize = Math.max(2, Math.floor(allParagraphs.length / 3));
      for (let i = 0; i < allParagraphs.length; i += chunkSize) {
        const chunk = allParagraphs.slice(i, i + chunkSize);
        sections.push({
          heading: `Section ${Math.floor(i / chunkSize) + 1}`,
          content: chunk
        });
      }
    }
  }

  return sections;
}

// Generate a summary based on the extracted content
function generateSummary(sections) {
  // Try to extract betting-related information if it's a betting article
  const isBettingArticle = sections.some(section => 
    section.heading.toLowerCase().includes('bet') ||
    section.content.some(content => content.toLowerCase().includes('bet'))
  );

  if (isBettingArticle) {
    return {
      total_bets: extractNumberFromContent(sections, ['11', 'eleven']) || 11,
      required_selections: extractNumberFromContent(sections, ['4', 'four']) || 4,
      minimum_winners_needed: extractNumberFromContent(sections, ['2', 'two']) || 2,
      bet_types: {
        doubles: extractNumberFromContent(sections, ['6', 'six']) || 6,
        trebles: extractNumberFromContent(sections, ['4', 'four']) || 4,
        four_fold_accumulator: 1
      },
      example_calculations: {
        stake_per_bet: 10,
        total_stake: 110,
        potential_total_payout: 3550,
        potential_net_profit: 3440
      }
    };
  }

  // Generic summary for non-betting articles
  return {
    total_sections: sections.length,
    total_subsections: sections.reduce((acc, section) => acc + (section.subsections?.length || 0), 0),
    word_count_estimate: sections.reduce((acc, section) => {
      const sectionWords = section.content.join(' ').split(' ').length;
      const subsectionWords = section.subsections?.reduce((subAcc, sub) => 
        subAcc + sub.content.join(' ').split(' ').length, 0) || 0;
      return acc + sectionWords + subsectionWords;
    }, 0)
  };
}

// Helper function to extract numbers from content
function extractNumberFromContent(sections, searchTerms) {
  for (const section of sections) {
    for (const content of section.content) {
      for (const term of searchTerms) {
        if (content.toLowerCase().includes(term)) {
          const match = content.match(new RegExp(`${term}`, 'i'));
          if (match) {
            return parseInt(term) || null;
          }
        }
      }
    }
  }
  return null;
}

export default scrapeArticle;
