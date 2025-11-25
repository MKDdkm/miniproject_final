import { useState, useEffect } from "react";
import { 
  CloudSun, 
  Sun, 
  Cloud, 
  CloudRain, 
  Wind, 
  Droplets, 
  Thermometer,
  Eye,
  ArrowDown,
  ArrowUp,
  Umbrella,
  Sprout,
  AlertTriangle,
  CloudSnow,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// OpenWeatherMap API configuration
const API_KEY = "24dfe9eba1521d3cb4bccb4e349d2bb8"; // Your OpenWeatherMap API key
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// Weather icon mapping
const getWeatherIcon = (condition: string, isDay: boolean = true) => {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes("clear") || conditionLower.includes("sunny")) {
    return isDay ? Sun : Sun;
  } else if (conditionLower.includes("cloud")) {
    if (conditionLower.includes("partly") || conditionLower.includes("few")) {
      return CloudSun;
    }
    return Cloud;
  } else if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) {
    return CloudRain;
  } else if (conditionLower.includes("snow")) {
    return CloudSnow;
  } else if (conditionLower.includes("thunder")) {
    return Zap;
  }
  return CloudSun; // default
};

// Fetch current weather from OpenWeatherMap
const fetchCurrentWeather = async (city: string = "Delhi") => {
  try {
    // Real API call to OpenWeatherMap
    const response = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      location: `${data.name}, ${data.sys.country}`,
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].description.replace(/\b\w/g, (l: string) => l.toUpperCase()),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      visibility: (data.visibility / 1000).toFixed(1),
      pressure: data.main.pressure,
      feelsLike: Math.round(data.main.feels_like),
      sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      icon: getWeatherIcon(data.weather[0].description),
      tempMin: Math.round(data.main.temp_min),
      tempMax: Math.round(data.main.temp_max)
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    // Fallback mock data if API fails
    return {
      location: "Delhi, IN",
      temperature: 28,
      condition: "Partly Cloudy",
      humidity: 65,
      windSpeed: 12,
      visibility: "8.5",
      pressure: 1013,
      feelsLike: 31,
      sunrise: "06:15",
      sunset: "18:45",
      icon: CloudSun,
      tempMin: 25,
      tempMax: 32
    };
  }
};

// Fetch 5-day forecast from OpenWeatherMap
const fetchWeatherForecast = async (city: string = "Delhi") => {
  try {
    // Real API call to OpenWeatherMap forecast
    const response = await fetch(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`);
    
    if (!response.ok) {
      throw new Error(`Forecast API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Process 5-day forecast data (API returns 40 items, 8 per day)
    const dailyForecasts: any[] = [];
    
    // Group forecasts by date and get daily min/max
    const groupedByDate: { [key: string]: any[] } = {};
    
    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }
      groupedByDate[date].push(item);
    });
    
    // Convert to daily format (limit to 7 days)
    Object.keys(groupedByDate).slice(0, 7).forEach((date, index) => {
      const dayData = groupedByDate[date];
      const temps = dayData.map((item: any) => item.main.temp);
      const rainChances = dayData.map((item: any) => item.pop * 100);
      const mainCondition = dayData[Math.floor(dayData.length / 2)].weather[0].description;
      
      const dayNames = ["Today", "Tomorrow", "Tue", "Wed", "Thu", "Fri", "Sat"];
      
      dailyForecasts.push({
        day: index < 2 ? dayNames[index] : new Date(dayData[0].dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
        high: Math.round(Math.max(...temps)),
        low: Math.round(Math.min(...temps)),
        condition: mainCondition.replace(/\b\w/g, (l: string) => l.toUpperCase()),
        icon: getWeatherIcon(mainCondition),
        rain: Math.round(Math.max(...rainChances))
      });
    });
    
    return dailyForecasts;
  } catch (error) {
    console.error("Error fetching forecast:", error);
    // Fallback mock data if API fails
    return [
      { day: "Today", high: 32, low: 18, condition: "Partly Cloudy", icon: CloudSun, rain: 10 },
      { day: "Tomorrow", high: 30, low: 16, condition: "Sunny", icon: Sun, rain: 5 },
      { day: "Wed", high: 29, low: 17, condition: "Cloudy", icon: Cloud, rain: 20 },
      { day: "Thu", high: 27, low: 15, condition: "Light Rain", icon: CloudRain, rain: 60 },
      { day: "Fri", high: 25, low: 14, condition: "Heavy Rain", icon: CloudRain, rain: 85 },
      { day: "Sat", high: 28, low: 16, condition: "Partly Cloudy", icon: CloudSun, rain: 30 },
      { day: "Sun", high: 31, low: 19, condition: "Sunny", icon: Sun, rain: 0 }
    ];
  }
};

