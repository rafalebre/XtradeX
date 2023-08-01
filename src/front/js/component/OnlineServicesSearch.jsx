import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import "./Search.css";

const OnlineServicesSearch = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [specificSearch, setSpecificSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getServiceCategories();
  }, []);

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);

    if (categoryId) {
      actions.getServiceSubcategories(categoryId);
    }
    setSelectedSubcategory("");
  };

  const handleSearch = (e) => {
    e.preventDefault();
  
    if (specificSearch) {
      actions.fetchOnlineServicesByName(searchTerm);
    } else {
      actions.fetchOnlineServices(selectedCategory, selectedSubcategory);
    }
  };

  const handleSpecificSearchToggle = () => {
    setSpecificSearch(!specificSearch);
    setSelectedCategory("");
    setSelectedSubcategory("");
  };

  const filteredSubcategories = selectedCategory
    ? store.serviceSubcategories.filter((sub) => sub.category_id == selectedCategory)
    : [];

  return (
    <div>
      <button onClick={handleSpecificSearchToggle}>
        Specific Item Search
      </button>

      {specificSearch ? (
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter item name..."
          />
          <button onClick={handleSearch}>
            Search
          </button>
          {store.onlineServices.map((service, index) => (
            <div key={index}>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <form onSubmit={handleSearch}>
          <select value={selectedCategory} onChange={handleCategoryChange}>
            <option value="">Select Category</option>
            {store.serviceCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)}>
            <option value="">Select Subcategory</option>
            {filteredSubcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>
          <button type="submit">
            Search
          </button>

          {store.onlineServices.map((service, index) => (
            <div key={index}>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </form>
      )}
    </div>
  );
};

export default OnlineServicesSearch;
