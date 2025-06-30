from fastapi import FastAPI, WebSocket
from pydantic import BaseModel
import uvicorn
import json

app = FastAPI()

class SwipeData(BaseModel):
    userID: str
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

            # Simulated ML logic
            recommendation = "Add more like this" if data.swipe == "right" else "Avoid similar"

            await websocket.send_text(json.dumps({
                "userId": data.userID,
                "recommendation": recommendation
            }))
    except Exception as e:
        print("WebSocket closed:", e)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
