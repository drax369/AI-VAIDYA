from PIL import Image
import torch
from transformers import CLIPProcessor, CLIPModel
import io

MODEL_NAME = "openai/clip-vit-base-patch32"

device = "cuda" if torch.cuda.is_available() else "cpu"

model = CLIPModel.from_pretrained(MODEL_NAME).to(device)
processor = CLIPProcessor.from_pretrained(MODEL_NAME)


LABELS = {
    "herb": [
        "a photo of tulsi holy basil leaves",
        "a photo of neem leaves",
        "a photo of mint leaves",
        "a photo of curry leaves",
        "a photo of aloe vera plant",
        "a photo of turmeric root",
        "a photo of ginger root",
        "a photo of amla indian gooseberry",
        "a photo of ashwagandha plant",
        "a photo of giloy plant"
    ],

    "skin": [
        "a close up photo of psoriasis skin condition",
        "a close up photo of eczema skin condition",
        "a close up photo of acne on skin",
        "a close up photo of fungal infection on skin",
        "a close up photo of skin rash",
        "a close up photo of red inflamed skin",
        "a close up photo of dry flaky skin",
        "a close up photo of pigmentation on skin"
    ],

    "tongue": [
        "a photo of tongue with white coating",
        "a photo of tongue with yellow coating",
        "a photo of red tongue",
        "a photo of pale tongue",
        "a photo of cracked tongue",
        "a photo of dry tongue",
        "a photo of healthy tongue"
    ],

    "symptom": [
        "a photo showing swelling",
        "a photo showing inflammation",
        "a photo showing redness",
        "a photo showing wound",
        "a photo showing rash",
        "a photo showing dryness",
        "a photo showing discoloration"
    ]
}


def clean_label(label: str):
    label = label.replace("a photo of ", "")
    label = label.replace("a close up photo of ", "")
    label = label.replace("skin condition", "")
    label = label.replace("on skin", "")
    return label.strip()


def classify_image_clip(image_bytes: bytes, mode: str):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    candidate_labels = LABELS.get(mode, LABELS["symptom"])

    inputs = processor(
        text=candidate_labels,
        images=image,
        return_tensors="pt",
        padding=True
    ).to(device)

    with torch.no_grad():
        outputs = model(**inputs)
        logits_per_image = outputs.logits_per_image
        probs = logits_per_image.softmax(dim=1)[0]

    ranked = sorted(
        [
            {
                "label": clean_label(candidate_labels[i]),
                "raw_label": candidate_labels[i],
                "confidence": round(float(probs[i]) * 100, 2)
            }
            for i in range(len(candidate_labels))
        ],
        key=lambda x: x["confidence"],
        reverse=True
    )

    top = ranked[0]

    semantic_query = (
        f"Ayurvedic explanation, causes, care, herbs, diet and safety guidance for possible {top['label']}"
    )

    return {
        "mode": mode,
        "top_prediction": top,
        "all_predictions": ranked[:5],
        "semantic_query": semantic_query,
        "model": MODEL_NAME,
        "device": device,
        "safety_note": "This is zero-shot visual classification, not confirmed medical diagnosis."
    }