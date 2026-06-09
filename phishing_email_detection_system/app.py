from __future__ import annotations

import sqlite3
from datetime import datetime
from pathlib import Path

import joblib
from flask import Flask, g, redirect, render_template, request, url_for

from train_model import MODEL_PATH, preprocess_email, train_model


BASE_DIR = Path(__file__).resolve().parent
DATABASE_PATH = BASE_DIR / "database" / "predictions.db"
SCHEMA_PATH = BASE_DIR / "database" / "schema.sql"

app = Flask(__name__)
app.config["SECRET_KEY"] = "replace-this-development-secret"


def get_database() -> sqlite3.Connection:
    if "database" not in g:
        DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
        g.database = sqlite3.connect(DATABASE_PATH)
        g.database.row_factory = sqlite3.Row
        g.database.executescript(SCHEMA_PATH.read_text(encoding="utf-8"))
        g.database.commit()
    return g.database


@app.teardown_appcontext
def close_database(_error: Exception | None = None) -> None:
    database = g.pop("database", None)
    if database is not None:
        database.close()


def init_database() -> None:
    with app.app_context():
        database = get_database()
        database.executescript(SCHEMA_PATH.read_text(encoding="utf-8"))
        database.commit()


def load_model():
    if not MODEL_PATH.exists():
        train_model()
    return joblib.load(MODEL_PATH)


def save_prediction(email_text: str, prediction: str, confidence: float) -> None:
    database = get_database()
    database.execute(
        """
        INSERT INTO predictions (email_text, prediction, confidence, created_at)
        VALUES (?, ?, ?, ?)
        """,
        (email_text, prediction, confidence, datetime.utcnow().isoformat(timespec="seconds")),
    )
    database.commit()


@app.route("/", methods=["GET", "POST"])
def index():
    result = None
    email_text = ""

    if request.method == "POST":
        email_text = request.form.get("email_text", "").strip()
        if email_text:
            model = load_model()
            clean_text = preprocess_email(email_text)
            prediction = model.predict([clean_text])[0]
            probabilities = model.predict_proba([clean_text])[0]
            confidence = float(max(probabilities))
            save_prediction(email_text, prediction, confidence)
            result = {
                "prediction": prediction,
                "confidence": round(confidence * 100, 2),
                "is_phishing": prediction == "phishing",
            }

    return render_template("index.html", result=result, email_text=email_text)


@app.route("/history")
def history():
    rows = get_database().execute(
        """
        SELECT email_text, prediction, confidence, created_at
        FROM predictions
        ORDER BY id DESC
        LIMIT 25
        """
    ).fetchall()
    return render_template("history.html", predictions=rows)


@app.route("/clear-history", methods=["POST"])
def clear_history():
    database = get_database()
    database.execute("DELETE FROM predictions")
    database.commit()
    return redirect(url_for("history"))


if __name__ == "__main__":
    init_database()
    load_model()
    app.run(debug=True)
