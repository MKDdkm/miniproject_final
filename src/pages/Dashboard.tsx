import { 
  CloudSun, 
  Droplets, 
  Bug, 
  FileText, 
  Calendar, 
  Sprout,
  Leaf,
  CheckSquare
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  
  const assistanceCards = [
    {
      title: "Weather & Advisory",
      description: "Current weather: 28°C, Partly cloudy. Good day for spraying pesticides.",
      icon: CloudSun,
      color: "bg-accent/10 text-accent",
      action: "View 7-day forecast"
    },
    {
      title: "Pest Alerts",
      description: "Aphid activity detected in nearby farms. Take preventive measures.",
      icon: Bug,
      color: "bg-destructive/10 text-destructive",
      action: "View pest prevention"
    },
    {
      title: "Sowing Calendar",
      description: "Optimal time for planting tomatoes: Next 2 weeks. Check detailed schedule.",
      icon: Calendar,
      color: "bg-secondary/10 text-secondary",
      action: "View full calendar"
    },
    {
      title: "Organic Farming Tips",
      description: "Learn natural pest control methods and organic fertilizer recipes.",
      icon: Leaf,
      color: "bg-primary/10 text-primary",
      action: "Explore organic methods"
    },
    {
      title: "Daily Tasks",
      description: "5 tasks pending: Water field A, Check irrigation pipes, Apply fertilizer",
      icon: CheckSquare,
      color: "bg-warning/10 text-warning",
      action: "Manage tasks"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      
      <main className="container px-4 py-12 flex-1">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold text-foreground">Fruit Grower Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              Your complete orchard companion with real-time insights and fruit cultivation recommendations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {assistanceCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Card 
                  key={index}
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
                  onClick={() => {
                    if (card.title === "Weather & Advisory") {
                      navigate("/weather");
                    } else if (card.title === "Pest Alerts") {
                      navigate("/pest-alerts");
                    } else if (card.title === "Sowing Calendar") {
                      navigate("/sowing-calendar");
                    } else if (card.title === "Organic Farming Tips" || card.title === "Daily Tasks") {
                      navigate("/organic-farming");

                    }
                  }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-lg ${card.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                    <CardTitle className="mt-4">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground min-h-[60px]">
                      {card.description}
                    </p>
                    <button className="text-sm font-medium text-primary hover:underline">
                      {card.action} →
                    </button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
