import { useState } from "react";
import { Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import fruitImage from "@/assets/fruit-detection.jpg";

const DiseaseDetection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setAnalyzing(true);
    
    try {
      const response = await fetch('https://serverless.roboflow.com/mourya-fayhi/workflows/detect-count-and-visualize-10', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          api_key: 'jpUBGThRukPDggdBe9hq',
          inputs: {
            "image": {"type": "base64", "value": selectedImage.split(',')[1]}
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Full API Response:', JSON.stringify(result, null, 2));
      
      // Debug: Log the structure to help understand the response format
      if (result && result.outputs) {
        console.log('Outputs keys:', Object.keys(result.outputs));
        Object.keys(result.outputs).forEach(key => {
          console.log(`Output ${key}:`, result.outputs[key]);
          // If this output has predictions, log its structure
          if (result.outputs[key].predictions) {
            console.log(`Predictions in output ${key}:`, result.outputs[key].predictions);
            console.log(`Predictions type:`, typeof result.outputs[key].predictions);
            if (typeof result.outputs[key].predictions === 'object') {
              console.log(`Predictions keys:`, Object.keys(result.outputs[key].predictions));
            }
          }
        });
      }
      
      // Parse workflow response - workflows return outputs with specific structure
      let predictions = [];
      let detection = null;
      
      // Check for workflow response structure
      if (result && result.outputs && Array.isArray(result.outputs)) {
        console.log('Workflow outputs:', result.outputs);
        
        // Loop through outputs array
        for (let i = 0; i < result.outputs.length; i++) {
          const output = result.outputs[i];
          
          // Check if this output has predictions
          if (output.predictions) {
            console.log(`Found predictions in output ${i}:`, output.predictions);
            
            // Handle different prediction formats
            if (Array.isArray(output.predictions)) {
              predictions = output.predictions;
            } else if (typeof output.predictions === 'object') {
              // Predictions might be an object with arrays inside
              const predObj = output.predictions;
              
              // Look for common prediction array property names
              if (predObj.predictions && Array.isArray(predObj.predictions)) {
                predictions = predObj.predictions;
              } else if (predObj.detections && Array.isArray(predObj.detections)) {
                predictions = predObj.detections;
              } else if (predObj.results && Array.isArray(predObj.results)) {
                predictions = predObj.results;
              } else {
                // Check all properties for arrays that look like predictions
                Object.keys(predObj).forEach(key => {
                  if (Array.isArray(predObj[key]) && predObj[key].length > 0) {
                    const firstItem = predObj[key][0];
                    if (firstItem && (firstItem.class || firstItem.className || firstItem.confidence !== undefined)) {
                      predictions = predObj[key];
                    }
                  }
                });
              }
            }
            
            if (predictions.length > 0) break; // Found predictions, stop looking
          }
        }
      } else if (result && result.predictions) {
        // Direct model response format
        predictions = Array.isArray(result.predictions) ? result.predictions : [];
      } else if (Array.isArray(result)) {
        // Array response format
        predictions = result;
      }

      console.log('Extracted predictions:', predictions);
      
      if (predictions && predictions.length > 0) {
        // Get the highest confidence detection
        detection = predictions.reduce((prev, current) => {
          const prevConf = prev.confidence || prev.score || 0;
          const currConf = current.confidence || current.score || 0;
          return (prevConf > currConf) ? prev : current;
        });
        
        console.log('Best detection:', detection);
        
        // Get treatment recommendations based on disease type
        const getTreatment = (diseaseClass: string) => {
          const treatments = {
            'apple_scab': [
              "Remove and destroy infected leaves immediately",
              "Apply fungicide spray every 10-14 days",
              "Ensure proper air circulation around trees",
              "Avoid overhead watering to reduce leaf wetness"
            ],
            'bacterial_spot': [
              "Remove infected fruits and leaves",
              "Apply copper-based bactericide",
              "Improve air circulation",
              "Avoid overhead irrigation"
            ],
            'early_blight': [
              "Remove affected plant parts",
              "Apply fungicide treatment",
              "Ensure proper plant spacing",
              "Practice crop rotation"
            ],
            'healthy': [
              "Your fruit appears healthy!",
              "Continue regular care and monitoring",
              "Maintain proper watering schedule",
              "Ensure adequate nutrition"
            ]
          };
          
          const normalizedClass = diseaseClass.toLowerCase().replace(/[\s-_]/g, '_');
          return treatments[normalizedClass] || [
            "Consult with a local agricultural expert",
            "Remove affected parts if visible",
            "Monitor plant health regularly",
            "Apply appropriate organic treatments"
          ];
        };
        
        // Extract class name and confidence from various possible property names
        const diseaseClass = detection.class || detection.className || detection.predicted_class || detection.label || "Unknown Issue";
        const confidence = detection.confidence || detection.score || detection.probability || 0;
        
        console.log('Final detection result:', { diseaseClass, confidence });
        
        // Check if this is a valid fruit/disease detection
        const isValidDetection = confidence > 0.3 && diseaseClass && diseaseClass !== "Unknown Issue";
        
        if (isValidDetection) {
          setResult({
            disease: diseaseClass,
            severity: confidence > 0.8 ? "High" : confidence > 0.5 ? "Medium" : "Low",
            confidence: Math.round(confidence * 100),
            treatment: getTreatment(diseaseClass)
          });
        } else {
          // Low confidence or unknown - treat as invalid image
          setResult({
            disease: "Invalid Image or Unclear Detection",
            severity: "Unable to Analyze",
            confidence: Math.round(confidence * 100),
            treatment: []
          });
        }
      } else {
        // No detections found - could be invalid image or healthy fruit
        setResult({
          disease: "Invalid Image or No Detection",
          severity: "Unable to Analyze",
          confidence: 0,
          treatment: []
        });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setResult({
        disease: "Analysis Error",
        severity: "Unable to Process",
        confidence: 0,
        treatment: [
          "Unable to analyze the image at this time",
          "Please try again with a clearer image",
          "Ensure good lighting and focus",
          "Contact support if the issue persists"
        ]
      });
    }
    
    setAnalyzing(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "low": return "text-success";
      case "medium": return "text-warning";
      case "high": return "text-destructive";
      default: return "text-foreground";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      
      <main className="container px-4 py-12 flex-1">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold text-foreground">Fruit Disease Detection</h1>
            <p className="text-lg text-muted-foreground">
              Upload a clear photo of your fruit to identify diseases and get treatment recommendations
            </p>
          </div>

          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Fruit Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div 
                  className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  {selectedImage ? (
                    <img 
                      src={selectedImage} 
                      alt="Selected fruit" 
                      className="max-h-64 mx-auto rounded-lg shadow-md"
                    />
                  ) : (
                    <div className="space-y-4">
                      <Upload className="h-16 w-16 mx-auto text-muted-foreground" />
                      <div>
                        <p className="text-lg font-medium text-foreground">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          PNG, JPG up to 10MB
                        </p>
                      </div>
                    </div>
                  )}
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {selectedImage && (
                  <Button 
                    onClick={analyzeImage} 
                    disabled={analyzing}
                    size="lg"
                    className="w-full"
                  >
                    {analyzing ? "Analyzing..." : "Analyze Image"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          {result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Alert className="border-success bg-success/5">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <AlertDescription className="text-foreground">
                  Analysis complete with {result.confidence}% confidence
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle>Detection Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Disease Detected</p>
                      <p className="text-2xl font-bold text-destructive">{result.disease}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Severity Level</p>
                      <p className={`text-2xl font-bold ${getSeverityColor(result.severity)}`}>
                        {result.severity}
                      </p>
                    </div>
                  </div>

                  {result.treatment && result.treatment.length > 0 && (
                    <div className="border-t pt-6">
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-primary" />
                        Recommended Treatment
                      </h3>
                      <ul className="space-y-3">
                        {result.treatment.map((step: string, index: number) => (
                          <li key={index} className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </span>
                            <span className="text-foreground">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(!result.treatment || result.treatment.length === 0) && (
                    <div className="border-t pt-6">
                      <div className="text-center p-6 bg-muted/50 rounded-lg">
                        <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                        <p className="text-lg font-medium text-muted-foreground mb-2">
                          Unable to Provide Treatment Recommendations
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Please try uploading a clearer image of a fruit or consult with an agricultural expert.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Example Image */}
          {!selectedImage && (
            <Card>
              <CardHeader>
                <CardTitle>How to Take a Good Photo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <img 
                    src={fruitImage} 
                    alt="Example fruit" 
                    className="rounded-lg shadow-md"
                  />
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Tips for Best Results:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>✓ Use natural daylight for clear photos</li>
                      <li>✓ Focus on the affected area of the fruit</li>
                      <li>✓ Keep the fruit in the center of the frame</li>
                      <li>✓ Avoid blurry or dark images</li>
                      <li>✓ Show multiple angles if possible</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DiseaseDetection;
