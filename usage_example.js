// Usage Example - How to use the dynamic API response structure

import React from 'react';
import YankeeBetArticle from './YankeeBetArticle';
import apiData from './yankee_bet_dynamic_api.json';

// Example of how to use the component
const App = () => {
  return (
    <div className="app">
      <YankeeBetArticle articleData={apiData} />
    </div>
  );
};

// Example of how the dynamic structure adapts to different content
// You can easily add new sections, subsections, or bet breakdowns

// Example 1: Adding a new section dynamically
const addNewSection = (apiData, newSection) => {
  return {
    ...apiData,
    article: {
      ...apiData.article,
      sections: [...apiData.article.sections, newSection]
    }
  };
};

// Example 2: Adding a new subsection to an existing section
const addSubsectionToSection = (apiData, sectionIndex, newSubsection) => {
  const updatedSections = [...apiData.article.sections];
  if (!updatedSections[sectionIndex].subsections) {
    updatedSections[sectionIndex].subsections = [];
  }
  updatedSections[sectionIndex].subsections.push(newSubsection);
  
  return {
    ...apiData,
    article: {
      ...apiData.article,
      sections: updatedSections
    }
  };
};

// Example 3: Dynamic bet breakdown for different bet types
const createCustomBetBreakdown = (betTypes) => {
  const breakdown = {};
  
  betTypes.forEach(betType => {
    breakdown[betType.name] = betType.bets.map((bet, index) => ({
      name: bet.description,
      calculation: bet.formula,
      payout: bet.result
    }));
  });
  
  return breakdown;
};

// Example usage with different content structures
const exampleNewSection = {
  heading: "Advanced Yankee Betting Strategies",
  content: [
    "For experienced bettors, there are several advanced strategies to maximize your Yankee bet potential.",
    "These strategies involve careful selection analysis and bankroll management."
  ],
  subsections: [
    {
      subheading: "Bankroll Management",
      content: [
        "Never stake more than 5% of your total bankroll on a single Yankee bet.",
        "Consider the variance and potential for both wins and losses."
      ]
    },
    {
      subheading: "Selection Criteria",
      content: [
        "Choose selections with odds between 2.00 and 4.00 for optimal balance.",
        "Ensure selections are from different markets to minimize correlation risk."
      ]
    }
  ]
};

// Example of how to update the API data dynamically
const updatedApiData = addNewSection(apiData, exampleNewSection);

// Example API fetch function
const fetchArticleData = async (articleId) => {
  try {
    const response = await fetch(`/api/articles/${articleId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching article data:', error);
    return null;
  }
};

// Example of rendering with fetched data
const DynamicArticleRenderer = ({ articleId }) => {
  const [articleData, setArticleData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadArticle = async () => {
      setLoading(true);
      const data = await fetchArticleData(articleId);
      setArticleData(data);
      setLoading(false);
    };
    
    loadArticle();
  }, [articleId]);

  if (loading) {
    return <div>Loading article...</div>;
  }

  if (!articleData) {
    return <div>Failed to load article.</div>;
  }

  return <YankeeBetArticle articleData={articleData} />;
};

// Benefits of this dynamic approach:
console.log(`
Dynamic API Structure Benefits:

1. **Flexible Content Structure**: 
   - Easy to add/remove sections, subsections, and content
   - Automatic rendering of any nested structure

2. **Bet Breakdown Adaptability**: 
   - Supports any bet type (doubles, trebles, accumulators, etc.)
   - Easy to add new calculation types

3. **Reusable Component**: 
   - Same component works for any article structure
   - No hardcoded content or layout

4. **SEO Friendly**: 
   - Semantic HTML structure
   - Proper heading hierarchy
   - Meta descriptions included

5. **Mobile Responsive**: 
   - CSS Grid and Flexbox for responsive design
   - Mobile-first approach

6. **Easy Maintenance**: 
   - Content changes only require API updates
   - No frontend code changes needed
   - Type-safe with proper validation

7. **Extensible**: 
   - Easy to add new field types
   - Support for images, videos, tables, etc.
   - Custom rendering functions for special content
`);

export default App;
export { DynamicArticleRenderer, addNewSection, addSubsectionToSection, createCustomBetBreakdown };