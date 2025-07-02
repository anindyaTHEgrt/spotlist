import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import joblib

# Step 1: Load your original dataset
df = pd.read_csv("spotify_songs.csv")  # <-- CHANGE THIS to your real CSV path

# Step 2: Define feature columns to use in model
feature_cols = [
    "danceability", "energy", "key", "loudness", "mode",
    "speechiness", "acousticness", "instrumentalness",
    "liveness", "valence", "tempo", "duration_ms"
]

# Step 3: Normalize those features
scaler = MinMaxScaler()
df_scaled = df.copy()
df_scaled[feature_cols] = scaler.fit_transform(df[feature_cols])

# Step 4: Extract the features as a NumPy matrix for fast similarity
feature_matrix = df_scaled[feature_cols].to_numpy()  # shape: (num_songs, num_features)

# Step 5: Save all relevant outputs

## a. Normalized CSV (optional, for debugging / readable format)
df_scaled.to_csv("normalized_songs.csv", index=False)

## b. Save scaler for use during inference (user vibe normalization)
joblib.dump(scaler, "scaler.pkl")

## c. Save NumPy matrix and track IDs (to align results)
np.save("features.npy", feature_matrix)
np.save("track_ids.npy", df_scaled["track_id"].to_numpy())

print("✅ Dataset normalization complete and saved.")
