from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
import pandas as pd
from tensorflow.keras.models import load_model, Model
import pymongo

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = pymongo.MongoClient("mongodb+srv://thakurharsh345:pBS49MPMBhjZY1Pb@cluster0.wgvqw.mongodb.net/SIH2024USER")
db = client['SIH2024USER']
location_collection = db['regions']
scheme_collection = db['schemes']
feedback_collection = db['feedbacks']

# Convert MongoDB collections to DataFrames
location_df = pd.DataFrame(list(location_collection.find()))
scheme_df = pd.DataFrame(list(scheme_collection.find()))
user_feedback_df = pd.DataFrame(list(feedback_collection.find()))

def prepare_features():
    """
    Generate features for locations and schemes using one-hot encoding.
    """
    location_features = pd.get_dummies(location_df[['population_density', 'gender_ratio', 'income_level', 'farming_cycle', 'seasonal_pattern']])
    scheme_features = pd.get_dummies(scheme_df[['ROI', 'target_gender', 'target_age_group', 'tax_benefit', 'risk_level']])
    
    # Simulated matrix factorization features
    mf_user_features = pd.DataFrame(np.random.rand(user_feedback_df.shape[0], 5))
    mf_scheme_features = pd.DataFrame(np.random.rand(scheme_df.shape[0], 5), index=scheme_df['scheme'])
    
    return location_features, scheme_features, mf_user_features, mf_scheme_features

def load_recommendation_models():
    """
    Load pre-trained hybrid recommendation models.
    """
    try:
        hybrid_model = load_model('hybrid_recommendation_model.keras')
        cbf_output_layer = hybrid_model.get_layer("dense_22").output
        caf_output_layer = hybrid_model.get_layer("dense_30").output
        
        cbf_model = Model(inputs=hybrid_model.input, outputs=cbf_output_layer)
        caf_model = Model(inputs=hybrid_model.input, outputs=caf_output_layer)
        
        return cbf_model, caf_model
    except Exception as e:
        raise Exception(f"Error loading models: {str(e)}")

def prepare_input_features(user_id, location, location_features, scheme_features, mf_user_features, mf_scheme_features):
    """
    Prepare input features for models based on user ID and location.
    """
    if user_id not in user_feedback_df['user_id'].values:
        raise ValueError(f"User ID {user_id} not found in feedback data.")
    if location not in location_df['location'].values:
        raise ValueError(f"Location '{location}' not found in location data.")
    
    user_idx = user_feedback_df[user_feedback_df['user_id'] == user_id].index[0]
    loc_idx = location_df[location_df['location'] == location].index[0]
    
    X_loc, X_scheme, X_user_mf, X_item_mf, X_context = [], [], [], [], []
    
    for scheme_name in scheme_df['scheme']:
        scheme_idx = scheme_df[scheme_df['scheme'] == scheme_name].index[0]
        
        # Append features for the current scheme
        X_loc.append(location_features.iloc[loc_idx].values)
        X_scheme.append(scheme_features.iloc[scheme_idx].values)
        X_user_mf.append(mf_user_features.iloc[user_idx].values)
        X_item_mf.append(mf_scheme_features.loc[scheme_name].values)
        X_context.append(np.concatenate([
            location_features.iloc[loc_idx].values, 
            scheme_features.iloc[scheme_idx].values
        ]))
    
    return map(lambda x: np.array(x, dtype=np.float32), 
              [X_loc, X_scheme, X_user_mf, X_item_mf, X_context])

@app.route('/recommend', methods=['POST'])
def recommend_schemes():
    """
    API endpoint to recommend schemes for a user in a specific location using CBF and CAF scores.
    """
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        location = data.get('location')
        top_n = data.get('top_n', 3)

        if not user_id or not location:
            return jsonify({'error': 'Missing required parameters'}), 400

        # Prepare features
        location_features, scheme_features, mf_user_features, mf_scheme_features = prepare_features()
        
        # Load models
        cbf_model, caf_model = load_recommendation_models()
        
        # Prepare input features
        X_loc, X_scheme, X_user_mf, X_item_mf, X_context = prepare_input_features(
            user_id, location, location_features, scheme_features, mf_user_features, mf_scheme_features
        )
        
        # Get predictions
        model_inputs = [X_loc, X_scheme, X_user_mf, X_item_mf, X_context]
        cbf_scores = cbf_model.predict(model_inputs).flatten()
        caf_scores = caf_model.predict(model_inputs).flatten()
        
        # Check shape consistency
        if cbf_scores.shape != caf_scores.shape:
            return jsonify({'error': 'Shape mismatch in model predictions'}), 500
        
        # Calculate final scores
        final_scores = 0.5 * cbf_scores + 0.5 * caf_scores
        
        # Create recommendations DataFrame
        recommendations = pd.DataFrame({
            'scheme': scheme_df['scheme'],
            'CBF_score': cbf_scores,
            'CAF_score': caf_scores,
            'final_score': final_scores
        }).sort_values(by='final_score', ascending=False)
        
        # Convert top recommendations to JSON
        top_recommendations = recommendations.head(top_n).to_dict(orient='records')
        return jsonify({'recommendations': top_recommendations})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/locations', methods=['GET'])
def get_locations():
    """API endpoint to get all available locations"""
    try:
        locations = location_df['location'].tolist()
        return jsonify({'locations': locations})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)