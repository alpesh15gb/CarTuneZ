import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Upload, Download, Share2, RotateCcw } from "lucide-react";
import { ObjectUploader } from "@/components/ObjectUploader";
import type { UploadResult } from "@uppy/core";
import { apiRequest } from "@/lib/queryClient";

export function CustomizerTool() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [bodyColor, setBodyColor] = useState("#2563eb");
  const [wheelColor, setWheelColor] = useState("#000000");
  const [decorStyle, setDecorStyle] = useState<string>("");
  const [brightness, setBrightness] = useState([100]);
  const [contrast, setContrast] = useState([100]);
  const [saturation, setSaturation] = useState([100]);
  const [hue, setHue] = useState([0]);
  const [colorSensitivity, setColorSensitivity] = useState([50]); // Controls how selective the color detection is
  const [targetColor, setTargetColor] = useState<{r: number, g: number, b: number} | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);

  // Advanced color detection and replacement for cars
  const applyFilters = useCallback(() => {
    if (!originalImageRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = originalImageRef.current;
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw original image first
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    // Get image data for pixel manipulation
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Enhanced car color detection algorithm
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const alpha = data[i + 3];

      if (alpha === 0) continue; // Skip transparent pixels

      // Calculate pixel coordinates for position-based exclusions
      const pixelIndex = i / 4;
      const x = pixelIndex % canvas.width;
      const y = Math.floor(pixelIndex / canvas.width);

      // Convert to HSL for better color manipulation
      const [h, s, l] = rgbToHsl(r, g, b);
      
      // Target-specific color detection
      let isCarColor = false;
      
      if (targetColor) {
        // Convert target color to HSL
        const [targetH, targetS, targetL] = rgbToHsl(targetColor.r, targetColor.g, targetColor.b);
        const sensitivity = colorSensitivity[0] / 100;
        
        // Calculate color similarity with enhanced tolerance
        const hDiff = Math.min(Math.abs(h - targetH), 1 - Math.abs(h - targetH)); // Handle hue wraparound
        const sDiff = Math.abs(s - targetS);
        const lDiff = Math.abs(l - targetL);
        
        // More lenient matching for car colors
        const hTolerance = 0.15 * sensitivity; // Hue tolerance
        const sTolerance = 0.3 * sensitivity;  // Saturation tolerance
        const lTolerance = 0.25 * sensitivity; // Lightness tolerance
        
        isCarColor = hDiff < hTolerance && sDiff < sTolerance && lDiff < lTolerance;
      } else {
        // Fallback: broad car paint detection when no target selected
        const sensitivity = colorSensitivity[0] / 100;
        const isObviouslyNotCar = 
          l > 0.85 || l < 0.1 || // Extreme brightness
          (s < 0.08 && l > 0.65) || // Chrome/mirrors
          (y < canvas.height * 0.25 && (x < canvas.width * 0.2 || x > canvas.width * 0.8)); // Mirror positions
        
        isCarColor = !isObviouslyNotCar && (
          (s > 0.12 * sensitivity && l > 0.2 && l < 0.75) || // Colored paints
          (l > 0.15 && l < 0.45 && s > 0.05 * sensitivity) // Dark metallics
        );
      }

      if (isCarColor) {
        // Apply enhanced color modifications
        let newH = (h + hue[0] / 360) % 1;
        let newS = Math.max(0, Math.min(1, s * (saturation[0] / 100)));
        let newL = Math.max(0, Math.min(1, l * (brightness[0] / 100)));
        
        // Apply contrast
        newL = ((newL - 0.5) * (contrast[0] / 100)) + 0.5;
        newL = Math.max(0, Math.min(1, newL));

        const [newR, newG, newB] = hslToRgb(newH, newS, newL);
        
        data[i] = newR;
        data[i + 1] = newG;
        data[i + 2] = newB;
      }
    }

    // Apply the modified image data back to canvas
    ctx.putImageData(imageData, 0, 0);
  }, [brightness, contrast, saturation, hue, colorSensitivity, targetColor]);

  // RGB to HSL conversion
  const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h, s, l];
  };

  // HSL to RGB conversion
  const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  };

  const loadImage = useCallback((imageSrc: string) => {
    const img = new Image();
    img.onload = () => {
      originalImageRef.current = img;
      applyFilters();
    };
    img.onerror = (error) => {
      console.error("Error loading image:", error);
    };
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
  }, [applyFilters]);

  const handleFileUpload = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        loadImage(result);
      };
      reader.readAsDataURL(file);
    }
  }, [loadImage]);

  // Apply filters whenever settings change
  useEffect(() => {
    if (uploadedImage && originalImageRef.current) {
      applyFilters();
    }
  }, [brightness, contrast, saturation, hue, colorSensitivity, targetColor, applyFilters]);

  // Handle canvas click to select target color
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !originalImageRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);
    
    // Get the original image data (not the modified canvas)
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;
    
    tempCanvas.width = originalImageRef.current.width;
    tempCanvas.height = originalImageRef.current.height;
    tempCtx.drawImage(originalImageRef.current, 0, 0);
    
    const imageData = tempCtx.getImageData(x, y, 1, 1);
    const [r, g, b] = imageData.data;
    
    setTargetColor({ r, g, b });
    setShowColorPicker(true);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove('dragover');
    }
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.add('dragover');
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove('dragover');
    }
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  // Handle object storage upload
  const handleGetUploadParameters = async () => {
    const response = await apiRequest("/api/objects/upload", { method: "POST" });
    return {
      method: "PUT" as const,
      url: response.uploadURL,
    };
  };

  const handleUploadComplete = (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful && result.successful.length > 0) {
      const uploadURL = result.successful[0].uploadURL as string;
      console.log("Upload completed, URL:", uploadURL);
      
      // Convert Google Cloud Storage URL to our server endpoint
      // From: https://storage.googleapis.com/bucket-name/.private/uploads/id
      // To: /objects/uploads/id
      const urlParts = uploadURL.split('/.private/');
      if (urlParts.length === 2) {
        const objectPath = `/objects/${urlParts[1]}`;
        console.log("Converted object path:", objectPath);
        setUploadedImage(objectPath);
        loadImage(objectPath);
      } else {
        // Fallback: use the original URL
        setUploadedImage(uploadURL);
        loadImage(uploadURL);
      }
    }
  };

  const resetFilters = () => {
    setBrightness([100]);
    setContrast([100]);
    setSaturation([100]);
    setHue([0]);
    setColorSensitivity([50]);
    setTargetColor(null);
    setShowColorPicker(false);
  };

  const downloadImage = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = 'customized-car.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const colorPresets = [
    { body: "#2563eb", wheel: "#000000", name: "Classic Blue", hue: 220 },
    { body: "#ef4444", wheel: "#ffffff", name: "Racing Red", hue: 0 },
    { body: "#10b981", wheel: "#6b7280", name: "Forest Green", hue: 150 },
    { body: "#f59e0b", wheel: "#fbbf24", name: "Solar Yellow", hue: 45 },
    { body: "#8b5cf6", wheel: "#dc2626", name: "Royal Purple", hue: 270 },
    { body: "#6b7280", wheel: "#374151", name: "Metallic Gray", hue: 200 },
    { body: "#dc2626", wheel: "#1f2937", name: "Deep Red", hue: 355 },
    { body: "#059669", wheel: "#d97706", name: "Emerald Green", hue: 160 },
  ];

  const decorStyles = [
    "Racing Stripes",
    "Carbon Fiber",
    "Flame Design",
    "Tribal Pattern",
    "Geometric",
    "Chrome Accents"
  ];

  return (
    <section id="customizer" className="py-20 bg-background" data-testid="customizer-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="customizer-title">
            Real-Time Car Customizer
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="customizer-description">
            Upload your car photo and instantly visualize custom decor, colors, and modifications
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Upload Area */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-8">
                <div 
                  ref={dropAreaRef}
                  className="drag-drop-area rounded-xl p-8 text-center bg-card border-2 border-dashed border-border hover:border-primary transition-all duration-300"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  data-testid="upload-area"
                >
                  <Upload className="w-16 h-16 text-muted-foreground mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Upload Your Car Photo</h3>
                  <p className="text-muted-foreground mb-4">Drag & drop or use the upload options below</p>
                  
                  <div className="flex gap-3 justify-center">
                    <ObjectUploader
                      maxNumberOfFiles={1}
                      maxFileSize={10485760}
                      onGetUploadParameters={handleGetUploadParameters}
                      onComplete={handleUploadComplete}
                      buttonClassName="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Cloud Upload
                    </ObjectUploader>
                    
                    <Button 
                      className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                      onClick={() => fileInputRef.current?.click()}
                      data-testid="button-choose-file"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Quick Select
                    </Button>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-3">Supports JPG, PNG, WebP up to 10MB</p>
                  
                  <input 
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                    data-testid="file-input"
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Real-Time Modification Tools */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-foreground" data-testid="customization-tools-title">
                    Real-Time Modifications
                  </h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetFilters}
                    data-testid="button-reset-filters"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {/* Color Presets */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">Quick Color Themes</label>
                    <div className="flex gap-2 flex-wrap">
                      {colorPresets.map((preset, index) => (
                        <button
                          key={index}
                          onClick={() => setHue([preset.hue])}
                          className={`w-12 h-12 rounded-lg border-2 transition-all duration-200 ${
                            Math.abs(hue[0] - preset.hue) < 10 ? 'border-primary scale-110' : 'border-border hover:scale-105'
                          }`}
                          style={{ backgroundColor: preset.body }}
                          title={preset.name}
                          data-testid={`color-preset-${index}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Hue Adjustment */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Color Hue: {hue[0]}°
                    </label>
                    <Slider
                      value={hue}
                      onValueChange={setHue}
                      max={360}
                      min={0}
                      step={1}
                      className="w-full"
                      data-testid="slider-hue"
                    />
                  </div>

                  {/* Brightness Adjustment */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Brightness: {brightness[0]}%
                    </label>
                    <Slider
                      value={brightness}
                      onValueChange={setBrightness}
                      max={200}
                      min={50}
                      step={5}
                      className="w-full"
                      data-testid="slider-brightness"
                    />
                  </div>

                  {/* Contrast Adjustment */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Contrast: {contrast[0]}%
                    </label>
                    <Slider
                      value={contrast}
                      onValueChange={setContrast}
                      max={200}
                      min={50}
                      step={5}
                      className="w-full"
                      data-testid="slider-contrast"
                    />
                  </div>

                  {/* Saturation Adjustment */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Saturation: {saturation[0]}%
                    </label>
                    <Slider
                      value={saturation}
                      onValueChange={setSaturation}
                      max={200}
                      min={0}
                      step={5}
                      className="w-full"
                      data-testid="slider-saturation"
                    />
                  </div>

                  {/* Color Detection Sensitivity */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Paint Detection: {colorSensitivity[0]}%
                    </label>
                    <Slider
                      value={colorSensitivity}
                      onValueChange={setColorSensitivity}
                      max={100}
                      min={10}
                      step={5}
                      className="w-full"
                      data-testid="slider-sensitivity"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Lower = Only main body paint | Higher = Include trim details
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">Decor Style</label>
                    <div className="grid grid-cols-2 gap-2">
                      {decorStyles.map((style) => (
                        <Button
                          key={style}
                          variant={decorStyle === style ? "default" : "secondary"}
                          onClick={() => setDecorStyle(decorStyle === style ? "" : style)}
                          className="text-sm"
                          data-testid={`decor-style-${style.toLowerCase().replace(' ', '-')}`}
                        >
                          {style}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Preview Area */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4" data-testid="preview-title">
                  Real-Time Preview
                </h3>
                <div className="relative rounded-lg overflow-hidden bg-secondary" data-testid="preview-area">
                  {uploadedImage ? (
                    <div className="relative">
                      {/* Color Selection Instructions */}
                      <div className="absolute top-2 left-2 z-10 bg-black/80 text-white px-3 py-1 rounded-full text-xs">
                        💡 Click to select car area
                      </div>
                      
                      {/* Target Color Display */}
                      {targetColor && (
                        <div className="absolute top-2 right-2 z-10 flex items-center gap-2 bg-black/80 text-white px-3 py-1 rounded-full">
                          <div 
                            className="w-4 h-4 rounded-full border border-white/50"
                            style={{ backgroundColor: `rgb(${targetColor.r}, ${targetColor.g}, ${targetColor.b})` }}
                          />
                          <span className="text-xs">Target Selected</span>
                          <button
                            onClick={() => { setTargetColor(null); setShowColorPicker(false); }}
                            className="ml-1 text-white/70 hover:text-white text-xs"
                            data-testid="button-clear-target"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                      
                      <canvas
                        ref={canvasRef}
                        className="w-full h-auto max-h-96 object-contain cursor-crosshair"
                        data-testid="processed-image"
                        onClick={handleCanvasClick}
                        style={{ display: originalImageRef.current ? 'block' : 'none' }}
                      />
                      <img 
                        src={uploadedImage} 
                        alt="Uploaded car" 
                        className={`w-full h-auto max-h-96 object-contain ${originalImageRef.current ? 'hidden' : 'block'}`}
                        data-testid="fallback-image"
                        onLoad={() => {
                          // Trigger filter application when fallback image loads
                          if (!originalImageRef.current) {
                            loadImage(uploadedImage);
                          }
                        }}
                      />
                      
                      {/* Decor Style Overlay */}
                      {decorStyle && (
                        <div className="absolute top-4 left-4 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                          {decorStyle} Applied
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-video bg-secondary flex flex-col items-center justify-center space-y-4">
                      <div className="text-center">
                        <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-foreground">Upload an image to get started</h4>
                        <p className="text-muted-foreground">See real-time color and style modifications</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Settings Display */}
                {uploadedImage && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground grid grid-cols-2 gap-2">
                      <div>Hue: {hue[0]}°</div>
                      <div>Brightness: {brightness[0]}%</div>
                      <div>Contrast: {contrast[0]}%</div>
                      <div>Saturation: {saturation[0]}%</div>
                      <div>Detection: {colorSensitivity[0]}%</div>
                      <div className={targetColor ? "text-green-400 font-medium" : ""}>
                        {targetColor ? "🎯 Targeted Mode" : "🔍 General Mode"}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-4 flex gap-2">
                  <Button 
                    className="flex-1" 
                    onClick={downloadImage}
                    disabled={!uploadedImage}
                    data-testid="button-download"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="flex-1"
                    disabled={!uploadedImage}
                    data-testid="button-share"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary" data-testid="stat-customizations">500+</div>
                  <div className="text-sm text-muted-foreground">Customizations</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-accent" data-testid="stat-turnaround">24h</div>
                  <div className="text-sm text-muted-foreground">Turnaround</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-destructive" data-testid="stat-satisfaction">100%</div>
                  <div className="text-sm text-muted-foreground">Satisfaction</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
