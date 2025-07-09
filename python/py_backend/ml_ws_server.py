from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import json
import numpy as np
import joblib
from sklearn.metrics.pairwise import cosine_similarity
import re
import os

app = FastAPI()
origins = [
    "http://localhost:5174",
    "http://127.0.0.1:5174",
"https://spotlist.onrender.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Constants ---
FEATURE_KEYS = [
    "danceability", "energy", "key", "loudness", "mode",
    "speechiness", "acousticness", "instrumentalness",
    "liveness", "valence", "tempo", "duration_ms"
]

SWIPE_WEIGHTS = {
    "left": -0.5,
    "right": 0.8,
    "up": 1.5
}

# --- Load Dataset Once ---
# feature_matrix = np.load("../py_ML/features.npy", allow_pickle=True)                # shape (N, 12)
# track_ids = np.load("../py_ML/track_ids.npy", allow_pickle=True)                    # shape (N,)
# scaler = joblib.load("../py_ML/scaler.pkl")

import os
base_dir = os.path.dirname(os.path.abspath(__file__))
feature_matrix = np.load(os.path.join(base_dir, "../py_ML/features.npy"), allow_pickle=True)
track_ids = np.load(os.path.join(base_dir, "../py_ML/track_ids.npy"), allow_pickle=True)
scaler = joblib.load(os.path.join(base_dir, "../py_ML/scaler.pkl"))

# --- Helpers ---
# def parse_vibe(vibe_str: str) -> dict:
#     """Parses the vibe string to a feature dictionary."""
#     vibe_str = vibe_str.split("prompt:")[-1].strip()
#     features = {}
#     for item in vibe_str.split(","):
#         if ":" in item:
#             k, v = item.strip().split(":")
#             features[k.strip()] = float(v.strip())
#     return features

FEATURE_KEYS = [
    "danceability", "energy", "key", "loudness", "mode",
    "speechiness", "acousticness", "instrumentalness",
    "liveness", "valence", "tempo", "duration_ms"
]


def parse_vibe(base_vibe: str) -> dict:
    vibe_dict = {}
    for feature in FEATURE_KEYS:
        # Match 'feature: value' where value is a float/int
        match = re.search(rf"{feature}\s*:\s*(-?\d+\.?\d*)", base_vibe, re.IGNORECASE)
        if match:
            vibe_dict[feature] = float(match.group(1))
    return vibe_dict

def normalize_vibe(vibe_dict, scaler, feature_keys):
    values = np.array([vibe_dict[k] for k in feature_keys]).reshape(1, -1)
    norm_values = scaler.transform(values)
    return norm_values  # shape: (1, 12)

def update_vibe(user_vibe_vector, song_vector, swipe_direction):
    weight = SWIPE_WEIGHTS[swipe_direction]
    return user_vibe_vector + weight * (song_vector - user_vibe_vector)

def recommend_song(user_vibe_vector, feature_matrix, track_ids, seen_ids=set()):
    similarities = cosine_similarity(user_vibe_vector, feature_matrix)[0]
    mask = np.isin(track_ids, list(seen_ids), invert=True)
    filtered_similarities = similarities[mask]
    filtered_track_ids = track_ids[mask]

    if len(filtered_similarities) == 0:
        return None  # No more songs

    top_index = np.argmax(filtered_similarities)
    return filtered_track_ids[top_index]



class SwipeData(BaseModel):
    status: str
    baseVibe: str
    swipe: str
    songId: str

@app.get("/ws/health")
async def healthcheck():
    return {"Websocket status": "alive"}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("Node.js connected!")

    user_vibe_vector = None
    exclude_ids = set()


    try:
        while True:
            text = await websocket.receive_text()
            # print("🔹 Raw message:", text)
            data = SwipeData.model_validate_json(text)
            # print("✅ Parsed message:", data)

            if data.status == "initial":
                # print("initial data: " + data.baseVibe)
                # 'promt: af : danceability: 0.8, energy: 0.75, key: 6, loudness: -7.0,
                # mode: 1, speechiness: 0.1, acousticness: 0.45, instrumentalness: 0.25,
                # liveness: 0.2, valence: 0.85, tempo: 115, duration_ms: 220000'

                # First time: parse and normalize base vibe
                print("✅ Parsed message:", data)
                base_vibe_dict = parse_vibe(data.baseVibe)
                print("🧠 Parsed base_vibe_dict:", base_vibe_dict)
                user_vibe_vector = normalize_vibe(base_vibe_dict, scaler, FEATURE_KEYS)

                song_id = recommend_song(user_vibe_vector, feature_matrix, track_ids, exclude_ids)
                if song_id:
                    exclude_ids.add(song_id)
                    print("Initial recommendation:", song_id)
                    await websocket.send_json({"recommendation": song_id})
                else:
                    await websocket.send_json({"error": "No songs left"})

                # await websocket.send_text(json.dumps({
                #     "recommendation": "initial data recommendation"
                # }))


            if data.status == "swipeData":
                song_id = data.songId
                swipe = data.swipe  # 'left' | 'right' | 'up'

                try:
                    song_index = np.where(track_ids == song_id)[0][0]
                    song_vector = feature_matrix[song_index].reshape(1, -1)
                    user_vibe_vector = update_vibe(user_vibe_vector, song_vector, swipe)

                    song_id = recommend_song(user_vibe_vector, feature_matrix, track_ids, exclude_ids)
                    if song_id:
                        exclude_ids.add(song_id)
                        print("Recommended Song:", song_id)
                        await websocket.send_json({"recommendation": song_id})
                    else:
                        await websocket.send_json({"error": "No songs left"})

                except IndexError:
                    await websocket.send_json({"error": f"Song ID {song_id} not found"})
                # Simulated ML logic
                # recommendation = "Add more like this" if data.swipe == "right" else "Avoid similar"
                # await websocket.send_text(json.dumps({
                #     "recommendation": recommendation
                # }))


    except Exception as e:
        print("WebSocket closed:", e)

# class vibeData(BaseModel):
#     userID: str
#     vibe: str
#
# @app.post("/vibe")
# async def vibe_endpoint(vibe: vibeData):
#     llmvibe = vibe.vibe
#     userID = vibe.userID
#     print(llmvibe)
#     return {
#         "msg": "python got the msg",
#         "vibe": llmvibe
#     }


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
