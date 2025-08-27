import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

  const handleColorPreset = (color: string) => {
    setSelectedColor(color);
  };

  const handleMetalnessChange = (value: number[]) => {
    setMetalness(value);
  };

  const handleRoughnessChange = (value: number[]) => {
    setRoughness(value);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Car Preview - Simplified CSS-based car */}
      <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border min-h-[400px] flex items-center justify-center">
        <div className="car-container" data-testid="car-preview">
          {/* Simple CSS Car */}
          <div className="relative">
            {/* Simple Car Shape */}
            <div 
              className="w-48 h-24 rounded-xl shadow-2xl mx-auto transform transition-all duration-500 hover:scale-110"
              style={{ backgroundColor: selectedColor }}
            >
              {/* Car Body */}
              <div className="w-full h-full rounded-xl relative">
                {/* Windshield */}
                <div className="absolute top-1 left-6 w-36 h-8 bg-gradient-to-b from-blue-200/30 to-blue-300/50 rounded-t-lg"></div>
                
                {/* Wheels */}
                <div className="absolute -left-2 top-16 w-8 h-8 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                <div className="absolute -right-2 top-16 w-8 h-8 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                <div className="absolute left-6 top-16 w-8 h-8 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                <div className="absolute right-6 top-16 w-8 h-8 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                
                {/* Headlights */}
                <div className="absolute right-2 top-8 w-3 h-3 bg-yellow-100 rounded-full shadow-lg"></div>
                <div className="absolute right-2 top-12 w-3 h-3 bg-yellow-100 rounded-full shadow-lg"></div>
              </div>
            </div>
            
            {/* Material Properties Visual Effect */}
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
        </div>
      </div>

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