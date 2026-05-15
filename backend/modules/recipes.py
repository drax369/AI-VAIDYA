from pydantic import BaseModel


class RecipeRequest(BaseModel):
    prakriti_type: str
    condition: str


RECIPE_DATABASE = {
    "cough": {
        "vata": {
            "name": "Warm Tulsi Ginger Decoction",
            "ingredients": ["Tulsi leaves", "Ginger", "Black pepper", "Honey", "Water"],
            "steps": [
                "Boil 1 cup of water.",
                "Add tulsi leaves and crushed ginger.",
                "Add a small pinch of black pepper.",
                "Boil for 5 to 7 minutes.",
                "Let it become warm, then add honey.",
                "Drink slowly."
            ],
            "avoid_if": ["High fever", "Honey allergy", "Children below 1 year"]
        },
        "pitta": {
            "name": "Mulethi Cooling Herbal Drink",
            "ingredients": ["Mulethi", "Warm water", "Small amount of honey"],
            "steps": [
                "Boil mulethi in water for 5 minutes.",
                "Let it cool slightly.",
                "Add a small amount of honey if suitable.",
                "Sip slowly."
            ],
            "avoid_if": ["High blood pressure", "Pregnancy without doctor advice"]
        },
        "kapha": {
            "name": "Trikatu Ginger Tea",
            "ingredients": ["Dry ginger", "Black pepper", "Long pepper", "Water"],
            "steps": [
                "Boil water.",
                "Add a small pinch of trikatu mixture.",
                "Boil for 3 to 5 minutes.",
                "Drink warm."
            ],
            "avoid_if": ["Acidity", "Ulcers", "High Pitta symptoms"]
        }
    },

    "digestion": {
        "vata": {
            "name": "Ajwain Warm Water",
            "ingredients": ["Ajwain", "Warm water", "Rock salt"],
            "steps": [
                "Boil ajwain in water for 5 minutes.",
                "Add a tiny pinch of rock salt.",
                "Drink warm after meals."
            ],
            "avoid_if": ["Severe acidity", "Pregnancy without doctor advice"]
        },
        "pitta": {
            "name": "Coriander Fennel Water",
            "ingredients": ["Coriander seeds", "Fennel seeds", "Water"],
            "steps": [
                "Soak coriander and fennel overnight.",
                "Strain in the morning.",
                "Drink at room temperature."
            ],
            "avoid_if": ["Severe illness", "Known allergy"]
        },
        "kapha": {
            "name": "Ginger Lemon Digestive Drink",
            "ingredients": ["Ginger", "Lemon", "Warm water"],
            "steps": [
                "Add grated ginger to warm water.",
                "Add a few drops of lemon.",
                "Drink before meals if suitable."
            ],
            "avoid_if": ["Acidity", "Ulcers", "Burning sensation"]
        }
    },

    "stress": {
        "vata": {
            "name": "Ashwagandha Warm Milk",
            "ingredients": ["Ashwagandha powder", "Warm milk", "Jaggery optional"],
            "steps": [
                "Warm one cup of milk.",
                "Add a small amount of ashwagandha powder.",
                "Mix well.",
                "Drink at night if suitable."
            ],
            "avoid_if": ["Pregnancy", "Thyroid medication without doctor advice"]
        },
        "pitta": {
            "name": "Brahmi Cooling Drink",
            "ingredients": ["Brahmi", "Water", "Honey optional"],
            "steps": [
                "Prepare a mild brahmi infusion.",
                "Let it cool slightly.",
                "Drink calmly in the evening."
            ],
            "avoid_if": ["Sedative medication", "Pregnancy without doctor advice"]
        },
        "kapha": {
            "name": "Tulsi Clove Tea",
            "ingredients": ["Tulsi", "Clove", "Warm water"],
            "steps": [
                "Boil water with tulsi and one clove.",
                "Simmer for 5 minutes.",
                "Drink warm."
            ],
            "avoid_if": ["Acidity", "Excess body heat"]
        }
    }
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


def normalize_condition(condition: str) -> str:
    value = condition.lower()

    if "cough" in value or "cold" in value:
        return "cough"
    if "digest" in value or "gas" in value or "stomach" in value:
        return "digestion"
    if "stress" in value or "sleep" in value or "anxiety" in value:
        return "stress"

    return "digestion"


def recommend_recipe(prakriti_type: str, condition: str):
    dosha = normalize_prakriti(prakriti_type)
    condition_key = normalize_condition(condition)

    recipe = RECIPE_DATABASE[condition_key][dosha]

    return {
        "prakriti_type": prakriti_type,
        "primary_dosha_used": dosha,
        "condition": condition,
        "condition_matched": condition_key,
        "recommended_recipe": recipe,
        "simple_explanation": f"This recipe is selected for {condition_key} while considering {dosha.capitalize()} prakriti.",
        "safety_note": "This is general Ayurvedic educational guidance. Do not use as a replacement for medical treatment."
    }