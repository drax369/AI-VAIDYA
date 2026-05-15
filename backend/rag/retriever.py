import chromadb
from rank_bm25 import BM25Okapi
from sentence_transformers import SentenceTransformer


CHROMA_DIR = "chroma_db"
COLLECTION_NAME = "ayurveda_knowledge"

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

client = chromadb.PersistentClient(path=CHROMA_DIR)
collection = client.get_or_create_collection(name=COLLECTION_NAME)


def tokenize(text: str):
    return text.lower().split()


def get_all_documents():
    data = collection.get()

    docs = data.get("documents", [])
    metadatas = data.get("metadatas", [])
    ids = data.get("ids", [])

    return [
        {
            "id": ids[i],
            "text": docs[i],
            "metadata": metadatas[i],
        }
        for i in range(len(docs))
    ]


def semantic_search(query: str, top_k: int = 5):
    query_embedding = embedding_model.encode([query]).tolist()[0]

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
    )

    output = []

    docs = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]

    for i, doc in enumerate(docs):
        output.append({
            "text": doc,
            "metadata": metadatas[i],
            "score": 1 - distances[i],
            "retrieval_type": "semantic",
        })

    return output


def keyword_search(query: str, top_k: int = 5):
    all_docs = get_all_documents()

    if not all_docs:
        return []

    corpus = [tokenize(doc["text"]) for doc in all_docs]
    bm25 = BM25Okapi(corpus)

    scores = bm25.get_scores(tokenize(query))
    ranked_indices = sorted(
        range(len(scores)),
        key=lambda i: scores[i],
        reverse=True
    )[:top_k]

    output = []

    for index in ranked_indices:
        output.append({
            "text": all_docs[index]["text"],
            "metadata": all_docs[index]["metadata"],
            "score": float(scores[index]),
            "retrieval_type": "keyword",
        })

    return output


def hybrid_search(query: str, top_k: int = 5):
    semantic_results = semantic_search(query, top_k=top_k)
    keyword_results = keyword_search(query, top_k=top_k)

    combined = semantic_results + keyword_results

    seen = set()
    unique_results = []

    for item in combined:
        key = item["text"][:150]

        if key not in seen:
            seen.add(key)
            unique_results.append(item)

    return unique_results[:top_k]