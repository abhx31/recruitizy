import os

from fastapi import FastAPI
from app.routes import auth, job, application, resume, applicant
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

DEFAULT_ORIGINS = "http://localhost:3000,http://localhost:3001"
origins = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", DEFAULT_ORIGINS).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(job.router)
app.include_router(application.router)
app.include_router(resume.router)
app.include_router(applicant.router)

@app.get("/")
def read_root():
    return {"message": "Server is running successfully!"}