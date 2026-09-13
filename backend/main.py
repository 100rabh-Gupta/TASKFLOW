from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

try:
    from backend.database import Base, engine
    from backend import model
    from backend.crud import router as crud_router
except ImportError:
    from database import Base, engine
    import model
    from crud import router as crud_router

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(crud_router, prefix='/todo', tags=["Crud Router"])

@app.get("/")
def home():
    return {"message": "ToDo API is running successfully!"}