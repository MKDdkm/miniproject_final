import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Users, Target } from "lucide-react";
import { DatabaseService } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Analytics = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const analyticsData = await DatabaseService.getDetectionStats();
      setStats(analyticsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <Navbar />
        <main className="container px-4 py-12 flex-1">
          <div className="text-center">Loading analytics...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      
      <main className="container px-4 py-12 flex-1">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold text-foreground">Detection Analytics</h1>
            <p className="text-lg text-muted-foreground">
              Real-time insights from fruit disease detection data
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Detections</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.total_detections || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Fruit scans analyzed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Disease Types Found</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.diseases_found?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Unique conditions detected
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Most Recent</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.recent_detections?.[0]?.detection_result?.disease || 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Latest detection
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Disease Breakdown */}
          {stats?.diseases_found && stats.diseases_found.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Disease Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.diseases_found.map((disease: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{disease.disease}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium">{disease.count}</div>
                        <div className="text-xs text-muted-foreground">detections</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Detections */}
          {stats?.recent_detections && stats.recent_detections.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Detections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recent_detections.map((detection: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">
                            {detection.detection_result.disease}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(detection.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={
                              detection.detection_result.severity === 'High' ? 'destructive' :
                              detection.detection_result.severity === 'Medium' ? 'default' :
                              'secondary'
                            }
                          >
                            {detection.detection_result.severity}
                          </Badge>
                          <div className="text-xs text-muted-foreground mt-1">
                            {Math.round((detection.detection_result.confidence || 0) * 100)}% confidence
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {(!stats || stats.total_detections === 0) && (
            <Card>
              <CardContent className="text-center py-12">
                <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
                <p className="text-muted-foreground">
                  Start using the disease detection feature to see analytics here.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Analytics;