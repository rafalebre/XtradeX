import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import ItemDetails from "./ItemDetails.jsx";
import GoogleMaps from './GoogleMaps.jsx';
import "./HomeSearch.css";

const HomeSearch = () => {
  const [searchType, setSearchType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [specificSearch, setSpecificSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { store, actions } = useContext(Context);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState(null);
  const [location, setLocation] = useState(null);
  const [bounds, setBounds] = useState(null);
  const [highlightedItem, setHighlightedItem] = useState(null);

  useEffect(() => {
    if (searchType === "products") {
      actions.getCategories();
    } else if (searchType === "services") {
      actions.getServiceCategories();
    }
  }, [searchType]);

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);

    if (categoryId) {
      if (searchType === "products") {
        actions.getSubcategories(categoryId);
      } else if (searchType === "services") {
        actions.getServiceSubcategories(categoryId);
      }
    }
    setSelectedSubcategory("");
  };

  const renderItems = (items, isProduct) => {
    return items.map((item, index) => (
      <div
        key={index}
        className="item-card-custom"
        onMouseEnter={() => setHighlightedItem(item)}
        onMouseLeave={() => setHighlightedItem(null)}
      >
        <h3>{item.name}</h3>
        {isProduct && <p>Condition: {item.condition}</p>}
        <p>Estimated Value: {item.estimated_value}{item.currency}</p>
        <button
          className="orange-button-custom"
          onClick={() =>
            handleOpenDetails(item, isProduct ? "product" : "service")
          }
        >
          Check details
        </button>
      </div>
    ));
  };

  const handleOpenDetails = (item, itemType) => {
    setSelectedItem(item);
    setSelectedItemType(itemType);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (specificSearch) {
      actions.fetchItemsByName(searchTerm, location, bounds);
    } else if (searchType === "products") {
      actions.fetchProducts(selectedCategory, selectedSubcategory, location, bounds);
    } else if (searchType === "services") {
      actions.fetchServices(selectedCategory, selectedSubcategory, location, bounds);
    }
  };

  const handleLocationChange = (newLocation, newBounds) => {
    setLocation(newLocation);
    setBounds(newBounds);
  };

  const handleSearchTypeChange = (newSearchType) => {
    setSearchType(newSearchType);
    setSelectedCategory("");
    setSelectedSubcategory("");
    setSpecificSearch(false);
  };

  const handleSpecificSearchToggle = () => {
    setSpecificSearch(true);
    setSearchType(null);
    setSelectedCategory("");
    setSelectedSubcategory("");
  };

  const filteredSubcategories = selectedCategory
    ? (searchType === "products"
        ? store.subcategories
        : store.serviceSubcategories
      ).filter((sub) => sub.category_id == selectedCategory)
    : [];

  const categories =
    searchType === "products" ? store.categories : store.serviceCategories;

  return (
    <div>
      <div className="button-container">
        <button
          className="search-button-custom"
          onClick={() => handleSearchTypeChange("products")}
        >
          Search Products
        </button>
        <button
          className="search-button-custom"
          onClick={() => handleSearchTypeChange("services")}
        >
          Search Services
        </button>
        <button
          className="search-button-custom"
          onClick={handleSpecificSearchToggle}
        >
          Specific Item Search
        </button>
      </div>

      {searchType ? (
        <form onSubmit={handleSearch}>
          <div className="dropdown-container">
            <select
              name="category_id"
              className="dropdown-custom"
              onChange={handleCategoryChange}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              name="subcategory_id"
              className="dropdown-custom"
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
            >
              <option value="">Select Subcategory</option>
              {filteredSubcategories.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </option>
              ))}
            </select>

            <button type="submit" className="submit-button-custom">
              Search
            </button>
          </div>
        </form>
      ) : null}
<div className="google-maps-container">
        <GoogleMaps
          onLocationChange={handleLocationChange}
          markers={store.searchedProducts.concat(store.searchedServices)}
          setHighlightedItem={setHighlightedItem}
          highlightedItem={highlightedItem}
        />
      </div>
      {specificSearch ? (
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter item name..."
          />
          <button
            onClick={handleSearch}
            className="search-button-custom"
          >
            Search
          </button>
          <div className="container">
            {renderItems(store.searchedProducts, true)}
            {renderItems(store.searchedServices, false)}
          </div>
        </div>
      ) : (
        <div className="item-list-custom">
          {searchType === "products" && renderItems(store.products, true)}
          {searchType === "services" && renderItems(store.services, false)}
        </div>
      )}

      {showDetails && selectedItem && selectedItemType && (
        <ItemDetails
          item={selectedItem}
          itemType={selectedItemType}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
};

export default HomeSearch;
