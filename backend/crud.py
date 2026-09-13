from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List

try:
    from backend.database import get_db
    from backend.model import ToDo
except ImportError:
    from database import get_db
    from model import ToDo

router = APIRouter()

class ToDocreate(BaseModel):
    title: str
    description: str
    done: bool

class ToDOresponse(ToDocreate):
    id: int

@router.get("/", response_model=List[ToDOresponse])
def getToDOs(db: Session = Depends(get_db)):
    return db.query(ToDo).all()

@router.post("/", response_model=ToDOresponse)
def create_todos(todo: ToDocreate, db: Session = Depends(get_db)):
    new_todo = ToDo(title=todo.title, description=todo.description, done=todo.done)
    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)
    return new_todo

@router.put("/{todo_id}", response_model=ToDOresponse)
def update_todos(todo_id: int, todo: ToDocreate, db: Session = Depends(get_db)):
    db_todo = db.query(ToDo).filter(ToDo.id == todo_id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="todo not found")
    db_todo.title = todo.title
    db_todo.description = todo.description
    db_todo.done = todo.done
    db.commit()
    db.refresh(db_todo)
    return db_todo

@router.delete("/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    db_todo = db.query(ToDo).filter(ToDo.id == todo_id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="todo not found")
    db.delete(db_todo)
    db.commit()
    return {"message": "todo deleted successfully"}
