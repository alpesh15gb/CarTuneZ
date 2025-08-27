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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);

  // Apply filters to image
  const applyFilters = useCallback(() => {
    if (!originalImageRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = originalImageRef.current;
    canvas.width = img.width;
    canvas.height = img.height;

    // Apply CSS-style filters
    ctx.filter = `
      brightness(${brightness[0]}%) 
      contrast(${contrast[0]}%) 
      saturate(${saturation[0]}%) 
      hue-rotate(${hue[0]}deg)
    `;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  }, [brightness, contrast, saturation, hue]);

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
  }, [brightness, contrast, saturation, hue, applyFilters]);

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
    if (result.successful.length > 0) {
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
                      <canvas
                        ref={canvasRef}
                        className="w-full h-auto max-h-96 object-contain"
                        data-testid="processed-image"
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
