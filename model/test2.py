from flask import Flask, request, jsonify
from pymongo import MongoClient
import numpy as np

app = Flask(__name__)

# MongoDB connection URI (replace with your actual MongoDB URI)
MONGO_URI = "mongodb+srv://thakurharsh345:pBS49MPMBhjZY1Pb@cluster0.wgvqw.mongodb.net/SIH2024USER"
client = MongoClient(MONGO_URI)

# Initialize collections
db = client.get_database()
region_collection = db.get_collection('regions')
scheme_collection = db.get_collection('schemes')

# Cosine Similarity Function
def cosine_similarity(vec1, vec2):
    dot_product = np.dot(vec1, vec2)
    norm_a = np.linalg.norm(vec1)
    norm_b = np.linalg.norm(vec2)
    return dot_product / (norm_a * norm_b)

# Helper function to map target age group to vector
def map_age_group_to_vector(age_group):
    if age_group == 'young':
        return [1, 0, 0, 0]
    elif age_group == 'youth':
        return [0, 1, 0, 0]
    elif age_group == 'adult':
        return [0, 0, 1, 0]
    elif age_group == 'senior_citizen':
        return [0, 0, 0, 1]
    return [0, 0, 0, 0]

# Helper function to convert location data to a vector
def location_to_vector(location):
    return [
        location['age_distribution']['young'],
        location['age_distribution']['youth'],
        location['age_distribution']['adult'],
        location['age_distribution']['senior_citizen'],
        location['income_level'],
        location['education_level'],
        location['gender_ratio']
    ]

# Helper function to convert scheme data to a vector
def scheme_to_vector(scheme):
    target_age_group_vector = map_age_group_to_vector(scheme['target_age_group'])
    
    # Assuming target_occupation is mapped or numerically encoded
    occupation_mapping = {
        "Engineer": 1,
        "Teacher": 2,
        "Doctor": 3,
        # Add more occupations here
    }
    occupation_value = occupation_mapping.get(scheme['target_occupation'], 0)  # Default to 0 if not found

    return [
        *target_age_group_vector,
        scheme['target_income_level'],
        scheme['target_education_level'],
        1 if scheme['target_gender'] == 'Male' else 0 if scheme['target_gender'] == 'Female' else 0.5,
        occupation_value
    ]

# Global error handler
@app.errorhandler(Exception)
def handle_exception(error):
    print(f"Error: {error}")
    return jsonify({"message": "Internal Server Error", "error": str(error)}), 500

# Recommendation API endpoint
@app.route('/recommend-schemes', methods=['GET'])
def recommend_schemes():
    location_name = request.args.get('locationName')
    
    if not location_name:
        return jsonify({"message": "Location name is required"}), 400

    try:
        print(f"Fetching location: {location_name}")
        
        # Fetch location data from MongoDB
        location = region_collection.find_one({"region_name": location_name})
        if not location:
            return jsonify({"message": "Location not found"}), 404

        print(f"Location found: {location}")

        # Fetch all schemes from MongoDB
        schemes = list(scheme_collection.find({}))
        print(f"Fetched {len(schemes)} schemes")

        # Convert location data to a vector
        location_vector = location_to_vector(location)
        print(f"Location vector: {location_vector}")

        # Calculate similarity scores for each scheme
        similarities = []
        for scheme in schemes:
            scheme_vector = scheme_to_vector(scheme)
            similarity = cosine_similarity(location_vector, scheme_vector)
            similarities.append({
                'scheme_name': scheme['scheme_name'],
                'similarity': similarity
            })
        
        # Sort by similarity score and return top 5
        similarities.sort(key=lambda x: x['similarity'], reverse=True)
        top_5_recommendations = similarities[:5]

        return jsonify(top_5_recommendations)
    
    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"message": "Internal Server Error", "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
