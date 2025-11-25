import { Upload, CloudSun, TrendingUp, ScrollText, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuickActionCard from "@/components/QuickActionCard";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/lib/translations";
import heroImage from "@/assets/hero-farm-sunrise.jpg";

const Index = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section 
        className="relative min-h-[600px] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        
        <div className="relative z-10 container px-4 py-20 text-center text-white">
          <div className="max-w-4xl mx-auto space-y-6">

            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              {getTranslation("heroTitle", language)}
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              {getTranslation("heroSubtitle", language)}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 bg-accent hover:bg-accent/90 text-white shadow-2xl"
                onClick={() => navigate("/weather")}
              >
                <Upload className="mr-2 h-5 w-5" />
                {getTranslation("weather", language)}
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6 bg-white/95 hover:bg-white text-foreground border-0 shadow-xl"
                onClick={() => navigate("/dashboard")}
              >
                {getTranslation("dashboard", language)}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="container px-4 py-16 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <QuickActionCard
            title="Weather & Advisory"
            description="Get real-time weather updates and farming tips"
            icon={CloudSun}
            href="/weather"
          />
          
          <QuickActionCard
            title="Market Prices"
            description="Check daily mandi rates for your crops"
            icon={TrendingUp}
            href="/prices"
            gradient
          />
          
          <QuickActionCard
            title="Govt. Schemes"
            description="Access subsidies and support programs"
            icon={ScrollText}
            href="/schemes"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {getTranslation("features", language)}
          </h2>
          <p className="text-lg text-muted-foreground">
            {getTranslation("heroSubtitle", language)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { title: "Disease Detection", desc: "AI-powered fruit disease identification", icon: "🔍" },
            { title: "Weather Advisory", desc: "Weather insights for fruit orchards", icon: "🌤️" },
            { title: "Pest Alerts", desc: "Fruit-specific pest management", icon: "🐛" },
            { title: "Planting Calendar", desc: "Optimal fruit planting schedules", icon: "📅" },

            { title: "Organic Methods", desc: "Natural fruit cultivation practices", icon: "🌱" },
            { title: "Market Prices", desc: "Fresh fruit market rates", icon: "📊" },
            { title: "Govt. Schemes", desc: "Horticulture subsidies & support", icon: "🏛️" },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-6 text-center hover:shadow-lg transition-shadow border border-border"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
