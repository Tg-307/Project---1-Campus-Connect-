# Campus Connect - Frontend

A modern, professional React frontend for the Campus Connect platform - a comprehensive campus management system for colleges with hostels.

## 🎨 Features

- **Modern UI/UX**: Eye-catching design with smooth animations using Framer Motion
- **Responsive Design**: Works seamlessly on both mobile and desktop
- **Authentication**: JWT-based authentication with login and registration
- **Marketplace**: Buy and sell items within your campus community
- **Issue Reporting**: Report and track campus-related issues
- **Real-time Notifications**: Stay updated with notification system
- **Institute-Specific**: Content filtered by user's institute

## 🚀 Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **Framer Motion** - Smooth animations
- **React Icons** - Beautiful icon library
- **React Toastify** - Toast notifications
- **Date-fns** - Date formatting utilities

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Django Backend** running on `http://localhost:8000`

## 🛠️ Installation & Setup

### Step 1: Extract the Files

Extract the `campus-connect-frontend` folder to your desired location.

### Step 2: Install Dependencies

Open a terminal in the project directory and run:

```bash
npm install
```

Or if you're using yarn:

```bash
yarn install
```

### Step 3: Configure Backend URL

The frontend is configured to connect to the Django backend at `http://localhost:8000`. 

If your backend runs on a different URL, update the `API_URL` in:
- `src/services/api.js` (line 3)

### Step 4: Start the Development Server

```bash
npm run dev
```

Or with yarn:

```bash
yarn dev
```

The application will start on `http://localhost:3000`

### Step 5: Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

You'll be redirected to the login page.

## 🔧 Backend Setup Requirements

Make sure your Django backend is running with:

1. **CORS enabled** - Install and configure `django-cors-headers`
2. **Media files serving** - Configure `MEDIA_URL` and `MEDIA_ROOT`
3. **Required endpoints** available at `/api/`:
   - `/api/auth/login/` - Login endpoint
   - `/api/auth/register/` - Registration endpoint
   - `/api/auth/me/` - Get current user
   - `/api/institutes/` - List institutes
   - `/api/listings/` - Marketplace listings
   - `/api/orders/` - Orders
   - `/api/issues/` - Issues
   - `/api/notifications/` - Notifications

### Django CORS Configuration

Add to your Django `settings.py`:

```python
INSTALLED_APPS = [
    # ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    # ... other middleware
]

# Allow frontend to make requests
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

# Or for development, allow all:
CORS_ALLOW_ALL_ORIGINS = True
```

Install django-cors-headers:
```bash
pip install django-cors-headers --break-system-packages
```

## 📱 Using the Application

### First Time Setup

1. **Register**: Click "Sign Up" and fill in your details
   - Select your institute from the dropdown
   - Choose your role (Student/Faculty/Staff)
   
2. **Login**: Use your credentials to log in

3. **Explore**:
   - **Dashboard**: View overview of marketplace and orders
   - **Marketplace**: Browse and search for items
   - **Issues**: Report and view campus issues
   - **Notifications**: Check updates in the notification bell

### Features Walkthrough

#### Marketplace
- Browse all available items in your institute
- Search by title
- Filter by category
- View item details including price, seller, and description

#### Issues
- View all reported issues
- Filter by status (Open, In Progress, Resolved)
- See issue priority and category
- Track issue resolution timeline

#### Notifications
- Real-time notifications in the navbar
- Mark notifications as read
- Delete unwanted notifications
- Auto-refresh every 30 seconds

## 🏗️ Project Structure

```
campus-connect-frontend/
├── public/              # Static files
├── src/
│   ├── components/      # Reusable components
│   │   └── layout/      # Layout components (Navbar, NotificationBell)
│   ├── context/         # React Context (AuthContext)
│   ├── pages/           # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Marketplace.jsx
│   │   └── Issues.jsx
│   ├── services/        # API services
│   │   └── api.js
│   ├── styles/          # CSS files
│   │   ├── global.css
│   │   ├── Auth.css
│   │   ├── Dashboard.css
│   │   ├── Marketplace.css
│   │   ├── Issues.css
│   │   └── Layout.css
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── README.md           # This file
```

## 🎨 Design Features

- **Modern Dark Theme**: Professional dark color scheme
- **Gradient Accents**: Eye-catching gradient highlights
- **Smooth Animations**: Framer Motion powered transitions
- **Custom Fonts**: Playfair Display & Outfit fonts
- **Glassmorphism**: Modern frosted glass effects
- **Responsive Grid Layouts**: Adapts to all screen sizes
- **Interactive Elements**: Hover effects and micro-interactions

## 🚀 Building for Production

To create a production build:

```bash
npm run build
```

The optimized files will be in the `dist/` folder.

To preview the production build:

```bash
npm run preview
```

## 🐛 Troubleshooting

### Port Already in Use
If port 3000 is busy, Vite will automatically use the next available port (3001, 3002, etc.)

### Backend Connection Issues
- Ensure Django backend is running on `http://localhost:8000`
- Check CORS configuration in Django
- Verify API endpoints are accessible

### Authentication Issues
- Clear browser localStorage
- Check if backend JWT tokens are being generated correctly
- Verify the `/api/auth/` endpoints

### Image Loading Issues
- Ensure Django `MEDIA_URL` and `MEDIA_ROOT` are configured
- Check if images are being served correctly by Django

### Categories Not Showing
If categories are not appearing in the marketplace:
1. **Check if categories exist in database**: Run in Django shell:
   ```python
   from marketplace.models import Category
   print(Category.objects.all())
   ```
2. **Verify API endpoint**: Visit `http://localhost:8000/api/categories/` in browser
3. **Check browser console**: Open DevTools and look for any error messages
4. **Verify you're logged in**: Categories are only visible to authenticated users

### Register Page Not Loading
If the register page is blank:
1. Check browser console for errors
2. Ensure institutes exist in database
3. Verify `/api/institutes/` endpoint is accessible

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔐 Environment Variables

You can create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8000/api
```

Then update `src/services/api.js` to use:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
```

## 🤝 Contributing

This project follows modern React best practices:
- Functional components with hooks
- Context API for state management
- Axios interceptors for auth
- Responsive design principles

## 📄 License

This project is part of the Campus Connect platform.

## 💡 Tips

1. **Hot Reload**: Changes are reflected instantly during development
2. **DevTools**: Use React DevTools browser extension for debugging
3. **Network Tab**: Monitor API requests in browser DevTools
4. **Console**: Check console for error messages

## 🎯 Next Steps

After setup, you can:
1. Create test listings in the marketplace
2. Report sample issues
3. Test the notification system
4. Explore the responsive design on mobile

## 📞 Support

For issues or questions:
1. Check the browser console for errors
2. Verify backend is running and accessible
3. Ensure all dependencies are installed
4. Check CORS configuration

---

**Happy Coding! 🚀**
