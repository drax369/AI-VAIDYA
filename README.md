# AI VAIDYA

AI VAIDYA is an AI-powered Ayurvedic wellness assistant built for intelligent Ayurveda guidance, Prakriti analysis, herbal recommendations, RAG-based Ayurveda knowledge retrieval, and hybrid computer vision analysis.

---

# Features

## AI Ayurveda Assistant

* Gemini-powered conversational Ayurveda assistant
* Context-aware RAG retrieval
* Multi-language support
* Voice interaction support
* Educational Ayurveda guidance

## Hybrid RAG Engine

* ChromaDB vector database
* Sentence-transformer embeddings
* Hybrid semantic + keyword retrieval
* Multi-folder Ayurveda dataset
* Source-grounded responses

## Vision Intelligence

* Herb recognition
* Tongue analysis
* Skin analysis
* Hybrid CLIP + Gemini Vision pipeline
* Image-based Ayurveda support

## Prakriti Analyzer

* Vata / Pitta / Kapha analysis
* Dynamic questionnaire system
* Personalized Dinacharya generation
* Lifestyle recommendations

## Ayurvedic Recommendation System

* Recipe recommendations
* Dinacharya generation
* Herb guidance
* Wellness routines

## Modern Frontend

* React + Vite frontend
* Animated 3D landing page
* Ayurvedic visual theme
* Voice UI
* Demo mode
* Saved history dashboard
* Responsive design

---

# Tech Stack

## Frontend

* React
* Vite
* TailwindCSS
* Framer Motion
* Three.js
* React Three Fiber
* Lucide Icons

## Backend

* FastAPI
* Python
* Gemini API
* ChromaDB
* Sentence Transformers
* Transformers
* Torch
* OpenCV

## AI Models

* Gemini 1.5 Flash
* SentenceTransformer all-MiniLM-L6-v2
* CLIP Vision Models

---

# Project Structure

```txt
ai-vaidya2/
│
├── backend/
│   ├── data/
│   │   ├── herbs/
│   │   ├── diseases/
│   │   ├── prakriti/
│   │   ├── routines/
│   │   ├── recipes/
│   │   └── treatments/
│   │
│   ├── rag/
│   ├── vision/
│   ├── prakriti/
│   ├── recipes/
│   ├── dinacharya/
│   ├── frontend_dist/
│   ├── chroma_db/
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# Local Installation

## Clone Repository

```bash
git clone YOUR_GITHUB_REPO_URL
cd ai-vaidya2
```

---

# Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create `.env`:

```env
GEMINI_API_KEY=your_api_key
GEMINI_MODEL=gemini-1.5-flash
```

Run ingestion:

```bash
python rag/ingest.py
```

Run backend:

```bash
uvicorn main:app --reload
```

Backend runs on:

```txt
http://127.0.0.1:8000
```

---

# Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

# Ayurveda Dataset

The RAG system supports:

* Herbs
* Diseases
* Recipes
* Treatments
* Dinacharya
* Prakriti

Dataset folders:

```txt
backend/data/
```

Rebuild embeddings anytime:

```bash
python rag/ingest.py
```

---

# API Endpoints

## RAG

```txt
POST /rag/ask
```

## Vision

```txt
POST /vision/hybrid-analyze
```

## Prakriti

```txt
GET /prakriti/questions
POST /prakriti/analyze
```

## Dinacharya

```txt
POST /dinacharya/generate
```

## Recipes

```txt
POST /recipes/recommend
```

---

# Safety Disclaimer

AI VAIDYA provides educational Ayurvedic wellness guidance only.

* Not a medical diagnosis system
* Not emergency medical support
* Not a replacement for professional healthcare
* Users should consult qualified professionals for medical concerns

---

# Demo Features

* Interactive AI chat
* Ayurveda RAG retrieval
* Vision analysis
* Voice assistant
* Prakriti analysis
* Recipe recommendations
* Dinacharya planner
* Animated Ayurvedic UI

---

# Future Improvements

* User authentication
* Cloud deployment
* Ayurveda PDF ingestion
* Personalized memory
* Fine-tuned Ayurveda models
* Mobile app version
* Real-time voice conversation
* Advanced medical image analysis

---

# Developed For

Hackathons, AI innovation showcases, Ayurvedic wellness systems, and AI-powered healthcare exploration.

---

# License

Educational and research purposes only.
