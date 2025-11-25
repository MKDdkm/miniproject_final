import { MapPin, Store, Tractor, FlaskConical, Search, Phone, Clock, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";

const Services = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState<any>(null);
  const services = [
    {
      category: "Fertilizer Shops",
      icon: Store,
      items: [
        { 
          id: 1,
          name: "Green Farm Supplies - Hebbal", 
          distance: "2.3 km", 
          contact: "080-2846-7532", 
          address: "Hebbal Main Road, Bangalore", 
          mapUrl: "https://maps.google.com/?q=Hebbal+fertilizer+shop+bangalore",
          lat: 13.0378,
          lng: 77.5946,
          rating: 4.2,
          timing: "8:00 AM - 7:00 PM",
          description: "Comprehensive fertilizer shop with organic and chemical fertilizers, seeds, and pesticides.",
          services: ["Fertilizers", "Seeds", "Pesticides", "Soil Conditioners"]
        },
        { 
          id: 2,
          name: "Krishi Seva Kendra - Yeshwantpur", 
          distance: "3.8 km", 
          contact: "080-2339-4521", 
          address: "Yeshwantpur Industrial Area, Bangalore", 
          mapUrl: "https://maps.google.com/?q=Yeshwantpur+krishi+seva+kendra+bangalore",
          lat: 13.0280,
          lng: 77.5423,
          rating: 4.5,
          timing: "9:00 AM - 6:00 PM",
          description: "Government authorized Krishi Seva Kendra providing subsidized agricultural inputs.",
          services: ["Subsidized Fertilizers", "Quality Seeds", "Soil Testing", "Advisory Services"]
        },
        { 
          id: 3,
          name: "Agro Chemicals Hub - Rajajinagar", 
          distance: "5.1 km", 
          contact: "080-2314-8967", 
          address: "Rajajinagar 2nd Block, Bangalore", 
          mapUrl: "https://maps.google.com/?q=Rajajinagar+agro+chemicals+bangalore",
          lat: 12.9894,
          lng: 77.5547,
          rating: 4.0,
          timing: "8:30 AM - 8:00 PM",
          description: "Specialized store for agricultural chemicals, bio-fertilizers, and plant growth regulators.",
          services: ["Bio-Fertilizers", "Plant Growth Regulators", "Micronutrients", "Organic Pesticides"]
        },
      ]
    },
    {
      category: "Equipment Rentals",
      icon: Tractor,
      items: [
        { 
          id: 4,
          name: "Tractor Rental Services - Devanahalli", 
          distance: "1.5 km", 
          contact: "080-2846-9876", 
          address: "Devanahalli Road, Bangalore", 
          mapUrl: "https://maps.google.com/?q=Devanahalli+tractor+rental+bangalore",
          lat: 13.2499,
          lng: 77.7007,
          rating: 4.3,
          timing: "24/7 Available",
          description: "Modern tractors and farming equipment available for hourly and daily rentals.",
          services: ["Tractors", "Tillers", "Harvesters", "Spraying Equipment"]
        },
        { 
          id: 5,
          name: "Farm Equipment Hub - Whitefield", 
          distance: "4.2 km", 
          contact: "080-2845-6543", 
          address: "Whitefield Main Road, Bangalore", 
          mapUrl: "https://maps.google.com/?q=Whitefield+farm+equipment+bangalore",
          lat: 12.9698,
          lng: 77.7499,
          rating: 4.1,
          timing: "6:00 AM - 9:00 PM",
          description: "Complete range of agricultural machinery for rent with trained operators.",
          services: ["Power Tillers", "Cultivators", "Seed Drills", "Threshers"]
        },
        { 
          id: 6,
          name: "Agri Machinery Rentals - Yelahanka", 
          distance: "6.0 km", 
          contact: "080-2856-1234", 
          address: "Yelahanka New Town, Bangalore", 
          mapUrl: "https://maps.google.com/?q=Yelahanka+agri+machinery+bangalore",
          lat: 13.1007,
          lng: 77.5963,
          rating: 3.9,
          timing: "7:00 AM - 7:00 PM",
          description: "Affordable agricultural equipment rental with maintenance support.",
          services: ["Mini Tractors", "Rotavators", "Lawn Mowers", "Water Pumps"]
        },
      ]
    },
    {
      category: "Testing Labs",
      icon: FlaskConical,
      items: [
        { 
          id: 7,
          name: "Soil Testing Laboratory - GKVK", 
          distance: "8.5 km", 
          contact: "080-2333-0123", 
          address: "GKVK Campus, Hebbal, Bangalore", 
          mapUrl: "https://maps.google.com/?q=GKVK+soil+testing+laboratory+bangalore",
          lat: 13.0756,
          lng: 77.5709,
          rating: 4.7,
          timing: "9:00 AM - 5:00 PM",
          description: "Advanced soil testing facility providing comprehensive soil health analysis.",
          services: ["Soil pH Testing", "Nutrient Analysis", "Organic Matter Testing", "Fertility Recommendations"]
        },
        { 
          id: 8,
          name: "Krishi Vigyan Kendra - Bangalore North", 
          distance: "12.3 km", 
          contact: "080-2371-4567", 
          address: "Bangalore North District, Karnataka", 
          mapUrl: "https://maps.google.com/?q=Krishi+Vigyan+Kendra+Bangalore+North",
          lat: 13.1500,
          lng: 77.6500,
          rating: 4.6,
          timing: "10:00 AM - 4:00 PM",
          description: "Agricultural extension center providing training and testing services.",
          services: ["Farmer Training", "Soil Testing", "Crop Advisory", "Technology Demonstration"]
        },
        { 
          id: 9,
          name: "Agricultural Research Center - UAS", 
          distance: "15.0 km", 
          contact: "080-2333-7890", 
          address: "University of Agricultural Sciences, Bangalore", 
          mapUrl: "https://maps.google.com/?q=UAS+agricultural+research+center+bangalore",
          lat: 13.0756,
          lng: 77.5709,
          rating: 4.8,
          timing: "9:30 AM - 4:30 PM",
          description: "Premier agricultural research facility with advanced testing capabilities.",
          services: ["Research & Development", "Plant Disease Diagnosis", "Seed Quality Testing", "Consultancy Services"]
        },
      ]
    },
  ];

  // Filter services based on search query
  const filteredServices = services.map(service => ({
    ...service,
    items: service.items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })).filter(service => service.items.length > 0);

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      
      <main className="container px-4 py-12 flex-1">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold text-foreground">Agriculture Services Finder</h1>
            <p className="text-lg text-muted-foreground">
              Find fertilizer shops, equipment rentals, and testing labs in Bangalore
            </p>
          </div>

          {/* Search Bar */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search for services, shops, or equipment..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button onClick={() => window.open('https://maps.google.com/?q=agricultural+services+fertilizer+shops+bangalore', '_blank')}>
                  <MapPin className="mr-2 h-4 w-4" />
                  Open in Google Maps
                </Button>
              </div>
              {searchQuery && (
                <div className="mt-3 text-sm text-muted-foreground">
                  Showing results for: <strong>"{searchQuery}"</strong>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Google Maps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Bangalore Agricultural Services Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden h-96 border border-border">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248849.84916296526!2d77.46612545425948!3d12.953945613752896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1632820132890!5m2!1sen!2sin&q=agricultural+services+fertilizer+shops+bangalore"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Bangalore Agricultural Services Map"
                ></iframe>
              </div>
            </CardContent>
          </Card>

          {/* Services List */}
          {filteredServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    {service.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {service.items.map((item, itemIndex) => (
                      <div 
                        key={itemIndex}
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-foreground">{item.name}</h4>
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                              <Star className="h-3 w-3 mr-1 fill-current" />
                              {item.rating}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {item.distance} away • {item.timing}
                          </p>
                          <p className="text-xs text-muted-foreground">{item.address}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.services.slice(0, 3).map((service: string, serviceIndex: number) => (
                              <Badge key={serviceIndex} variant="secondary" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                            {item.services.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{item.services.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedService(item)}
                          >
                            View Details
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(`tel:${item.contact}`, '_self')}
                          >
                            <Phone className="h-3 w-3 mr-1" />
                            Call
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => window.open(item.mapUrl, '_blank')}
                          >
                            <MapPin className="h-3 w-3 mr-1" />
                            Directions
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Additional Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => window.open('https://maps.google.com/?q=fertilizer+shops+bangalore', '_blank')}
                >
                  <Store className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-semibold">Find More Shops</div>
                    <div className="text-xs text-muted-foreground">Search Google Maps</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => window.open('tel:1800-180-1551', '_self')}
                >
                  <Phone className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-semibold">Helpline</div>
                    <div className="text-xs text-muted-foreground">1800-180-1551</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => setSearchQuery("")}
                >
                  <Search className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-semibold">Clear Search</div>
                    <div className="text-xs text-muted-foreground">Show all services</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
