from pydantic import BaseModel
from typing import Dict, List


class PrakritiRequest(BaseModel):
    answers: List[str]


DOSHA_MAP = {
    "thin": "vata",
    "dry": "vata",
    "light_sleep": "vata",
    "quick": "vata",
    "anxious": "vata",

    "medium": "pitta",
    "warm": "pitta",
    "sharp_hunger": "pitta",
    "focused": "pitta",
    "irritable": "pitta",

    "heavy": "kapha",
    "oily": "kapha",
    "deep_sleep": "kapha",
    "calm": "kapha",
    "slow": "kapha",
}


RECOMMENDATIONS = {
    "vata": {
        "meaning": "Vata is linked with movement, creativity, dryness, and irregular energy.",
        "diet": ["Warm cooked food", "Soups", "Ghee", "Rice", "Root vegetables"],
        "avoid": ["Cold drinks", "Raw food", "Excess caffeine"],
        "exercise": ["Gentle yoga", "Walking", "Stretching"],
        "lifestyle": ["Fixed sleep routine", "Oil massage", "Stay warm"],
        "herbs": ["Ashwagandha", "Dashamoola", "Bala"],
    },
    "pitta": {
        "meaning": "Pitta is linked with heat, digestion, focus, and intensity.",
        "diet": ["Cooling foods", "Coconut water", "Cucumber", "Rice", "Milk"],
        "avoid": ["Spicy food", "Fried food", "Excess heat", "Anger triggers"],
        "exercise": ["Swimming", "Moon salutations", "Moderate workouts"],
        "lifestyle": ["Avoid overheating", "Take breaks", "Practice calm breathing"],
        "herbs": ["Amla", "Guduchi", "Neem"],
    },
    "kapha": {
        "meaning": "Kapha is linked with stability, strength, calmness, and heaviness.",
        "diet": ["Light warm food", "Millets", "Ginger tea", "Steamed vegetables"],
        "avoid": ["Heavy sweets", "Excess dairy", "Day sleep", "Too much oily food"],
        "exercise": ["Cardio", "Fast walking", "Dynamic yoga"],
        "lifestyle": ["Wake early", "Stay active", "Avoid laziness"],
        "herbs": ["Trikatu", "Tulsi", "Ginger"],
    },
}


def analyze_prakriti(answers: List[str]) -> Dict:
    score = {
        "vata": 0,
        "pitta": 0,
        "kapha": 0,
    }

    for answer in answers:
        dosha = DOSHA_MAP.get(answer)
        if dosha:
            score[dosha] += 1

    total = sum(score.values())

    if total == 0:
        return {
            "error": "No valid answers found",
            "message": "Please submit valid quiz options."
        }

    percentages = {
        dosha: round((value / total) * 100, 2)
        for dosha, value in score.items()
    }

    sorted_doshas = sorted(percentages.items(), key=lambda x: x[1], reverse=True)

    primary = sorted_doshas[0][0]
    secondary = sorted_doshas[1][0]

    if percentages[secondary] >= 30:
        prakriti_type = f"{primary.capitalize()}-{secondary.capitalize()} Dominant"
    else:
        prakriti_type = f"{primary.capitalize()} Dominant"

    return {
        "prakriti_type": prakriti_type,
        "scores": percentages,
        "primary_dosha": primary,
        "secondary_dosha": secondary,
        "explanation": RECOMMENDATIONS[primary]["meaning"],
        "recommendations": RECOMMENDATIONS[primary],
    }