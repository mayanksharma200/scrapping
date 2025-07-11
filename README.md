# Dynamic Article API Response Structure

This project provides a flexible, dynamic API response structure for rendering articles (specifically Yankee betting content) that can easily adapt to any content structure and be rendered dynamically on the UI.

## Files Created

1. **`yankee_bet_dynamic_api.json`** - The main API response structure
2. **`YankeeBetArticle.jsx`** - React component for dynamic rendering
3. **`usage_example.js`** - Usage examples and helper functions

## Key Features

### 🔄 Dynamic Structure
- **Flexible Content Organization**: Uses object-based structure with `heading` keys and corresponding `content`
- **Nested Subsections**: Supports unlimited nesting of subsections with their own headings and content
- **Bet Breakdown Support**: Special handling for betting calculations (doubles, trebles, accumulators)
- **Automatic Adaptation**: Component automatically renders any structure passed to it

### 📱 UI-Ready
- **React Component**: Ready-to-use component that dynamically renders the content
- **Responsive Design**: Mobile-first CSS with grid layouts
- **SEO Optimized**: Semantic HTML structure with proper heading hierarchy
- **Styled Components**: Beautiful, modern styling included

### 🧩 Modular Design
- **Reusable**: Same component works for any article type
- **Extensible**: Easy to add new content types or sections
- **Maintainable**: Content changes only require API updates
- **Type-Safe**: Structured data with predictable formats

## API Response Structure

```json
{
  "article": {
    "title": "Article Title",
    "meta_description": "SEO description",
    "sections": [
      {
        "heading": "Section Title",
        "content": ["Paragraph 1", "Paragraph 2"],
        "subsections": [
          {
            "subheading": "Subsection Title", 
            "content": ["Content..."],
            "bet_breakdown": {
              "doubles": [
                {
                  "name": "Bet Name",
                  "calculation": "Formula",
                  "payout": "Result"
                }
              ]
            }
          }
        ]
      }
    ],
    "summary": {
      "total_bets": 11,
      "bet_types": {},
      "example_calculations": {}
    }
  }
}
```

## Usage Examples

### Basic Usage
```jsx
import YankeeBetArticle from './YankeeBetArticle';
import apiData from './yankee_bet_dynamic_api.json';

const App = () => {
  return <YankeeBetArticle articleData={apiData} />;
};
```

### Dynamic Content Addition
```js
// Add new section
const newSection = {
  heading: "New Section",
  content: ["Content here..."],
  subsections: [...]
};

const updatedData = addNewSection(apiData, newSection);
```

### API Integration
```js
const fetchArticleData = async (articleId) => {
  const response = await fetch(`/api/articles/${articleId}`);
  return response.json();
};

// Use with dynamic renderer
<DynamicArticleRenderer articleId="yankee-bet-guide" />
```

## Benefits

### 1. **Flexibility**
- Add/remove sections without code changes
- Support for any content structure
- Easy to extend with new field types

### 2. **Developer Experience**
- No hardcoded content in components
- Type-safe structure
- Easy debugging and maintenance

### 3. **Performance**
- Efficient rendering with React keys
- Conditional rendering for optional sections
- Optimized for large content structures

### 4. **SEO & Accessibility**
- Semantic HTML structure
- Proper heading hierarchy (h1 > h2 > h3)
- Screen reader friendly
- Meta descriptions for search engines

### 5. **Design System Ready**
- Consistent styling approach
- CSS custom properties support
- Theme-able components
- Responsive breakpoints

## Content Types Supported

### Text Content
- Paragraphs
- Headings (multiple levels)
- Lists (ordered/unordered)

### Betting Specific
- Bet breakdowns (doubles, trebles, accumulators)
- Calculation displays
- Odds formatting
- Payout summaries

### Metadata
- SEO descriptions
- Article summaries
- Quick facts sections
- Statistical data

## Extending the Structure

### Adding New Content Types
```js
// In the React component, add new render functions
const renderNewContentType = (data) => {
  // Custom rendering logic
  return <div className="new-content-type">{data}</div>;
};

// Use conditionally in main render
{section.newContentType && renderNewContentType(section.newContentType)}
```

### Custom Styling
```css
/* Override default styles */
.yankee-bet-article {
  --primary-color: #your-color;
  --font-family: 'Your-Font';
}

/* Add new component styles */
.new-content-type {
  /* Your styles */
}
```

## Best Practices

1. **Content Structure**: Keep consistent object structures for predictable rendering
2. **Performance**: Use React.memo for large content to prevent unnecessary re-renders
3. **Accessibility**: Always include proper ARIA labels and semantic HTML
4. **SEO**: Include meta descriptions and structured data
5. **Testing**: Test with various content structures to ensure flexibility

## Future Enhancements

- **Image Support**: Add image objects with alt text and captions
- **Video Embedding**: Support for video content with transcripts
- **Interactive Elements**: Support for calculators, forms, and interactive betting tools
- **Internationalization**: Multi-language content support
- **Analytics**: Built-in tracking for content engagement

This dynamic structure ensures your content API can grow and adapt to any future requirements while maintaining a clean, maintainable codebase.