import json
from flask import Flask, request, jsonify
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from flask_cors import CORS
import pymongo

app = Flask(__name__)
CORS(app)

client = pymongo.MongoClient("mongodb+srv://thakurharsh345:pBS49MPMBhjZY1Pb@cluster0.wgvqw.mongodb.net/SIH2024USER")
db = client['SIH2024USER']
scheme_collection = db['schemes']

def calculate_cbf_score(user_profile, schemes):
    scores = []

    for scheme in schemes:
        score = 0
        
        if scheme['target_age_group'][0] <= user_profile['Age'] <= scheme['target_age_group'][1]:
            score += 1

        if scheme['target_gender'] == "Any" or scheme['target_gender'] == user_profile['Gender']:
            score += 1

        if scheme['target_income_level'][0] <= user_profile['Income'] <= scheme['target_income_level'][1]:
            score += 1

        if scheme['target_occupation'][0] == "Any" or user_profile['Occupation'] in scheme['target_occupation']:
            score += 1

        if scheme['target_education_level'] == "Any" or scheme['target_education_level'] == user_profile['Education']:
            score += 1

        scores.append({
            "scheme_name": scheme['scheme_name'],
            "buying_probability_score": round((score / 5) * 100, 2)
        })

    return scores

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        user_profile = {
            'Id': data.get('Id'),
            'Age': int(data.get('Age')),
            'Gender': data.get('Gender'),
            'Income': float(data.get('Income')),
            'Occupation': data.get('Occupation'),
            'Education': data.get('Education')
        }
        
        # Get schemes from MongoDB
        schemes = list(scheme_collection.find({}, {'_id': 0}))
        
        # Generate Recommendations
        recommendations = calculate_cbf_score(user_profile, schemes)

        output = {
            "user_id": user_profile['Id'],
            "recommendations": recommendations
        }

        return jsonify(output), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)