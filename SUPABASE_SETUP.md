# Supabase Setup Instructions for Fruit Vision AI

## 🚀 Quick Setup Guide

### Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" and sign up
3. Create a new project (choose a region close to your users)

### Step 2: Set up Database
1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste the contents of `supabase-schema.sql`
3. Click "Run" to create the tables and indexes

### Step 3: Get API Credentials
1. Go to **Settings** → **API**
2. Copy your **Project URL** and **anon public** key
3. Create `.env.local` file in your project root:

```bash
# Copy .env.example to .env.local and update with your credentials
cp .env.example .env.local
```

### Step 4: Configure Environment Variables
Edit `.env.local` with your Supabase credentials:

```env
REACT_APP_SUPABASE_URL=https://your-project-ref.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 5: Test the Integration
1. Start your development server: `npm run dev`
2. Go to Disease Detection page
3. Upload and analyze a fruit image
4. Check your Supabase dashboard → **Table Editor** → `detection_logs`
5. You should see the detection result saved!

## 📊 Database Schema Overview

### Tables Created:

#### 1. `user_sessions`
- Tracks anonymous user sessions
- Stores session ID, IP, user agent, location
- Used for associating detections with users

#### 2. `detection_logs`
- **Main table** for storing fruit scan results
- Fields:
  - `session_id`: Links to user session
  - `image_name`: Name of uploaded image
  - `detection_result`: JSON with disease, confidence, severity, treatment
  - `location`: User's GPS coordinates (if available)
  - `weather_data`: Weather conditions at time of scan
  - `created_at`: Timestamp of detection

#### 3. `detection_stats` (View)
- Aggregated analytics data
- Shows daily detection counts, unique users, disease types
- Used for dashboard analytics

## 🔍 What Gets Stored When User Scans Fruit

Each time a user uploads and analyzes a fruit image, the following data is saved:

```json
{
  "session_id": "session_1732520400_abc123xyz",
  "image_name": "detection_1732520400123.jpg",
  "detection_result": {
    "disease": "Apple Scab",
    "confidence": 0.85,
    "severity": "Medium",
    "treatment": [
      "Remove infected leaves immediately",
      "Apply fungicide spray every 10-14 days",
      "Ensure proper air circulation"
    ]
  },
  "location": {
    "latitude": 12.9716,
    "longitude": 77.5946,
    "accuracy": 100
  },
  "weather_data": {
    "city": "Bangalore",
    "timestamp": "2025-11-25T10:30:00Z"
  },
  "created_at": "2025-11-25T10:30:00Z"
}
```

## 📈 Features Added

### 1. **Detection History**
- Users can view their past 10 detections
- Shows disease name, confidence, severity, timestamp
- Includes treatment recommendations

### 2. **Session Tracking**
- Anonymous users get unique session IDs
- Session persists in localStorage
- All detections linked to session

### 3. **Location Integration**
- Optional GPS coordinates capture
- Helps with regional disease mapping

### 4. **Real-time Saving**
- Detection results saved immediately after analysis
- Visual feedback during save process

## 🛠 Advanced Configuration

### Custom Analytics
You can query the database for insights:

```sql
-- Most common diseases detected
SELECT 
  detection_result->>'disease' as disease,
  COUNT(*) as occurrences
FROM detection_logs 
GROUP BY detection_result->>'disease'
ORDER BY occurrences DESC;

-- Detection accuracy over time
SELECT 
  DATE_TRUNC('day', created_at) as date,
  AVG((detection_result->>'confidence')::numeric) as avg_confidence
FROM detection_logs 
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;
```

### Row Level Security
The database includes RLS policies for security:
- Users can only access their own detection data
- Anonymous access controlled by session IDs

## 🔧 Troubleshooting

### Common Issues:

1. **Database connection error**
   - Check your `.env.local` file
   - Verify Supabase URL and key are correct

2. **Detection not saving**
   - Check browser console for errors
   - Verify tables exist in Supabase dashboard

3. **History not loading**
   - Check if session ID is properly generated
   - Verify RLS policies are enabled

### Debug Mode:
Check browser console logs for detailed error messages and API responses.

## 🎯 Next Steps

With this setup, you can:
1. **Build Analytics Dashboard**: Show detection trends, popular diseases
2. **Add User Authentication**: Convert sessions to real user accounts  
3. **Export Data**: Allow users to download their detection history
4. **Regional Insights**: Map disease patterns by location
5. **Notification System**: Alert users about disease outbreaks in their area

Your Fruit Vision AI now has a complete backend for storing and analyzing fruit detection data! 🎉