const API_BASE = "";

async function handleResponse(response, errorMessage) {
  if (!response.ok) {
    const errorText = await response.text();
    console.error(errorMessage, errorText);
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function askRag(query, language = "English") {
  const response = await fetch(`${API_BASE}/rag/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, language }),
  });

  return handleResponse(response, "Failed to ask AI VAIDYA");
}

export async function analyzeHybridVision(mode, imageFile) {
  const formData = new FormData();
  formData.append("mode", mode);
  formData.append("image", imageFile);

  const response = await fetch(`${API_BASE}/vision/hybrid-analyze`, {
    method: "POST",
    body: formData,
  });

  return handleResponse(response, "Failed to analyze image");
}

export async function getPrakritiQuestions() {
  const response = await fetch(`${API_BASE}/prakriti/questions`);

  return handleResponse(response, "Failed to load Prakriti questions");
}

export async function analyzePrakriti(answers) {
  const response = await fetch(`${API_BASE}/prakriti/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ answers }),
  });

  return handleResponse(response, "Failed to analyze Prakriti");
}

export async function generateDinacharya(prakriti_type) {
  const response = await fetch(`${API_BASE}/dinacharya/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prakriti_type }),
  });

  return handleResponse(response, "Failed to generate Dinacharya");
}

export async function recommendRecipe(prakriti_type, condition) {
  const response = await fetch(`${API_BASE}/recipes/recommend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prakriti_type, condition }),
  });

  return handleResponse(response, "Failed to recommend recipe");
}