from pydantic import BaseModel


class DinacharyaRequest(BaseModel):
    prakriti_type: str


DINACHARYA_PLANS = {
    "vata": {
        "morning": [
            "Wake up at a fixed time.",
            "Drink warm water.",
            "Do gentle stretching or yoga.",
            "Apply warm sesame oil massage if possible.",
            "Eat a warm, nourishing breakfast."
        ],
        "afternoon": [
            "Eat lunch at the same time daily.",
            "Prefer warm cooked meals.",
            "Avoid skipping meals.",
            "Take short calming breaks."
        ],
        "evening": [
            "Avoid too much screen time at night.",
            "Eat light but warm dinner.",
            "Practice slow breathing.",
            "Sleep early and keep routine consistent."
        ],
    },
    "pitta": {
        "morning": [
            "Wake up early but avoid rushing.",
            "Drink normal or slightly cool water.",
            "Do calming yoga or walking.",
            "Avoid overheating during exercise.",
            "Eat a cooling balanced breakfast."
        ],
        "afternoon": [
            "Eat lunch on time.",
            "Avoid spicy and oily meals.",
            "Take breaks from intense work.",
            "Stay hydrated."
        ],
        "evening": [
            "Avoid late-night arguments or stressful work.",
            "Eat cooling and light dinner.",
            "Practice meditation.",
            "Sleep in a cool environment."
        ],
    },
    "kapha": {
        "morning": [
            "Wake up early before sunrise if possible.",
            "Avoid sleeping late.",
            "Drink warm water with ginger if suitable.",
            "Do energetic exercise.",
            "Eat a light breakfast."
        ],
        "afternoon": [
            "Prefer light, warm meals.",
            "Avoid heavy oily foods.",
            "Stay active after meals.",
            "Avoid daytime sleep."
        ],
        "evening": [
            "Take a brisk walk.",
            "Eat early and light dinner.",
            "Avoid sweets at night.",
            "Keep yourself mentally active."
        ],
    },
}


def normalize_prakriti(prakriti_type: str) -> str:
    value = prakriti_type.lower()

    if "vata" in value:
        return "vata"
    if "pitta" in value:
        return "pitta"
    if "kapha" in value:
        return "kapha"

    return "vata"


def generate_dinacharya(prakriti_type: str):
    dosha = normalize_prakriti(prakriti_type)
    plan = DINACHARYA_PLANS[dosha]

    return {
        "prakriti_type": prakriti_type,
        "primary_dosha_used": dosha,
        "meaning": f"This routine is designed to balance {dosha.capitalize()} tendencies.",
        "daily_routine": plan,
        "safety_note": "This is general educational Ayurvedic guidance, not medical diagnosis."
    }