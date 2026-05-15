from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from modules.prakriti import PrakritiRequest, analyze_prakriti
from modules.prakriti_questions import PRAKRITI_QUESTIONS
from modules.dinacharya import DinacharyaRequest, generate_dinacharya
from modules.recipes import RecipeRequest, recommend_recipe
from rag.ingest import ingest_documents
from rag.generator import RAGRequest, generate_rag_answer
from fastapi import UploadFile, File, Form
from modules.vision import VisionMode, analyze_image_with_gemini
from rag.generator import generate_rag_answer
from modules.clip_vision import classify_image_clip
from modules.hybrid_vision import analyze_hybrid_vision
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path

app = FastAPI(
    title="AI VAIDYA Backend",
    description="Ayurveda RAG + Prakriti + Recipe + Vision AI Backend",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "AI VAIDYA backend is running",
        "status": "healthy"
    }

@app.get("/health")
def health_check():
    return {
        "backend": "active",
        "rag": "pending",
        "vision": "pending",
        "prakriti": "pending"
        
    }
@app.post("/prakriti/analyze")
def prakriti_analyze(request: PrakritiRequest):
    return analyze_prakriti(request.answers)

@app.get("/prakriti/questions")
def get_prakriti_questions():
    return {
        "total_questions": len(PRAKRITI_QUESTIONS),
        "questions": PRAKRITI_QUESTIONS
    }

@app.post("/dinacharya/generate")
def dinacharya_generate(request: DinacharyaRequest):
    return generate_dinacharya(request.prakriti_type)

@app.post("/recipes/recommend")
def recipe_recommend(request: RecipeRequest):
    return recommend_recipe(request.prakriti_type, request.condition)

@app.post("/rag/ingest")
def rag_ingest():
    return ingest_documents()


@app.post("/rag/ask")
def rag_ask(request: RAGRequest):
    return generate_rag_answer(request.query, request.language)

@app.post("/vision/analyze")
async def vision_analyze(
    mode: VisionMode = Form(...),
    image: UploadFile = File(...)
):
    image_bytes = await image.read()

    vision_result = analyze_image_with_gemini(
        image_bytes=image_bytes,
        mime_type=image.content_type,
        mode=mode.value
    )

    rag_result = generate_rag_answer(vision_result["semantic_query"])

    return {
        "mode": mode.value,
        "filename": image.filename,
        "visual_analysis": vision_result["visual_analysis"],
        "semantic_query": vision_result["semantic_query"],
        "rag_answer": rag_result["answer"],
        "sources": rag_result["sources"],
        "safety_note": "This is educational Ayurvedic wellness guidance, not medical diagnosis."
    }

@app.post("/vision/clip-analyze")
async def clip_vision_analyze(
    mode: VisionMode = Form(...),
    image: UploadFile = File(...)
):
    image_bytes = await image.read()

    clip_result = classify_image_clip(
        image_bytes=image_bytes,
        mode=mode.value
    )

    rag_result = generate_rag_answer(clip_result["semantic_query"])

    return {
        "mode": mode.value,
        "filename": image.filename,
        "clip_prediction": clip_result["top_prediction"],
        "top_5_predictions": clip_result["all_predictions"],
        "semantic_query": clip_result["semantic_query"],
        "rag_answer": rag_result["answer"],
        "sources": rag_result["sources"],
        "model": clip_result["model"],
        "device": clip_result["device"],
        "safety_note": "Possible visual pattern only. Not medical diagnosis."
    }

@app.post("/vision/hybrid-analyze")
async def hybrid_vision_analyze(
    mode: VisionMode = Form(...),
    image: UploadFile = File(...)
):
    image_bytes = await image.read()

    hybrid_result = analyze_hybrid_vision(
        image_bytes=image_bytes,
        mime_type=image.content_type,
        mode=mode.value
    )

    rag_result = generate_rag_answer(hybrid_result["semantic_query"])

    return {
        "mode": mode.value,
        "filename": image.filename,
        "clip_prediction": hybrid_result["clip_prediction"],
        "top_5_predictions": hybrid_result["top_5_predictions"],
        "gemini_visual_analysis": hybrid_result["gemini_visual_analysis"],
        "semantic_query": hybrid_result["semantic_query"],
        "rag_answer": rag_result["answer"],
        "sources": rag_result["sources"],
        "model_stack": hybrid_result["model_stack"],
        "safety_note": hybrid_result["safety_note"]
    }
FRONTEND_DIST = Path(__file__).parent / "frontend_dist"

if FRONTEND_DIST.exists():
    app.mount(
        "/assets",
        StaticFiles(directory=FRONTEND_DIST / "assets"),
        name="assets",
    )

    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        index_file = FRONTEND_DIST / "index.html"
        return FileResponse(index_file)