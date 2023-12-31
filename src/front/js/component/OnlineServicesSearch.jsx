import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import TradeProposal from './TradeProposal.jsx';
import "./OnlineServicesSearch.css";

const OnlineServicesSearch = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [specificSearch, setSpecificSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { store, actions } = useContext(Context);
  const [showTradeProposalModal, setShowTradeProposalModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  useEffect(() => {
    actions.getServiceCategories();
  }, []);

  const handleProposeDeal = (service) => {
    setSelectedService(service);
    setShowTradeProposalModal(true);
  };

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

  const handleExpandDescription = (serviceId) => {
    setExpandedDescriptions((prevState) => ({
      ...prevState,
      [serviceId]: !prevState[serviceId]
    }));
  };

  return (
    <div className="online-search-container">
      <button className="search-btn" onClick={handleSpecificSearchToggle}>
        Specific Item Search
      </button>

      {specificSearch ? (
        <div className="input-container">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter item name..."
            className="dropdown-input"
          />
          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>
      ) : (
        <form className="category-form" onSubmit={handleSearch}>
          <select className="dropdown-input" value={selectedCategory} onChange={handleCategoryChange}>
            <option value="">Select Category</option>
            {store.serviceCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select className="dropdown-input" value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)}>
            <option value="">Select Subcategory</option>
            {filteredSubcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>
          <button className="search-btn" type="submit">
            Search
          </button>
        </form>
      )}

      <div className="online-list">
        {store.onlineServices.map((service, index) => (
          <div key={index} className="online-card">
            <div className="card-content">
              <h3>{service.name}</h3>
              <p className={`description ${expandedDescriptions[service.id] ? 'expanded' : ''}`}>
                {service.description}
              </p>
              {service.description.length > 100 && (
                <button
                  className="see-more-btn"
                  onClick={() => handleExpandDescription(service.id)}
                >
                  {expandedDescriptions[service.id]}
                </button>
              )}
            </div>
            <div className="card-action">
              <p>{service.currency} {service.estimated_value}</p>
              <button className="propose-btn" onClick={() => handleProposeDeal(service)}>Propose a Deal</button>
            </div>
          </div>
        ))}
      </div>

      {showTradeProposalModal && (
        <TradeProposal
          show={showTradeProposalModal}
          handleClose={() => setShowTradeProposalModal(false)}
          itemToTrade={selectedService}
          itemType="service"
        />
      )}
    </div>
  );
};

export default OnlineServicesSearch;
