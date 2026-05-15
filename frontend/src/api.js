const API_BASE_URL = "http://127.0.0.1:8000";

export async function askRag(query, language = "English") {
  const response = await fetch(`${API_BASE_URL}/rag/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, language }),
  });

  if (!response.ok) {
    throw new Error("Failed to ask AI VAIDYA");
  }

  return response.json();
}

export async function analyzeHybridVision(mode, imageFile) {
  const formData = new FormData();
  formData.append("mode", mode);
  formData.append("image", imageFile);

  const response = await fetch(`${API_BASE_URL}/vision/hybrid-analyze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to analyze image");
  }

  return response.json();
}

export async function getPrakritiQuestions() {
  const response = await fetch(`${API_BASE_URL}/prakriti/questions`);

  if (!response.ok) {
    throw new Error("Failed to load Prakriti questions");
  }

  return response.json();
}

export async function analyzePrakriti(answers) {
  const response = await fetch(`${API_BASE_URL}/prakriti/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ answers }),
  });

  if (!response.ok) {
    throw new Error("Failed to analyze Prakriti");
  }

  return response.json();
}

export async function generateDinacharya(prakriti_type) {
  const response = await fetch(`${API_BASE_URL}/dinacharya/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prakriti_type }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate Dinacharya");
  }

  return response.json();
}

export async function recommendRecipe(prakriti_type, condition) {
  const response = await fetch(`${API_BASE_URL}/recipes/recommend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prakriti_type, condition }),
  });

  if (!response.ok) {
    throw new Error("Failed to recommend recipe");
  }

  return response.json();
}