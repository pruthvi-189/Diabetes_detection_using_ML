import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock ML Model logic (Logistic Regression coefficients approximation)
  // In a real app, you'd load a .json or .bin model file here.
  const predictDiabetes = (data: any) => {
    const {
      pregnancies = 0,
      glucose = 0,
      bloodPressure = 0,
      skinThickness = 0,
      insulin = 0,
      bmi = 0,
      pedigree = 0,
      age = 0
    } = data;

    // These are simplified coefficients for demonstration
    // Logit = b0 + b1*Preg + b2*Gluc + b3*BP + b4*Skin + b5*Ins + b6*BMI + b7*Ped + b8*Age
    const logit = -8.4 
      + 0.12 * pregnancies 
      + 0.035 * glucose 
      + -0.013 * bloodPressure 
      + 0.0006 * skinThickness 
      + -0.001 * insulin 
      + 0.089 * bmi 
      + 0.94 * pedigree 
      + 0.014 * age;

    const probability = 1 / (1 + Math.exp(-logit));
    const result = probability > 0.5 ? "Diabetic" : "Non-Diabetic";
    
    return {
      prediction: result,
      probability: parseFloat(probability.toFixed(4)),
      confidence: Math.round((result === "Diabetic" ? probability : 1 - probability) * 100),
      metrics: {
        glucoseRisk: glucose > 140 ? "High" : "Normal",
        bmiRisk: bmi > 30 ? "High" : "Normal",
        ageRisk: age > 45 ? "Moderate" : "Low"
      }
    };
  };

  // API Routes
  app.post("/api/predict", (req, res) => {
    try {
      const data = req.body;
      // Simulate network delay for "AI thinking" effect
      setTimeout(() => {
        const prediction = predictDiabetes(data);
        res.json(prediction);
      }, 1500);
    } catch (error) {
      res.status(500).json({ error: "Prediction failed" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
