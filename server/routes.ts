import type { Express } from "express";
import { createServer, type Server } from "http";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const { firstName, lastName, email, phone, vehicle, service, message } = req.body;
      
      // Validate required fields
      if (!firstName || !lastName || !email || !phone || !vehicle || !service || !message) {
        return res.status(400).json({ 
          error: "All fields are required" 
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          error: "Invalid email format" 
        });
      }

      // In a real application, you would:
      // 1. Save the contact form data to a database
      // 2. Send confirmation email to the customer
      // 3. Send notification email to the business
      // 4. Perhaps integrate with a CRM system

      console.log("Contact form submission:", {
        firstName,
        lastName,
        email,
        phone,
        vehicle,
        service,
        message,
        timestamp: new Date().toISOString()
      });

      res.status(200).json({ 
        success: true,
        message: "Your quote request has been submitted successfully. We'll contact you within 2 hours."
      });

    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({ 
        error: "Failed to submit your request. Please try again." 
      });
    }
  });

  // Serve public assets from object storage
  app.get("/public-objects/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath;
    const objectStorageService = new ObjectStorageService();
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get upload URL for object storage
  app.post("/api/objects/upload", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    res.json({ uploadURL });
  });

  // Serve private objects (uploaded images)
  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(
        req.path,
      );
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error accessing object:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Gallery images endpoint
  app.get("/api/gallery", async (req, res) => {
    try {
      const { category } = req.query;

      // In a real application, you would fetch from database
      const galleryItems = [
        {
          id: 1,
          category: "wraps",
          title: "Chrome Wrap Package",
          subtitle: "Lamborghini Huracán",
          imageUrl: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3"
        },
        // More gallery items would be fetched from database
      ];

      const filteredItems = category && category !== "all" 
        ? galleryItems.filter(item => item.category === category)
        : galleryItems;

      res.status(200).json({
        success: true,
        items: filteredItems
      });

    } catch (error) {
      console.error("Gallery fetch error:", error);
      res.status(500).json({
        error: "Failed to fetch gallery items"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
