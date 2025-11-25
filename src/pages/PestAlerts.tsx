import { useState, useEffect } from "react";
import { 
  Bug, 
  Shield, 
  AlertTriangle, 
  Leaf, 
  MapPin,
  Calendar,
  Thermometer,
  Droplets,
  Eye,
  CheckCircle,
  XCircle,
  Info
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Real fruit pest data
const fruitPestData = {
  apple: [
    {
      name: "Codling Moth",
      severity: "High",
      season: "Spring-Summer",
      symptoms: "Small holes in fruits, brown frass at entry points, larvae inside fruit",
      prevention: [
        "Use pheromone traps during blooming season",
        "Apply Bacillus thuringiensis (Bt) spray every 10-14 days",
        "Remove fallen fruits immediately",
        "Spray neem oil during egg-laying period"
      ],
      treatment: [
        "Spinosad-based insecticides during larval stage",
        "Remove infected fruits and destroy them",
        "Use kaolin clay as physical barrier"
      ],
      weatherConditions: "Active in temperatures 15-25°C with moderate humidity"
    },
    {
      name: "Apple Scab",
      severity: "Medium",
      season: "Spring",
      symptoms: "Dark, scaly lesions on leaves and fruits, premature fruit drop",
      prevention: [
        "Plant resistant varieties",
        "Ensure good air circulation between trees",
        "Remove fallen leaves in autumn",
        "Apply copper fungicide during dormant season"
      ],
      treatment: [
        "Captan or myclobutanil fungicide spray",
        "Lime sulfur during dormant season",
        "Prune affected branches"
      ],
      weatherConditions: "Thrives in wet, humid conditions with temperatures 16-24°C"
    }
  ],
  mango: [
    {
      name: "Mango Fruit Fly",
      severity: "High",
      season: "Fruiting Season",
      symptoms: "Small puncture marks on fruit skin, maggots inside fruit, premature fruit drop",
      prevention: [
        "Use methyl eugenol traps for males",
        "Bag fruits when marble-sized",
        "Collect and destroy fallen fruits daily",
        "Maintain orchard hygiene"
      ],
      treatment: [
        "Protein bait spray with malathion",
        "Release sterile male flies (SIT program)",
        "Apply spinosad bait stations"
      ],
      weatherConditions: "Most active during warm, humid weather (25-30°C)"
    },
    {
      name: "Anthracnose",
      severity: "Medium",
      season: "Monsoon",
      symptoms: "Dark brown to black spots on leaves, flowers, and fruits",
      prevention: [
        "Ensure proper drainage",
        "Prune for better air circulation",
        "Apply copper oxychloride before monsoon",
        "Remove infected plant material"
      ],
      treatment: [
        "Carbendazim fungicide spray",
        "Copper-based fungicides during wet weather",
        "Post-harvest treatment with hot water (52°C for 5 minutes)"
      ],
      weatherConditions: "Spreads rapidly in high humidity (>80%) and temperatures 20-30°C"
    }
  ],
  citrus: [
    {
      name: "Citrus Psyllid",
      severity: "High",
      season: "Year-round",
      symptoms: "Yellowing leaves, stunted growth, honeydew on leaves, sooty mold",
      prevention: [
        "Use yellow sticky traps",
        "Plant psyllid-resistant rootstocks",
        "Regular monitoring with magnifying glass",
        "Remove water sprouts and suckers"
      ],
      treatment: [
        "Imidacloprid soil application",
        "Horticultural oil spray for nymphs",
        "Systemic insecticides (thiamethoxam)"
      ],
      weatherConditions: "Thrives in warm weather (20-30°C) with new growth flushes"
    },
    {
      name: "Citrus Canker",
      severity: "High",
      season: "Monsoon",
      symptoms: "Raised, corky lesions on leaves, stems, and fruits with yellow halos",
      prevention: [
        "Use disease-free planting material",
        "Avoid overhead irrigation",
        "Copper spray during vulnerable periods",
        "Windbreaks to reduce wind-driven rain"
      ],
      treatment: [
        "Copper hydroxide or copper oxychloride spray",
        "Streptomycin sulfate for severe cases",
        "Remove and destroy infected plant parts"
      ],
      weatherConditions: "Spreads during wet, windy conditions with temperatures 20-30°C"
    }
  ],
  banana: [
    {
      name: "Banana Weevil",
      severity: "High",
      season: "Year-round",
      symptoms: "Yellowing and wilting of leaves, tunnels in pseudostem, plant collapse",
      prevention: [
        "Use clean planting material",
        "Pheromone traps for adult weevils",
        "Remove plant debris and old pseudostems",
        "Crop rotation with non-host crops"
      ],
      treatment: [
        "Carbofuran granules in soil",
        "Inject pseudostem with chlorpyrifos",
        "Release Beauveria bassiana (biocontrol)"
      ],
      weatherConditions: "Active year-round but increases during warm, humid conditions"
    }
  ]
};

// Current regional alerts (mock data - would come from agricultural APIs)
const getCurrentAlerts = () => [
  {
    id: 1,
    pest: "Codling Moth",
    fruit: "Apple",
    location: "Delhi Region",
    severity: "High",
    status: "Active Outbreak",
    affectedArea: "12 orchards",
    lastUpdated: "2 hours ago",
    recommendation: "Immediate pheromone trap deployment recommended"
  },
  {
    id: 2,
    pest: "Mango Fruit Fly",
    fruit: "Mango",
    location: "Maharashtra",
    severity: "Medium",
    status: "Monitoring",
    affectedArea: "8 orchards",
    lastUpdated: "6 hours ago",
    recommendation: "Increase fruit bagging and trap monitoring"
  },
  {
    id: 3,
    pest: "Citrus Psyllid",
    fruit: "Citrus",
    location: "Punjab Region",
    severity: "Low",
    status: "Preventive Stage",
    affectedArea: "3 orchards",
    lastUpdated: "1 day ago",
    recommendation: "Continue regular monitoring with yellow sticky traps"
  }
];

// Weather-based risk assessment
const assessPestRisk = (weather: any) => {
  const risks = [];
  
  if (weather.humidity > 70 && weather.temperature > 20) {
    risks.push({
      pest: "Fungal Diseases",
      risk: "High",
      reason: "High humidity and warm temperature favor fungal growth"
    });
  }
  
  if (weather.temperature > 25 && weather.temperature < 35) {
    risks.push({
      pest: "Fruit Flies",
      risk: "Medium",
      reason: "Optimal temperature range for fruit fly activity"
    });
  }
  
  return risks;
};

const PestAlerts = () => {
  const [selectedFruit, setSelectedFruit] = useState("apple");
  const [currentAlerts, setCurrentAlerts] = useState(getCurrentAlerts());
  const [weatherRisks, setWeatherRisks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Simulate weather-based risk assessment
  useEffect(() => {
    const mockWeather = { temperature: 28, humidity: 65 };
    setWeatherRisks(assessPestRisk(mockWeather));
  }, []);

  const refreshAlerts = () => {
    setLoading(true);
    setTimeout(() => {
      setCurrentAlerts(getCurrentAlerts());
      setLoading(false);
    }, 1000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active outbreak": return <XCircle className="h-4 w-4 text-red-500" />;
      case "monitoring": return <Eye className="h-4 w-4 text-yellow-500" />;
      case "preventive stage": return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-blue-50">
      <Navbar />
      
      <main className="container px-4 py-8 flex-1">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold text-gray-900">Fruit Pest Alerts & Prevention</h1>
            <p className="text-lg text-gray-600">
              Real-time pest monitoring and prevention strategies for fruit crops
            </p>
            <button 
              onClick={refreshAlerts}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Updating..." : "Refresh Alerts"}
            </button>
          </div>

          {/* Current Alerts */}
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertTriangle className="h-5 w-5" />
                Current Regional Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentAlerts.map((alert) => (
                  <div key={alert.id} className="bg-white rounded-lg p-4 border border-orange-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{alert.pest}</h3>
                        <p className="text-sm text-gray-600">{alert.fruit} • {alert.location}</p>
                      </div>
                      {getStatusIcon(alert.status)}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity} Risk
                        </Badge>
                        <span className="text-xs text-gray-500">{alert.lastUpdated}</span>
                      </div>
                      
                      <p className="text-sm text-gray-700">
                        <MapPin className="h-3 w-3 inline mr-1" />
                        {alert.affectedArea} affected
                      </p>
                      
                      <div className="bg-blue-50 p-2 rounded text-xs text-blue-800">
                        <strong>Action:</strong> {alert.recommendation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weather Risk Assessment */}
          {weatherRisks.length > 0 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Thermometer className="h-5 w-5" />
                  Weather-Based Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {weatherRisks.map((risk, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Bug className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold">{risk.pest}</span>
                        <Badge className={getSeverityColor(risk.risk)}>{risk.risk} Risk</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{risk.reason}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pest Information Database */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="h-5 w-5" />
                Fruit Pest Prevention Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedFruit} onValueChange={setSelectedFruit}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="apple">🍎 Apple</TabsTrigger>
                  <TabsTrigger value="mango">🥭 Mango</TabsTrigger>
                  <TabsTrigger value="citrus">🍊 Citrus</TabsTrigger>
                  <TabsTrigger value="banana">🍌 Banana</TabsTrigger>
                </TabsList>
                
                {Object.entries(fruitPestData).map(([fruit, pests]) => (
                  <TabsContent key={fruit} value={fruit} className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {pests.map((pest, index) => (
                        <Card key={index} className="border-gray-200">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{pest.name}</CardTitle>
                              <Badge className={getSeverityColor(pest.severity)}>
                                {pest.severity} Risk
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {pest.season}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* Symptoms */}
                            <div>
                              <h4 className="font-semibold flex items-center gap-2 mb-2">
                                <Eye className="h-4 w-4" />
                                Symptoms
                              </h4>
                              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                                {pest.symptoms}
                              </p>
                            </div>

                            {/* Prevention */}
                            <div>
                              <h4 className="font-semibold flex items-center gap-2 mb-2">
                                <Shield className="h-4 w-4 text-green-600" />
                                Prevention Methods
                              </h4>
                              <ul className="text-sm text-gray-700 space-y-1">
                                {pest.prevention.map((method, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                    {method}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Treatment */}
                            <div>
                              <h4 className="font-semibold flex items-center gap-2 mb-2">
                                <Leaf className="h-4 w-4 text-orange-600" />
                                Treatment Options
                              </h4>
                              <ul className="text-sm text-gray-700 space-y-1">
                                {pest.treatment.map((treatment, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <XCircle className="h-3 w-3 text-orange-500 mt-0.5 flex-shrink-0" />
                                    {treatment}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Weather Conditions */}
                            <div className="bg-blue-50 p-3 rounded">
                              <h4 className="font-semibold flex items-center gap-2 mb-1">
                                <Droplets className="h-4 w-4 text-blue-600" />
                                Weather Conditions
                              </h4>
                              <p className="text-sm text-blue-800">{pest.weatherConditions}</p>
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

export default PestAlerts;