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
    season: "Monsoon Planting (June - September)",
    period: "June - September",
    description: "Tropical fruit trees planted with natural rainfall for best establishment",
    crops: [
      {
        name: "Mango Trees",
        sowingTime: "June - August",
        harvestTime: "3-5 years (April-July)",
        duration: "Perennial - 50+ years",
        soilTemp: "25-35°C",
        rainfall: "750-1200mm annually",
        varieties: ["Alphonso", "Dasheri", "Langra", "Kesar", "Totapuri"],
        regions: ["Maharashtra", "Uttar Pradesh", "Andhra Pradesh", "Karnataka"],
        tips: [
          "Plant grafted saplings 2-3 years old",
          "Dig pits 1m×1m×1m size, 8m spacing",
          "Add 20kg organic manure per pit",
          "Provide shade for first 2 years",
          "Install drip irrigation system"
        ],
        currentStatus: "Peak planting season"
      },
      {
        name: "Citrus Trees (Orange/Lemon)",
        sowingTime: "July - September", 
        harvestTime: "2-3 years (November-March)",
        duration: "Perennial - 25-30 years",
        soilTemp: "20-30°C",
        rainfall: "900-1200mm annually",
        varieties: ["Nagpur Orange", "Mosambi", "Kagzi Lime", "Malta"],
        regions: ["Maharashtra", "Punjab", "Andhra Pradesh", "Tamil Nadu"],
        tips: [
          "Choose disease-resistant rootstock",
          "Maintain 6×6m spacing between plants",
          "Apply micronutrient mixture regularly",
          "Protect from strong winds",
          "Regular pruning for shape training"
        ],
        currentStatus: "Good planting window"
      },
      {
        name: "Pomegranate",
        sowingTime: "June - August",
        harvestTime: "2.5-3 years (October-February)", 
        duration: "Perennial - 15-20 years",
        soilTemp: "25-32°C",
        rainfall: "600-900mm annually",
        varieties: ["Bhagwa", "Ganesh", "Ruby", "Mridula"],
        regions: ["Maharashtra", "Karnataka", "Andhra Pradesh", "Gujarat"],
        tips: [
          "Plant in well-drained black soil",
          "Maintain 4×4m or 5×5m spacing",
          "Install trellis system for support",
          "Regular bagging of fruits",
          "Drip irrigation recommended"
        ],
        currentStatus: "Optimal planting time"
      },
      {
        name: "Jackfruit Trees",
        sowingTime: "June - July",
        harvestTime: "5-6 years (March-September)",
        duration: "Perennial - 80+ years", 
        soilTemp: "25-35°C",
        rainfall: "1000-1500mm annually",
        varieties: ["Soft Variety", "Hard Variety", "Rudrakshi", "Golden Pillow"],
        regions: ["Kerala", "Karnataka", "Tamil Nadu", "West Bengal"],
        tips: [
          "Plant seedlings or grafted plants",
          "Maintain 8×8m to 10×10m spacing",
          "Provide support stakes initially",
          "Mulching around base important",
          "Intercropping possible in early years"
        ],
        currentStatus: "Excellent planting season"
      }
    ]
  },
  winter: {
    season: "Winter Planting (November - February)",
    period: "November - February", 
    description: "Temperate fruit trees and cool season varieties with controlled irrigation",
    crops: [
      {
        name: "Apple Trees",
        sowingTime: "December - February",
        harvestTime: "4-5 years (August-October)",
        duration: "Perennial - 40+ years",
        soilTemp: "10-20°C",
        rainfall: "1000-1200mm annually",
        varieties: ["Red Delicious", "Royal Delicious", "Golden Delicious", "Gala"],
        regions: ["Himachal Pradesh", "Jammu & Kashmir", "Uttarakhand"],
        tips: [
          "Plant in hill slopes with good drainage",
          "Maintain 4×4m to 5×5m spacing",
          "Install support system for heavy fruiting",
          "Regular pruning essential",
          "Chill hour requirement 1000-1500 hours"
        ],
        currentStatus: "Peak season for hill regions"
      },
      {
        name: "Grape Vines",
        sowingTime: "January - February",
        harvestTime: "1.5-2 years (December-April)",
        duration: "Perennial - 25-30 years",
        soilTemp: "15-25°C", 
        rainfall: "500-700mm annually",
        varieties: ["Thompson Seedless", "Bangalore Blue", "Anab-e-Shahi", "Sharad Seedless"],
        regions: ["Maharashtra", "Karnataka", "Andhra Pradesh", "Tamil Nadu"],
        tips: [
          "Install pandal or trellis system",
          "Maintain 3×2m spacing",
          "Drip irrigation with fertigation",
          "Regular canopy management",
          "Bunch thinning for quality fruits"
        ],
        currentStatus: "Ideal planting period"
      },
      {
        name: "Strawberry Plants", 
        sowingTime: "November - December",
        harvestTime: "60-70 days (January-March)",
        duration: "Annual crop",
        soilTemp: "15-25°C",
        rainfall: "400-500mm during season",
        varieties: ["Chandler", "Camarosa", "Sweet Charlie", "Festival"],
        regions: ["Maharashtra", "Karnataka", "Himachal Pradesh"],
        tips: [
          "Use raised beds with plastic mulching",
          "Plant runners or tissue culture plants",
          "Drip irrigation with fertigation",
          "Control temperature with shade nets", 
          "Regular harvesting every 2-3 days"
        ],
        currentStatus: "Active planting window"
      },
      {
        name: "Kiwi Vines",
        sowingTime: "December - January", 
        harvestTime: "3-4 years (October-November)",
        duration: "Perennial - 30+ years",
        soilTemp: "10-18°C",
        rainfall: "1000-1500mm annually", 
        varieties: ["Hayward", "Bruno", "Monty", "Allison"],
        regions: ["Himachal Pradesh", "Arunachal Pradesh", "Sikkim"],
        tips: [
          "Requires male and female plants (1:8 ratio)",
          "Install strong pergola system", 
          "Plant in well-drained acidic soil",
          "Protection from strong winds essential",
          "Regular winter pruning required"
        ],
        currentStatus: "Suitable for hill regions"
      }
    ]
  },
  summer: {
    season: "Summer Planting (March - May)",
    period: "March - May",
    description: "Heat-tolerant fruit varieties with intensive irrigation systems",
    crops: [
      {
        name: "Papaya Plants",
        sowingTime: "March - May",
        harvestTime: "8-10 months (November-February)",
        duration: "Short-lived perennial - 4-6 years",
        soilTemp: "25-35°C",
        rainfall: "800-1000mm annually",
        varieties: ["Red Lady", "Taiwan Red", "Pusa Dwarf", "Coorg Honey Dew"],
        regions: ["All tropical and subtropical regions"],
        tips: [
          "Plant both hermaphrodite and female plants",
          "Maintain 2×2m spacing",
          "Provide wind protection",
          "Regular organic mulching",
          "Harvest fruits at 25% yellow stage"
        ],
        currentStatus: "Good planting season"
      },
      {
        name: "Banana Suckers",
        sowingTime: "April - May",
        harvestTime: "12-15 months (April-August next year)", 
        duration: "Perennial - continuous cropping",
        soilTemp: "26-30°C",
        rainfall: "1200-1500mm annually",
        varieties: ["Grand Naine", "Robusta", "Rasthali", "Poovan"],
        regions: ["Tamil Nadu", "Karnataka", "Maharashtra", "Gujarat"],
        tips: [
          "Use tissue culture or healthy suckers",
          "Plant in 2×2m or 1.8×1.8m spacing",
          "Install drip irrigation system",
          "Regular de-suckering required",
          "Bunch covering for quality fruits"
        ],
        currentStatus: "Peak planting time"
      },
      {
        name: "Guava Trees",
        sowingTime: "March - April", 
        harvestTime: "2-3 years (November-January & June-August)",
        duration: "Perennial - 30-40 years",
        soilTemp: "25-30°C", 
        rainfall: "750-1000mm annually",
        varieties: ["Allahabad Safeda", "Sardar", "Apple Guava", "Chittidar"],
        regions: ["Uttar Pradesh", "Bihar", "Maharashtra", "Gujarat"],
        tips: [
          "Plant grafted or air-layered plants",
          "Maintain 5×5m to 6×6m spacing",
          "Regular pruning after harvest",
          "Fruit bagging for export quality",
          "Two seasons cropping possible"
        ],
        currentStatus: "Suitable planting window"
      },
      {
        name: "Coconut Palms", 
        sowingTime: "April - May",
        harvestTime: "5-6 years (Year-round)",
        duration: "Perennial - 80+ years",
        soilTemp: "27-32°C",
        rainfall: "1200-2000mm annually",
        varieties: ["West Coast Tall", "East Coast Tall", "Malayan Dwarf"],
        regions: ["Kerala", "Tamil Nadu", "Karnataka", "Andhra Pradesh"],
        tips: [
          "Plant 12-month-old seedlings",
          "Maintain 7.5×7.5m to 8×8m spacing", 
          "Dig pits 1m×1m×1m size",
          "Add 25kg organic manure per pit",
          "Intercropping with spices possible"
        ],
        currentStatus: "Optimal for coastal regions"
      }
    ]
  }
};

