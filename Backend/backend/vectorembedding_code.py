from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import pymongo

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# MongoDB connection
client = pymongo.MongoClient("mongodb+srv://thakurharsh345:pBS49MPMBhjZY1Pb@cluster0.wgvqw.mongodb.net/SIH2024USER")
db = client['SIH2024USER']
location_collection = db['regions']
scheme_collection = db['schemes']
feedback_collection = db['feedbacks']

# Vector embedding method to analyze performance
def compute_vector_embeddings(data):
    # Normalize data for analysis
    normalized_data = (data - np.min(data)) / (np.max(data) - np.min(data))
    # Create embeddings (e.g., time-series embeddings)
    embeddings = np.array([normalized_data[i:i + 5] for i in range(len(normalized_data) - 4)])
    return embeddings

# Critical gap analysis
def critical_gap_analysis(embeddings, threshold=0.8):
    similarity_matrix = cosine_similarity(embeddings)
    gaps = []
    for i in range(len(similarity_matrix)):
        for j in range(i + 1, len(similarity_matrix[i])):
            if similarity_matrix[i][j] < threshold:
                gaps.append((i, j, similarity_matrix[i][j]))
    return gaps

# API endpoint for analyzing scheme performance
@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.json
        if not data or 'values' not in data:
            return jsonify({"error": "Invalid input data"}), 400

        values = np.array(data['values'])
        embeddings = compute_vector_embeddings(values)
        gaps = critical_gap_analysis(embeddings)

        return jsonify({
            "status": "success",
            "gaps": gaps
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API endpoint for fetching MongoDB data
@app.route('/fetch-data', methods=['GET'])
def fetch_data():
    try:
        collection_name = request.args.get('collection')
        if not collection_name:
            return jsonify({"error": "Collection name is required"}), 400

        collection = db[collection_name]
        data = list(collection.find({}, {"_id": 0}))

        return jsonify({
            "status": "success",
            "data": data
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run Flask app
if __name__ == '__main__':
    app.run(debug=True)
