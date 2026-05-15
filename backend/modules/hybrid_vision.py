from modules.clip_vision import classify_image_clip
from modules.vision import analyze_image_with_gemini


def build_hybrid_semantic_query(mode: str, clip_result: dict, gemini_result: dict):
    top_label = clip_result["top_prediction"]["label"]
    confidence = clip_result["top_prediction"]["confidence"]

    gemini_query = gemini_result.get("semantic_query", "")

    return (
        f"Ayurvedic explanation, causes, dosha relation, herbs, diet, "
        f"lifestyle care and safety guidance for possible {top_label}. "
        f"Visual confidence: {confidence}%. "
        f"Additional visual context: {gemini_query}"
    )


def analyze_hybrid_vision(image_bytes: bytes, mime_type: str, mode: str):
    clip_result = classify_image_clip(image_bytes, mode)

    gemini_result = analyze_image_with_gemini(
        image_bytes=image_bytes,
        mime_type=mime_type,
        mode=mode
    )

    semantic_query = build_hybrid_semantic_query(
        mode=mode,
        clip_result=clip_result,
        gemini_result=gemini_result
    )

    return {
        "mode": mode,
        "clip_prediction": clip_result["top_prediction"],
        "top_5_predictions": clip_result["all_predictions"],
        "gemini_visual_analysis": gemini_result["visual_analysis"],
        "semantic_query": semantic_query,
        "model_stack": {
            "classifier": clip_result["model"],
            "vision_reasoner": "Gemini Vision",
            "retrieval": "Hybrid RAG"
        },
        "safety_note": (
            "This is AI-based visual wellness analysis only. "
            "It is not a confirmed medical diagnosis."
        )
    }