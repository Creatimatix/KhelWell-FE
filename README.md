# KhelWell Frontend

**Your Game. Your Journey. All in One Place**

A modern React-based frontend application for the KhelWell sports platform.

## 🚀 Features

- **Modern UI/UX**: Beautiful, responsive design with Material-UI
- **User Authentication**: Login, registration, and OTP verification
- **Turf Booking**: Complete booking workflow with slot selection
- **Event Management**: Browse and register for sports events
- **Dashboard**: Role-based dashboards for users, owners, and admins
- **Real-time Updates**: Live booking status and notifications
- **Mobile Responsive**: Optimized for all device sizes
- **TypeScript**: Full TypeScript support for better development experience

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Modern web browser

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd KhelWell-Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=http://localhost:5001/api
   REACT_APP_NAME=KhelWell
   REACT_APP_VERSION=1.0.0
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout component
│   ├── PrivateRoute.tsx # Route protection
│   └── ...
├── pages/              # Page components
│   ├── HomePage.tsx    # Landing page
│   ├── LoginPage.tsx   # Authentication pages
│   ├── user/           # User-specific pages
│   ├── admin/          # Admin pages
│   └── owner/          # Owner pages
├── context/            # React context providers
│   └── AuthContext.tsx # Authentication context
├── services/           # API service functions
│   └── authService.ts  # Authentication services
├── types/              # TypeScript type definitions
│   └── index.ts        # Main type definitions
└── App.tsx             # Main application component
```

## 🎨 UI Components

### Core Components:
- **Layout**: Main application layout with navigation
- **PrivateRoute**: Route protection for authenticated users
- **LoadingSpinner**: Loading indicators
- **ErrorBoundary**: Error handling components
- **NotificationBell**: Real-time notifications

### Page Components:
- **HomePage**: Landing page with hero section
- **LoginPage/RegisterPage**: Authentication forms
- **TurfListPage**: Browse available turfs
- **TurfDetailPage**: Detailed turf information and booking
- **EventsPage**: Browse sports events
- **UserDashboard**: User's personal dashboard
- **AdminDashboard**: Admin management interface
- **OwnerDashboard**: Turf owner management

## 🔐 Authentication

The application uses JWT-based authentication with the following features:

- **Login/Register**: User account creation and login
- **OTP Verification**: SMS-based verification with Twilio
- **Role-based Access**: Different interfaces for users, owners, and admins
- **Session Management**: Automatic token refresh and logout
- **Protected Routes**: Secure access to authenticated pages

## 🎯 User Roles

### Regular User:
- Browse and search turfs
- Book turf slots
- Register for events
- View booking history
- Manage profile

### Turf Owner:
- All user features
- Manage owned turfs
- View turf bookings
- Update booking statuses
- Revenue tracking

### Admin:
- All features
- User management
- Turf approval
- Event management
- System analytics

## 🌐 API Integration

The frontend communicates with the backend API through service functions:

### Authentication Services:
- User registration and login
- OTP verification
- Profile management
- Password updates

### Turf Services:
- Fetch available turfs
- Get turf details
- Create bookings
- Manage bookings

### Event Services:
- Browse events
- Event registration
- Event management (admin)

### Admin Services:
- User management
- Turf approval
- Analytics data

## 🎨 Styling & Theming

- **Material-UI (MUI)**: Modern component library
- **Custom Theme**: Branded color scheme and typography
- **Responsive Design**: Mobile-first approach
- **Dark/Light Mode**: Theme switching capability
- **Animations**: Smooth transitions and micro-interactions

## 🚀 Deployment

### Build for Production:
```bash
npm run build
```

### Vercel Deployment:
1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel --prod`

### Environment Variables for Production:
```env
REACT_APP_API_URL=https://your-backend-api.vercel.app/api
REACT_APP_NAME=KhelWell
REACT_APP_VERSION=1.0.0
```

## 🛠️ Development

### Available Scripts:
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Development Tools:
- **TypeScript**: Type safety and better IDE support
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **React Developer Tools**: Browser extension for debugging

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience
- **Tablet**: Touch-optimized interface
- **Mobile**: Mobile-first design with touch gestures

## 🔧 Configuration

### Environment Variables:
- `REACT_APP_API_URL`: Backend API endpoint
- `REACT_APP_NAME`: Application name
- `REACT_APP_VERSION`: Application version

### Build Configuration:
- **Public URL**: Configured for root deployment
- **Asset Optimization**: Automatic optimization
- **Service Worker**: PWA capabilities ready

## 🧪 Testing

### Testing Strategy:
- **Unit Tests**: Component testing with Jest
- **Integration Tests**: API integration testing
- **E2E Tests**: End-to-end testing with Cypress

### Running Tests:
```bash
npm test          # Run unit tests
npm run test:e2e  # Run E2E tests
```

## 📊 Performance

### Optimization Features:
- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Optimized image loading
- **Caching**: Browser caching strategies
- **Bundle Analysis**: Webpack bundle analyzer

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

## 📄 License

This project is licensed under the MIT License.

---

**KhelWell - Your Game. Your Journey. All in One Place** 