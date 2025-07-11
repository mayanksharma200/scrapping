import React from 'react';

const YankeeBetArticle = ({ articleData }) => {
  const renderBetBreakdown = (betBreakdown) => {
    if (!betBreakdown) return null;

    return (
      <div className="bet-breakdown">
        {Object.entries(betBreakdown).map(([betType, bets]) => (
          <div key={betType} className="bet-type-section">
            <h4 className="bet-type-title">{betType.charAt(0).toUpperCase() + betType.slice(1)}</h4>
            <ul className="bet-list">
              {bets.map((bet, index) => (
                <li key={index} className="bet-item">
                  <strong>{bet.name}:</strong> {bet.calculation} = {bet.payout}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  const renderSubsection = (subsection, index) => {
    return (
      <div key={index} className="subsection">
        <h3 className="subsection-heading">{subsection.subheading}</h3>
        <div className="subsection-content">
          {subsection.content.map((paragraph, pIndex) => (
            <p key={pIndex}>{paragraph}</p>
          ))}
        </div>
        {subsection.bet_breakdown && renderBetBreakdown(subsection.bet_breakdown)}
      </div>
    );
  };

  const renderSection = (section, index) => {
    return (
      <section key={index} className="article-section">
        <h2 className="section-heading">{section.heading}</h2>
        <div className="section-content">
          {section.content.map((paragraph, pIndex) => (
            <p key={pIndex}>{paragraph}</p>
          ))}
        </div>
        {section.subsections && (
          <div className="subsections">
            {section.subsections.map((subsection, sIndex) => 
              renderSubsection(subsection, sIndex)
            )}
          </div>
        )}
      </section>
    );
  };

  const renderSummary = (summary) => {
    if (!summary) return null;

    return (
      <div className="article-summary">
        <h3>Quick Facts</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <strong>Total Bets:</strong> {summary.total_bets}
          </div>
          <div className="summary-item">
            <strong>Required Selections:</strong> {summary.required_selections}
          </div>
          <div className="summary-item">
            <strong>Minimum Winners Needed:</strong> {summary.minimum_winners_needed}
          </div>
        </div>
        
        <div className="bet-types-breakdown">
          <h4>Bet Types Breakdown:</h4>
          {Object.entries(summary.bet_types).map(([type, count]) => (
            <div key={type} className="bet-type-count">
              <strong>{type.replace('_', ' ').toUpperCase()}:</strong> {count}
            </div>
          ))}
        </div>

        <div className="example-calculations">
          <h4>Example Calculations:</h4>
          {Object.entries(summary.example_calculations).map(([key, value]) => (
            <div key={key} className="calculation-item">
              <strong>{key.replace('_', ' ').toUpperCase()}:</strong> ${value}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!articleData || !articleData.article) {
    return <div>Loading...</div>;
  }

  const { article } = articleData;

  return (
    <article className="yankee-bet-article">
      <header className="article-header">
        <h1 className="article-title">{article.title}</h1>
        <p className="article-meta">{article.meta_description}</p>
      </header>

      <div className="article-body">
        {article.sections.map((section, index) => renderSection(section, index))}
      </div>

      {article.summary && renderSummary(article.summary)}
    </article>
  );
};

// CSS styles (can be moved to a separate CSS file)
const styles = `
.yankee-bet-article {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  line-height: 1.6;
}

.article-header {
  margin-bottom: 30px;
  text-align: center;
}

.article-title {
  color: #333;
  font-size: 2.5em;
  margin-bottom: 10px;
}

.article-meta {
  color: #666;
  font-style: italic;
  font-size: 1.1em;
}

.article-section {
  margin-bottom: 40px;
}

.section-heading {
  color: #2c3e50;
  font-size: 1.8em;
  margin-bottom: 15px;
  border-bottom: 2px solid #3498db;
  padding-bottom: 5px;
}

.subsection {
  margin: 25px 0;
  padding-left: 20px;
}

.subsection-heading {
  color: #34495e;
  font-size: 1.4em;
  margin-bottom: 10px;
}

.bet-breakdown {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
}

.bet-type-section {
  margin-bottom: 20px;
}

.bet-type-title {
  color: #2980b9;
  font-size: 1.2em;
  margin-bottom: 10px;
}

.bet-list {
  list-style: none;
  padding: 0;
}

.bet-item {
  background-color: white;
  padding: 10px;
  margin: 5px 0;
  border-left: 4px solid #3498db;
  border-radius: 4px;
}

.article-summary {
  background-color: #ecf0f1;
  padding: 25px;
  border-radius: 10px;
  margin-top: 40px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin: 15px 0;
}

.summary-item,
.bet-type-count,
.calculation-item {
  background-color: white;
  padding: 10px;
  border-radius: 5px;
  border-left: 4px solid #e74c3c;
}

.bet-types-breakdown,
.example-calculations {
  margin: 20px 0;
}

@media (max-width: 768px) {
  .yankee-bet-article {
    padding: 15px;
  }
  
  .article-title {
    font-size: 2em;
  }
  
  .section-heading {
    font-size: 1.5em;
  }
}
`;

export default YankeeBetArticle;