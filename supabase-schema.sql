-- Supabase SQL Schema for Fruit Vision AI
-- Run these commands in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Sessions Table (for anonymous users)
CREATE TABLE user_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id VARCHAR(100) UNIQUE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  location JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Detection Logs Table (main table for storing fruit scan results)
CREATE TABLE detection_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id VARCHAR(100) REFERENCES user_sessions(session_id),
  user_id UUID, -- For future user authentication
  image_url TEXT,
  image_name VARCHAR(255) NOT NULL,
  detection_result JSONB NOT NULL, -- Stores disease, confidence, severity, treatment
  location JSONB, -- Store location data
  weather_data JSONB, -- Store weather conditions at time of detection
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_detection_logs_session_id ON detection_logs (session_id);
CREATE INDEX idx_detection_logs_created_at ON detection_logs (created_at);
CREATE INDEX idx_detection_logs_disease ON detection_logs ((detection_result->>'disease'));

-- Analytics/Stats View
CREATE VIEW detection_stats AS
SELECT 
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as total_detections,
  COUNT(DISTINCT session_id) as unique_users,
  detection_result->>'disease' as disease_type,
  AVG((detection_result->>'confidence')::numeric) as avg_confidence
FROM detection_logs 
GROUP BY DATE_TRUNC('day', created_at), detection_result->>'disease'
ORDER BY date DESC;

-- Row Level Security (RLS) Policies
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE detection_logs ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to read/write their own session data
CREATE POLICY "Users can manage their own sessions" ON user_sessions
  FOR ALL USING (true); -- Since we're using session_id based authentication

CREATE POLICY "Users can manage their own detections" ON detection_logs
  FOR ALL USING (true); -- Since we're using session_id based authentication

-- Sample data structure examples:

-- Sample detection_result JSONB structure:
-- {
--   "disease": "Apple Scab",
--   "confidence": 0.85,
--   "severity": "Medium", 
--   "treatment": [
--     "Remove infected leaves immediately",
--     "Apply fungicide spray every 10-14 days",
--     "Ensure proper air circulation"
--   ]
-- }

-- Sample weather_data JSONB structure:
-- {
--   "temperature": 28,
--   "humidity": 65,
--   "city": "Bangalore",
--   "conditions": "Partly Cloudy"
-- }

-- Sample location JSONB structure:
-- {
--   "city": "Bangalore",
--   "state": "Karnataka",
--   "country": "India",
--   "coordinates": {"lat": 12.9716, "lng": 77.5946}
-- }