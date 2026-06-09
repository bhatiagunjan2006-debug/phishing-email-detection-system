# Phishing Email Detection System

A Cyber Security minor project that classifies email text as **phishing** or **legitimate** using Python, Flask, Pandas, and Scikit-learn.

## Features

- Email text preprocessing with Pandas and regular expressions
- TF-IDF feature extraction
- Logistic Regression machine learning classifier
- Accuracy, precision, recall, F1-score, and confusion matrix evaluation
- Flask web interface for live email classification
- SQLite database for storing prediction history
- Sample dataset included for training and demonstration

## Project Structure

```text
phishing_email_detection_system/
  app.py
  train_model.py
  requirements.txt
  README.md
  data/
    emails.csv
  database/
    schema.sql
  docs/
    PROJECT_REPORT.md
  models/
    .gitkeep
  static/
    css/style.css
  templates/
    base.html
    index.html
    history.html
```

## Setup

```bash
cd phishing_email_detection_system
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python train_model.py
python app.py
```

Open `http://127.0.0.1:5000` in your browser.

## Dataset Format

The dataset is stored at `data/emails.csv`.

| Column | Description |
| --- | --- |
| `email_text` | Raw email content |
| `label` | `phishing` or `legitimate` |

You can replace the sample dataset with a larger real-world dataset that follows the same column format.

## How It Works

1. `train_model.py` loads and cleans the dataset with Pandas.
2. Email text is normalized by lowercasing, removing URLs, removing email addresses, and stripping special characters.
3. Scikit-learn converts text into TF-IDF features.
4. Logistic Regression trains on the extracted features.
5. The model is saved to `models/phishing_model.joblib`.
6. `app.py` loads the saved model and predicts whether submitted email content is phishing or legitimate.
7. Predictions are stored in `database/predictions.db`.

## Notes

This project is intended for academic demonstration. For production use, train with a large verified dataset, monitor model drift, add sender/domain reputation checks, and deploy with proper security controls.
