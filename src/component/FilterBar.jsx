/**
 * FilterBar Component
 * 
 * A component to filter notes based on collaboration type and category.
 * 
 * Props:
 * - theme: The current theme ("light" or "dark") for styling.
 * - filterType: The current filter type for collaboration (e.g., "All", "My Notes", "Collaborations").
 * - setFilterType: Function to update the filter type for collaboration.
 * - categories: List of available categories to filter by.
 * - selectedCategory: The currently selected category filter.
 * - setSelectedCategory: Function to update the selected category.
 */

const FilterBar = ({ theme, filterType, setFilterType, categories, selectedCategory, setSelectedCategory }) => (
  <div className="filters flex flex-col gap-4 mb-4">
    {/* Collaboration Filter */}
    <div>
      {/* Heading for Collaboration Filter */}
      <h3
        className={`text-sm font-bold mb-2 ${
          theme === "dark" ? "text-white" : "text-black"
        }`}
      >
        Filter by Collaboration
      </h3>

      {/* Dropdown for selecting collaboration filter */}
      <select
        style={{
          backgroundColor: theme === "dark" ? "#35363a" : "#ffffff",
          color: theme === "dark" ? "white" : "black",
        }}
        className="w-full p-2 border rounded-md"
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
      >
        <option value="All">All Notes</option>
        <option value="My Notes">My Notes</option>
        <option value="Collaborations">Collaborations</option>
      </select>
    </div>

    {/* Category Filter */}
    <div>
      {/* Heading for Category Filter */}
      <h3
        className={`text-sm font-bold mb-2 ${
          theme === "dark" ? "text-white" : "text-black"
        }`}
      >
        Filter by Category
      </h3>

      {/* Dropdown for selecting category filter */}
      <select
        style={{
          backgroundColor: theme === "dark" ? "#35363a" : "#ffffff",
          color: theme === "dark" ? "white" : "black",
        }}
        className="w-full p-2 border rounded-md"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default FilterBar;
