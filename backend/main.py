import asyncio
import json

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)


async def task_progress_generator():
    for progress in [20, 40, 60, 80, 100]:
        yield {
            "event": "progress",
            "data": json.dumps({"progress": progress}),
        }
        await asyncio.sleep(1)

    yield {
        "event": "complete",
        "data": "Задача завершена",
    }


@app.get("/stream/")
async def stream():
    return EventSourceResponse(task_progress_generator())
