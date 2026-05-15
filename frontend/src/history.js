export function getHistory() {
  return JSON.parse(localStorage.getItem("aiVaidyaHistory") || "[]");
}

export function saveHistory(item) {
  const history = getHistory();

  const newItem = {
    id: crypto.randomUUID(),
    createdAt: new Date().toLocaleString(),
    ...item,
  };

  localStorage.setItem(
    "aiVaidyaHistory",
    JSON.stringify([newItem, ...history].slice(0, 30))
  );

  return newItem;
}

export function clearHistory() {
  localStorage.removeItem("aiVaidyaHistory");
}