const FruitPlantingCalendar = () => {
  const [selectedSeason, setSelectedSeason] = useState("monsoon");
  const [currentMonth] = useState(new Date().getMonth() + 1);
  
  const getCurrentSeason = () => {
    if (currentMonth >= 6 && currentMonth <= 9) return "monsoon";
    if (currentMonth >= 11 || currentMonth <= 2) return "winter"; 
    return "summer";
  };

  const getSeasonStatus = (season: string) => {
    const current = getCurrentSeason();
    if (season === current) return "active";
    return "upcoming";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Peak planting season":
      case "Optimal planting time":
      case "Peak season for hill regions":
        return "bg-green-100 text-green-800";
      case "Good planting window":
      case "Ideal planting period": 
      case "Active planting window":
        return "bg-blue-100 text-blue-800";
      case "Suitable planting window":
      case "Good planting season":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-blue-50">
      <Navbar />
      
      <main className="container px-4 py-8 flex-1">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold text-gray-900">Fruit Planting Calendar</h1>
            <p className="text-lg text-gray-600">
              Optimal fruit tree planting schedules for maximum yield and quality orchards across India
            </p>
          </div>

          {/* Season Selection */}
          <Tabs value={selectedSeason} onValueChange={setSelectedSeason}>
            <TabsList className="grid w-full grid-cols-3">
              {Object.entries(fruitCalendarData).map(([key, season]) => (
                <TabsTrigger key={key} value={key} className="relative">
                  <div className="flex items-center gap-2">
                    {key === "monsoon" && <Droplets className="h-4 w-4" />}
                    {key === "winter" && <Sun className="h-4 w-4" />}
                    {key === "summer" && <Thermometer className="h-4 w-4" />}
                    <span className="hidden sm:inline">{season.season}</span>
                    <span className="sm:hidden">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  </div>
                  {getSeasonStatus(key) === "active" && (
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse" />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(fruitCalendarData).map(([seasonKey, seasonData]) => (
              <TabsContent key={seasonKey} value={seasonKey} className="space-y-6">
                {/* Season Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {seasonData.season}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Period:</span>
                          <span>{seasonData.period}</span>
                        </div>
                        <p className="text-muted-foreground">{seasonData.description}</p>
                      </div>
                      <div className="flex items-center justify-end">
                        <Badge className={getSeasonStatus(seasonKey) === "active" ? 
                          "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {getSeasonStatus(seasonKey) === "active" ? "Current Season" : "Upcoming Season"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Fruit Varieties */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {seasonData.crops.map((fruit, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <Sprout className="h-5 w-5 text-green-600" />
                            {fruit.name}
                          </CardTitle>
                          <Badge className={getStatusColor(fruit.currentStatus)}>
                            {fruit.currentStatus}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Key Information */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span className="font-medium">Planting:</span>
                            </div>
                            <p className="text-muted-foreground pl-5">{fruit.sowingTime}</p>
                            
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="font-medium">First Harvest:</span>
                            </div>
                            <p className="text-muted-foreground pl-5">{fruit.harvestTime}</p>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Thermometer className="h-3 w-3 text-muted-foreground" />
                              <span className="font-medium">Soil Temp:</span>
                            </div>
                            <p className="text-muted-foreground pl-5">{fruit.soilTemp}</p>
                            
                            <div className="flex items-center gap-2">
                              <Droplets className="h-3 w-3 text-muted-foreground" />
                              <span className="font-medium">Water Req:</span>
                            </div>
                            <p className="text-muted-foreground pl-5">{fruit.rainfall}</p>
                          </div>
                        </div>

                        {/* Varieties */}
                        <div>
                          <p className="font-medium text-sm mb-2">Popular Varieties:</p>
                          <div className="flex flex-wrap gap-1">
                            {fruit.varieties.slice(0, 4).map((variety, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {variety}
                              </Badge>
                            ))}
                            {fruit.varieties.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{fruit.varieties.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Regions */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium text-sm">Best Regions:</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {fruit.regions.join(", ")}
                          </p>
                        </div>

                        {/* Expert Tips */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Info className="h-3 w-3 text-blue-500" />
                            <span className="font-medium text-sm">Expert Tips:</span>
                          </div>
                          <div className="space-y-1">
                            {fruit.tips.slice(0, 3).map((tip, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-muted-foreground">{tip}</p>
                              </div>
                            ))}
                            {fruit.tips.length > 3 && (
                              <p className="text-xs text-blue-600 cursor-pointer hover:underline pl-5">
                                +{fruit.tips.length - 3} more tips
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Current Month Recommendations */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-green-600" />
                Current Month Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Based on the current month, here are the best fruit planting opportunities:
                </p>
                
                {/* Current season crops */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {fruitCalendarData[getCurrentSeason() as keyof typeof fruitCalendarData].crops
                    .slice(0, 3)
                    .map((fruit, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Sprout className="h-4 w-4 text-green-600" />
                        <h4 className="font-medium">{fruit.name}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{fruit.sowingTime}</p>
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        {fruit.currentStatus}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FruitPlantingCalendar;