from __future__ import annotations

import re
from pathlib import Path

import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline


BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data" / "emails.csv"
MODEL_PATH = BASE_DIR / "models" / "phishing_model.joblib"


def preprocess_email(text: str) -> str:
    """Normalize email content before vectorization."""
    text = str(text).lower()
    text = re.sub(r"http\S+|www\.\S+", " url ", text)
    text = re.sub(r"\S+@\S+", " email ", text)
    text = re.sub(r"\d+", " number ", text)
    text = re.sub(r"[^a-z\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def load_dataset(path: Path = DATA_PATH) -> pd.DataFrame:
    df = pd.read_csv(path)
    required_columns = {"email_text", "label"}
    missing_columns = required_columns.difference(df.columns)
    if missing_columns:
        raise ValueError(f"Dataset missing columns: {', '.join(sorted(missing_columns))}")

    df = df.dropna(subset=["email_text", "label"]).copy()
    df["clean_text"] = df["email_text"].apply(preprocess_email)
    df["label"] = df["label"].str.strip().str.lower()
    df = df[df["label"].isin(["phishing", "legitimate"])]

    if df.empty:
        raise ValueError("Dataset does not contain valid phishing or legitimate rows.")

    return df


def build_pipeline() -> Pipeline:
    return Pipeline(
        steps=[
            (
                "tfidf",
                TfidfVectorizer(
                    stop_words="english",
                    ngram_range=(1, 2),
                    min_df=1,
                ),
            ),
            ("classifier", LogisticRegression(max_iter=1000, random_state=42)),
        ]
    )


def train_model() -> dict[str, object]:
    df = load_dataset()
    stratify = df["label"] if df["label"].value_counts().min() > 1 else None
    x_train, x_test, y_train, y_test = train_test_split(
        df["clean_text"],
        df["label"],
        test_size=0.25,
        random_state=42,
        stratify=stratify,
    )

    model = build_pipeline()
    model.fit(x_train, y_train)
    predictions = model.predict(x_test)

    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, MODEL_PATH)

    return {
        "accuracy": accuracy_score(y_test, predictions),
        "classification_report": classification_report(y_test, predictions),
        "confusion_matrix": confusion_matrix(y_test, predictions).tolist(),
        "model_path": str(MODEL_PATH),
        "training_rows": len(x_train),
        "testing_rows": len(x_test),
    }


if __name__ == "__main__":
    metrics = train_model()
    print("Model trained successfully")
    print(f"Model path: {metrics['model_path']}")
    print(f"Training rows: {metrics['training_rows']}")
    print(f"Testing rows: {metrics['testing_rows']}")
    print(f"Accuracy: {metrics['accuracy']:.2%}")
    print("Confusion matrix:")
    print(metrics["confusion_matrix"])
    print("Classification report:")
    print(metrics["classification_report"])
