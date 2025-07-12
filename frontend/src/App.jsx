import React from "react";
import ArticleList from "./components/ArticleList";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white w-full">
      <div className="w-full p-4">
        <ArticleList />
      </div>
    </div>
  );
}

export default App;