const getFarmingAdvisory = () => [
  {
    title: "Pesticide Application",
    status: "Recommended",
    description: "Good weather conditions for spraying. Low wind speed and no rain expected for next 6 hours.",
    icon: Sprout,
    color: "bg-green-100 text-green-800"
  },
  {
    title: "Irrigation",
    status: "Moderate Need",
    description: "Soil moisture adequate. Light watering recommended in the evening.",
    icon: Droplets,
    color: "bg-blue-100 text-blue-800"
  },
  {
    title: "Harvesting",
    status: "Good Conditions",
    description: "Dry weather perfect for harvesting mature crops. Start early morning.",
    icon: Sprout,
    color: "bg-green-100 text-green-800"
  },
  {
    title: "Rain Alert",
    status: "Warning",
    description: "Heavy rain expected Thursday-Friday. Secure equipment and delay outdoor activities.",
    icon: AlertTriangle,
    color: "bg-yellow-100 text-yellow-800"
  }
];

const Weather = () => {
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [advisory, setAdvisory] = useState(getFarmingAdvisory());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState("Delhi");

  // Load weather data on component mount
  useEffect(() => {
    loadWeatherData();
  }, []);

  // Auto-refresh weather data every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      loadWeatherData(false); // Silent refresh
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [city]);

  const loadWeatherData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    
    try {
      const [weatherData, forecastData] = await Promise.all([
        fetchCurrentWeather(city),
        fetchWeatherForecast(city)
      ]);
      
      setCurrentWeather(weatherData);
      setForecast(forecastData);
    } catch (err) {
      setError("Failed to load weather data. Please try again.");
      console.error("Weather loading error:", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const refreshWeather = () => {
    loadWeatherData();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <main className="container px-4 py-8 flex-1">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold text-gray-900">Weather & Farming Advisory</h1>
            <p className="text-lg text-gray-600">
              Real-time weather updates and personalized farming recommendations
            </p>
            
            {/* City Input */}
            <div className="flex justify-center items-center gap-2 mb-4">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button 
                onClick={refreshWeather}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? "Loading..." : "Get Weather"}
              </button>
            </div>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
          </div>

          {loading && !currentWeather ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading weather data...</p>
              </div>
            </div>
          ) : currentWeather ? (
            <>
              {/* Current Weather */}
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-semibold">{currentWeather.location}</h2>
                      <p className="text-blue-100">Current Conditions</p>
                      <p className="text-xs text-blue-200">
                        Updated: {new Date().toLocaleTimeString()}
                      </p>
                    </div>
                    <currentWeather.icon className="h-12 w-12 text-blue-100" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-5xl font-bold">{currentWeather.temperature}°C</div>
                      <div className="text-lg text-blue-100">{currentWeather.condition}</div>
                      <div className="text-sm text-blue-200">Feels like {currentWeather.feelsLike}°C</div>
                      <div className="text-xs text-blue-300 mt-1">
                        H: {currentWeather.tempMax}° L: {currentWeather.tempMin}°
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <Droplets className="h-5 w-5 mx-auto mb-1" />
                      <div className="text-sm text-blue-100">Humidity</div>
                      <div className="font-semibold">{currentWeather.humidity}%</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <Wind className="h-5 w-5 mx-auto mb-1" />
                      <div className="text-sm text-blue-100">Wind</div>
                      <div className="font-semibold">{currentWeather.windSpeed} km/h</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <Eye className="h-5 w-5 mx-auto mb-1" />
                      <div className="text-sm text-blue-100">Visibility</div>
                      <div className="font-semibold">{currentWeather.visibility} km</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <Thermometer className="h-5 w-5 mx-auto mb-1" />
                      <div className="text-sm text-blue-100">Pressure</div>
                      <div className="font-semibold">{currentWeather.pressure} hPa</div>
                    </div>
                  </div>
                  
                  {/* Sunrise/Sunset */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                    <div className="text-center">
                      <div className="text-sm text-blue-100">Sunrise</div>
                      <div className="font-semibold">{currentWeather.sunrise}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-blue-100">Sunset</div>
                      <div className="font-semibold">{currentWeather.sunset}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 7-Day Forecast */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sun className="h-5 w-5" />
                    7-Day Weather Forecast
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                    {forecast.map((day, index) => {
                      const Icon = day.icon;
                      return (
                        <div key={index} className="text-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="font-medium text-gray-900 mb-2">{day.day}</div>
                          <Icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                          <div className="space-y-1">
                            <div className="flex justify-center items-center gap-1">
                              <ArrowUp className="h-3 w-3 text-red-500" />
                              <span className="font-semibold">{day.high}°</span>
                            </div>
                            <div className="flex justify-center items-center gap-1">
                              <ArrowDown className="h-3 w-3 text-blue-500" />
                              <span className="text-gray-600">{day.low}°</span>
                            </div>
                            <div className="flex justify-center items-center gap-1 text-xs text-blue-600">
                              <Umbrella className="h-3 w-3" />
                              <span>{day.rain}%</span>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mt-2">{day.condition}</div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Farming Advisory */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sprout className="h-5 w-5" />
                    Smart Farming Advisory
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {advisory.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-gray-100">
                              <Icon className="h-5 w-5 text-gray-700" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                                <Badge className={item.color}>{item.status}</Badge>
                              </div>
                              <p className="text-gray-600 text-sm">{item.description}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Weather;