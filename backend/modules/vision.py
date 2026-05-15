import os
import base64
from enum import Enum
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")


class VisionMode(str, Enum):
    herb = "herb"
    tongue = "tongue"
    skin = "skin"
    symptom = "symptom"


class VisionResult(BaseModel):
    mode: str
    visual_analysis: str
    semantic_query: str
    safety_note: str


def image_to_base64(image_bytes: bytes):
    return base64.b64encode(image_bytes).decode("utf-8")


def get_prompt(mode: str):
    common_rules = """
You are AI VAIDYA's visual wellness assistant.

Important rules:
- Do NOT give medical diagnosis.
- Do NOT claim certainty.
- Describe only visible patterns.
- Convert the visual observation into an Ayurveda-related semantic search query.
- Keep it educational and safe.
- If image is unclear, say it is unclear.
"""

    if mode == "herb":
        return common_rules + """
Task:
Analyze the uploaded herb/plant image.

Return exactly in this format:

VISUAL_ANALYSIS:
- Possible herb name:
- Confidence:
- Visible features:
- Possible Ayurvedic uses:
- Safety warning:

SEMANTIC_QUERY:
Ayurvedic uses, properties, safety and preparation of [possible herb name]
"""

    if mode == "tongue":
        return common_rules + """
Task:
Analyze the uploaded tongue image for visual wellness patterns.

Look for:
- coating
- color
- cracks
- dryness
- redness
- texture

Return exactly in this format:

VISUAL_ANALYSIS:
- Visible tongue patterns:
- Possible Ayurvedic imbalance:
- General wellness meaning:
- Safety warning:

SEMANTIC_QUERY:
Ayurvedic explanation for tongue coating color cracks dryness redness and possible dosha imbalance
"""

    if mode == "skin":
        return common_rules + """
Task:
Analyze the uploaded skin image for visible skin wellness patterns.

Look for:
- acne
- redness
- rash-like appearance
- dryness
- inflammation
- pigmentation
- oily/congested appearance

Return exactly in this format:

VISUAL_ANALYSIS:
- Visible skin patterns:
- Possible Ayurvedic imbalance:
- General wellness meaning:
- Safety warning:

SEMANTIC_QUERY:
Ayurvedic explanation and remedies for skin redness acne inflammation dryness pigmentation dosha imbalance
"""

    return common_rules + """
Task:
Analyze the uploaded image for visible symptoms or wellness patterns.

Return exactly in this format:

VISUAL_ANALYSIS:
- Visible patterns:
- Possible Ayurvedic wellness connection:
- Safety warning:

SEMANTIC_QUERY:
Ayurvedic explanation for the visible symptoms and related dosha imbalance
"""


def split_response(text: str):
    visual_analysis = text
    semantic_query = "Ayurvedic explanation for visible wellness patterns and dosha imbalance"

    if "SEMANTIC_QUERY:" in text:
        parts = text.split("SEMANTIC_QUERY:", 1)
        visual_analysis = parts[0].replace("VISUAL_ANALYSIS:", "").strip()
        semantic_query = parts[1].strip()

    return visual_analysis, semantic_query


def analyze_image_with_gemini(image_bytes: bytes, mime_type: str, mode: str):
    if not GEMINI_API_KEY:
        return {
            "mode": mode,
            "visual_analysis": "Gemini API key missing. Add GEMINI_API_KEY in backend/.env.",
            "semantic_query": "Ayurvedic explanation for visible wellness patterns",
            "safety_note": "Educational guidance only. Not medical diagnosis."
        }

    client = genai.Client(api_key=GEMINI_API_KEY)

    prompt = get_prompt(mode)

    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=[
            types.Part.from_bytes(
                data=image_bytes,
                mime_type=mime_type,
            ),
            prompt,
        ],
    )

    visual_analysis, semantic_query = split_response(response.text)

    return {
        "mode": mode,
        "visual_analysis": visual_analysis,
        "semantic_query": semantic_query,
        "safety_note": "AI VAIDYA visual analysis is educational only, not medical diagnosis."
    }