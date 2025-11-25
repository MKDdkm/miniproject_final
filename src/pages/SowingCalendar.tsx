import { useState, useEffect } from "react";
import { 
  Calendar, 
  Sprout, 
  Clock, 
  MapPin,
  Thermometer,
  Droplets,
  Sun,
  Leaf,
  CheckCircle,
  AlertCircle,
  Info,
  Download
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Real fruit planting data for different regions of India
const fruitCalendarData = {
  monsoon: {
    season: "Monsoon Fruits",
    period: "June - September",
    description: "Ideal planting time for monsoon-loving fruit trees",
    crops: [
      {
        name: "Mango",
        sowingTime: "June - August",
        harvestTime: "March - June (next year)",
        duration: "2 years to fruit",
        soilTemp: "25-35°C",
        rainfall: "750-1200mm",
        varieties: ["Alphonso", "Dasheri", "Langra", "Chausa"],
        regions: ["Maharashtra", "Uttar Pradesh", "Karnataka", "Andhra Pradesh"],
        tips: [
          "Plant grafted saplings for better yield",
          "Ensure proper drainage to prevent root rot",
          "Apply organic manure during planting",
          "Protect young plants from strong winds"
        ],
        currentStatus: "Prime planting season"
      },
      {
        name: "Guava",
        sowingTime: "June - September",
        harvestTime: "December - March",
        duration: "2 years to fruit",
        soilTemp: "20-30°C",
        rainfall: "1000-1500mm",
        varieties: ["Allahabad Safeda", "Lucknow 49", "Chittidar", "Apple Guava"],
        regions: ["Uttar Pradesh", "Bihar", "Maharashtra", "Punjab"],
        tips: [
          "Choose well-drained sandy loam soil",
          "Maintain 5-6 meter spacing between plants",
          "Regular pruning for better shape",
          "Control fruit fly during fruiting"
        ],
        currentStatus: "Excellent planting window"
      },
      {
        name: "Papaya",
        sowingTime: "June - August",
        harvestTime: "10-12 months",
        duration: "10-12 months to fruit",
        soilTemp: "25-30°C",
        rainfall: "1200-1500mm",
        varieties: ["Red Lady", "Taiwan", "Coorg Honey Dew", "Pusa Majesty"],
        regions: ["Karnataka", "Andhra Pradesh", "Tamil Nadu", "Kerala"],
        tips: [
          "Plant in raised beds for drainage",
          "Maintain 2.5m x 2.5m spacing",
          "Provide wind protection",
          "Regular watering but avoid waterlogging"
        ],
        currentStatus: "Active planting period"
      }
    ]
  },
  winter: {
    season: "Winter Fruits",
    period: "November - February",
    description: "Cold season fruit planting and citrus cultivation",
    crops: [
      {
        name: "Orange",
        sowingTime: "November - January",
        harvestTime: "December - February (next year)",
        duration: "2 years to fruit",
        soilTemp: "13-35°C",
        rainfall: "1200-1500mm",
        varieties: ["Nagpur Orange", "Coorg Orange", "Jaffa", "Valencia"],
        regions: ["Maharashtra", "Karnataka", "Punjab", "Himachal Pradesh"],
        tips: [
          "Choose sunny location with morning sun",
          "Maintain 6m x 6m spacing for full-grown trees",
          "Apply citrus-specific fertilizers",
          "Control citrus canker and leaf miner"
        ],
        currentStatus: "Current planting season"
      },
      {
        name: "Apple",
        sowingTime: "December - February",
        harvestTime: "August - October",
        duration: "2 years to fruit",
        soilTemp: "7-24°C",
        rainfall: "1000-1250mm",
        varieties: ["Red Delicious", "Golden Delicious", "Granny Smith", "Gala"],
        regions: ["Himachal Pradesh", "Jammu & Kashmir", "Uttarakhand"],
        tips: [
          "Requires chilling hours (below 7°C)",
          "Plant in well-drained mountain slopes",
          "Ensure cross-pollination varieties",
          "Protection from late spring frost"
        ],
        currentStatus: "Optimal transplanting time"
      },
      {
        name: "Grapes",
        sowingTime: "December - January",
        harvestTime: "February - April",
        duration: "2 years to fruit",
        soilTemp: "15-35°C",
        rainfall: "650-750mm",
        varieties: ["Thompson Seedless", "Bangalore Blue", "Anab-e-Shahi", "Sharad Seedless"],
        regions: ["Maharashtra", "Karnataka", "Andhra Pradesh", "Tamil Nadu"],
        tips: [
          "Install proper trellising system",
          "Maintain 3m x 3m vine spacing",
          "Regular pruning for better fruiting",
          "Control downy mildew and powdery mildew"
        ],
        currentStatus: "Prime planting window"
      }
    ]
  },
  summer: {
    season: "Summer Fruits",
    period: "March - May",
    description: "Heat-tolerant fruits and irrigation-dependent cultivation",
    crops: [
      {
        name: "Watermelon",
        sowingTime: "February - April",
        harvestTime: "May - July",
        duration: "90-100 days",
        soilTemp: "25-35°C",
        rainfall: "Irrigation required",
        varieties: ["Sugar Baby", "Crimson Sweet", "Charleston Gray", "Kiran"],
        regions: ["Uttar Pradesh", "Punjab", "Haryana", "Rajasthan"],
        tips: [
          "Prepare raised beds for drainage",
          "Provide support for heavy fruits",
          "Regular irrigation but avoid waterlogging",
          "Control fruit fly and aphids"
        ],
        currentStatus: "Peak planting season"
      },
      {
        name: "Muskmelon",
        sowingTime: "February - March",
        harvestTime: "May - June", 
        duration: "90-120 days",
        soilTemp: "25-30°C",
        rainfall: "Drip irrigation preferred",
        varieties: ["Hara Madhu", "Durgapura Madhu", "Punjab Sunehri", "Arka Jeet"],
        regions: ["Uttar Pradesh", "Punjab", "Haryana", "Rajasthan"],
        tips: [
          "Use mulching to conserve moisture",
          "Maintain proper vine spacing",
          "Harvest when fruit gives sweet aroma",
          "Protect from fruit borer"
        ],
        currentStatus: "Late planting acceptable"
      }
    ]
  }
};

// Weather-based fruit recommendations
const getWeatherRecommendations = () => [
  {
    crop: "Mango",
    recommendation: "Prime planting season - plant now",
    reason: "Monsoon provides optimal moisture for sapling establishment",
    action: "Plant grafted saplings with proper drainage",
    urgency: "high"
  },
  {
    crop: "Grapes", 
    recommendation: "Excellent planting window active",
    reason: "Cool weather perfect for vine establishment",
    action: "Install trellising and plant certified vines",
    urgency: "medium"
  },
  {
    crop: "Orange",
    recommendation: "Current planting season optimal",
    reason: "Winter temperatures ideal for citrus planting",
    action: "Prepare citrus-specific soil mix and plant",
    urgency: "medium"
  }
];

// Regional fruit planting adjustments
const getRegionalAdjustments = (region: string) => {
  const adjustments: { [key: string]: any } = {
    "North India": {
      note: "Plant citrus and apple varieties suited for cooler climate",
      crops: ["Apple", "Orange", "Grapes"]
    },
    "South India": {
      note: "Tropical fruits thrive - focus on mango and papaya",
      crops: ["Mango", "Papaya", "Guava"]
    },
    "West India": {
      note: "Semi-arid conditions perfect for grape cultivation", 
      crops: ["Grapes", "Orange", "Watermelon"]
    },
    "East India": {
      note: "High humidity suitable for tropical fruit varieties",
      crops: ["Mango", "Guava", "Papaya"]
    }
  };
  return adjustments[region] || null;
};

const SowingCalendar = () => {
  const [selectedSeason, setSelectedSeason] = useState("winter");
  const [selectedRegion, setSelectedRegion] = useState("North India");
  const [weatherRecommendations, setWeatherRecommendations] = useState(getWeatherRecommendations());
  const [currentMonth] = useState(new Date().toLocaleDateString('en-US', { month: 'long' }));
  const [loading, setLoading] = useState(false);

  const refreshRecommendations = () => {
    setLoading(true);
    setTimeout(() => {
      setWeatherRecommendations(getWeatherRecommendations());
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "optimal planting window":
      case "prime planting time":
      case "current planting season":
      case "active sowing period":
        return "bg-green-100 text-green-800 border-green-200";
      case "approaching sowing window":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "late sowing period":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "off-season":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "high": return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "medium": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "low": return <Info className="h-4 w-4 text-blue-500" />;
      default: return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const regionalAdjustment = getRegionalAdjustments(selectedRegion);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-yellow-50">
      <Navbar />
      
      <main className="container px-4 py-8 flex-1">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold text-gray-900">Fruit Planting Calendar</h1>
            <p className="text-lg text-gray-600">
              Optimal fruit tree planting schedules and timing for different seasons and regions
            </p>
            
            {/* Region Selection */}
            <div className="flex justify-center items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">Region:</span>
                <select 
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="North India">North India</option>
                  <option value="South India">South India</option>
                  <option value="West India">West India</option>
                  <option value="East India">East India</option>
                </select>
              </div>
              
              <button 
                onClick={refreshRecommendations}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 text-sm"
              >
                {loading ? "Updating..." : "Refresh"}
              </button>
            </div>
          </div>

          {/* Current Month Recommendations */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Calendar className="h-5 w-5" />
                {currentMonth} Planting Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {weatherRecommendations.map((rec, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-3">
                      {getUrgencyIcon(rec.urgency)}
                      <h3 className="font-semibold text-gray-900">{rec.crop}</h3>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-green-700">{rec.recommendation}</p>
                      <p className="text-xs text-gray-600">{rec.reason}</p>
                      <div className="bg-green-50 p-2 rounded text-xs text-green-800">
                        <strong>Action:</strong> {rec.action}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {regionalAdjustment && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">{selectedRegion} Adjustment</span>
                  </div>
                  <p className="text-sm text-yellow-700">{regionalAdjustment.note}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Seasonal Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sprout className="h-5 w-5" />
                Seasonal Crop Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedSeason} onValueChange={setSelectedSeason}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="kharif">🌾 Kharif Season</TabsTrigger>
                  <TabsTrigger value="rabi">🌱 Rabi Season</TabsTrigger>
                  <TabsTrigger value="zaid">☀️ Zaid Season</TabsTrigger>
                </TabsList>
                
                {Object.entries(fruitCalendarData).map(([season, data]) => (
                  <TabsContent key={season} value={season} className="mt-6">
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{data.season}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {data.period}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{data.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {data.crops.map((crop, index) => (
                        <Card key={index} className="border-gray-200">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg flex items-center gap-2">
                                <Leaf className="h-5 w-5 text-green-600" />
                                {crop.name}
                              </CardTitle>
                              <Badge className={getStatusColor(crop.currentStatus)}>
                                {crop.currentStatus}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* Timing Information */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold flex items-center gap-2 mb-2">
                                  <Sprout className="h-4 w-4 text-green-600" />
                                  Sowing
                                </h4>
                                <p className="text-sm text-gray-700">{crop.sowingTime}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold flex items-center gap-2 mb-2">
                                  <Calendar className="h-4 w-4 text-orange-600" />
                                  Harvest
                                </h4>
                                <p className="text-sm text-gray-700">{crop.harvestTime}</p>
                              </div>
                            </div>

                            {/* Environmental Conditions */}
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="bg-red-50 p-2 rounded text-center">
                                <Thermometer className="h-3 w-3 mx-auto mb-1 text-red-600" />
                                <div className="font-medium">Soil Temp</div>
                                <div className="text-red-700">{crop.soilTemp}</div>
                              </div>
                              <div className="bg-blue-50 p-2 rounded text-center">
                                <Droplets className="h-3 w-3 mx-auto mb-1 text-blue-600" />
                                <div className="font-medium">Rainfall</div>
                                <div className="text-blue-700">{crop.rainfall}</div>
                              </div>
                              <div className="bg-yellow-50 p-2 rounded text-center">
                                <Clock className="h-3 w-3 mx-auto mb-1 text-yellow-600" />
                                <div className="font-medium">Duration</div>
                                <div className="text-yellow-700">{crop.duration}</div>
                              </div>
                            </div>

                            {/* Varieties */}
                            <div>
                              <h4 className="font-semibold text-sm mb-2">Popular Varieties</h4>
                              <div className="flex flex-wrap gap-1">
                                {crop.varieties.map((variety, i) => (
                                  <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                    {variety}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Regions */}
                            <div>
                              <h4 className="font-semibold text-sm mb-2">Suitable Regions</h4>
                              <div className="flex flex-wrap gap-1">
                                {crop.regions.map((region, i) => (
                                  <span key={i} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                                    {region}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Tips */}
                            <div>
                              <h4 className="font-semibold text-sm mb-2">Cultivation Tips</h4>
                              <ul className="text-xs text-gray-700 space-y-1">
                                {crop.tips.map((tip, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                    {tip}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>


        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SowingCalendar;