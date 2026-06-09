# Project Report: Phishing Email Detection System

## 1. Introduction

Phishing is a social engineering attack where fraudulent emails attempt to steal sensitive information such as passwords, bank details, or identity data. This project uses machine learning to classify email content as phishing or legitimate.

## 2. Objectives

- Build a machine learning model for phishing email detection.
- Preprocess text data using Python and Pandas.
- Train and evaluate a Scikit-learn classifier.
- Provide a Flask web interface for email classification.
- Store prediction history in a SQLite database.

## 3. Technologies Used

- Python
- Flask
- Pandas
- Scikit-learn
- SQLite
- HTML and CSS

## 4. Dataset Preprocessing

The dataset contains two columns: `email_text` and `label`. The preprocessing pipeline:

1. Converts text to lowercase.
2. Replaces URLs with a common token.
3. Replaces email addresses with a common token.
4. Replaces numbers with a common token.
5. Removes special characters.
6. Removes extra spaces.

This reduces noise and helps the model learn from meaningful email patterns.

## 5. Machine Learning Model

The system uses a Scikit-learn pipeline:

- `TfidfVectorizer` converts email text into numerical features.
- `LogisticRegression` classifies the email as phishing or legitimate.

The trained model is saved as `models/phishing_model.joblib`.

## 6. Evaluation

The training script reports:

- Accuracy
- Precision
- Recall
- F1-score
- Confusion matrix

These metrics help measure how well the classifier separates phishing emails from legitimate emails.

## 7. Flask Web Application

The Flask application provides:

- Home page with an email input form
- Prediction result with confidence score
- History page showing previous predictions
- Clear history action

## 8. Database

SQLite stores prediction logs in the `predictions` table.

| Column | Purpose |
| --- | --- |
| `id` | Unique record ID |
| `email_text` | Submitted email content |
| `prediction` | Model output |
| `confidence` | Highest class probability |
| `created_at` | Prediction timestamp |

## 9. Limitations

- The included dataset is small and intended for demonstration.
- Real phishing campaigns evolve quickly.
- The model only uses email body text and does not inspect headers, attachments, sender reputation, or links in depth.

## 10. Future Scope

- Train with a larger public phishing dataset.
- Add URL reputation and domain age analysis.
- Include email header inspection.
- Add administrator login and downloadable reports.
- Deploy on a cloud platform with monitoring.

## 11. Conclusion

The Phishing Email Detection System demonstrates how machine learning can support cyber security by identifying suspicious email content. It combines preprocessing, model training, web deployment, and database logging in a complete minor-project structure.
