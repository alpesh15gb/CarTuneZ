import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Download, Share2 } from "lucide-react";

export function CustomizerTool() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [bodyColor, setBodyColor] = useState("#2563eb");
  const [wheelColor, setWheelColor] = useState("#000000");
  const [decorStyle, setDecorStyle] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
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

  const colorPresets = [
    { body: "#2563eb", wheel: "#000000", name: "Classic Blue" },
    { body: "#ef4444", wheel: "#ffffff", name: "Racing Red" },
    { body: "#10b981", wheel: "#6b7280", name: "Forest Green" },
    { body: "#f59e0b", wheel: "#fbbf24", name: "Solar Yellow" },
    { body: "#8b5cf6", wheel: "#dc2626", name: "Royal Purple" },
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
                  className="drag-drop-area rounded-xl p-8 text-center bg-card border-2 border-dashed border-border hover:border-primary transition-all duration-300 cursor-pointer"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  data-testid="upload-area"
                >
                  <Upload className="w-16 h-16 text-muted-foreground mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Upload Your Car Photo</h3>
                  <p className="text-muted-foreground mb-4">Drag & drop or click to select your car image</p>
                  <Button 
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    data-testid="button-choose-file"
                  >
                    Choose File
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">Supports JPG, PNG, WebP up to 10MB</p>
                  
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
            
            {/* Color Picker Tools */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <h3 className="text-lg font-semibold text-foreground mb-4" data-testid="customization-tools-title">
                  Customization Tools
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">Body Color</label>
                    <div className="flex gap-2 flex-wrap">
                      {colorPresets.map((preset, index) => (
                        <button
                          key={index}
                          onClick={() => setBodyColor(preset.body)}
                          className={`w-12 h-12 rounded-lg border-2 transition-all duration-200 ${
                            bodyColor === preset.body ? 'border-primary scale-110' : 'border-border hover:scale-105'
                          }`}
                          style={{ backgroundColor: preset.body }}
                          title={preset.name}
                          data-testid={`color-preset-body-${index}`}
                        />
                      ))}
                      <input 
                        type="color" 
                        value={bodyColor} 
                        onChange={(e) => setBodyColor(e.target.value)}
                        className="w-12 h-12 rounded-lg border border-border cursor-pointer"
                        data-testid="color-picker-body"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">Wheel Color</label>
                    <div className="flex gap-2 flex-wrap">
                      {colorPresets.map((preset, index) => (
                        <button
                          key={index}
                          onClick={() => setWheelColor(preset.wheel)}
                          className={`w-12 h-12 rounded-lg border-2 transition-all duration-200 ${
                            wheelColor === preset.wheel ? 'border-primary scale-110' : 'border-border hover:scale-105'
                          }`}
                          style={{ backgroundColor: preset.wheel }}
                          title={`${preset.name} Wheels`}
                          data-testid={`color-preset-wheel-${index}`}
                        />
                      ))}
                      <input 
                        type="color" 
                        value={wheelColor} 
                        onChange={(e) => setWheelColor(e.target.value)}
                        className="w-12 h-12 rounded-lg border border-border cursor-pointer"
                        data-testid="color-picker-wheel"
                      />
                    </div>
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
                <h3 className="text-lg font-semibold text-foreground mb-4" data-testid="preview-title">Live Preview</h3>
                <div className="relative rounded-lg overflow-hidden bg-secondary" data-testid="preview-area">
                  {uploadedImage ? (
                    <div className="relative">
                      <img 
                        src={uploadedImage} 
                        alt="Uploaded car for customization" 
                        className="w-full h-auto max-h-96 object-contain"
                        data-testid="uploaded-image"
                      />
                      {/* Color overlay simulation */}
                      <div 
                        className="absolute inset-0 mix-blend-color opacity-30"
                        style={{ backgroundColor: bodyColor }}
                        data-testid="color-overlay"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-secondary flex items-center justify-center">
                      <img 
                        src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                        alt="Default car for customization preview" 
                        className="w-full h-full object-cover"
                        data-testid="default-preview-image"
                      />
                    </div>
                  )}
                </div>
                
                <div className="mt-4 flex gap-2">
                  <Button className="flex-1" data-testid="button-download">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="secondary" className="flex-1" data-testid="button-share">
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
