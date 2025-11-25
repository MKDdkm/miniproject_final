import React, { useState } from "react";
import { Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import fruitImage from "@/assets/fruit-detection.jpg";

const DiseaseDetection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageLoading(true);
      setApiError(null);
      
      // Check file size (max 5MB for mobile compatibility)
      if (file.size > 5 * 1024 * 1024) {
        setApiError('Image too large. Please use an image smaller than 5MB.');
        setImageLoading(false);
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setApiError('Please select a valid image file.');
        setImageLoading(false);
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
        setImageLoading(false);
      };
      reader.onerror = () => {
        setApiError('Error reading image. Please try again.');
        setImageLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setAnalyzing(true);
    setApiError(null);
    
    try {
      let result = null;
      let usingMockData = false;

      try {
        console.log('Preparing Roboflow Workflow API call...');
        
        // Prepare the image data - try base64 format first
        const imageData = selectedImage.split(',')[1]; // Remove data:image/jpeg;base64, prefix
        console.log('Image data length:', imageData.length);
        
        // Check if image is too large for mobile/API
        if (imageData.length > 4 * 1024 * 1024) { // 4MB base64 limit
          throw new Error('Image too large for analysis. Please use a smaller image.');
        }
        
        const requestBody = {
          api_key: 'jpUBGThRukPDggdBe9hq',
          inputs: {
            "image": {"type": "base64", "value": imageData}
          }
        };
        
        console.log('Request body size:', JSON.stringify(requestBody).length);
        
        // Add timeout for mobile networks
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        // Use your actual Roboflow workflow endpoint
        const response = await fetch('https://serverless.roboflow.com/mourya-fayhi/workflows/detect-count-and-visualize-11', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (response.ok) {
          result = await response.json();
          console.log('Roboflow Workflow Response:', JSON.stringify(result, null, 2));
          
          // Debug: Check response structure
          console.log('Response keys:', Object.keys(result));
          if (result.predictions) {
            console.log('Predictions structure:', result.predictions);
          }
          if (result.outputs) {
            console.log('Outputs structure:', result.outputs);
          }
        } else {
          const errorText = await response.text();
          console.error('API Error Response:', errorText);
          throw new Error(`API error: ${response.status} - ${errorText}`);
        }
      } catch (apiError) {
        console.warn('Roboflow workflow API failed:', apiError);
        
        // Handle specific errors
        if (apiError.name === 'AbortError') {
          setApiError('Request timeout. Please check your internet connection and try again.');
        } else if (apiError.message.includes('Image too large')) {
          setApiError(apiError.message);
        } else {
          setApiError('API unavailable. Using demo mode for testing.');
        }
        
        // Fallback to realistic mock detection
        usingMockData = true;
        const mockDiseases = [
          { class: 'apple_scab', confidence: 0.85 },
          { class: 'bacterial_spot', confidence: 0.78 },
          { class: 'early_blight', confidence: 0.92 },
          { class: 'healthy', confidence: 0.95 },
          { class: 'powdery_mildew', confidence: 0.73 }
        ];
        
        const randomDisease = mockDiseases[Math.floor(Math.random() * mockDiseases.length)];
        result = {
          outputs: [{ predictions: [randomDisease] }]
        };
        
        console.log('Using mock detection data:', result);
      }
      console.log('Roboflow Workflow Response:', JSON.stringify(result, null, 2));
      
      // Process the Roboflow workflow response
      let predictions = [];
      
      // Handle different Roboflow API response structures
      if (result.predictions && result.predictions.predictions && Array.isArray(result.predictions.predictions)) {
        // Direct model API format: predictions.predictions[array]
        predictions = result.predictions.predictions;
        console.log('Found direct model predictions:', predictions);
      } else if (result.outputs && Array.isArray(result.outputs)) {
        // Workflow API format: outputs[0].predictions.predictions[array] or outputs[0][key].predictions[array]
        for (const output of result.outputs) {
          console.log('Checking output:', output);
          
          // Check if output has predictions directly
          if (output.predictions && output.predictions.predictions && Array.isArray(output.predictions.predictions)) {
            predictions = output.predictions.predictions;
            console.log('Found workflow predictions (nested):', predictions);
            break;
          }
          
          // Check if output has direct predictions array
          if (output.predictions && Array.isArray(output.predictions)) {
            predictions = output.predictions;
            console.log('Found workflow predictions (direct):', predictions);
            break;
          }
          
          // Check if output is an object with prediction keys
          if (typeof output === 'object') {
            Object.keys(output).forEach(key => {
              const outputData = output[key];
              if (outputData && outputData.predictions) {
                if (Array.isArray(outputData.predictions)) {
                  predictions = outputData.predictions;
                  console.log(`Found predictions in output key '${key}':`, predictions);
                } else if (outputData.predictions.predictions && Array.isArray(outputData.predictions.predictions)) {
                  predictions = outputData.predictions.predictions;
                  console.log(`Found nested predictions in output key '${key}':`, predictions);
                }
              }
            });
          }
        }
      } else if (result.outputs) {
        // Mock/fallback format: outputs[0].predictions[array]
        console.log('Found outputs:', result.outputs);
        console.log('Outputs type:', typeof result.outputs);
        console.log('Outputs keys:', Object.keys(result.outputs));
        
        // Handle workflow output format - outputs might be an object or array
        if (Array.isArray(result.outputs)) {
          for (let i = 0; i < result.outputs.length; i++) {
            const output = result.outputs[i];
            console.log(`Output ${i}:`, output);
            if (output && output.predictions && Array.isArray(output.predictions)) {
              predictions = output.predictions;
              console.log(`Found predictions in output ${i}:`, predictions);
              break;
            }
          }
        } else {
          // Outputs might be an object with different keys
          Object.keys(result.outputs).forEach(key => {
            const output = result.outputs[key];
            console.log(`Output key '${key}':`, output);
            
            if (output && output.predictions && Array.isArray(output.predictions)) {
              predictions = output.predictions;
              console.log(`Found predictions in output '${key}':`, predictions);
            } else if (Array.isArray(output) && output.length > 0) {
              // Sometimes predictions are directly in the output
              const firstItem = output[0];
              if (firstItem && (firstItem.class || firstItem.className || firstItem.confidence !== undefined)) {
                predictions = output;
                console.log(`Found predictions array in output '${key}':`, predictions);
              }
            }
          });
        }
      } else if (result.predictions && Array.isArray(result.predictions)) {
        // Direct predictions format (fallback)
        predictions = result.predictions;
        console.log('Found direct predictions:', predictions);
      }
      
      console.log('Final extracted predictions:', predictions);
      
      if (predictions && predictions.length > 0) {
        // Get the highest confidence detection
        const bestPrediction = predictions.reduce((prev, current) => {
          const prevConf = prev.confidence || prev.score || 0;
          const currConf = current.confidence || current.score || 0;
          return (prevConf > currConf) ? prev : current;
        });

        console.log('Best prediction:', bestPrediction);

        // Map Roboflow class names to readable disease names and treatments
        const getDiseaseInfo = (className) => {
          const diseaseMap = {
            'apple_scab': {
              name: 'Apple Scab',
              treatment: [
                "Remove and destroy infected leaves immediately",
                "Apply fungicide spray every 10-14 days", 
                "Ensure proper air circulation around trees",
                "Avoid overhead watering to reduce leaf wetness"
              ]
            },
            'bacterial_spot': {
              name: 'Bacterial Spot',
              treatment: [
                "Remove infected fruits and leaves",
                "Apply copper-based bactericide",
                "Improve air circulation",
                "Avoid overhead irrigation"
              ]
            },
            'early_blight': {
              name: 'Early Blight',
              treatment: [
                "Remove affected plant parts",
                "Apply fungicide treatment",
                "Ensure proper plant spacing", 
                "Practice crop rotation"
              ]
            },
            'healthy': {
              name: 'Healthy Fruit',
              treatment: [
                "Your fruit appears healthy!",
                "Continue regular care and monitoring",
                "Maintain proper watering schedule",
                "Ensure adequate nutrition"
              ]
            },
            'apple_good': {
              name: 'Healthy Apple',
              treatment: [
                "Excellent! Your apple is in great condition",
                "Continue current care practices",
                "Harvest at optimal ripeness",
                "Store properly to maintain quality"
              ]
            }
          };

          const normalizedClass = className.toLowerCase().replace(/[\s-]/g, '_');
          return diseaseMap[normalizedClass] || {
            name: className,
            treatment: [
              "Consult with a local agricultural expert",
              "Remove affected parts if visible", 
              "Monitor plant health regularly",
              "Apply appropriate organic treatments"
            ]
          };
        };

        const diseaseInfo = getDiseaseInfo(bestPrediction.class);
        const confidence = bestPrediction.confidence;

        const detectionResult = {
          disease: diseaseInfo.name,
          confidence: confidence,
          severity: confidence > 0.8 ? "High" : confidence > 0.5 ? "Medium" : "Low",
          treatment: diseaseInfo.treatment,
          prevention: [
            "Regular inspection of plants",
            "Maintain proper spacing between plants", 
            "Use drip irrigation instead of overhead watering",
            "Remove fallen leaves and debris"
          ],
          isDemo: usingMockData
        };

        setResult(detectionResult);
        
      } else {
        // No detections found - better error message
        setResult({
          disease: "Invalid Image or No Fruit Detected",
          confidence: 0,
          severity: "Please Upload Valid Fruit Image",
          treatment: [
            "Upload a clear image of a fruit",
            "Ensure the fruit is well-lit and centered",
            "Try a different angle or closer shot",
            "Ensure good lighting",
            "Focus on the affected area"
          ],
          prevention: [
            "Use high-quality images",
            "Ensure proper lighting",
            "Focus on the fruit clearly",
            "Try different angles if needed"
          ]
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
        ],
        prevention: [
          "Check your internet connection",
          "Try uploading a different image",
          "Ensure the image format is supported",
          "Contact support if issues persist"
        ]
      });
    }
    
    setAnalyzing(false);
  };

  const analyzeAppleImage = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    setAnalyzing(true);
    setResult(null);

    try {
      console.log('Starting Apple Disease Detection...');
      
      // Convert image to base64
      const base64Image = selectedImage.split(',')[1];
      
      const response = await fetch('https://serverless.roboflow.com/mourya-fayhi/workflows/detect-count-and-visualize-12', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          api_key: 'jpUBGThRukPDggdBe9hq',
          inputs: {
            "image": {"type": "base64", "value": base64Image}
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Apple Detection Response:', result);

      // Parse Apple detection results
      let predictions = [];
      
      if (result.outputs && Array.isArray(result.outputs)) {
        for (const output of result.outputs) {
          if (output.predictions && Array.isArray(output.predictions)) {
            predictions = output.predictions;
            break;
          }
        }
      }

      console.log('Apple predictions:', predictions);

      if (predictions && predictions.length > 0) {
        const bestPrediction = predictions.reduce((prev, current) => {
          const prevConf = prev.confidence || prev.score || 0;
          const currConf = current.confidence || current.score || 0;
          return (prevConf > currConf) ? prev : current;
        });

        // Apple-specific disease mapping
        const getAppleDiseaseInfo = (className) => {
          const appleDiseaseMap = {
            'apple_scab': {
              name: 'Apple Scab',
              treatment: [
                "Remove and destroy infected leaves immediately",
                "Apply fungicide spray every 10-14 days", 
                "Ensure proper air circulation around trees",
                "Avoid overhead watering to reduce leaf wetness"
              ]
            },
            'apple_healthy': {
              name: 'Healthy Apple',
              treatment: [
                "Your apple appears healthy!",
                "Continue regular monitoring",
                "Maintain proper watering schedule",
                "Ensure adequate nutrition for the tree"
              ]
            },
            'apple_black_rot': {
              name: 'Apple Black Rot',
              treatment: [
                "Prune infected branches immediately",
                "Apply copper-based fungicide",
                "Remove infected fruits from tree and ground",
                "Improve air circulation around the tree"
              ]
            },
            'apple_cedar_rust': {
              name: 'Apple Cedar Rust',
              treatment: [
                "Remove nearby cedar trees if possible",
                "Apply preventive fungicide sprays in spring",
                "Remove infected leaves and fruits",
                "Plant resistant apple varieties"
              ]
            }
          };
          
          return appleDiseaseMap[className] || {
            name: className.replace('_', ' ').toUpperCase(),
            treatment: [
              "Consult with a local agricultural expert",
              "Remove affected plant parts",
              "Apply appropriate treatments as recommended",
              "Monitor the plant closely for changes"
            ]
          };
        };

        const diseaseInfo = getAppleDiseaseInfo(bestPrediction.class);
        const confidence = Math.round((bestPrediction.confidence || bestPrediction.score || 0) * 100);

        const detectionResult = {
          disease: diseaseInfo.name,
          confidence: confidence,
          severity: confidence > 80 ? "High" : confidence > 50 ? "Medium" : "Low",
          treatment: diseaseInfo.treatment,
          prevention: [
            "Regular inspection of apple trees",
            "Maintain proper spacing for air circulation", 
            "Use drip irrigation instead of overhead watering",
            "Remove fallen leaves and debris regularly",
            "Apply preventive treatments during growing season"
          ],
          isAppleDetection: true
        };

        setResult(detectionResult);
        toast.success('Apple analysis completed!');
        
      } else {
        setResult({
          disease: "No Apple Disease Detected",
          confidence: 0,
          severity: "Please Upload Clear Apple Image",
          treatment: [
            "Upload a clear image of an apple or apple leaf",
            "Ensure the apple/leaf is well-lit and centered",
            "Focus on any diseased areas if visible",
            "Try a closer shot of the affected area"
          ],
          prevention: [
            "Use high-quality apple images",
            "Ensure proper lighting",
            "Focus on the fruit or leaves clearly",
            "Try different angles if needed"
          ]
        });
        toast.warning('No apple diseases detected in image');
      }
    } catch (error) {
      console.error('Apple analysis error:', error);
      setResult({
        disease: "Apple Analysis Error",
        severity: "Unable to Process",
        confidence: 0,
        treatment: [
          "Unable to analyze the apple image",
          "Please try again with a clearer image",
          "Check your internet connection",
          "Contact support if issues persist"
        ],
        prevention: [
          "Check your internet connection",
          "Try uploading a different apple image",
          "Ensure the image format is supported",
          "Contact support if issues persist"
        ]
      });
      toast.error('Failed to analyze apple image');
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button 
                      onClick={analyzeImage} 
                      disabled={analyzing}
                      size="lg"
                      className="w-full"
                      variant="default"
                    >
                      {analyzing ? "Analyzing..." : "🍎 General Fruit Detection"}
                    </Button>
                    <Button 
                      onClick={analyzeAppleImage} 
                      disabled={analyzing}
                      size="lg"
                      className="w-full bg-red-600 hover:bg-red-700"
                    >
                      {analyzing ? "Analyzing..." : "🍏 Apple Disease Detection"}
                    </Button>
                  </div>
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
                  <CardTitle className="flex items-center justify-between">
                    Detection Results
                    {result.isDemo && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Demo Mode (API Unavailable)
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Simple Results Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">🍎 Fruit Type</p>
                      <p className="text-xl font-bold text-destructive">{result.disease}</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">📊 Confidence</p>
                      <p className="text-xl font-bold text-orange-600">{Math.round(result.confidence * 100)}%</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">⚡ Severity</p>
                      <p className={`text-xl font-bold ${getSeverityColor(result.severity)}`}>
                        {result.severity}
                      </p>
                    </div>
                  </div>

                  {/* Simple Treatment & Prevention */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {result.treatment && Array.isArray(result.treatment) && result.treatment.length > 0 && (
                      <div className="border rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-red-600">
                          🏥 Treatment
                        </h3>
                        <ul className="space-y-2">
                          {result.treatment.map((step: string, index: number) => (
                            <li key={index} className="flex gap-2">
                              <span className="text-red-500 font-bold">•</span>
                              <span className="text-sm">{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {result.prevention && Array.isArray(result.prevention) && result.prevention.length > 0 && (
                      <div className="border rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-green-600">
                          🛡️ Prevention Tips
                        </h3>
                        <ul className="space-y-2">
                          {result.prevention.map((tip: string, index: number) => (
                            <li key={index} className="flex gap-2">
                              <span className="text-green-500 font-bold">•</span>
                              <span className="text-sm">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {(!result.treatment || !Array.isArray(result.treatment) || result.treatment.length === 0) && (
                    <div className="text-center p-6 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200">
                      <AlertCircle className="h-12 w-12 mx-auto text-yellow-600 mb-3" />
                      <p className="text-lg font-medium text-yellow-800 dark:text-yellow-300 mb-2">
                        Please Upload a Valid Fruit Image
                      </p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-400">
                        Make sure the image shows a clear fruit that needs analysis.
                      </p>
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
