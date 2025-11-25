# Fruit Vision AI - Complete Testing Guide

## Quick Start Testing

### 1. Environment Setup
First, follow the `SUPABASE_SETUP.md` instructions to set up your database:

1. Create Supabase account at https://supabase.com
2. Create new project
3. Run the SQL schema from `supabase-schema.sql`
4. Create `.env.local` with your credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

### 2. Test Multi-Language Support
- Visit the app at http://localhost:5173
- Click the language dropdown in the navbar
- Test switching between: English, ಕನ್ನಡ, हिंदी, తెలుగు
- Verify all UI elements translate correctly

### 3. Test Dark/Light Mode
- Click the theme toggle (sun/moon icon) in the navbar
- Verify theme persists on page refresh
- Test on both desktop and mobile layouts

### 4. Test Disease Detection with Data Storage
1. Go to `/detection` page
2. Upload a fruit image (any image will work for testing)
3. Click "Analyze Image" - should show mock detection results
4. Verify the detection gets saved to database
5. Check "Your Detection History" section - should show the saved result

### 5. Test Analytics Dashboard
1. After creating some detection records (step 4)
2. Go to `/analytics` page
3. Verify you see:
   - Total detection count
   - Disease types found
   - Recent detections list
   - Detection distribution charts

### 6. Test Database Integration
Open your Supabase dashboard and check:
- `user_sessions` table should have session records
- `detection_logs` table should have your test detections
- Data should include all detection details (disease, confidence, treatment, etc.)

## Expected Features Working

✅ **Multi-Language Support**
- 4 languages: English, Kannada, Hindi, Telugu
- Complete UI translation including navigation, buttons, forms
- Language selection dropdown with native names

✅ **Dark/Light Mode**
- Theme toggle button in navbar
- Persistent theme selection (localStorage)
- Proper styling for both themes

✅ **Complete Database Integration**
- Detection result storage in Supabase
- Session management and tracking
- Detection history viewing
- Real-time analytics dashboard

✅ **Analytics Dashboard**
- Detection statistics and counts
- Disease type distribution
- Recent detection timeline
- Visual charts and metrics

## Test Data Examples

The system will create mock data like:
```json
{
  "disease": "Apple Scab",
  "confidence": 0.89,
  "severity": "Medium",
  "treatment": "Apply fungicide spray during early morning...",
  "prevention": "Ensure proper air circulation..."
}
```

## Troubleshooting

### No Data in Analytics
- Make sure you've completed some disease detections first
- Check browser console for any database connection errors
- Verify your Supabase credentials in `.env.local`

### Language Not Switching
- Check if translations are loaded properly
- Verify the language context is working
- Try refreshing the page

### Theme Not Persisting
- Check localStorage in browser dev tools
- Ensure theme context is properly wrapped in App.tsx

### Database Errors
- Verify Supabase URL and keys are correct
- Check if database schema was created properly
- Look for CORS or authentication issues in console

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Next Steps

After testing, you can:
1. Replace mock detection with real AI model
2. Add real-time weather integration
3. Implement user authentication
4. Add more analytics features
5. Deploy to production

The foundation is complete with multi-language support, theming, and full database integration!