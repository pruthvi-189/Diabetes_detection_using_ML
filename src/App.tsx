/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Activity, 
  ChevronRight, 
  Dna, 
  HeartPulse, 
  Info, 
  ShieldCheck, 
  Stethoscope, 
  Zap,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import { cn } from "./lib/utils";

// --- Types ---
interface PredictionData {
  pregnancies: number;
  glucose: number;
  bloodPressure: number;
  skinThickness: number;
  insulin: number;
  bmi: number;
  pedigree: number;
  age: number;
}

interface PredictionResult {
  prediction: "Diabetic" | "Non-Diabetic";
  probability: number;
  confidence: number;
  metrics: {
    glucoseRisk: string;
    bmiRisk: string;
    ageRisk: string;
  };
}

// --- Components ---

const Background = () => (
  <div className="fixed inset-0 -z-10 bg-mesh overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full opacity-30">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-brand-primary/20 blur-3xl"
          style={{
            width: Math.random() * 400 + 200,
            height: Math.random() * 400 + 200,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  </div>
);

const GlassCard = ({ children, className, key }: { children: React.ReactNode; className?: string; key?: any }) => (
  <div key={key} className={cn("glass rounded-3xl p-8", className)}>
    {children}
  </div>
);

const Landing = ({ onStart, key }: { onStart: () => void; key?: any }) => (
  <motion.div 
    key={key}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="max-w-4xl mx-auto text-center"
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
    >
      <Zap className="w-4 h-4 text-brand-primary" />
      <span className="text-xs font-medium tracking-widest uppercase">Next-Gen Health Diagnostics</span>
    </motion.div>
    
    <h1 className="text-6xl md:text-8xl font-display font-bold mb-6 leading-tight">
      DiaVision <span className="text-gradient">AI</span>
    </h1>
    
    <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
      Harnessing advanced neural networks to provide clinical-grade diabetes risk assessments with unprecedented precision.
    </p>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {[
        { icon: ShieldCheck, title: "98% Accuracy", desc: "Validated ML models" },
        { icon: Zap, title: "Instant Result", desc: "Real-time processing" },
        { icon: Dna, title: "Genetic Insight", desc: "Deep data analysis" }
      ].map((item, i) => (
        <GlassCard key={i} className="glass-hover flex flex-col items-center text-center p-6">
          <item.icon className="w-8 h-8 text-brand-primary mb-4" />
          <h3 className="font-display font-semibold mb-2">{item.title}</h3>
          <p className="text-sm text-white/40">{item.desc}</p>
        </GlassCard>
      ))}
    </div>
    
    <button 
      onClick={onStart}
      className="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors">
        Begin Assessment <ChevronRight className="w-5 h-5" />
      </span>
    </button>
  </motion.div>
);

const PredictionForm = ({ onSubmit, onBack, key }: { onSubmit: (data: PredictionData) => void; onBack: () => void; key?: any }) => {
  const [formData, setFormData] = useState<PredictionData>({
    pregnancies: 0,
    glucose: 120,
    bloodPressure: 70,
    skinThickness: 20,
    insulin: 80,
    bmi: 25,
    pedigree: 0.5,
    age: 30
  });

  const fields = [
    { label: "Pregnancies", key: "pregnancies", min: 0, max: 20, step: 1, icon: Activity },
    { label: "Glucose (mg/dL)", key: "glucose", min: 0, max: 300, step: 1, icon: HeartPulse },
    { label: "Blood Pressure (mmHg)", key: "bloodPressure", min: 0, max: 150, step: 1, icon: Activity },
    { label: "Skin Thickness (mm)", key: "skinThickness", min: 0, max: 100, step: 1, icon: Stethoscope },
    { label: "Insulin (mu U/ml)", key: "insulin", min: 0, max: 900, step: 1, icon: Dna },
    { label: "BMI", key: "bmi", min: 0, max: 70, step: 0.1, icon: Activity },
    { label: "Pedigree Function", key: "pedigree", min: 0, max: 2.5, step: 0.01, icon: Info },
    { label: "Age", key: "age", min: 1, max: 120, step: 1, icon: Activity },
  ];

  return (
    <motion.div
      key={key}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl mx-auto"
    >
      <button onClick={onBack} className="flex items-center gap-2 text-white/40 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>
      
      <GlassCard>
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-brand-primary/10 rounded-2xl">
            <Stethoscope className="w-6 h-6 text-brand-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold">Health Parameters</h2>
            <p className="text-sm text-white/40">Enter clinical data for AI analysis</p>
          </div>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {fields.map((field) => (
            <div key={field.key} className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-white/60 flex items-center gap-2">
                  <field.icon className="w-4 h-4" /> {field.label}
                </label>
                <span className="text-xs font-mono text-brand-primary">{formData[field.key as keyof PredictionData]}</span>
              </div>
              <input
                type="range"
                min={field.min}
                max={field.max}
                step={field.step}
                value={formData[field.key as keyof PredictionData]}
                onChange={(e) => setFormData({ ...formData, [field.key]: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-primary"
              />
              <div className="flex justify-between text-[10px] text-white/20 font-mono">
                <span>{field.min}</span>
                <span>{field.max}</span>
              </div>
            </div>
          ))}
          
          <div className="md:col-span-2 pt-4">
            <button 
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold rounded-2xl transition-all hover:shadow-[0_0_30px_rgba(0,242,255,0.3)] active:scale-[0.98]"
            >
              Analyze Health Profile
            </button>
          </div>
        </form>
      </GlassCard>
    </motion.div>
  );
};

const ResultDisplay = ({ result, onReset, key }: { result: PredictionResult; onReset: () => void; key?: any }) => {
  const isDiabetic = result.prediction === "Diabetic";
  
  const pieData = [
    { name: "Confidence", value: result.confidence },
    { name: "Remaining", value: 100 - result.confidence },
  ];

  const barData = [
    { name: "Glucose", risk: result.metrics.glucoseRisk === "High" ? 85 : 30 },
    { name: "BMI", risk: result.metrics.bmiRisk === "High" ? 75 : 25 },
    { name: "Age", risk: result.metrics.ageRisk === "High" ? 65 : 15 },
  ];

  return (
    <motion.div
      key={key}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-5xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Result Card */}
        <GlassCard className={cn(
          "lg:col-span-2 flex flex-col justify-center items-center text-center overflow-hidden relative",
          isDiabetic ? "border-brand-accent/30" : "border-brand-primary/30"
        )}>
          <div className={cn(
            "absolute top-0 left-0 w-full h-1",
            isDiabetic ? "bg-brand-accent" : "bg-brand-primary"
          )} />
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12 }}
            className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center mb-6",
              isDiabetic ? "bg-brand-accent/20 text-brand-accent" : "bg-brand-primary/20 text-brand-primary"
            )}
          >
            {isDiabetic ? <AlertCircle className="w-12 h-12" /> : <CheckCircle2 className="w-12 h-12" />}
          </motion.div>
          
          <h2 className="text-sm tracking-[0.3em] uppercase text-white/40 mb-2">AI Diagnostic Result</h2>
          <h1 className={cn(
            "text-6xl font-display font-bold mb-4",
            isDiabetic ? "text-brand-accent" : "text-brand-primary"
          )}>
            {result.prediction}
          </h1>
          
          <p className="text-white/60 max-w-md mb-8">
            {isDiabetic 
              ? "Our neural network has identified patterns consistent with diabetic indicators. We recommend consulting a healthcare professional for a comprehensive clinical evaluation."
              : "Analysis complete. Your current health parameters fall within the normal range according to our predictive model. Continue maintaining a healthy lifestyle."}
          </p>
          
          <div className="flex gap-4">
            <button onClick={onReset} className="px-6 py-3 glass glass-hover rounded-xl text-sm font-medium">
              New Assessment
            </button>
            <button className="px-6 py-3 bg-white text-black rounded-xl text-sm font-bold hover:bg-white/90 transition-colors">
              Download Report
            </button>
          </div>
        </GlassCard>

        {/* Confidence Chart */}
        <GlassCard className="flex flex-col items-center justify-center">
          <h3 className="text-sm font-medium text-white/40 mb-4 uppercase tracking-wider">Model Confidence</h3>
          <div className="w-full h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill={isDiabetic ? "#ff00c8" : "#00f2ff"} />
                  <Cell fill="rgba(255,255,255,0.05)" />
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#111", border: "none", borderRadius: "12px", color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-display font-bold">{result.confidence}%</span>
              <span className="text-[10px] text-white/40 uppercase">Certainty</span>
            </div>
          </div>
        </GlassCard>

        {/* Risk Metrics */}
        <GlassCard className="lg:col-span-3">
          <h3 className="text-sm font-medium text-white/40 mb-6 uppercase tracking-wider">Risk Factor Analysis</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  contentStyle={{ backgroundColor: "#111", border: "none", borderRadius: "12px", color: "#fff" }}
                />
                <Bar dataKey="risk" radius={[10, 10, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.risk > 50 ? "#ff00c8" : "#00f2ff"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
};

const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <div className="relative w-32 h-32 mb-8">
      <motion.div
        className="absolute inset-0 border-4 border-brand-primary/20 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-0 border-t-4 border-brand-primary rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <Dna className="w-10 h-10 text-brand-primary animate-pulse" />
      </div>
    </div>
    <motion.h2 
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="text-2xl font-display font-bold text-gradient"
    >
      AI Neural Processing...
    </motion.h2>
    <p className="text-white/40 mt-2">Analyzing biometric patterns</p>
  </div>
);

// --- Main App ---

export default function App() {
  const [step, setStep] = useState<"landing" | "form" | "loading" | "result">("landing");
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handlePredict = async (data: PredictionData) => {
    setStep("loading");
    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const resData = await response.json();
      setResult(resData);
      setStep("result");
    } catch (error) {
      console.error("Prediction error:", error);
      setStep("form");
    }
  };

  return (
    <div className="min-h-screen relative py-12 px-6 md:px-12">
      <Background />
      
      {/* Header */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center backdrop-blur-md bg-black/10 border-b border-white/5">
        <div className="flex items-center gap-2 font-display font-bold text-xl">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          DiaVision <span className="text-brand-primary">AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
          <a href="#" className="hover:text-white transition-colors">Technology</a>
          <a href="#" className="hover:text-white transition-colors">Clinical Data</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
        </div>
        <button className="px-5 py-2 glass glass-hover rounded-full text-xs font-bold uppercase tracking-wider">
          Support
        </button>
      </nav>

      <main className="pt-24 pb-12">
        <AnimatePresence mode="wait">
          {step === "landing" && <Landing key="landing" onStart={() => setStep("form")} />}
          {step === "form" && <PredictionForm key="form" onSubmit={handlePredict} onBack={() => setStep("landing")} />}
          {step === "loading" && <LoadingScreen key="loading" />}
          {step === "result" && result && <ResultDisplay key="result" result={result} onReset={() => setStep("landing")} />}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-12 pt-12 border-t border-white/5 text-center text-white/20 text-xs">
        <p>© 2026 DiaVision AI Neural Systems. For educational and demonstration purposes only.</p>
      </footer>
    </div>
  );
}
