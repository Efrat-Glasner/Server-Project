/* eslint-disable react/prop-types */
import { useState } from "react";

const Search = ({ data, onFilter, searchFields }) => {
  const [query, setQuery] = useState("");
  const [searchCriterion, setSearchCriterion] = useState(searchFields[0]);

  const handleSearch = (e) => {
    setQuery(e.target.value);
    const filtered = filterData(data, e.target.value, searchCriterion);
    onFilter(filtered);
  };

  const handleCriterionChange = (e) => {
    setSearchCriterion(e.target.value);
    const filtered = filterData(data, query, e.target.value);
    onFilter(filtered);
  };

  const filterData = (data, query, criterion) => {
    if (!query) return data;
    return data.filter((item) =>
      item[criterion]?.toString().toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search..."
      />
      <select onChange={handleCriterionChange} value={searchCriterion}>
        {searchFields.map((field) => (
          <option key={field} value={field}>
            {field}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Search;
