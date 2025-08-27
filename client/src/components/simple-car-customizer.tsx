import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ObjectUploader } from "@/components/ObjectUploader";
import { Upload, Download, RotateCcw } from "lucide-react";
import type { UploadResult } from "@uppy/core";

const COLOR_PRESETS = [
  { name: "Racing Red", color: "#FF1744" },
  { name: "Electric Blue", color: "#0052D4" },
  { name: "Midnight Black", color: "#1A1A1A" },
  { name: "Pearl White", color: "#F8F8FF" },
  { name: "Solar Yellow", color: "#FFD600" },
  { name: "Forest Green", color: "#228B22" },
  { name: "Sunset Orange", color: "#FF6B35" },
  { name: "Royal Purple", color: "#6A0DAD" }
];

interface CarCustomizerProps {
  className?: string;
}

export function SimpleCarCustomizer({ className = "" }: CarCustomizerProps) {
  const [selectedColor, setSelectedColor] = useState("#FF1744");
  const [metalness, setMetalness] = useState([0.8]);
  const [roughness, setRoughness] = useState([0.2]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [clickPosition, setClickPosition] = useState<{x: number, y: number} | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<HTMLImageElement>(null);

  // Color modification function
  const modifyImageColor = (targetColor: string, clickX?: number, clickY?: number) => {
    const canvas = canvasRef.current;
    const originalImage = originalImageRef.current;
    
    if (!canvas || !originalImage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsProcessing(true);

    // Set canvas size to match image
    canvas.width = originalImage.naturalWidth;
    canvas.height = originalImage.naturalHeight;

    // Draw original image
    ctx.drawImage(originalImage, 0, 0);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Convert target color to RGB
    const targetRgb = hexToRgb(targetColor);
    if (!targetRgb) return;

    // If click position provided, get the clicked color for targeted replacement
    let targetPixelColor = null;
    if (clickX !== undefined && clickY !== undefined) {
      const pixelIndex = (clickY * canvas.width + clickX) * 4;
      targetPixelColor = {
        r: data[pixelIndex],
        g: data[pixelIndex + 1], 
        b: data[pixelIndex + 2]
      };
    }

    // Process each pixel
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      let shouldModify = false;

      if (targetPixelColor) {
        // Targeted color replacement - check if pixel is similar to clicked color
        const colorDiff = Math.sqrt(
          Math.pow(r - targetPixelColor.r, 2) +
          Math.pow(g - targetPixelColor.g, 2) +
          Math.pow(b - targetPixelColor.b, 2)
        );
        shouldModify = colorDiff < 60; // Tolerance for similar colors
      } else {
        // General car paint detection (avoid very dark/bright colors)
        const brightness = (r + g + b) / 3;
        shouldModify = brightness > 30 && brightness < 220 && 
                      Math.max(r, g, b) - Math.min(r, g, b) > 20;
      }

      if (shouldModify) {
        // Apply new color while preserving some original characteristics
        const factor = 0.7; // How much of the new color to apply
        data[i] = Math.min(255, r * (1 - factor) + targetRgb.r * factor);
        data[i + 1] = Math.min(255, g * (1 - factor) + targetRgb.g * factor);
        data[i + 2] = Math.min(255, b * (1 - factor) + targetRgb.b * factor);
      }
    }

    // Apply material effects
    const metalnessFactor = metalness[0];
    const roughnessFactor = roughness[0];

    for (let i = 0; i < data.length; i += 4) {
      // Add metallic effect
      if (metalnessFactor > 0.5) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const metallic = metalnessFactor * 0.3;
        data[i] = Math.min(255, data[i] + avg * metallic);
        data[i + 1] = Math.min(255, data[i + 1] + avg * metallic);
        data[i + 2] = Math.min(255, data[i + 2] + avg * metallic);
      }

      // Add roughness effect
      if (roughnessFactor > 0.5) {
        const noise = (Math.random() - 0.5) * roughnessFactor * 20;
        data[i] = Math.max(0, Math.min(255, data[i] + noise));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
      }
    }

    // Put modified image data back
    ctx.putImageData(imageData, 0, 0);

    // Convert canvas to data URL
    const processedDataUrl = canvas.toDataURL();
    setProcessedImage(processedDataUrl);
    setIsProcessing(false);
  };

  // Hex to RGB conversion
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Handle image upload
  const handleGetUploadParameters = async () => {
    const response = await fetch('/api/objects/upload', {
      method: 'POST',
    });
    const { uploadURL } = await response.json();
    return {
      method: 'PUT' as const,
      url: uploadURL,
    };
  };

  const handleUploadComplete = (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful && result.successful.length > 0) {
      const uploadedFile = result.successful[0];
      const imageUrl = uploadedFile.uploadURL;
      if (imageUrl) {
        setUploadedImage(imageUrl);
        
        // Load the image
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          if (originalImageRef.current && imageUrl) {
            originalImageRef.current.src = imageUrl;
          }
          // Process with current color
          setTimeout(() => {
            modifyImageColor(selectedColor);
          }, 100);
        };
        img.src = imageUrl;
      }
    }
  };

  // Handle image click for targeted color replacement
  const handleImageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!uploadedImage) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / rect.width * (originalImageRef.current?.naturalWidth || 1));
    const y = Math.floor((event.clientY - rect.top) / rect.height * (originalImageRef.current?.naturalHeight || 1));
    
    setClickPosition({ x, y });
    modifyImageColor(selectedColor, x, y);
  };

  // Handle color preset change
  const handleColorPreset = (color: string) => {
    setSelectedColor(color);
    if (uploadedImage) {
      modifyImageColor(color, clickPosition?.x, clickPosition?.y);
    }
  };

  const handleMetalnessChange = (value: number[]) => {
    setMetalness(value);
    if (uploadedImage) {
      modifyImageColor(selectedColor, clickPosition?.x, clickPosition?.y);
    }
  };

  const handleRoughnessChange = (value: number[]) => {
    setRoughness(value);
    if (uploadedImage) {
      modifyImageColor(selectedColor, clickPosition?.x, clickPosition?.y);
    }
  };

  // Download processed image
  const downloadImage = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.download = 'customized-car.png';
      link.href = processedImage;
      link.click();
    }
  };

  // Reset to original image
  const resetImage = () => {
    setClickPosition(null);
    if (uploadedImage) {
      modifyImageColor(selectedColor);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Car Preview */}
      <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border min-h-[400px] flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center" data-testid="car-preview">
          {uploadedImage ? (
            /* Uploaded Car Image */
            <div 
              className="relative cursor-crosshair max-w-full max-h-full"
              onClick={handleImageClick}
              title="Click on car parts to change their color"
            >
              {isProcessing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-lg">
                  <div className="text-white bg-blue-600 px-4 py-2 rounded-lg">
                    Processing image...
                  </div>
                </div>
              )}
              
              {processedImage ? (
                <img 
                  src={processedImage}
                  alt="Customized car"
                  className="max-w-full max-h-[380px] object-contain rounded-lg shadow-2xl"
                  crossOrigin="anonymous"
                />
              ) : (
                <img 
                  src={uploadedImage}
                  alt="Original car"
                  className="max-w-full max-h-[380px] object-contain rounded-lg shadow-2xl"
                  crossOrigin="anonymous"
                />
              )}
              
              {clickPosition && (
                <div 
                  className="absolute w-4 h-4 border-2 border-white rounded-full pointer-events-none"
                  style={{
                    left: `${clickPosition.x / (originalImageRef.current?.naturalWidth || 1) * 100}%`,
                    top: `${clickPosition.y / (originalImageRef.current?.naturalHeight || 1) * 100}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              )}
            </div>
          ) : (
            /* Simple CSS Car */
            <div className="relative">
              <div 
                className="w-48 h-24 rounded-xl shadow-2xl mx-auto transform transition-all duration-500 hover:scale-110"
                style={{ backgroundColor: selectedColor }}
              >
                <div className="w-full h-full rounded-xl relative">
                  <div className="absolute top-1 left-6 w-36 h-8 bg-gradient-to-b from-blue-200/30 to-blue-300/50 rounded-t-lg"></div>
                  <div className="absolute -left-2 top-16 w-8 h-8 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                  <div className="absolute -right-2 top-16 w-8 h-8 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                  <div className="absolute left-6 top-16 w-8 h-8 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                  <div className="absolute right-6 top-16 w-8 h-8 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                  <div className="absolute right-2 top-8 w-3 h-3 bg-yellow-100 rounded-full shadow-lg"></div>
                  <div className="absolute right-2 top-12 w-3 h-3 bg-yellow-100 rounded-full shadow-lg"></div>
                </div>
              </div>
              
              <div 
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{
                  background: `linear-gradient(45deg, 
                    rgba(255,255,255,${metalness[0] * 0.3}) 0%, 
                    transparent 50%, 
                    rgba(0,0,0,${roughness[0] * 0.2}) 100%)`,
                  mixBlendMode: 'overlay'
                }}
              ></div>
            </div>
          )}
        </div>
        
        {/* Upload prompt overlay when no image is uploaded */}
        {!uploadedImage && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/70 text-white px-6 py-3 rounded-lg text-center">
              <Upload className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm">Upload a car image to start customizing</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Hidden elements for image processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <img ref={originalImageRef} style={{ display: 'none' }} crossOrigin="anonymous" />

      {/* Upload and Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        <ObjectUploader
          maxNumberOfFiles={1}
          maxFileSize={10485760}
          onGetUploadParameters={handleGetUploadParameters}
          onComplete={handleUploadComplete}
          buttonClassName="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload Car Image
        </ObjectUploader>
        
        {uploadedImage && processedImage && (
          <Button
            onClick={downloadImage}
            variant="outline"
            className="flex items-center gap-2"
            data-testid="button-download-image"
          >
            <Download className="w-4 h-4" />
            Download Result
          </Button>
        )}
        
        {uploadedImage && clickPosition && (
          <Button
            onClick={resetImage}
            variant="outline"
            className="flex items-center gap-2"
            data-testid="button-reset-image"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Selection
          </Button>
        )}
      </div>
      
      {uploadedImage && (
        <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Instructions:</strong> Click on any part of the car to target that color for modification. 
            Then use the color presets below to change it. Adjust metalness and roughness to fine-tune the material finish.
          </p>
        </div>
      )}

      {/* Controls Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Color Presets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedColor }}></span>
              Color Presets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {COLOR_PRESETS.map((preset) => (
                <Button
                  key={preset.name}
                  variant={selectedColor === preset.color ? "default" : "outline"}
                  className="justify-start h-auto py-3"
                  onClick={() => handleColorPreset(preset.color)}
                  data-testid={`button-color-${preset.name.toLowerCase().replace(' ', '-')}`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-background shadow-sm" 
                      style={{ backgroundColor: preset.color }}
                    />
                    <span className="text-sm">{preset.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Material Properties */}
        <Card>
          <CardHeader>
            <CardTitle>Material Properties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Metalness</label>
                <Badge variant="outline">{metalness[0].toFixed(2)}</Badge>
              </div>
              <Slider
                value={metalness}
                onValueChange={handleMetalnessChange}
                max={1}
                step={0.01}
                className="w-full"
                data-testid="slider-metalness"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Roughness</label>
                <Badge variant="outline">{roughness[0].toFixed(2)}</Badge>
              </div>
              <Slider
                value={roughness}
                onValueChange={handleRoughnessChange}
                max={1}
                step={0.01}
                className="w-full"
                data-testid="slider-roughness"
              />
            </div>
          </CardContent>
        </Card>
      </div>


    </div>
  );
}