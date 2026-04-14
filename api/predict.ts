import type { VercelRequest, VercelResponse } from '@vercel/node';

const predictDiabetes = (data: any) => {
  const {
    pregnancies = 0,
    glucose = 0,
    bloodPressure = 0,
    skinThickness = 0,
    insulin = 0,
    bmi = 0,
    pedigree = 0,
    age = 0,
  } = data;

  // Simplified Logistic Regression coefficients for demonstration
  const logit =
    -8.4 +
    0.12 * pregnancies +
    0.035 * glucose +
    -0.013 * bloodPressure +
    0.0006 * skinThickness +
    -0.001 * insulin +
    0.089 * bmi +
    0.94 * pedigree +
    0.014 * age;

  const probability = 1 / (1 + Math.exp(-logit));
  const result = probability > 0.5 ? 'Diabetic' : 'Non-Diabetic';

  return {
    prediction: result,
    probability: parseFloat(probability.toFixed(4)),
    confidence: Math.round(
      (result === 'Diabetic' ? probability : 1 - probability) * 100
    ),
    metrics: {
      glucoseRisk: glucose > 140 ? 'High' : 'Normal',
      bmiRisk: bmi > 30 ? 'High' : 'Normal',
      ageRisk: age > 45 ? 'Moderate' : 'Low',
    },
  };
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const prediction = predictDiabetes(req.body);
    return res.status(200).json(prediction);
  } catch (error) {
    return res.status(500).json({ error: 'Prediction failed' });
  }
}
