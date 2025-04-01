import React from "react";

const CategoryTabs = ({ selectedCategory, setSelectedCategory }) => {
  const categories = [
    "Cancer",
    "Chronic",
    "Smoking",
    "Reproductive",
    "Overall",
  ];

  return (
    <div className="flex space-x-4 bg-white p-4 rounded-lg shadow-md">
      {categories.map((category) => (
        <button
          key={category}
          className={`px-4 py-2 text-sm font-medium rounded-md transition ${
            selectedCategory === category
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setSelectedCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
