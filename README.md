# National Park Ranker

A web application that helps outdoor enthusiasts discover, compare, and rank national parks based on various features and personal preferences.

## 📋 Overview

National Park Ranker allows users to explore U.S. National Parks, view detailed information about each park, and create personalized rankings based on criteria that matter most to them. Whether you're planning your next adventure or simply curious about America's natural treasures, this app provides an interactive way to engage with national park data.

## ✨ Features

- **Browse Parks**: Explore a comprehensive database of U.S. National Parks
- **Detailed Park Information**: View descriptions, location data, amenities, and attractions for each park
- **Custom Rankings**: Create personalized rankings based on your preferred criteria
- **Comparison Tool**: Compare multiple parks side by side
- **User Accounts**: Save your preferences and rankings
- **Responsive Design**: Enjoy a seamless experience across desktop and mobile devices

## 🛠️ Technologies

- **Frontend**: React.js
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT
- **APIs**: National Park Service API
- **Deployment**: Heroku

## 🚀 Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- MongoDB (local or Atlas connection)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Yashasvi-Khatri/NationalParkRanker.git
   cd NationalParkRanker
   ```

2. Install dependencies:
   ```bash
   # Install server dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NPS_API_KEY=your_national_park_service_api_key
   ```

4. Start the development server:
   ```bash
   # Run both client and server concurrently
   npm run dev
   
   # Or run separately
   npm run server
   npm run client
   ```

5. Open your browser and navigate to `http://localhost:3000`

## 📱 Usage

### Creating an Account

1. Click on "Sign Up" in the navigation bar
2. Enter your email and password
3. Verify your email address (if enabled)

### Browsing Parks

1. Navigate to the "Parks" section
2. Use filters to narrow down by state, features, or activities
3. Click on any park to view detailed information

### Creating a Custom Ranking

1. Go to "Create Ranking" in the main menu
2. Select your preferred criteria (e.g., scenic beauty, hiking trails, accessibility)
3. Adjust the weights for each criterion
4. View your personalized park rankings
5. Save your ranking for future reference

## 🤝 Contributing

We welcome contributions to the National Park Ranker project! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the project's coding standards and includes appropriate tests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Data provided by the [National Park Service API](https://www.nps.gov/subjects/developer/api-documentation.htm)
- Icons by [FontAwesome](https://fontawesome.com/)
- [React.js](https://reactjs.org/) and the open-source community

## 📞 Contact

Yashasvi Khatri - [GitHub](https://github.com/Yashasvi-Khatri)

Project Link: [https://github.com/Yashasvi-Khatri/NationalParkRanker](https://github.com/Yashasvi-Khatri/NationalParkRanker)
