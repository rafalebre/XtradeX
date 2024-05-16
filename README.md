# X-trade-X

## Description
X-trade-X is a bartering application that allows users to advertise products and services for exchange with other users' advertised products and services. The app integrates functionalities such as Google Maps and a currency conversion API, providing a robust and interactive platform for both local and online exchanges.

## Motivation
This project was developed as a final capstone project for a full stack web development bootcamp. The main idea was to demonstrate the skills I learned during the course. The app was designed to help people dispose of items they no longer use or to acquire items they need, without the need to throw things away or buy new, promoting a sustainable way of acquiring goods and services.

## Features
- **User Registration:** Users can register and set up their personal profiles.
- **Item and Service Listings:** Users can list items and services, categorizing them into various categories and subcategories.
- **Local and Online Exchange Options:** Both physical and online services are supported.
- **Interactive Map Integration:** Listings reflect the search area on the map, with pins also appearing in the results list.
- **Currency Conversion:** Users can convert the value of items into their local currency.
- **Trade Proposals:** Users must have registered items or services to propose a trade, enhancing site interaction.
- **Advanced Search Options:** Users can search by selecting specific products or services, categories, and subcategories.
- **Wishlist and Favorites:** Users can create a wishlist and favorite items for future reference.
- **User Dashboard:** Allows for modification or deletion of posted items and services.
- **Trade Management:** Tracks sent and received trade proposals with status updates.

## Technologies Used
- **Front-End:** React with Flux and Context, CSS
- **Back-End:** Python Flask API
- **Database:** MySQL
- Additional integrations include Google Maps API and Exchange Rate API.

## Installation and Setup
### Backend Setup:
- Install Python 3.8, Pipenv, and a database engine (PostgreSQL recommended).
- Install Python packages: `pipenv install`
- Create a `.env` file from the template: `cp .env.example .env`
- Set up your database and update the `DATABASE_URL` in the `.env` file.
- Run migrations: `pipenv run migrate` and `pipenv run upgrade`
- Start the application: `pipenv run start`

### Frontend Setup:
- Ensure Node.js (version 14+) is installed.
- Install npm packages: `npm install`
- Start the development server: `npm run start`

## Note on Development
This project was developed six months after my first contact with programming, and it still contains some errors, including in the use of colors and visual standards. That is why I am redesigning it from scratch in a new project.

## Contributing
This project was primarily developed to demonstrate my capabilities and to fulfill graduation requirements from the coding bootcamp. It serves as a showcase of my skills, and I am currently working on an improved version of this project; hence it is not open for external contributions.

## License
This project is not currently under any specific open source license.

## Contact
This project is a demonstration of my skills for potential employment opportunities and is not intended for public contributions.

## Project Visuals
Below are some visual representations of the X-trade-X app. These images provide a look at the app's interface and functionality without the need to run it locally:

![Home Screen](XtradeX%20images/Home.png)

![Add a service](XtradeX%20images/AddService.png)

![Add a product](XtradeX%20images/AddProduct.png)

![Search Results](XtradeX%20images/Search.png)

![Trade Proposal](XtradeX%20images/TradeProposal.png)

![Trade Proposal Details](XtradeX%20images/TradeProposalDetails.png)

These images offer a glimpse into the various features and capabilities of the app, illustrating the user-friendly design and interactive elements.
