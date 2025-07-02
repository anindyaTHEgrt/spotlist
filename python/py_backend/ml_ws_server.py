from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import json

app = FastAPI()
origins = [
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SwipeData(BaseModel):
    status: str
    baseVibe: str
    swipe: str
    songId: str

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("Node.js connected!")


    try:
        while True:
            text = await websocket.receive_text()
            data = SwipeData.model_validate_json(text)
            if data.status == "initial":
                print("initial data: " + data.baseVibe)
                # 'promt: af : danceability: 0.8, energy: 0.75, key: 6, loudness: -7.0,
                # mode: 1, speechiness: 0.1, acousticness: 0.45, instrumentalness: 0.25,
                # liveness: 0.2, valence: 0.85, tempo: 115, duration_ms: 220000'
                
                await websocket.send_text(json.dumps({
                    "recommendation": "initial data recommendation"
                }))
            if data.status == "swipeData":
                # Simulated ML logic
                recommendation = "Add more like this" if data.swipe == "right" else "Avoid similar"
                await websocket.send_text(json.dumps({
                    "recommendation": recommendation
                }))

    except Exception as e:
        print("WebSocket closed:", e)

class vibeData(BaseModel):
    userID: str
    vibe: str

@app.post("/vibe")
async def vibe_endpoint(vibe: vibeData):
    llmvibe = vibe.vibe
    userID = vibe.userID
    print(llmvibe)
    return {
        "msg": "python got the msg",
        "vibe": llmvibe
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
