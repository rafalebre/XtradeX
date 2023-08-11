import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import ItemDetails from "./ItemDetails.jsx";
import TradeProposal from "./TradeProposal.jsx";
import GoogleMaps from './GoogleMaps.jsx';
import "./Search.css";
import "./scrollToTop";

const Search = () => {
  const [searchType, setSearchType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [specificSearch, setSpecificSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { store, actions } = useContext(Context);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState(null);
  const [showTradeProposal, setShowTradeProposal] = useState(false);
  const [location, setLocation] = useState(null);
  const [bounds, setBounds] = useState(null);

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
      <div key={index} className="item-card">
        <h3>{item.name}</h3>
        {isProduct && <p>Condition: {item.condition}</p>}
        <p>Estimated Value: {item.estimated_value}{item.currency}</p>
        <button
          className="orange-button"
          onClick={() =>
            handleOpenDetails(item, isProduct ? "product" : "service")
          }
        >
          Check details
        </button>
        {/* Adicionar botão para adicionar aos favoritos */}
        <button
          className="orange-button"
          onClick={() => handleAddToFavorites(item)}
        >
          Add to Favorites
        </button>
        {/* Abre o modal de Trade Proposal */}
        <button
          className="orange-button"
          onClick={() =>
            handleOpenTradeProposal(item, isProduct ? "product" : "service")
          }
        >
          Propose Trade
        </button>
      </div>
    ));
  };

  // Função para abrir o modal de TradeProposal
  const handleOpenTradeProposal = (item, itemType) => {
    setSelectedItem(item);
    setSelectedItemType(itemType);
    setShowTradeProposal(true);
  };

  // Função para fechar o modal de TradeProposal
  const handleCloseTradeProposal = () => {
    setShowTradeProposal(false);
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
  }
  

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

  const handleAddToFavorites = (item) => {
    actions.addFavorite(item);
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
      <div className="search-container">
        <div className="button-container">
          <button className="search-button" onClick={() => handleSearchTypeChange("products")}>Search Products</button>
          <button className="search-button" onClick={() => handleSearchTypeChange("services")}>Search Services</button>
          <button className="search-button" onClick={handleSpecificSearchToggle}>Specific Item Search</button>
        </div>
    
        {searchType && (
          <form onSubmit={handleSearch} className="category-form">
            <select name="category_id" className="dropdown" onChange={handleCategoryChange}>
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <select name="subcategory_id" className="dropdown" value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)}>
              <option value="">Select Subcategory</option>
              {filteredSubcategories.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
              ))}
            </select>
            <button type="submit" className="submit-button">Search</button>
          </form>
        )}
      
        <GoogleMaps onLocationChange={handleLocationChange} markers={store.searchedProducts.concat(store.searchedServices)} />
        
        {specificSearch ? (
          <div className="input-container">
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Enter item name..." />
            <button onClick={handleSearch} className="search-button">Search</button>
            <div className="item-list">
              {renderItems(store.searchedProducts, true)}
              {renderItems(store.searchedServices, false)}
            </div>
          </div>
        ) : (
          <div className="item-list">
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
    
        {selectedItem && (
          <TradeProposal
            show={showTradeProposal}
            handleClose={handleCloseTradeProposal}
            itemToTrade={selectedItem}
            itemType={selectedItemType}
          />
        )}
      </div>
    );}
    
    export default Search;
    