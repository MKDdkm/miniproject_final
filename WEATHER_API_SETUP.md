# Weather API Setup Guide

## Get Your FREE OpenWeatherMap API Key

### Step 1: Sign Up
1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Click "Sign Up" (top right)
3. Create a free account with your email

### Step 2: Get API Key
1. After signing up, go to your [API Keys page](https://home.openweathermap.org/api_keys)
2. Copy your default API key
3. It looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

### Step 3: Add to Your Project
1. Open `src/pages/Weather.tsx`
2. Find line 17: `const API_KEY = "your_openweathermap_api_key";`
3. Replace `"your_openweathermap_api_key"` with your actual key
4. Example: `const API_KEY = "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6";`

### Step 4: Enable Real API Calls
Replace the mock API calls with real ones:

```typescript
// In fetchCurrentWeather function, replace:
const mockData = { ... };

// With:
const response = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
const data = await response.json();
```

```typescript  
// In fetchWeatherForecast function, replace:
const today = new Date(); ...

// With:
const response = await fetch(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`);
const data = await response.json();
```

## Free Tier Limits
- ✅ 1,000 API calls per day
- ✅ Current weather data
- ✅ 5-day forecast
- ✅ Global coverage

## Alternative: No API Key Required

For immediate testing, the app currently uses realistic mock data that simulates real weather patterns. This works perfectly for development and demonstration purposes.

## Need Help?
- OpenWeatherMap Documentation: https://openweathermap.org/api
- API Key Issues: Check your dashboard at https://home.openweathermap.org/
- Rate Limiting: Free accounts are limited to 60 calls/minute