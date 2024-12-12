from sklearn.decomposition import NMF
from sklearn.model_selection import train_test_split, KFold
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, Dropout, Concatenate, Input
from tensorflow.keras.regularizers import l2
from tensorflow.keras.callbacks import EarlyStopping

# Dataset Definitions
location_df = pd.DataFrame({
    'location': ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'],
    'population_density': [21000, 11000, 8400, 7100, 6900],
    'gender_ratio': [0.92, 0.87, 0.95, 0.98, 0.89],
    'income_level': [45000, 52000, 48000, 38000, 35000],
    'farming_cycle': ['Kharif', 'Rabi', 'Mixed', 'Kharif', 'Mixed'],
    'seasonal_pattern': ['Monsoon', 'Winter', 'Year-round', 'Monsoon', 'Year-round']
})

scheme_df = pd.DataFrame({
    'scheme': ['PM-KISAN', 'PMFBY', 'KCC', 'SHC', 'PKVY'],
    'ROI': [12.5, 8.2, 15.3, 10.1, 9.8],
    'target_gender': ['Both', 'Male', 'Both', 'Female', 'Both'],
    'target_age_group': ['Adult', 'Young', 'Adult', 'Senior', 'Young'],
    'tax_benefit': ['Yes', 'No', 'Yes', 'No', 'Yes'],
    'risk_level': ['Low', 'Medium', 'High', 'Low', 'Medium']
})

user_feedback_df = pd.DataFrame({
    'user_id': [1, 2, 3, 4, 5],
    'location': ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'],
    'scheme': ['PM-KISAN', 'PMFBY', 'KCC', 'SHC', 'PKVY'],
    'rating': [4.5, 3.8, 4.2, 3.9, 4.0]
})

# Preprocess Features
location_features = pd.get_dummies(location_df[['population_density', 'gender_ratio', 'income_level', 'farming_cycle', 'seasonal_pattern']])
scheme_features = pd.get_dummies(scheme_df[['ROI', 'target_gender', 'target_age_group', 'tax_benefit', 'risk_level']])

# Matrix Factorization for Collaborative Filtering
nmf_model = NMF(n_components=5, random_state=42)
user_scheme_matrix = pd.pivot_table(user_feedback_df, values='rating', index='user_id', columns='scheme', fill_value=0)

mf_user_features = pd.DataFrame(nmf_model.fit_transform(user_scheme_matrix))
mf_scheme_features = pd.DataFrame(nmf_model.components_.T, index=user_scheme_matrix.columns)

# Hybrid Model Definition
def create_hybrid_model(location_dim, scheme_dim, mf_user_dim=5, mf_item_dim=5):
    # Input layers
    location_input = Input(shape=(location_dim,))
    scheme_input = Input(shape=(scheme_dim,))
    mf_user_input = Input(shape=(mf_user_dim,))
    mf_item_input = Input(shape=(mf_item_dim,))
    context_input = Input(shape=(location_dim + scheme_dim,))

    # Content-Based Filtering (CBF)
    cbf_loc = Dense(32, activation='relu', kernel_regularizer=l2(0.01))(location_input)
    cbf_scheme = Dense(32, activation='relu', kernel_regularizer=l2(0.01))(scheme_input)
    cbf_output = Dense(64, activation='relu')(Concatenate()([cbf_loc, cbf_scheme]))

    # Collaborative Filtering (CF)
    cf_user = Dense(32, activation='relu', kernel_regularizer=l2(0.01))(mf_user_input)
    cf_item = Dense(32, activation='relu', kernel_regularizer=l2(0.01))(mf_item_input)
    cf_output = Dense(64, activation='relu')(Concatenate()([cf_user, cf_item]))

    # Context-Aware Filtering (CAF)
    caf_output = Dense(64, activation='relu', kernel_regularizer=l2(0.01))(context_input)

    # Hybrid Model
    hybrid_concat = Concatenate()([cbf_output, cf_output, caf_output])
    x = Dense(128, activation='relu', kernel_regularizer=l2(0.01))(hybrid_concat)
    x = Dropout(0.3)(x)
    x = Dense(64, activation='relu', kernel_regularizer=l2(0.01))(x)
    x = Dense(32, activation='relu', kernel_regularizer=l2(0.01))(x)
    output = Dense(1, activation='sigmoid')(x)

    model = Model(inputs=[location_input, scheme_input, mf_user_input, mf_item_input, context_input], outputs=output)
    model.compile(optimizer='adam', loss='mse')
    return model

# Data Preparation
def prepare_hybrid_training_data(user_feedback_df, location_features, scheme_features, user_factors, item_factors):
    X_loc, X_scheme, X_user_mf, X_item_mf, X_context, y = [], [], [], [], [], []
    for _, feedback in user_feedback_df.iterrows():
        loc_idx = location_df[location_df['location'] == feedback['location']].index[0]
        scheme_idx = scheme_df[scheme_df['scheme'] == feedback['scheme']].index[0]
        user_idx = feedback['user_id'] - 1
        scheme_name = feedback['scheme']

        X_loc.append(location_features.iloc[loc_idx].values)
        X_scheme.append(scheme_features.iloc[scheme_idx].values)
        X_user_mf.append(user_factors.iloc[user_idx].values)
        X_item_mf.append(item_factors.loc[scheme_name].values)
        X_context.append(np.concatenate([location_features.iloc[loc_idx].values, scheme_features.iloc[scheme_idx].values]))
        y.append(feedback['rating'])

    return [np.array(X_loc, dtype=np.float32), np.array(X_scheme, dtype=np.float32),
            np.array(X_user_mf, dtype=np.float32), np.array(X_item_mf, dtype=np.float32),
            np.array(X_context, dtype=np.float32)], np.array(y, dtype=np.float32)

# Prepare Training Data
X_hybrid, y = prepare_hybrid_training_data(user_feedback_df, location_features, scheme_features, mf_user_features, mf_scheme_features)
y = y / 5.0  # Normalize ratings

# Cross-Validation Training
kf = KFold(n_splits=5, shuffle=True, random_state=42)
best_model = None
best_rmse = float('inf')

for train_idx, val_idx in kf.split(X_hybrid[0]):
    X_train = [x[train_idx] for x in X_hybrid]
    X_val = [x[val_idx] for x in X_hybrid]
    y_train, y_val = y[train_idx], y[val_idx]

    model = create_hybrid_model(X_hybrid[0].shape[1], X_hybrid[1].shape[1])
    model.fit(X_train, y_train, validation_data=(X_val, y_val), epochs=100, batch_size=32,
              callbacks=[EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)], verbose=0)

    pred = model.predict(X_val).flatten()
    rmse = np.sqrt(np.mean((y_val - pred) ** 2))
    if rmse < best_rmse:
        best_rmse = rmse
        best_model = model

# Save the Best Model
best_model.save('hybrid_recommendation_model.keras')
