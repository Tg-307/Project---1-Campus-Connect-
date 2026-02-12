# 🚀 Quick Setup Guide - Campus Connect Frontend

## Prerequisites Checklist
- [ ] Node.js installed (v16+)
- [ ] Django backend running on http://localhost:8000
- [ ] Backend has CORS enabled

## Setup Steps (5 minutes)

### 1. Install Dependencies
```bash
cd campus-connect-frontend
npm install
```

### 2. Configure Backend (if needed)
Edit `src/services/api.js` line 3 if your backend URL is different:
```javascript
const API_URL = 'http://YOUR_BACKEND_URL/api';
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Open Browser
Navigate to: `http://localhost:3000`

## Django Backend Requirements

Add to your `settings.py`:

```python
# Install: pip install django-cors-headers --break-system-packages

INSTALLED_APPS = [
    # ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    # ...
]

CORS_ALLOW_ALL_ORIGINS = True  # For development
```

## First Time Use

1. Click "Sign Up" to create an account
2. Select your institute
3. Login with your credentials
4. Explore the dashboard!

## Common Issues

**Port 3000 busy?** 
- Vite will automatically use the next available port

**Backend connection error?**
- Ensure Django is running: `python manage.py runserver`
- Check CORS is configured in Django

**Login not working?**
- Verify backend `/api/auth/login/` endpoint works
- Check browser console for errors

## File Structure Overview

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components (Dashboard, Marketplace, Issues)
├── context/        # React Context (Auth)
├── services/       # API communication
└── styles/         # CSS files
```

## Need Help?

1. Check `README.md` for detailed documentation
2. Look at browser console for error messages
3. Verify backend API endpoints are working

---

**You're all set! Start building amazing campus experiences! 🎓**
