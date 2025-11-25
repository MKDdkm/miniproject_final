import { ScrollText, ExternalLink, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Schemes = () => {
  const schemes = [
    {
      title: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
      description: "Direct income support of ₹6,000 per year in three equal installments to all landholding farmer families.",
      eligibility: "All landholding farmers",
      benefits: "₹6,000/year",
      status: "Active",
      category: "Income Support",
      officialUrl: "https://pmkisan.gov.in/"
    },
    {
      title: "Kisan Credit Card (KCC)",
      description: "Easy access to credit for farmers to meet their cultivation and post-harvest needs at concessional interest rates.",
      eligibility: "All farmers with cultivable land",
      benefits: "Low interest credit",
      status: "Active",
      category: "Credit",
      officialUrl: "https://www.india.gov.in/spotlight/kisan-credit-card-kcc-scheme"
    },
    {
      title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
      description: "Comprehensive crop insurance scheme covering all stages of the crop cycle against natural calamities.",
      eligibility: "All farmers growing notified crops",
      benefits: "Crop insurance coverage",
      status: "Active",
      category: "Insurance",
      officialUrl: "https://pmfby.gov.in/"
    },
    {
      title: "Soil Health Card Scheme",
      description: "Free soil testing and health card providing crop-wise recommendations for nutrients and fertilizers.",
      eligibility: "All farmers",
      benefits: "Free soil testing",
      status: "Active",
      category: "Advisory",
      officialUrl: "https://soilhealth.dac.gov.in/"
    },
    {
      title: "National Agriculture Market (e-NAM)",
      description: "Online trading platform for agricultural commodities to enable transparent price discovery.",
      eligibility: "Registered farmers and traders",
      benefits: "Better market access",
      status: "Active",
      category: "Marketing",
      officialUrl: "https://enam.gov.in/"
    },
    {
      title: "Paramparagat Krishi Vikas Yojana (PKVY)",
      description: "Support for organic farming through cluster approach with financial assistance of ₹50,000 per hectare.",
      eligibility: "Farmers willing to adopt organic farming",
      benefits: "₹50,000/hectare",
      status: "Active",
      category: "Organic Farming",
      officialUrl: "https://pgsindia-ncof.gov.in/"
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Income Support": "bg-success/10 text-success border-success/20",
      "Credit": "bg-primary/10 text-primary border-primary/20",
      "Insurance": "bg-accent/10 text-accent border-accent/20",
      "Advisory": "bg-secondary/10 text-secondary border-secondary/20",
      "Marketing": "bg-warning/10 text-warning border-warning/20",
      "Organic Farming": "bg-primary/10 text-primary border-primary/20",
    };
    return colors[category] || "bg-muted text-foreground";
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      
      <main className="container px-4 py-12 flex-1">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold text-foreground">Government Schemes & Subsidies</h1>
            <p className="text-lg text-muted-foreground">
              Explore available agricultural schemes, subsidies, and support programs
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-primary">{schemes.length}</div>
                <p className="text-sm text-muted-foreground mt-1">Active Schemes</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-accent">100%</div>
                <p className="text-sm text-muted-foreground mt-1">Coverage Available</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-success">₹6K+</div>
                <p className="text-sm text-muted-foreground mt-1">Direct Benefits</p>
              </CardContent>
            </Card>
          </div>

          {/* Schemes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {schemes.map((scheme, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{scheme.title}</CardTitle>
                    <Badge className={getCategoryColor(scheme.category)}>
                      {scheme.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {scheme.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Eligibility</p>
                        <p className="text-sm font-medium text-foreground">{scheme.eligibility}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Benefits</p>
                        <p className="text-sm font-medium text-foreground">{scheme.benefits}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => window.open(scheme.officialUrl, '_blank')}
                    >
                      Apply Now
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(scheme.officialUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>


        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Schemes;
