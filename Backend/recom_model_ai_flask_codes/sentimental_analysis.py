from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
import re
import pymongo

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for React compatibility

# MongoDB connection
client = pymongo.MongoClient("mongodb+srv://thakurharsh345:pBS49MPMBhjZY1Pb@cluster0.wgvqw.mongodb.net/SIH2024USER")
db = client['SIH2024USER']
feedback_collection = db['feedback']

# Load the fine-tuned BERT model and tokenizer
MODEL_NAME = "finiteautomata/bertweet-base-sentiment-analysis"  # Replace with your fine-tuned model

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)

# Define a function to clean the feedback data
def clean_text(text):
    """Removes unnecessary content such as URLs, mentions, hashtags, and extra spaces."""
    text = re.sub(r'http\S+|www\.\S+', '', text)  # Remove URLs
    text = re.sub(r'@\w+', '', text)  # Remove mentions
    text = re.sub(r'#\w+', '', text)  # Remove hashtags
    text = re.sub(r'[^A-Za-z0-9 ]+', '', text)  # Remove special characters
    text = re.sub(r'\s+', ' ', text).strip()  # Remove extra spaces
    return text

# Initialize sentiment analysis pipeline
sentiment_analyzer = pipeline("sentiment-analysis", model=model, tokenizer=tokenizer)

@app.route('/analyze', methods=['POST'])
def analyze_sentiment():
    """Endpoint to analyze sentiment from feedback data."""
    data = request.json
    feedback_list = data.get('feedback', [])

    # Clean the feedback data
    cleaned_feedback = [clean_text(feedback) for feedback in feedback_list]

    # Analyze sentiment
    results = sentiment_analyzer(cleaned_feedback)

    # Extract sentiment and confidence scores
    sentiment_output = [
        {"text": feedback, "label": result['label'], "score": result['score']}
        for feedback, result in zip(cleaned_feedback, results)
    ]

    # Save feedback and analysis results to MongoDB
    for feedback, result in zip(feedback_list, sentiment_output):
        feedback_document = {
            "original_feedback": feedback,
            "cleaned_feedback": result['text'],
            "sentiment": result['label'],
            "confidence": result['score']
        }
        feedback_collection.insert_one(feedback_document)

    return jsonify(sentiment_output)

if __name__ == '__main__':
    app.run(debug=True)
