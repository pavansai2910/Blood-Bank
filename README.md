# BloodMatch Dashboard

A comprehensive blood and organ donation management system built with React and Node.js.

## Features

- **Dynamic Dashboard**: Real-time statistics and data visualization
- **Donor Management**: Register and manage blood/organ donors
- **Recipient Management**: Track patients in need of donations
- **Request System**: Blood request management with status tracking
- **Matching System**: Intelligent donor-recipient matching
- **Integration Hub**: System integration and data synchronization
- **Admin Panel**: Complete administrative control
- **Real-time Updates**: Live data updates every 30 seconds

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd LifeLink
   ```

2. **Install frontend dependencies**

   ```bash
   npm install
   ```

3. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Set up environment variables**
   Create a `.env` file in the backend directory:

   ```env
   MONGO_URI=mongodb://localhost:27017/organ_donation
   PORT=5050
   JWT_SECRET=your-secret-key
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system.

## Running the Application

### Option 1: Quick Start (Recommended)

```bash
npm run setup
npm run dev
```

### Option 2: Manual Start

1. **Start the backend server**

   ```bash
   cd backend
   npm start
   ```

2. **Start the frontend**

   ```bash
   npm start
   ```

3. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

## Available Scripts

- `npm start` - Start the React frontend
- `npm run dev` - Start both frontend and backend concurrently
- `npm run backend` - Start only the backend server
- `npm run seed` - Clear and prepare the database
- `npm run setup` - Install dependencies and seed database

## Usage

### Accessing the Application

1. **Main Dashboard**: http://localhost:3000/user-dashboard
2. **Admin Panel**: http://localhost:3000/admin-login

### Admin Credentials (Development)

- **Username**: admin
- **Password**: admin123

### Adding Data

1. **Login to Admin Panel**
2. **Add Donors**: Navigate to "Donor Management"
3. **Add Recipients**: Navigate to "Recipient Management"
4. **View Dashboard**: All data will appear dynamically

## API Endpoints

### Donors

- `GET /api/donors` - Get all donors
- `POST /api/donors` - Add new donor

### Recipients

- `GET /api/recipients` - Get all recipients
- `POST /api/recipients` - Add new recipient

### Requests

- `GET /api/requests` - Get all requests
- `POST /api/requests` - Create new request
- `PUT /api/requests/:id` - Update request status

### Notifications

- `GET /api/notifications` - Get all notifications

### Blood Inventory

- `GET /api/bloodinventories` - Get blood inventory

## Database Schema

### Donor

```javascript
{
  name: String,
  age: Number,
  gender: String,
  location: String,
  email: String,
  phone: String,
  donationType: String,
  bloodType: String,
  medicalHistory: String,
  consent1: Boolean,
  consent2: Boolean
}
```

### Recipient

```javascript
{
  name: String,
  age: Number,
  gender: String,
  location: String,
  email: String,
  phone: String,
  organNeeded: String,
  bloodType: String,
  urgency: String,
  medicalHistory: String
}
```

## Features Removed

- ❌ **Hardcoded Data**: All sample data has been removed
- ❌ **Mock Statistics**: Statistics now calculate from real data
- ❌ **Static Notifications**: All notifications come from backend
- ❌ **Fixed Credentials**: Admin login now supports API authentication

## Dynamic Features

- ✅ **Real-time Data**: All data fetched from backend APIs
- ✅ **Live Statistics**: Dashboard stats update automatically
- ✅ **Dynamic Notifications**: Real notification system
- ✅ **API-driven**: No hardcoded data anywhere
- ✅ **Responsive Design**: Works on all devices
- ✅ **Auto-refresh**: Data updates every 30 seconds

## Troubleshooting

### Common Issues

1. **Backend not starting**

   - Check if MongoDB is running
   - Verify port 5050 is available
   - Check environment variables

2. **Frontend not connecting**

   - Ensure backend is running on port 5050
   - Check CORS settings
   - Verify API endpoints

3. **Database issues**
   - Run `npm run seed` to reset database
   - Check MongoDB connection string
   - Verify database permissions

### Development Tips

- Use browser developer tools to monitor API calls
- Check console for error messages
- Verify network connectivity between frontend and backend
- Use MongoDB Compass for database inspection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team.
