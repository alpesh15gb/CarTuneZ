import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import chroma from "chroma-js";
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

export function ThreeCarCustomizer({ className = "" }: CarCustomizerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const carRef = useRef<THREE.Group>();
  const frameRef = useRef<number>();
  
  const [selectedColor, setSelectedColor] = useState("#FF1744");
  const [metalness, setMetalness] = useState([0.8]);
  const [roughness, setRoughness] = useState([0.2]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    // Set loading to false immediately to prevent infinite loading
    const initTimeout = setTimeout(() => {
      setLoading(false);
    }, 100);

    try {
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      // Scene setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x1a1a1a);
      sceneRef.current = scene;

      // Camera setup
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.set(5, 3, 5);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;

      // Renderer setup
      const renderer = new THREE.WebGLRenderer({ 
        antialias: false, // Disable for faster loading
        alpha: true 
      });
      renderer.setSize(width, height);
      renderer.shadowMap.enabled = false; // Disable shadows for faster loading
      rendererRef.current = renderer;
      
      mountRef.current.appendChild(renderer.domElement);

      // Simple lighting setup
      const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(10, 10, 5);
      scene.add(directionalLight);

    // Create car geometry (simplified car shape)
    const carGroup = new THREE.Group();
    
    // Car body
    const bodyGeometry = new THREE.BoxGeometry(4, 1.5, 2);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: selectedColor,
      metalness: 0.8,
      roughness: 0.2,
      envMapIntensity: 1.0
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1;
    body.castShadow = true;
    body.receiveShadow = true;
    carGroup.add(body);

    // Car roof
    const roofGeometry = new THREE.BoxGeometry(3, 1, 1.8);
    const roofMaterial = new THREE.MeshStandardMaterial({
      color: selectedColor,
      metalness: 0.8,
      roughness: 0.2,
      envMapIntensity: 1.0
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 2.25;
    roof.position.x = -0.2;
    roof.castShadow = true;
    carGroup.add(roof);

    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 16);
    const wheelMaterial = new THREE.MeshStandardMaterial({
      color: 0x222222,
      metalness: 0.5,
      roughness: 0.8
    });

    const positions = [
      [-1.5, 0.5, -1.2],
      [1.5, 0.5, -1.2],
      [-1.5, 0.5, 1.2],
      [1.5, 0.5, 1.2]
    ];

    positions.forEach(([x, y, z]) => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial.clone());
      wheel.position.set(x, y, z);
      wheel.rotation.z = Math.PI / 2;
      wheel.castShadow = true;
      carGroup.add(wheel);
    });

    // Headlights
    const headlightGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const headlightMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
      emissive: 0x444444
    });

    const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial.clone());
    leftHeadlight.position.set(2.1, 1.2, -0.6);
    carGroup.add(leftHeadlight);

    const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial.clone());
    rightHeadlight.position.set(2.1, 1.2, 0.6);
    carGroup.add(rightHeadlight);

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.8,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    carRef.current = carGroup;
    scene.add(carGroup);
    setLoading(false);

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      
      if (isAnimating && carRef.current) {
        carRef.current.rotation.y += 0.01;
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update car color with smooth transition
  const updateCarColor = (newColor: string) => {
    if (!carRef.current) return;
    
    setSelectedColor(newColor);
    
    const carMaterials = carRef.current.children
      .filter(child => child instanceof THREE.Mesh)
      .map(mesh => (mesh as THREE.Mesh).material as THREE.MeshStandardMaterial)
      .filter(material => material.color && !material.userData?.isWheel);

    carMaterials.forEach(material => {
      if (material.color) {
        // Smooth color transition using Chroma.js
        const startColor = material.color.getHex();
        const colorScale = chroma.scale([`#${startColor.toString(16).padStart(6, '0')}`, newColor]);
        
        let startTime = Date.now();
        const duration = 800;
        
        const animateColor = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          const currentColor = colorScale(progress).hex();
          material.color.setHex(parseInt(currentColor.slice(1), 16));
          
          if (progress < 1) {
            requestAnimationFrame(animateColor);
          }
        };
        
        animateColor();
      }
    });
  };

  const updateMaterialProperty = (property: 'metalness' | 'roughness', value: number) => {
    if (!carRef.current) return;
    
    const carMaterials = carRef.current.children
      .filter(child => child instanceof THREE.Mesh)
      .map(mesh => (mesh as THREE.Mesh).material as THREE.MeshStandardMaterial)
      .filter(material => material[property] !== undefined && !material.userData?.isWheel);

    carMaterials.forEach(material => {
      if (material[property] !== undefined) {
        material[property] = value;
      }
    });
  };

  const handleMetalnessChange = (value: number[]) => {
    setMetalness(value);
    updateMaterialProperty('metalness', value[0]);
  };

  const handleRoughnessChange = (value: number[]) => {
    setRoughness(value);
    updateMaterialProperty('roughness', value[0]);
  };

  const handleColorPreset = (color: string) => {
    updateCarColor(color);
  };

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-[600px] ${className}`}>
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading 3D Car Customizer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 3D Viewport */}
      <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border">
        <div 
          ref={mountRef} 
          className="w-full h-[600px]" 
          data-testid="three-car-viewport"
        />
        
        {/* Viewport Controls */}
        <div className="absolute top-4 right-4 space-y-2">
          <Button
            onClick={toggleAnimation}
            variant={isAnimating ? "default" : "outline"}
            size="sm"
            data-testid="button-toggle-animation"
          >
            {isAnimating ? "Stop" : "Rotate"}
          </Button>
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