# Tor Store

A secure online marketplace for printed materials like business cards, flyers, brochures, posters, and stickers. This application is designed to work over the Tor network and accepts Bitcoin payments for enhanced privacy.

## Features

- Anonymous browsing without tracking
- Bitcoin payment processing
- Product categories: business cards, flyers, brochures, posters, stickers, and more
- Customizable product options
- Order tracking system
- No account required for purchasing
- Secure checkout process
- Responsive design for all devices

## Tech Stack

- **Frontend**: React.js, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Payment**: Bitcoin

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/tor-store.git
   cd tor-store
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```

4. Create a `.env` file in the backend directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/tor-store
   JWT_SECRET=your_jwt_secret_key_here
   BITCOIN_API_KEY=your_bitcoin_payment_processor_api_key
   BITCOIN_API_SECRET=your_bitcoin_payment_processor_api_secret
   ```

## Running the Application

1. Start the backend server:
   ```
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```
   cd frontend
   npm start
   ```

3. Seed the database with sample data:
   ```
   cd backend
   node seeder.js
   ```
   
   To clear the database:
   ```
   node seeder.js -d
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Deployment on Tor

For deploying as a Tor hidden service, follow these additional steps:

1. Install Tor on your server
2. Configure a hidden service in your torrc file
3. Point the hidden service to your local Node.js server
4. Share your .onion address with trusted users

## Security Considerations

- All user data is minimized and encrypted
- No personal information is stored unless necessary for shipping
- Bitcoin transactions provide an additional layer of privacy
- No tracking or analytics scripts are used

## License

This project is licensed under the MIT License - see the LICENSE file for details.