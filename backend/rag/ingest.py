import uuid
from pathlib import Path

import chromadb
from pypdf import PdfReader
from sentence_transformers import SentenceTransformer


DATA_DIR = Path("data")
CHROMA_DIR = "chroma_db"
COLLECTION_NAME = "ayurveda_knowledge"

SUPPORTED_EXTENSIONS = [".txt", ".pdf"]

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

client = chromadb.PersistentClient(path=CHROMA_DIR)
collection = client.get_or_create_collection(name=COLLECTION_NAME)


def read_txt(file_path: Path) -> str:
    return file_path.read_text(encoding="utf-8", errors="ignore")


def read_pdf(file_path: Path) -> str:
    reader = PdfReader(str(file_path))
    text = ""

    for page_num, page in enumerate(reader.pages, start=1):
        page_text = page.extract_text() or ""
        text += f"\n\n[Page {page_num}]\n{page_text}"

    return text


def chunk_text(text: str, chunk_size: int = 800, overlap: int = 150):
    chunks = []
    start = 0

    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end].strip()

        if chunk:
            chunks.append(chunk)

        start += chunk_size - overlap

    return chunks


def get_all_files():
    files = []

    if not DATA_DIR.exists():
        DATA_DIR.mkdir(parents=True, exist_ok=True)

    for extension in SUPPORTED_EXTENSIONS:
        files.extend(DATA_DIR.rglob(f"*{extension}"))

    return files


def load_documents():
    documents = []
    files = get_all_files()

    for file_path in files:
        if file_path.suffix.lower() == ".txt":
            text = read_txt(file_path)
        elif file_path.suffix.lower() == ".pdf":
            text = read_pdf(file_path)
        else:
            continue

        chunks = chunk_text(text)

        relative_source = file_path.relative_to(DATA_DIR).as_posix()

        for index, chunk in enumerate(chunks):
            documents.append({
                "id": str(uuid.uuid4()),
                "text": chunk,
                "source": relative_source,
                "category": file_path.parent.name,
                "chunk_index": index,
            })

    return documents


def ingest_documents():
    documents = load_documents()

    if not documents:
        return {
            "status": "empty",
            "message": "No PDF or TXT files found inside backend/data folders"
        }

    texts = [doc["text"] for doc in documents]
    embeddings = embedding_model.encode(texts).tolist()

    collection.add(
        ids=[doc["id"] for doc in documents],
        documents=texts,
        embeddings=embeddings,
        metadatas=[
            {
                "source": doc["source"],
                "category": doc["category"],
                "chunk_index": doc["chunk_index"],
            }
            for doc in documents
        ],
    )

    return {
        "status": "success",
        "chunks_added": len(documents),
        "sources": sorted(list(set(doc["source"] for doc in documents))),
    }


if __name__ == "__main__":
    result = ingest_documents()
    print(result)