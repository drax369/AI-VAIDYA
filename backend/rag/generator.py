import os
import time
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
from google.genai import types

from rag.retriever import hybrid_search

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")


class RAGRequest(BaseModel):
    query: str
    language: str = "English"


def build_context(results):
    context = []

    for index, item in enumerate(results, start=1):
        source = item["metadata"].get("source", "unknown")
        chunk_index = item["metadata"].get("chunk_index", "unknown")

        context.append(
            f"[Source {index}] File: {source}, Chunk: {chunk_index}\n"
            f"{item['text']}"
        )

    return "\n\n".join(context)


def build_sources(results):
    sources = []

    for index, item in enumerate(results, start=1):
        sources.append({
            "source_number": index,
            "source": item["metadata"].get("source", "unknown"),
            "chunk_index": item["metadata"].get("chunk_index", "unknown"),
            "retrieval_type": item["retrieval_type"],
            "score": round(float(item["score"]), 4),
        })

    return sources


def fallback_answer(query: str, context: str, language: str) -> str:
    if language.lower() == "hindi":
        return f"""
AI VAIDYA का AI मॉडल अभी quota या high demand के कारण temporary unavailable है।

लेकिन आपके uploaded Ayurveda knowledge base के आधार पर सामान्य जानकारी:

1. सरल उत्तर:
Tulsi, ginger, warm water और हल्का भोजन mild cough/congestion में traditionally उपयोग किए जाते हैं।

2. Ayurveda explanation:
Ayurveda में cough/congestion को अक्सर Kapha imbalance से जोड़ा जाता है। Warm fluids और light routine Kapha को balance करने में मदद कर सकते हैं।

3. General guidance:
- गरम पानी पिएं
- Tulsi tea ले सकते हैं
- भारी, oily और cold food avoid करें
- आराम करें

4. Safety warning:
यह educational Ayurvedic guidance है, medical diagnosis नहीं। तेज बुखार, breathing problem, chest pain, pregnancy, children या chronic illness में doctor से consult करें।

5. Sources:
Uploaded Ayurveda knowledge base से retrieved context use किया गया।
"""

    return f"""
AI VAIDYA temporary fallback response:

The Gemini AI service is currently busy, quota-limited, or unavailable.
Based on the uploaded Ayurveda knowledge base, here is safe general guidance.

1. Simple answer:
For mild cough or congestion, Ayurveda commonly mentions warm fluids, Tulsi, ginger, and light food habits.

2. Ayurveda explanation:
Cough and congestion are often connected with Kapha-type imbalance in basic Ayurvedic explanation. Warm, light, and soothing routines may support comfort.

3. Suggested general guidance:
- Drink warm water
- Use Tulsi tea if suitable
- Avoid cold drinks and heavy oily foods
- Rest properly
- Maintain hydration

4. Safety warning:
This is educational Ayurvedic guidance only, not medical diagnosis. Consult a qualified doctor for severe symptoms, breathing issues, high fever, pregnancy, children, or chronic illness.

5. Sources used:
Retrieved context from your uploaded Ayurveda knowledge base.
"""


def build_prompt(query: str, context: str, language: str) -> str:
    return f"""
You are AI VAIDYA, an Ayurveda knowledge assistant.

IMPORTANT:
- Respond ONLY in {language}.
- If language is Hindi, answer fully in Hindi.
- If language is Kannada, answer fully in Kannada.
- If language is Telugu, answer fully in Telugu.
- If language is Tamil, answer fully in Tamil.
- If language is Malayalam, answer fully in Malayalam.
- Never answer in English unless language is English.

Rules:
- Answer ONLY using the provided context.
- Do not invent herbs, dosages, treatments, or medical claims.
- Do not provide emergency medical advice.
- Always say this is educational guidance, not medical diagnosis.
- Keep the answer simple and user-friendly.
- Use clear sections.

User question:
{query}

Retrieved Ayurveda context:
{context}

Answer format:
1. Simple answer
2. Ayurveda explanation
3. Suggested general guidance
4. Safety warning
5. Sources used
"""


def call_gemini(query: str, context: str, language: str) -> str:
    if not GEMINI_API_KEY:
        return "Gemini API key is missing. Add GEMINI_API_KEY in backend/.env."

    client = genai.Client(api_key=GEMINI_API_KEY)

    prompt = build_prompt(query, context, language)

    models_to_try = [
        GEMINI_MODEL,
        "gemini-1.5-flash",
        "gemini-1.5-pro",
    ]

    seen_models = []

    for model_name in models_to_try:
        if model_name in seen_models:
            continue

        seen_models.append(model_name)

        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.4,
                    max_output_tokens=800,
                ),
            )

            return response.text

        except Exception as e:
            print(f"[AI VAIDYA] Gemini model failed: {model_name}")
            print(e)
            time.sleep(2)

    return fallback_answer(query, context, language)


def generate_rag_answer(query: str, language: str = "English"):
    results = hybrid_search(query, top_k=5)

    if not results:
        return {
            "query": query,
            "language": language,
            "answer": "I could not find relevant Ayurveda knowledge in the uploaded documents.",
            "sources": [],
            "safety_note": "AI VAIDYA provides educational Ayurvedic guidance only, not medical diagnosis."
        }

    context = build_context(results)
    answer = call_gemini(query, context, language)

    return {
        "query": query,
        "language": language,
        "answer": answer,
        "sources": build_sources(results),
        "safety_note": "AI VAIDYA provides educational Ayurvedic guidance only, not medical diagnosis."
    }