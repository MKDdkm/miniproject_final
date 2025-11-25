import { createClient } from '@supabase/supabase-js'

// Supabase configuration
// Vite uses import.meta.env instead of process.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://aeakqwqaymfouyamlcmc.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface DetectionLog {
  id?: string
  user_id?: string
  session_id: string
  image_url?: string
  image_name: string
  detection_result: {
    disease: string
    confidence: number
    severity: string
    treatment: string[]
  }
  location?: string
  weather_data?: {
    temperature?: number
    humidity?: number
    city?: string
  }
  created_at?: string
}

export interface UserSession {
  id?: string
  session_id: string
  ip_address?: string
  user_agent?: string
  location?: string
  created_at?: string
}

// Database service functions
export class DatabaseService {
  
  // Log fruit detection result
  static async logDetection(detectionData: Omit<DetectionLog, 'id' | 'created_at'>): Promise<DetectionLog | null> {
    try {
      // First, ensure the session exists in user_sessions table
      const sessionData = {
        session_id: detectionData.session_id,
        ip_address: null,
        user_agent: navigator.userAgent,
        location: null
      }

      // Insert or update session (upsert)
      await supabase
        .from('user_sessions')
        .upsert([sessionData], { 
          onConflict: 'session_id',
          ignoreDuplicates: false 
        })

      // Now insert the detection log
      const { data, error } = await supabase
        .from('detection_logs')
        .insert([detectionData])
        .select()
        .single()

      if (error) {
        console.error('Error logging detection:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Database error:', error)
      return null
    }
  }

  // Get user's detection history
  static async getDetectionHistory(sessionId: string, limit: number = 10): Promise<DetectionLog[]> {
    try {
      const { data, error } = await supabase
        .from('detection_logs')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching history:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Database error:', error)
      return []
    }
  }

  // Get detection statistics
  static async getDetectionStats(): Promise<{
    total_detections: number
    diseases_found: { disease: string; count: number }[]
    recent_detections: DetectionLog[]
  } | null> {
    try {
      // Get total detections count
      const { count: totalCount } = await supabase
        .from('detection_logs')
        .select('*', { count: 'exact', head: true })

      // Get recent detections
      const { data: recentData, error: recentError } = await supabase
        .from('detection_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      if (recentError) {
        console.error('Error fetching recent detections:', recentError)
        return null
      }

      // Process disease statistics from recent data
      const diseaseMap = new Map<string, number>()
      recentData?.forEach(log => {
        const disease = log.detection_result.disease
        diseaseMap.set(disease, (diseaseMap.get(disease) || 0) + 1)
      })

      const diseasesFound = Array.from(diseaseMap.entries()).map(([disease, count]) => ({
        disease,
        count
      }))

      return {
        total_detections: totalCount || 0,
        diseases_found: diseasesFound,
        recent_detections: recentData || []
      }
    } catch (error) {
      console.error('Database error:', error)
      return null
    }
  }

  // Create or update user session
  static async createSession(sessionData: Omit<UserSession, 'id' | 'created_at'>): Promise<UserSession | null> {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .insert([sessionData])
        .select()
        .single()

      if (error) {
        console.error('Error creating session:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Database error:', error)
      return null
    }
  }
}

// Generate unique session ID for anonymous users
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Get or create session ID from localStorage
export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('fruit-vision-session-id')
  
  if (!sessionId) {
    sessionId = generateSessionId()
    localStorage.setItem('fruit-vision-session-id', sessionId)
  }
  
  return sessionId
}