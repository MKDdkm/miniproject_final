import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const MarketPrices = () => {
  const marketData = [
    { crop: "Apples", price: "₹80", unit: "kg", change: "+5%", trend: "up", location: "Bangalore Mandi" },
    { crop: "Oranges", price: "₹45", unit: "kg", change: "+3%", trend: "up", location: "Mysuru Mandi" },
    { crop: "Mangoes", price: "₹120", unit: "kg", change: "-2%", trend: "down", location: "Mandya Mandi" },
    { crop: "Bananas", price: "₹35", unit: "dozen", change: "+1%", trend: "up", location: "Tumkur Mandi" },
    { crop: "Grapes", price: "₹95", unit: "kg", change: "+8%", trend: "up", location: "Bijapur Mandi" },
    { crop: "Pomegranates", price: "₹110", unit: "kg", change: "-1%", trend: "down", location: "Bagalkot Mandi" },
    { crop: "Papayas", price: "₹28", unit: "kg", change: "+4%", trend: "up", location: "Kolar Mandi" },
    { crop: "Watermelons", price: "₹18", unit: "kg", change: "0%", trend: "neutral", location: "Hubli Mandi" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      
      <main className="container px-4 py-12 flex-1">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold text-foreground">Market Prices (Mandi Rates)</h1>
            <p className="text-lg text-muted-foreground">
              Daily updated wholesale prices from major mandis across Karnataka
            </p>
          </div>

          {/* Price Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-success/10 border-success/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Best Price Today</p>
                    <p className="text-2xl font-bold text-success mt-1">Mangoes - ₹120/kg</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-success" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-accent/10 border-accent/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Highest Gain</p>
                    <p className="text-2xl font-bold text-accent mt-1">Grapes +8%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/10 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Markets Updated</p>
                    <p className="text-2xl font-bold text-primary mt-1">8 Mandis</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Price Table */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Wholesale Prices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Crop</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Change</TableHead>
                      <TableHead>Location</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {marketData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.crop}</TableCell>
                        <TableCell className="text-lg font-semibold text-primary">
                          {item.price}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{item.unit}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={item.trend === "up" ? "default" : item.trend === "down" ? "destructive" : "secondary"}
                            className="flex items-center gap-1 w-fit"
                          >
                            {item.trend === "up" && <TrendingUp className="h-3 w-3" />}
                            {item.trend === "down" && <TrendingDown className="h-3 w-3" />}
                            {item.change}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{item.location}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Note */}
          <Card className="bg-warning/5 border-warning/20">
            <CardContent className="pt-6">
              <p className="text-sm text-foreground">
                <strong>Note:</strong> Prices are indicative and may vary based on quality, quantity, and local market conditions. 
                Last updated: Today at 9:00 AM. Refresh for latest rates.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default MarketPrices;
